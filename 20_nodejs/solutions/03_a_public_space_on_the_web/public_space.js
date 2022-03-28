// A public space on the web

// Since the file server serves up any kind of file and even includes the right Content-Type header, you can use it to serve a website. Since it allows everybody to delete and replace files, it would be an interesting kind of website: one that can be modified, improved, and vandalized by everybody who takes the time to create the right HTTP request.

// Write a basic HTML page that includes a simple JavaScript file. Put the files in a directory served by the file server and open them in your browser.

// Next, as an advanced exercise or even a weekend project, combine all the knowledge you gained from this book to build a more user-friendly interface for modifying the website—from inside the website.

// Use an HTML form to edit the content of the files that make up the website, allowing the user to update them on the server by using HTTP requests, as described in Chapter 18.

// Start by making only a single file editable. Then make it so that the user can select which file to edit. Use the fact that our file server returns lists of files when reading a directory.

// Don’t work directly in the code exposed by the file server since if you make a mistake, you are likely to damage the files there. Instead, keep your work outside of the publicly accessible directory and copy it there when testing.

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
