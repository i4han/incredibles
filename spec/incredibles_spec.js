let i$ = require('../incredibles.js')

describe(  "incObject", () => {
    let a = i$({a:1, b:3, c:3, d:4})
    let b = i$({})
    it("1",
        () => expect(b.add('a', 4))    .toEqual(i$({a:4}))  )
    it("2",
        () => expect(b.add('b.c', 3))  .toEqual(i$({a:4,b:i$({c:3})}))  )
    it("3",
        () => expect(b.remove('b'))    .toEqual(i$({a:4}))  )
    it("4",
        () => expect(b.rekey('a', 'c')).toEqual(i$({c:4}))  )
    it("5",
        () => expect(b.add({b:6}))     .toEqual(i$({c:4, b:6}))  )
    it("6",
        () => expect(b.keys())         .toEqual(['c','b'])  )
    it("7",
        () => expect(b.add(['d', 3]))  .toEqual(i$({c:4, b:6, d:3}))  )
})

describe(  "incArray", () => {
    let a = i$([1,2,3,4,5])
    let b = i$([4,5,6,7,8])
    it("finds index of a value",
        () => expect(a.indexOf(3))           .toEqual(2)  )
    it("finds index of a function",
        () => expect(a.indexOf(v => v === 4)).toEqual(3)  )
    it("produces union of an array",
        () => expect(a.union(b))             .toEqual([1,2,3,4,5,6,7,8])  )
    it("produces intersection of an array",
        () => expect(a.intersection(b))      .toEqual([4,5])  )
    it("produces difference of an array",
        () => expect(a.difference(b))        .toEqual([1,2,3])  )
    it("test equality with an array",
        () => expect(a.equals([1,2,3,4,5]))  .toEqual(true)  )
    it("test equality with an array",
        () => expect(a.equals([1,2,3,4]))    .toEqual(false)  )
})

false && describe(  "incFunction", () => {
    let f = (a, b) => console.log('hello', a + b)
    let fi = i$(f)
    it("1",
        () => expect(fi.is('function'))       .toEqual(true)  )
    it("2",
        () => expect(f(1,2))        .toEqual(3)  )
    it("3",
        () => expect(fi.call(1,2))        .toEqual(3)  )

})
