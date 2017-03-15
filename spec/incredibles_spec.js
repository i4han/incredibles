
let in$ = require('../src/incredibles.js')

describe(  "Object$", () => {
    let a = in$.from({a:1, b:3, c:3, d:4})
    let b = in$.from({})
    let c = in$.from({a: o => o.name})
    let d = in$.from({a:{b: v => v.name}})
    it("in$.from",
        () => expect(in$.from({a: 1}).value)  .toEqual({a:1})  )
    it("set",
        () => expect(b.set('a', 4).value)     .toEqual({a:4})  )
    it("is",
        () => expect(b.is({a: 4}))         .toEqual(true)  )
    it("dset",
        () => expect(b.setAt('b.c', 3).value)  .toEqual({a:4,b:{c:3}})  )
    it("delete",
        () => expect(b.delete('b').value)     .toEqual({a:4})  )
    it("setAt",
        () => expect(b.setAt(0, 'a.b', 4, 'c', 'd.e.2', 'hello').at(0, 'a.b.4.c', 'd.e.2')).toEqual('hello'))
    it("clear",
        () => expect(b.clear().value)         .toEqual({})  )
    it("set",
        () => expect(b.set('a', 4).value)     .toEqual({a:4})  )
    it("prop to set",
        () => expect(b.prop(0, 6).value)      .toEqual({a:4})  )
    it("prop to get",
        () => expect(b.prop(0))            .toEqual(6)  )
    it("rekey",
        () => expect(b.rekey('a', 'c').value) .toEqual({c:4})  )
    it("set",
        () => expect(b.assign({b:6},{d:5}).value).toEqual({c:4, b:6, d:5})  )
    it("delete",
        () => expect(b.delete('d').value)     .toEqual({c:4, b:6})  )
    it("keys",
        () => expect(b.keys())             .toEqual(['c','b'])  )
    it("__",
        () => expect(b.value)              .toEqual({c:4, b:6})  )
    it("save and delete",
        () => expect(b.cash.saveValuePropertyTo('c').delete('c').value).toEqual({b:6})  )
    it("restore",
        () => expect(b.cash.restoreValuePropertyFrom('c').value)       .toEqual({c:4, b:6})  )
    it("is",
        () => expect(b.is({c:4, b:6}))     .toEqual(true)  )
    it("is with true callback",
        () => expect(b.is({c:4, b:6}, () => 'ok')).toEqual('ok')  )
    it("typeof",
        () => expect(b.typeof('object'))          .toEqual(true)  )
    it("typeof with true callback",
        () => expect(b.typeof('object', () => 'good')).toEqual('good')  )
    it("evalProperties type 1",
        () => expect(c.invokeProperties({name: 'ok'}).value).toEqual({a:'ok'})  )
    it("evalProperties type 2",
        () => expect(d.invokeProperties({name: 'hi'}).value).toEqual({a:{b:'hi'}})  )
    it("aset",
        () => expect(b.zip(['d'], [3]).value).toEqual({c:4, b:6, d:3})  )
})

describe(  "Array$", () => {
    let a = in$.from([1,2,3,4,5])
    let b = in$.from([4,5,6,7,8])
    it("is",
        () => expect(a.is([1,2,3,4,5]))      .toEqual(true)  )
    it("typeof",
        () => expect(a.typeof('array'))      .toEqual(true)  )
    it("typeof returns true",
        () => expect(a.if(v => v.typeof('array') ).then(v => 21).result).toEqual(21)  )
    it("typeof returns false",
        () => expect(a.if(v => v.typeof('object')).else(23).result).toEqual(23)  )
    it("length",
        () => expect(in$.from([1,1,1,1,1]).length).toEqual(5)  )
    it("findIndex",
        () => expect(a.findIndex(v => v === 2))  .toEqual(1)  )
    it("find",
        () => expect(a.find( v => v === 5 )).toEqual(in$.from(5)) )
    it("union",
        () => expect(a.union(b))       .toEqual([1,2,3,4,5,6,7,8])  )
    it("intersection",
        () => expect(a.intersection(b)).toEqual([4,5])  )
    it("difference",
        () => expect(a.difference(b))  .toEqual([1,2,3])  )
    it("is returns true",
        () => expect(a.is([1,2,3,4,5])).toEqual(true)  )
    it("is returns false",
        () => expect(a.is([1,2,3,4]))  .toEqual(false)  )
})

describe(  "Function", () => {
    let f = (a, b) => a + b
    let fi = in$.from(f)
    it("function",
        () => expect(f(1,2))        .toEqual(3)  )
    it("invoke",
        () => expect(fi.invoke(1,2).value).toEqual(3)  )

})

describe(  "String$", () => {
    let s1 = in$.from('hello')
    let s2 = in$.from('world')
    it("1",
        () => expect(s1.typeof('function')) .toEqual(false)  )
    it("2",
        () => expect(s1.if(v => v.typeof('string')).then('ok').result).toEqual('ok')  )
    it("3",
        () => expect(s1.if(v => v.is('hello')).then(() => 3).result)  .toEqual(3)  )
    it("4",
        () => expect(s1.path('home', 'client').__).toEqual('hello/home/client')  )
    it("5",
        () => expect(s1.path(s2, 'client').__)    .toEqual('hello/world/client')  )
    it("6",
        () => expect(s1.__)                       .toEqual('hello')  )
    it("7",
        () => expect(s1.if(v => v.is('hello')).then( w => w + 'o' ).result).toEqual('helloo')  )
    it("8",
        () => expect(s1.if(v => v.is('hell' )).else( x => x + 'p' ).result).toEqual('hellop')  )
    it("10",
        () => expect(in$.from('hello-world').camelize()) .toEqual('helloWorld') )
    it("11",
        () => expect(in$.from('helloWorld') .dasherize()).toEqual('hello-world') )

})

describe(  "String", () => {
    it("1",
        () => expect('halo'.padStart(5)).toEqual(' halo')  )
    it("2",
        () => expect('halo'.padEnd(5))  .toEqual('halo ')  )

})
