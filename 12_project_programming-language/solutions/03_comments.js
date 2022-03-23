// Comments

/*
It would be nice if we could write comments in Egg. For example, whenever we find a hash sign (#), we could treat the rest of the line as a comment and ignore it, similar to // in JavaScript.

We do not have to make any big changes to the parser to support this. We can simply change skipSpace to skip comments as if they are whitespace so that all the points where skipSpace is called will now also skip comments. Make this change.
*/

// load dependencies
require('../code/load')('code/chapter/12_language.js');

// origin version: only for removing white space
function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return '';
  return string.slice(first);
}

// my version: also for skipping comments
function skipSpace(string) {
  let hash = string.search(/#/);
  if (hash !== -1) {
    let commentEnd = string.search(/\n/);
    string = string.replace(string.slice(hash, commentEnd + 1), '');
  }
  let first = string.search(/\S/);
  if (first == -1) return '';
  return string.slice(first);
}

// book version: for removing white space & skipping comments
function skipSpace(string) {
  // returns a string that is to be at the beginning and is either white space or a hash sign followed by any characters that may not be a new line
  let skippable = string.match(/^(\s|#.*)*/);
  // the found string is removed from the beginning of the original string
  return string.slice(skippable[0].length);
}

console.log(parse('# hello\nx'));
// → {type: "word", name: "x"}

console.log(parse('a # one\n   # two\n()'));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}
