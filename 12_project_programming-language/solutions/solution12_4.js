// Fixing scope

/*
Currently, the only way to assign a binding a value is define. This construct acts as a way both to define new bindings and to give existing ones a new value.

This ambiguity causes a problem. When you try to give a nonlocal binding a new value, you will end up defining a local one with the same name instead. Some languages work like this by design, but I’ve always found it an awkward way to handle scope.

Add a special form set, similar to define, which gives a binding a new value, updating the binding in an outer scope if it doesn’t already exist in the inner scope. If the binding is not defined at all, throw a ReferenceError (another standard error type).

The technique of representing scopes as simple objects, which has made things convenient so far, will get in your way a little at this point. You might want to use the Object.getPrototypeOf function, which returns the prototype of an object. Also remember that scopes do not derive from Object.prototype, so if you want to call hasOwnProperty on them, you have to use this clumsy expression: Object.prototype.hasOwnProperty.call(scope, name);
*/

// load dependencies
require('../code/load')('code/chapter/12_language.js');

// specialForms.define = (args, scope) => {
//   if (args.length != 2 || args[0].type != 'word') {
//     throw new SyntaxError('Incorrect use of define');
//   }
//   let value = evaluate(args[1], scope);
//   scope[args[0].name] = value;
//   return value;
// };

specialForms.set = (args, scope) => {
  // outer scope: { x: 4, setx: [Function] }
  // inner scope: { val: 50 }
  if (Object.prototype.hasOwnProperty.call(scope, args[0].name)) {
    // overwrite x
    console.log('arg in scope');
    // x
    console.log(args[0]);
    // val
    console.log(args[1]);
    // let value = evaluate(args[1], scope);
    // console.log(value);
    // scope[args[0].name] = value;
    // return value;
  }
  if (Object.getPrototypeOf(scope) == null) {
    console.log('error');
  } else {
    console.log('recursive');
    specialForms.set(args, Object.getPrototypeOf(scope));
  }
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
// run(`set(quux, true)`);
// → Some kind of ReferenceError
