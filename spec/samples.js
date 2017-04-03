
let path = require('path')
let in$  = require('../src/incredibles.js')
let o1 = {g:1, h:1, i:1}
let o2 = {a:'hello', b:'world', c:'ok'}
let a1 = [1, 2, 3, 5]
let a2 = ['a', 'b', 'c',  'd']
let f1 = v => console.log(v)
let f2 = function() { console.log(this) }

Object.assign( global, {
    re: () => {
        delete require.cache[
            in$(process.env.INCREDIBLES_PATH)
            .chain([path.join, 'src', 'incredibles.js']).value ]
        require('../src/incredibles.js')  }
  , o1: o1
  , o2: o2
  , a1: a1
  , a2: a2
  , f1: v => console.log(v)
  , f2: function() { console.log(this) }
  , o$: in$.object(o1)
  , a$: in$.array(a1)
  , s$: in$.string('hello')
  , n$: in$.number(3)
  , f$: in$.function(f1)
  , b$: in$.bin(o2)
})

console.log('ok')
