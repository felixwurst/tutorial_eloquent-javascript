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
