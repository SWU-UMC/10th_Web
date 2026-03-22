var input = document.getElementById("box");
var list1 = document.getElementById("todo-list1");
var list2 = document.getElementById("todo-list2");
var addBtn = document.getElementById("add-btn");
// 상태
var todos = [];
var doneTasks = [];
// 화면 그리기
var renderTask = function () {
    list1.innerHTML = "";
    list2.innerHTML = "";
    // 🔹 할 일 리스트
    todos.forEach(function (todo) {
        var li = document.createElement("li");
        li.textContent = todo.text;
        var btn = document.createElement("button");
        btn.textContent = "완료";
        btn.onclick = function () {
            todos = todos.filter(function (t) { return t.id !== todo.id; });
            doneTasks.push(todo);
            renderTask();
        };
        list1.appendChild(li);
        li.appendChild(btn);
    });
    // 🔹 완료 리스트
    doneTasks.forEach(function (todo) {
        var li = document.createElement("li");
        li.textContent = todo.text;
        var btn2 = document.createElement("button");
        btn2.textContent = "삭제";
        btn2.style.backgroundColor = "red";
        btn2.onclick = function () {
            doneTasks = doneTasks.filter(function (t) { return t.id !== todo.id; });
            renderTask();
        };
        list2.appendChild(li);
        li.appendChild(btn2);
    });
};
// 할 일 추가
var addTodo = function () {
    var text = input.value.trim();
    if (text === "")
        return;
    todos.push({
        id: Date.now(),
        text: text,
    });
    input.value = "";
    renderTask();
};
// 버튼 클릭
addBtn.onclick = addTodo;
renderTask();
