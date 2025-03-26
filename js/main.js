// Находим элементы на странице
const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

form.addEventListener('submit', addTask);
taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);
let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
};

tasks.forEach(function (task) {
    renderTask(task);
});

checkEmptyList();

function addTask(event) {
    event.preventDefault(); // Отмена стандартных событий

    const taskText = taskInput.value;

    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }

    tasks.push(newTask);

    renderTask(newTask);

    taskInput.value = '';
    taskInput.focus();
    saveToLocalStorage();
    checkEmptyList();
}

function deleteTask(event) {
    if (event.target.dataset.action !== 'delete') return;

    const parentNode = event.target.closest('li');  // - поиск родительского элемента

    const id = Number(parentNode.id);

    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();
    checkEmptyList();

    parentNode.remove();

}

function doneTask(event) {
    if (event.target.dataset.action === 'done') {
        const parentNode = event.target.closest('li');  // - поиск родительского элемента

        const id = Number(parentNode.id);

        const task = tasks.find(function (task) {
            if (task.id === id) {
                return true;
            }
        });

        task.done = !task.done;

        const taskTitle = parentNode.querySelector('.task-title');
        taskTitle.classList.toggle('task-title--done');
        saveToLocalStorage();
    }
}

function checkEmptyList() {
    if (tasks.length == 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`;
        taskList.insertAdjacentHTML('beforeend', emptyListHTML);
    }
    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    const cssClass = task.done ? "task-title task-title--done" : "task-title";
    const taskHtml = `<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
<span class="${cssClass}">${task.text}</span>
<div class="task-item__buttons">
    <button type="button" data-action="done" class="btn-action">
        <img src="./img/tick.svg" alt="Done" width="18" height="18">
    </button>
    <button type="button" data-action="delete" class="btn-action">
        <img src="./img/cross.svg" alt="Done" width="18" height="18">
    </button>
</div>
</li>`;

    taskList.insertAdjacentHTML('beforeend', taskHtml);

}