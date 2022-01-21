// Search tool

// On Unix systems, there is a command line tool called grep that can be used to quickly search files for a regular expression.

// Write a Node script that can be run from the command line and acts somewhat like grep. It treats its first command line argument as a regular expression and treats any further arguments as files to search. It should output the names of any file whose content matches the regular expression.

// When that works, extend it so that when one of the arguments is a directory, it searches through all files in that directory and its subdirectories.

// Use asynchronous or synchronous file system functions as you see fit. Setting things up so that multiple asynchronous actions are requested at the same time might speed things up a little, but not a huge amount, since most file systems can read only one thing at a time.

const {statSync, readdirSync, readFileSync} = require('fs');
const {sep} = require('path');

// treats its first command line argument as a regular expression
let searchWord = new RegExp(process.argv[2]);
// treats all other arguments as files to be searched
for (const arg of process.argv.slice(3)) {
  search(arg);
}

function search(file) {
  let stats = statSync(file);
  // if one of the arguments is a directory, all files in that directory and its subdirectories are searched
  if (stats.isDirectory()) {
    for (const f of readdirSync(file)) {
      search(file + sep + f);
    }
    // outputs the names of all files whose content matches the regular expression
  } else if (searchWord.test(readFileSync(file, 'utf8'))) {
    console.log(file);
  }
}
