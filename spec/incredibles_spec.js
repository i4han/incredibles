
let in$ = require('../incredibles.js')

describe(  "incObject", () => {
    let a = in$({a:1, b:3, c:3, d:4})
    let b = in$({})
    let c = in$({a: o => o.name})
    let d = in$({a:{b: v => v.name}})
    it("1",
        () => expect(b.add('a', 4))    .toEqual(in$({a:4}))  )
    it("2",
        () => expect(b.add('b.c', 3))  .toEqual(in$({a:4,b:in$({c:3})}))  )
    it("3",
        () => expect(b.remove('b'))    .toEqual(in$({a:4}))  )
    it("4",
        () => expect(b)    .toEqual(in$({a:4}))  )
    // it("4",
    //     () => expect(Object.is(b, in$({a:4})))    .toEqual(true)  )
    it("5",
        () => expect(b.rekey('a', 'c')).toEqual(in$({c:4}))  )
    it("6",
        () => expect(b.add({b:6}))     .toEqual(in$({c:4, b:6}))  )
    it("7",
        () => expect(b.keys())         .toEqual(['c','b'])  )
    it("8",
        () => expect(c.fnValue({name: 'ok'})).toEqual(in$({a:'ok'}))  )
    it("9",
        () => expect(d.fnValue({name: 'ok'})).toEqual(in$({a:in$({b:'ok'})}))  )
    it("10",
        () => expect(b.add(['d', 3]))  .toEqual(in$({c:4, b:6, d:3}))  )
})

describe(  "incArray", () => {
    let a = in$([1,2,3,4,5])
    let b = in$([4,5,6,7,8])
    it("typeof",
        () => expect(a.typeof('array'))             .toEqual(true)  )
    it("typeof",
        () => expect(a.typeof('array', () => 21))   .toEqual(21)  )
    it("typeof",
        () => expect(a.typeof('arr', () => 21, 23)) .toEqual(23)  )
    it("finds index of a value",
        () => expect(a.indexOf(3))           .toEqual(2)  )
    it("finds index of a function",
        () => expect(a.indexOf(v => v === 4)).toEqual(3)  )
    it("finds first value that satisfy a function",
        () => expect(a.firstValue( v => v.is(5) )).toEqual(in$(5)) )
    it("produces union of an array",
        () => expect(a.union(b))             .toEqual([1,2,3,4,5,6,7,8])  )
    it("produces intersection of an array",
        () => expect(a.intersection(b))      .toEqual([4,5])  )
    it("produces difference of an array",
        () => expect(a.difference(b))        .toEqual([1,2,3])  )
    it("test equality with an array",
        () => expect(a.is([1,2,3,4,5]))  .toEqual(true)  )
    it("test equality with an array",
        () => expect(a.is([1,2,3,4]))    .toEqual(false)  )
})

describe(  "Function", () => {
    let f = (a, b) => a + b
    let fi = in$(f)
    it("1",
        () => expect(fi.typeof('function'))  .toEqual(true)  )
    it("2",
        () => expect(f(1,2))                 .toEqual(3)  )
    it("3",
        () => expect(fi.call([], 1,2))       .toEqual(3)  )

})

describe(  "incString", () => {
    let s1 = in$('hello')
    let s2 = in$('world')
    it("1",
        () => expect(s1.typeof('function'))  .toEqual(false)  )
    it("2",
        () => expect(s1.typeof('string', 'ok')) .toEqual('ok')  )
    it("3",
        () => expect(s1.is('hello', () => 3))    .toEqual(3)  )
    it("3",
        () => expect(s1.path('home', 'client'))  .toEqual('hello/home/client')  )
    it("4",
        () => expect(s1.path(s2, 'client'))  .toEqual('hello/world/client')  )
    it("6",
        () => expect(s1.val)  .toEqual('hello')  )

})
