const { ipcRenderer } = require('electron')


let messages = document.querySelector('#messages');

ipcRenderer.on('ping', (event, ping) => {
  let message = document.createElement('div');
  message.textContent = `${ping}`;
  messages.appendChild(message);
})

ipcRenderer.on('sub', (event, body) => {
  let message = document.createElement('div');
  message.textContent = `${body}`;
  messages.appendChild(message);
})

ipcRenderer.on('resub', (event, body) => {
  let message = document.createElement('div');
  message.textContent = `${body}`;
  messages.appendChild(message);
})

ipcRenderer.on('giftsub', (event, body) => {
  let message = document.createElement('div');
  message.textContent = `${body}`;
  messages.appendChild(message);
})
