"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 1. DOM 요소 가져오기 (타입 단언 사용)
const todoInput = document.getElementById('todo-input');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const doneList = document.getElementById('done-list');
// 상태 관리 배열
let todos = [];
let doneTasks = [];
// 3. 텍스트 입력 처리 함수 (공백 제거)
const getTodoText = () => {
    return todoInput.value.trim();
};
// 4. 할 일 추가 함수
const addTodo = (text) => {
    const newTodo = {
        id: Date.now(), // 고유 ID로 현재 시간 사용
        text: text,
    };
    todos.push(newTodo);
    todoInput.value = ''; // 입력창 초기화
};
// 5. 할 일 상태 변경 (할 일 -> 완료)
const completeTask = (todo) => {
    todos = todos.filter((t) => t.id !== todo.id); // 기존 리스트에서 제거
    doneTasks.push(todo); // 완료 리스트에 추가
    renderTasks();
};
// 6. 완료된 할 일 삭제 함수
const deleteTodo = (todo) => {
    doneTasks = doneTasks.filter((t) => t.id !== todo.id);
    renderTasks();
};
// 7. 리스트 아이템 DOM 생성 함수
const createTodoElement = (todo, isDone) => {
    const li = document.createElement('li');
    li.classList.add('render__container__item');
    // 텍스트 추가
    const textNode = document.createTextNode(todo.text);
    li.appendChild(textNode);
    // 버튼 추가
    const button = document.createElement('button');
    button.classList.add('render__container__item__button');
    if (isDone) {
        button.textContent = '삭제';
        button.style.backgroundColor = '#dc3545'; // 삭제는 빨간색
        button.addEventListener('click', () => deleteTodo(todo));
    }
    else {
        button.textContent = '완료';
        button.style.backgroundColor = '#28a745'; // 완료는 초록색
        button.addEventListener('click', () => completeTask(todo));
    }
    li.appendChild(button);
    return li; // HTML 태그 노드 반환
};
// 8. 화면 렌더링 함수
const renderTasks = () => {
    // 화면 초기화
    todoList.innerHTML = '';
    doneList.innerHTML = '';
    // 진행 중인 할 일 렌더링
    todos.forEach((todo) => {
        const li = createTodoElement(todo, false);
        todoList.appendChild(li);
    });
    // 완료된 할 일 렌더링
    doneTasks.forEach((doneTask) => {
        const li = createTodoElement(doneTask, true);
        doneList.appendChild(li);
    });
};
// 9. 폼 이벤트 리스너 연결
todoForm.addEventListener('submit', (e) => {
    e.preventDefault(); // 기본 폼 제출(새로고침) 방지
    const text = getTodoText();
    if (text) {
        addTodo(text);
        renderTasks();
    }
});
//# sourceMappingURL=script.js.map