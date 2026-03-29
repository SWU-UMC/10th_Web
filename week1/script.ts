const input = document.getElementById("box") as HTMLInputElement;
const list1 = document.getElementById("todo-list1") as HTMLUListElement;
const list2 = document.getElementById("todo-list2") as HTMLUListElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;

// 타입
type Todo = {
  id: number;
  text: string;
};

// 상태
let todos: Todo[] = [];
let doneTasks: Todo[] = [];

// 화면 그리기
const renderTask = (): void => {
  list1.innerHTML = "";
  list2.innerHTML = "";

  // 🔹 할 일 리스트
  todos.forEach((todo) => {
    const li = document.createElement("li");

    li.textContent = todo.text;

    const btn = document.createElement("button");
    btn.textContent = "완료";

    btn.onclick = () => {
      todos = todos.filter((t) => t.id !== todo.id);
      doneTasks.push(todo);
      renderTask();
    };
    list1.appendChild(li);
    li.appendChild(btn);   

    
  });

  // 🔹 완료 리스트
  doneTasks.forEach((todo) => {
    const li = document.createElement("li");
    li.textContent = todo.text;

    const btn2 = document.createElement("button");
    btn2.textContent = "삭제";
    btn2.style.backgroundColor = "red";

    btn2.onclick = () => {
      doneTasks = doneTasks.filter((t) => t.id !== todo.id);
      renderTask();
    };
    list2.appendChild(li);
    li.appendChild(btn2);

    
  });
};

// 할 일 추가
const addTodo = (): void => {
  const text = input.value.trim();
  if (text === "") return;

  todos.push({
    id: Date.now(),
    text,
  });

  input.value = "";
  renderTask();
};

// 버튼 클릭
addBtn.onclick = addTodo;
renderTask();