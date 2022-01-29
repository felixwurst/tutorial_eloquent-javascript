// the required DOM nodes
let fileList = document.querySelector('#fileList');
let textArea = document.querySelector('#file');

// loads the initial file list from the server
fetch('/')
  .then(response => response.text())
  .then(files => {
    for (let file of files.split('\n')) {
      let option = document.createElement('option');
      option.textContent = file;
      fileList.appendChild(option);
    }
    // makes sure that the textarea contains the currently selected file
    loadCurrentFile();
  });

// fetches a file from the server and put it into the textarea
function loadCurrentFile() {
  fetch(fileList.value)
    .then(response => response.text())
    .then(file => {
      textArea.value = file;
    });
}

// watches the change event
fileList.addEventListener('change', loadCurrentFile);

// Called by the button on the page. Makes a request to save the currently selected file.
function saveFile() {
  fetch(fileList.value, {method: 'PUT', body: textArea.value});
}
