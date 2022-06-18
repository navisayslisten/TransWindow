const { Notification } = require('electron')

function showNotification(title, body) {
  const options = {
    title,
    body,
    silent: false,
    timeoutType: 'default'
  }
  new Notification(options).show();
  console.log(`${title}: ${body}`);
}

exports.showNotification = showNotification;
