function createOpenToolAction(tool) {
  const toolAction = document.createElement('div');
  toolAction.setAttribute('class', 'tool-action');

  const icon = document.createElement('img');
  icon.setAttribute('class', 'tool-action__icon');
  icon.setAttribute('alt', tool.name);
  icon.setAttribute('src', tool.icon);

  const actionText = document.createElement('span');
  actionText.setAttribute('class', 'tool-action__text');
  actionText.textContent = `Open in ${tool.name} using`;

  const httpsLink = document.createElement('a');
  httpsLink.setAttribute('class', 'tool-action__link');
  httpsLink.setAttribute('href', tool.cloneUrl);
  httpsLink.textContent = 'HTTPS';
  setClickHandler(httpsLink);

  const delimiter = document.createElement('span');
  delimiter.setAttribute('class', 'tool-action__text');
  delimiter.textContent = '/';

  const sshLink = document.createElement('a');
  sshLink.setAttribute('class', 'tool-action__link');
  sshLink.setAttribute('href', tool.sshUrl);
  sshLink.textContent = 'SSH';
  setClickHandler(sshLink);

  toolAction.append(icon);
  toolAction.append(actionText);
  toolAction.append(httpsLink);
  toolAction.append(delimiter);
  toolAction.append(sshLink);

  return toolAction;
}

function setClickHandler(action) {
  action.addEventListener('click', e => {
    e.preventDefault();

    chrome.tabs.executeScript({
      code: `
        (function () {
          var action = document.createElement('a');
          action.style.position = 'absolute';
          action.style.left = '-9999em';
          action.href = '${e.currentTarget.href}';
          document.body.appendChild(action);
          action.click();
          document.body.removeChild(action);
        })();`
    });
  });
}

chrome.tabs.query({active: true, currentWindow: true}, tabs => {
  chrome.tabs.sendMessage(tabs[0].id, {type: 'get-tools'}, tools => {
    if (tools == null) {
      return;
    }

    const fragment = document.createDocumentFragment();
    tools.forEach(tool => {
      fragment.append(createOpenToolAction(tool));
    });
    document.getElementById('tool-action-stub').style.display = 'none';
    document.querySelector('.js-tool-actions').append(fragment);
  });
});
