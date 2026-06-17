
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    setupFilters();
});

todoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = todoInput.value.trim();
    if (taskText !== '') {
        const newTodo = { 
            id: Date.now(), 
            text: taskText, 
            completed: false 
        };
        todos.push(newTodo);
        saveAndRender();
        todoInput.value = '';
    }
});

todoList.addEventListener('click', (e) => {
    const target = e.target;
    const todoItem = target.closest('.todo-item');
    if (!todoItem) return;
    const id = parseInt(todoItem.dataset.id);

    if (target.classList.contains('todo-checkbox')) {
        todos = todos.map(todo => todo.id === id ? { ...todo, completed: target.checked } : todo);
        saveAndRender();
    }

    if (target.classList.contains('delete-btn')) {
        todos = todos.filter(todo => todo.id !== id);
        saveAndRender();
    }


    if (target.classList.contains('edit-btn')) {
        const todo = todos.find(t => t.id === id);
        if (target.innerText === "Edit") {
            renderEditMode(todoItem, todo);
        } else {
            const input = todoItem.querySelector('.edit-input');
            saveEdit(id, input.value);
        }
    }
});


function renderEditMode(element, todo) {
    const textSpan = element.querySelector('.todo-text');
    const editBtn = element.querySelector('.edit-btn');
    
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'edit-input';
    input.value = todo.text;
    
    element.replaceChild(input, textSpan);
    editBtn.innerText = "Save";
    input.focus();

    
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit(todo.id, input.value);
    });
}


function saveEdit(id, newText) {
    if (newText.trim() !== "") {
        todos = todos.map(todo => todo.id === id ? { ...todo, text: newText.trim() } : todo);
        saveAndRender();
    }
}


function setupFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });
}


function renderTodos() {
    todoList.innerHTML = '';
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<li class="todo-item" style="border: none; justify-content: center; color: #aaa;">No tasks found</li>`;
        return;
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;
        
        li.innerHTML = `
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text">${todo.text}</span>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}


function saveAndRender() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}