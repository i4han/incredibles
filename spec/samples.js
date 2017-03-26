global.path = require('path')
global.in$  = require('../src/incredibles.js')

global.re = () => {
    delete require.cache[
        process.env.INCREDIBLES_PATH.into$
        .chain([path.join, 'src', 'incredibles.js']).value ]
    require('../src/incredibles.js')  }
global.ooo = {g:1, h:1, i:1}
global.obj = {a:1, b:2, c:3}
global.ary = [1,2,3,5]
global.o = new in$.Object$(obj)
global.a = new in$.Array$(ary)
global.s = new in$.String$('hello')
global.i = new in$.Bin$(obj)
global.fn = () => console.log(this)
console.log('ok')
