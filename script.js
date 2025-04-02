const addTaskBtn = document.getElementById('add-task-btn');
const todoBoard = document.getElementById('todo-board');

function attachDragEvents(target) {
    target.addEventListener('dragstart', () => {
        target.classList.add('flying');
    });

    target.addEventListener('dragend', () => {
        target.classList.remove('flying');
    });
}

// ✅ Load tasks from localStorage on page load
window.addEventListener("load", () => {
    let tasks = JSON.parse(localStorage.getItem("taskCards")) || [];

    tasks.forEach(taskText => {
        const taskCard = document.createElement('p');
        taskCard.classList.add('item');
        taskCard.setAttribute('draggable', true);
        taskCard.innerText = taskText;

        attachDragEvents(taskCard);
        todoBoard.appendChild(taskCard);
    });
});

addTaskBtn.addEventListener('click', () => {
    const input = prompt('What is the task?');
    if (!input) return;

    const taskCard = document.createElement('p');
    taskCard.classList.add('item');
    taskCard.setAttribute('draggable', true);
    taskCard.innerText = input;

    attachDragEvents(taskCard);
    todoBoard.appendChild(taskCard);

    // ✅ Store multiple tasks in localStorage
    let tasks = JSON.parse(localStorage.getItem("taskCards")) || [];
    tasks.push(input);
    localStorage.setItem("taskCards", JSON.stringify(tasks));
});

// Drag-and-drop functionality
const allBoards = document.querySelectorAll('.board');

allBoards.forEach(board => {
    board.addEventListener('dragover', (event) => {
        event.preventDefault(); // ✅ Allows dropping
        const flyingElement = document.querySelector('.flying');
        if (flyingElement) {
            board.appendChild(flyingElement);
        }
    });
});

// ✅ Dark Mode Toggle (Persists after refresh)
const toggleButton = document.getElementById("darkModeToggle");
const body = document.body;

if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
}

toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");

    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}); //

//1:10