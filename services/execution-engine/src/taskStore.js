// In-memory task store for rapid prototyping
const tasks = [];

function addTask(task) {
  tasks.push(task);
}

function listTasks() {
  return tasks;
}

function resetTasks() {
  tasks.length = 0;
}

module.exports = { addTask, listTasks, resetTasks };
