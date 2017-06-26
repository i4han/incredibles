
let in$ = require('../src/incredibles.js')

describe(  "Bin$", () => {
    let a = in$({a:1, b:3, c:3, d:4})
    let b = in$({})
    let c = in$({a: o => o.name})
    let d = in$({a:{b: v => v.name}})
    it("in$.from",
        () => expect(in$.from({a: 1}).value).toEqual({a:1})  )
    it("set",
        () => expect(b.set('a', 4).value)   .toEqual({a:4})  )
    it("is",
        () => expect(b.is({a: 4}).flag)    .toEqual(true)  )
    it("setAt",
        () => expect(b.setAt('b.c', 3).value).toEqual({a:4,b:{c:3}})  )
    it("delete",
        () => expect(b.delete('b').value)    .toEqual({a:4})  )
    it("setAt",
        () => expect(b.setAt(0, 'a.b', 4, 'c', 'd.e.2', 'hello')
                         .at(0, 'a.b', 4, 'c', 'd.e.2')).toEqual('hello'))
    it("clear",
        () => expect(b.clear().value)      .toEqual({})  )
    it("set",
        () => expect(b.set('a', 4).value)  .toEqual({a:4})  )
    it("prop to set",
        () => expect(b.$.setAt('a', 6).value).toEqual({a:4})  )
    it("prop to get",
        () => expect(b.$.a)               .toEqual(6)  )
    it("rekey",
        () => expect(b.rekey('a', 'c').value).toEqual({c:4})  )
    it("set",
        () => expect(b.assign({b:6},{d:5}).value).toEqual({c:4, b:6, d:5})  )
    it("delete",
        () => expect(b.delete('d').value).toEqual({c:4, b:6})  )
    it("keys",
        () => expect(b.keys())           .toEqual(['c','b'])  )
    it("__",
        () => expect(b.value)            .toEqual({c:4, b:6})  )
    it("save and delete",
        () => expect(b.save('c').delete('c').value).toEqual({b:6})  )
    it("restore",
        () => expect(b.restore('c').value)       .toEqual({c:4, b:6})  )
    it("is",
        () => expect(b.is({c:4, b:6}).flag)     .toEqual(true)  )
    it("is with true callback",
        () => expect(b.is({c:4, b:6}).then(v => 'ok').result).toEqual('ok')  )
    it("type",
        () => expect(b.type('object').flag) .toEqual(true)  )
    it("type with true callback",
        () => expect(b.type('object').then(v=>'good').result).toEqual('good')  )
    it("evalProperties type 1",
        () => expect(c.invokeProperties({name: 'ok'}).value).toEqual({a:'ok'})  )
    it("evalProperties type 2",
        () => expect(d.invokeProperties({name: 'hi'}).value).toEqual({a:{b:'hi'}})  )
    it("aset",
        () => expect(b.zip(['d'], [3]).value).toEqual({c:4, b:6, d:3})  )
})

describe(  "Array$", () => {
    let a = in$([1,2,3,4,5])
    let b = in$([4,5,6,7,8])
    it("is",
        () => expect(a.is([1,2,3,4,5]).flag).toEqual(true) )
    it("type",
        () => expect(a.type('array').flag).toEqual(true) )
    it("type returns true",
        () => expect(a.type('array').then(v=>21).result).toEqual(21)  )
    it("type returns false",
        () => expect(a.type('object').then(v=>21).else(v=>23).result).toEqual(23)  )
    it("length",
        () => expect(in$.from([1,1,1,1,1]).size()).toEqual(5)  )
    it("findIndex",
        () => expect(a.cut().findIndex(v => v === 2).value).toEqual(1) )
    it("find",
        () => expect(a.find(v => v === 5).value).toEqual(5) )
    it("union",
        () => expect(a.union(b).value) .toEqual([1,2,3,4,5,6,7,8])  )
    it("intersection",
        () => expect(a.intersection(b).value).toEqual([4,5]) )
    it("difference",
        () => expect(a.difference(b).value)  .toEqual([1,2,3]) )
    it("'is' returns true",
        () => expect(a.is([1,2,3,4,5]).flag).toEqual(true)  )
    it("'is' returns false",
        () => expect(a.is([1,2,3,4]).flag)  .toEqual(false)  )
})

describe(  "Function", () => {
    let f = (a, b) => a + b
    let fi = in$.from(f)
    it("function",
        () => expect(f(1,2))        .toEqual(3)  )
    it("invoke",
        () => expect(fi.invoke(1,2).value).toEqual(3)  )

})

let path = require('path')

describe(  "String$", () => {
    in$.ductMethod('path', 'thru', path.join)
    let s1 = in$('hello').cut()
    let s2 = in$('world')
    it("type logic",
        () => expect(s1.type('function').flag) .toEqual(false)  )
    it("type result",
        () => expect(s1.type('string').then(v=>'ok').result).toEqual('ok')  )
    it("is then",
        () => expect(s1.is('hello').then(v=>3).result).toEqual(3)  )
    it("path",
        () => expect(s1.path('home',   'client').value).toEqual('hello/home/client')  )
    it("path",
        () => expect(s1.path(s2.value, 'client').value).toEqual('hello/world/client')  )
    it("value",
        () => expect(s1.value)                         .toEqual('hello')  )
    it("'is' true",
        () => expect(s1.is('hello').then( w=>w + 'o' ).result).toEqual('helloo')  )
    it("'is' false",
        () => expect(s1.is('hellx').else( x=>x + 'p' ).result).toEqual('hellop')  )
    it("camelize",
        () => expect(in$('hello-world').camelize().value) .toEqual('helloWorld') )
    it("dasherize",
        () => expect(in$('helloWorld') .dasherize().value).toEqual('hello-world') )

})

describe(  "String", () => {
    it("padStart",
        () => expect('halo'.padStart(5)).toEqual(' halo')  )
    it("padEnd",
        () => expect('halo'.padEnd(5))  .toEqual('halo ')  )

})
