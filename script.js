const addTaskBtn = document.getElementById('add-task-btn');
const todoBoard = document.getElementById('todo-board');

function attachDragEvents(target) {
    target.addEventListener('dragstart', (event) => {
        // Store the ID of the task card instead of innerText which contains the delete button
        event.dataTransfer.setData("text/plain", target.id);
        target.classList.add('flying');
    });
    target.addEventListener('dragend', () => {
        target.classList.remove('flying');
    });
}

// Load tasks from localStorage on page load
window.addEventListener("load", () => {
    // Load tasks for each board, not just todoBoard
    const allBoards = document.querySelectorAll('.board');
    allBoards.forEach(board => {
        const boardId = board.id;
        let tasks = JSON.parse(localStorage.getItem(boardId + "Tasks")) || [];
        tasks.forEach(taskText => {
            createTaskCard(taskText, board);
        });
    });
});

addTaskBtn.addEventListener('click', () => {
    const input = prompt('What is the task?');
    if (!input || input.trim() === '') return; // Check for empty input after trimming
    
    createTaskCard(input, todoBoard);
    
    // Store tasks specific to todoBoard
    let tasks = JSON.parse(localStorage.getItem(todoBoard.id + "Tasks")) || [];
    tasks.push(input);
    localStorage.setItem(todoBoard.id + "Tasks", JSON.stringify(tasks));
});

// Function to Create Task Card
function createTaskCard(text, board) {
    const taskCard = document.createElement('div'); // Use div instead of p for better structure
    taskCard.classList.add('item');
    taskCard.setAttribute('draggable', true);
    
    // Generate unique ID for the task card
    const taskId = 'task-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    taskCard.id = taskId;
    
    // Create text element separate from delete button
    const taskText = document.createElement('span');
    taskText.innerText = text;
    taskCard.appendChild(taskText);
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = "❌";
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener("click", () => removeTask(taskCard, board));
    taskCard.appendChild(deleteBtn);
    
    attachDragEvents(taskCard);
    board.appendChild(taskCard);
}

// Function to Remove Task
function removeTask(taskCard, board) {
    // Get text content from the span element only
    const taskText = taskCard.querySelector('span').innerText;
    
    // Remove from specific board's storage
    let tasks = JSON.parse(localStorage.getItem(board.id + "Tasks")) || [];
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem(board.id + "Tasks", JSON.stringify(tasks));
    
    taskCard.remove();
}

// Drag-and-Drop Functionality
const allBoards = document.querySelectorAll('.board');
allBoards.forEach(board => {
    board.addEventListener('dragover', (event) => event.preventDefault());
    board.addEventListener('drop', (event) => {
        event.preventDefault();
        
        // Get the task card ID instead of text
        const taskId = event.dataTransfer.getData("text/plain");
        if (!taskId) return;
        
        const draggedTask = document.getElementById(taskId);
        if (!draggedTask) return;
        
        // Get original board and task text
        const originalBoard = draggedTask.parentElement;
        const taskText = draggedTask.querySelector('span').innerText;
        
        // Only proceed if dropping to a different board
        if (originalBoard !== board) {
            // Remove from original board's storage
            let originalTasks = JSON.parse(localStorage.getItem(originalBoard.id + "Tasks")) || [];
            originalTasks = originalTasks.filter(task => task !== taskText);
            localStorage.setItem(originalBoard.id + "Tasks", JSON.stringify(originalTasks));
            
            // Add to new board's storage
            let newBoardTasks = JSON.parse(localStorage.getItem(board.id + "Tasks")) || [];
            newBoardTasks.push(taskText);
            localStorage.setItem(board.id + "Tasks", JSON.stringify(newBoardTasks));
            
            // Move the task card to the new board
            board.appendChild(draggedTask);
        }
    });
});

// Dark Mode Toggle (Persists after refresh)
const toggleButton = document.getElementById("darkModeToggle");
const body = document.body;

// Check dark mode setting on load
if (localStorage.getItem("darkMode") === "enabled") {
    body.classList.add("dark-mode");
    // Update toggle button state to match
    toggleButton.classList.add("active");
}

toggleButton.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    toggleButton.classList.toggle("active");
    localStorage.setItem("darkMode", body.classList.contains("dark-mode") ? "enabled" : "disabled");
});
