document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todosContainer = document.getElementById('todos-container');

  // Load todos on page load
  loadTodos();

  // Add new todo
  todoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = todoInput.value.trim();
    if (!title) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        todoInput.value = '';
        loadTodos(); // Refresh list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add todo');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    }
  });

  // Delete todo
  todosContainer.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-btn')) {
      const todoItem = e.target.closest('.todo-item');
      const id = todoItem.dataset.id;

      try {
        const response = await fetch(`/api/todos/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          todoItem.style.opacity = '0';
          todoItem.style.transform = 'translateX(100px)';
          setTimeout(() => {
            todoItem.remove();
            checkEmptyState();
          }, 300);
        } else {
          alert('Failed to delete todo');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Something went wrong!');
      }
    }
  });

  // Fetch and render todos
  async function loadTodos() {
    try {
      const response = await fetch('/api/todos');
      const todos = await response.json();
      renderTodos(todos);
    } catch (err) {
      console.error('Error loading todos:', err);
    }
  }

  // Render todos in DOM
  function renderTodos(todos) {
    if (todos.length === 0) {
      todosContainer.innerHTML = `
        <p class="empty-state">📭 No todos yet. Add one above!</p>
      `;
      return;
    }

    const todosList = document.createElement('ul');
    todosList.className = 'todos-list';

    todos.forEach(todo => {
      const li = document.createElement('li');
      li.className = 'todo-item';
      li.dataset.id = todo.id;

      li.innerHTML = `
        <div class="todo-content">
          <h3>${escapeHtml(todo.title)}</h3>
          <small class="todo-time">${todo.createdAt}</small>
        </div>
        <button class="delete-btn" title="Delete Todo">🗑️</button>
      `;

      todosList.appendChild(li);
    });

    todosContainer.innerHTML = '';
    todosContainer.appendChild(todosList);
  }

  // Check if empty and show empty state
  function checkEmptyState() {
    const items = document.querySelectorAll('.todo-item');
    if (items.length === 0) {
      todosContainer.innerHTML = `
        <p class="empty-state">📭 No todos yet. Add one above!</p>
      `;
    }
  }

  // Prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});