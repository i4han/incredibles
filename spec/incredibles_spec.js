
let inc = require('../src/incredibles.js')

describe(  "Object$", () => {
    let a = inc.$({a:1, b:3, c:3, d:4})
    let b = inc.$({})
    let c = inc.$({a: o => o.name})
    let d = inc.$({a:{b: v => v.name}})
    it("inc.$",
        () => expect(inc.$({a: 1}).__)    .toEqual({a:1})  )
    it("set",
        () => expect(b.set('a', 4).__)    .toEqual({a:4})  )
    it("is",
        () => expect(b.is({a: 4}))        .toEqual(true)  )
    it("dset",
        () => expect(b.dset('b.c', 3).__) .toEqual({a:4,b:{c:3}})  )
    it("delete",
        () => expect(b.delete('b').__)    .toEqual({a:4})  )
    it("__",
        () => expect(b.__)                .toEqual({a:4})  )
    it("prop to set",
        () => expect(b.prop(0, 6).__)      .toEqual({a:4})  )
    it("prop to get",
        () => expect(b.prop(0))            .toEqual(6)  )
    it("rekey",
        () => expect(b.rekey('a', 'c').__).toEqual({c:4})  )
    it("set",
        () => expect(b.oset({b:6},{d:5}).__)    .toEqual({c:4, b:6, d:5})  )
    it("delete",
        () => expect(b.delete('d').__)    .toEqual({c:4, b:6})  )
    it("keys",
        () => expect(b.keys())            .toEqual(['c','b'])  )
    it("__",
        () => expect(b.__)                .toEqual({c:4, b:6})  )
    it("is",
        () => expect(b.is({c:4, b:6}))    .toEqual(true)  )
    it("is with true callback",
        () => expect(b.is({c:4, b:6}, () => 'ok')).toEqual('ok')  )
    it("typeof",
        () => expect(b.typeof('object'))          .toEqual(true)  )
    it("typeof with true callback",
        () => expect(b.typeof('object', () => 'good')).toEqual('good')  )
    it("evalProperties type 1",
        () => expect(c.evalProperties({name: 'ok'}).__).toEqual({a:'ok'})  )
    it("evalProperties type 2",
        () => expect(d.evalProperties({name: 'hi'}).__).toEqual({a:{b:'hi'}})  )
    it("aset",
        () => expect(b.aset(['d'], [3]).__)     .toEqual({c:4, b:6, d:3})  )
})

describe(  "Array$", () => {
    let a = inc.$([1,2,3,4,5])
    let b = inc.$([4,5,6,7,8])
    it("is",
        () => expect(a.is([1,2,3,4,5]))      .toEqual(true)  )
    it("typeof",
        () => expect(a.typeof('array'))      .toEqual(true)  )
    it("typeof returns true",
        () => expect(a.if(v => v.typeof('array') ).then(v => 21).result).toEqual(21)  )
    it("typeof returns false",
        () => expect(a.if(v => v.typeof('object')).else(23).result).toEqual(23)  )
    it("length",
        () => expect(inc.$([1,1,1,1,1]).length).toEqual(5)  )
    it("findIndex",
        () => expect(a.findIndex(v => v === 2))  .toEqual(1)  )
    it("find",
        () => expect(a.find( v => v === 5 )).toEqual(inc.$(5)) )
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
    let fi = inc.$(f)
    it("2",
        () => expect(f(1,2))             .toEqual(3)  )
    it("3",
        () => expect(fi.__.call([], 1,2)).toEqual(3)  )

})

describe(  "String$", () => {
    let s1 = inc.$('hello')
    let s2 = inc.$('world')
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
        () => expect(inc.$('hello-world').camelize()) .toEqual('helloWorld') )
    it("11",
        () => expect(inc.$('helloWorld') .dasherize()).toEqual('hello-world') )

})

describe(  "String", () => {
    it("1",
        () => expect('halo'.padStart(5)).toEqual(' halo')  )
    it("2",
        () => expect('halo'.padEnd(5))  .toEqual('halo ')  )

})
