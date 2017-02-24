
let inc = require('../src/incredibles.js')('$')

describe(  "Object$", () => {
    let a = inc.$({a:1, b:3, c:3, d:4})
    let b = inc.$({})
    let c = inc.$({a: o => o.name})
    let d = inc.$({a:{b: v => v.name}})
    it("0",
        () => expect(inc.$({a: 1}).__)      .toEqual({a:1})  )
    it("1",
        () => expect(b.set('a', 4).__)    .toEqual({a:4})  )
    it("2",
        () => expect(b.dset('b.c', 3).__) .toEqual({a:4,b:{c:3}})  )
    it("3",
        () => expect(b.delete('b').__)    .toEqual({a:4})  )
    it("4",
        () => expect(b.__)                .toEqual({a:4})  )
    it("5",
        () => expect(b.rekey('a', 'c').__).toEqual({c:4})  )
    it("6",
        () => expect(b.oset({b:6}).__)    .toEqual({c:4, b:6})  )
    it("7",
        () => expect(b.keys())            .toEqual(['c','b'])  )
    it("8",
        () => expect(b.__)            .toEqual({c:4, b:6})  )
    it("9",
        () => expect(b.is({c:4, b:6}))            .toEqual(true)  )
    it("10",
        () => expect(b.is({c:4, b:6}, () => 'ok')).toEqual('ok')  )
    it("11",
        () => expect(b.typeof('object'))          .toEqual(true)  )
    it("12",
        () => expect(b.typeof('object', () => 'good'))   .toEqual('good')  )
    it("13",
        () => expect(c.fnValue({name: 'ok'}).__).toEqual({a:'ok'})  )
    it("14",
        () => expect(d.fnValue({name: 'hi'}).__).toEqual({a:{b:'hi'}})  )
    it("15",
        () => expect(b.aset(['d'], [3]).__)     .toEqual({c:4, b:6, d:3})  )
})

describe(  "Array$", () => {
    let a = inc.$([1,2,3,4,5])
    let b = inc.$([4,5,6,7,8])
    it("typeof",
        () => expect(a.typeof('array'))      .toEqual(true)  )
    it("typeof",
        () => expect(a.if(v => v.typeof('array') ).then(v => 21).result).toEqual(21)  )
    it("typeof",
        () => expect(a.if(v => v.typeof('object')).else(23).result).toEqual(23)  )
    it("length",
        () => expect(inc.$([1,1,1,1,1]).length).toEqual(5)  )
    it("finds index of a value",
        () => expect(a.indexOf(3))           .toEqual(2)  )
    it("finds index of a function",
        () => expect(a.indexOf(v => v === 4)).toEqual(3)  )
    it("finds first value that satisfy a function",
        () => expect(a.until( v => v === 5 )).toEqual(inc.$(5)) )
    it("produces union of an array",
        () => expect(a.union(b))       .toEqual([1,2,3,4,5,6,7,8])  )
    it("produces intersection of an array",
        () => expect(a.intersection(b)).toEqual([4,5])  )
    it("produces difference of an array",
        () => expect(a.difference(b))  .toEqual([1,2,3])  )
    it("test equality with an array",
        () => expect(a.is([1,2,3,4,5])).toEqual(true)  )
    it("test equality with an array",
        () => expect(a.is([1,2,3,4]))  .toEqual(false)  )
})

describe(  "Function", () => {
    let f = (a, b) => a + b
    let fi = inc.$(f)
    it("2",
        () => expect(f(1,2))               .toEqual(3)  )
    it("3",
        () => expect(fi.call([], 1,2))     .toEqual(3)  )

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
