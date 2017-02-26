
'use strict'

require('./polyfill.js')
let path = {}

if ('undefined' === typeof Meteor) {
    let bypassRequire = require
    bypassRequire('underscore2')
    path = bypassRequire('path')  }

let condition = new WeakMap()
let result    = new WeakMap()

const __func  = (fn, o) => __.isFunction(fn) ? result.set(o, fn(o)) : result.set(o, fn)

const __is = (answer, o, ...fn) =>
    fn.length === 0 ? answer ? true     : false :
    fn.length === 1 ? answer ? fn[0](o) : false :
    fn.length === 2 ? answer ? fn[0](o) : fn[1](o)
                    : console.log('error: is')

const __typeof = (answer, type, o, ...fn) =>
    fn.length === 0 ? answer === type ? true     : false :
    fn.length === 1 ? answer === type ? fn[0](o) : false :
    fn.length === 2 ? answer === type ? fn[0](o) : fn[1](o)
                    : console.log('error: typeof')

const __if = (o, f) => {
    condition.set( o, __.isFunction(f) ? !!f(o) : !!f )
    return o  }

const __then = (o, f) => {
    if (condition.get(o) === true )
        __.isFunction(f) ? __func(f, o) : result.set(o, f)
    return o  }

const __else = (o, f) => {
    if (condition.get(o) === false)
        __.isFunction(f) ? __func(f, o) : result.set(o, f)
    return o  }

const __else_if = (o, f) => {
    if (condition.get(o) === true )
         condition.set( o, undefined )
    else condition.set( o, __.isFunction(f) ? !!f(o) : !!f )
    return o  }

// const __return = (o, ...v) =>
//     v.length === 1 ?                    __func(v[0], o) :
//     v.length === 2 ? condition.get(o) ? __func(v[0], o) : __func(v[1], o)
//                    : console.log('error: return')
const __pipe = (o, f) => {
    let ret
    result.set(o, ret = f(o))
    return ret  }

const __prop = (o, ...args) => {
    if      (args.length === 1) return property.get(o)[ args[0] ]
    else if (args.length === 2) property.get(o)[ args[0] ] = args[1]
    return o  }


const __assign = (obj, ...prop) => {
    prop.forEach( p => {
    p = p instanceof Object$ ? p.__ : p
    for ( let k in p )
        obj.set(k, p[k]) })
    // {
        // if ( __.isObject(p[k]) ) obj.set( k, p[k] )
        // else obj.set( k, p[k] ) } }  )
    return obj  }

const __evalProperties = (o, self) => {
    Object.keys(o).forEach( k =>
        o[k] = __.isObject(o[k])   ? __evalProperties(o[k], self) :
               __.isFunction(o[k]) ? o[k](self) : o[k] )
    return o  }

const __get = (o, ...keys) =>
    o instanceof Object$ ?
        keys.length === 1 ? o.get(keys[0]) : __get( o.get(keys[0]), keys.slice(1) ) :
        keys.length === 1 ? o[keys[0]]     : __get( o[keys[0]], keys.slice(1) )

const __set = (o, k, v) =>
    o instanceof Object$ ? o.set(k, v) : o[k] = v

const __equal = (x, y) => {
    if ( x === y ) return true
    if ( x.constructor !== y.constructor ) return false
    if ( Object.keys(x).length !== Object.keys(y).length ) return false
    for (let p in x) {
        if ( Object.is(x[p], y[p]) ) continue
        if ( "object" !== typeof x[p] || "object" !== typeof y[p] ) return false
        if ( ! __equal(x[p], y[p]) ) return false  }
    return true  }

// Function.prototype.typeof = (type, ...fn) => __typeof('function', type, this, ...fn)
// Function.prototype.is = (f, ...fn) => __is(f.toString === this.toString, this, fn)
// String.prototype.in$ = function() { return new String$(this) }


let object   = new WeakMap()
let property = new WeakMap()

class Map$ extends Map {
    constructor (arg) {
        super(arg)  }
    typeof (type, ...fn) {
        return __typeof( 'map', type, this, ...fn )  }
}

/**
 * @class {Object$}
 * @example in$({a:1, b:2, c:3}).keys() => ['a', 'b', 'c']
 * @method keys
 * @return {Array$} keys of the Object$
 */

class Object$ extends Object {
    constructor (arg) {
        super()
        property.set(this, {})
        object.set(this, arg instanceof Object$ ? arg.__: arg || {})  }
    is (obj, ...fn) {
        return __is( __equal(this.__, obj), this.__, ...fn)  }
    typeof (type, ...fn) {
        return __typeof( 'object', type, this, ...fn )  }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.__[v] )
        else delete this.__[ keys[0] ]
        return this  }
    // __add (key, value) {
    //     return this.set(key, value)  }

    set (key, value) {
        //this[key] = value Object.assign
        object.get(this)[key] = value
        return this  }
    dset (key, value) {
        let re = key.match(/^([^.]+)\.(.*$)/)
        let [firstKey, restKey] = [re[1], re[2]]
        let objFirst = this.get(firstKey)
        objFirst = this.set(firstKey, objFirst || {}).get$(firstKey)
        restKey.indexOf('.') === -1 ?
            __set ( objFirst, restKey, value ) :
            objFirst.dset( restKey, value )
        return this  }
    oset (...obj) {
        __assign(this, obj[0])  // recursive obj reference assign
        return obj.length > 1 ? this.oset( ...obj.slice(1) ) : this }
    aset (key, value) { //   aset(['a', 'b', 'c'], [1,2,3])
        key.forEach( (v, i) => this.set( v, value[i] ) )
        return this  }
    get$ (...key) {    // for object
        return any$( this.get(...key) )  }
    get (...key) {
        let k = object.get(this)[ key[0] ]
        return key.length > 1 ? __get(k, key.slice(1)) : k }
    dget$ (...key) {
        return any$( this.dget(...key) )  }
    dget (...key) {
        return this.get( ...key.join('.').split('.') )  }

    size () { return this.keys().length }
    clear () {
        object.set(this, {})
        return this  }
    has (k) {
        return k in this.__  }
    forEach (f) {
        this.keys().forEach( k => f( this.get(k), k, this ) )
        return this  }
    map (f)    { return this.keys().map(    k => f( this.get(k), k, this ) ) }
    filter (f) { return this.keys().filter( k => f( this.get(k), k, this ) ) }
    reduce (f, init) {
        let accumulator = init
        for (let p in this.__)
            accumulator = f( accumulator, this.get(k), k, this)
        return accumulator  }
    keys ()    { return Object.keys( this.__ ) }
    values ()  {
        return this.keys().map( k => this.get(k) )  }
    // entries () {
    //     return this.keys().map( k => [k, this.get(k)] )  }
    entries ()  { return Object.entries(this.__) }
    freeze ()   { return Object.freeze(this.__) && this }
    isFrozen () { return Object.isFrozen(this.__) }
    seal ()     { return Object.seal(this.__) && this }
    isExtensible()     { return Object.isExtensible(this.__) }
    getPrototypeOf()   { return Object.getPrototypeOf(this.__) }
    getOwnPropertyNames()   { return Object.getOwnPropertyNames(this.__) }
    getOwnPropertySymbols() { return Object.getOwnPropertySymbols(this.__) }
    getOwnPropertyDescriptor (prop) { return Object.getOwnPropertyDescriptor(this.__, prop) }
    valueOf ()   { return this.__.valueOf() }
    toString ()  { return this.__.toString() }
    unwatch (p)  { return this.__.unwatch(p) }
    watch (p, handler) { return this.__.watch(p, handler) }
    hasOwnProperty (p) { return this.__.hasOwnProperty(p) }
    isPrototypeOf (o)  { return this.__.isPrototypeOf(o) }
    propertyIsEnumerable(p) { return this.__.propertyIsEnumerable(p) }
    rekey (oldKey, newKey)  {
        this.set( newKey, this.get(oldKey) )
        if ( this.hasOwnProperty(oldKey) ) {
            this.delete(oldKey)  }
        return this  }
    evalProperties (self) { // evaluateFunctionProperties evaluateProperties
        this.forEach(  (v,k) => this.set(  k,
            __.isFunction(v) ? v(self) :
            __.isObject(v)   ? __evalProperties(v, self) : v  ))
        return this  }
    valueOf ()       { return this.__  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return object.get(this)  }  }

// let Object$ = v => v instanceof Object$ ? v : new Object$(v)

class Array$ extends Array {
    constructor (arg) {
        super()
        property.set(this, {})
        let value = arg instanceof Array$ ? arg.__ : arg
        if (value)
            for(let i = 0; i < value.length; i++)
                this[i] = arg[i]  }
    is (a, ...fn) {
        return __is(  __equal(this.__, a.valueOf() ), this, ...fn ) }
    typeof (type, ...fn) {
        return __typeof('array', type, this, ...fn) }
    if   (f)    { return __if  (this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    get (i) {
        return this[i]  }
    set (i, v) {
        return this[i] = v  }
    indexOf (f) { // findIndex
        let fn
        if ( __.isFunction(f) ) fn = f
        else fn = arg => arg === f
        for (let i = 0; i < this.length; i++)
            if ( fn(this[i], i, this) ) return i
        return -1  }
    find$ (f) {
        return any$( this.find(f) )  }
    shift$ () {
        this.shift()
        return this  }
    // map    (...args) { return Array$(object.get(this).map    (...args)) }
    // forEach(...args) { return Array$(object.get(this).forEach(...args)) }
    // filter (...args) { return Array$(object.get(this).filter (...args)) }
    // reduce (...args) { return in$   (object.get(this).reduce (...args)) }
    // concat (...args) { return Array$(object.get(this).concat (...args)) }
    // slice  (...args) { return Array$(object.get(this).slice  (...args)) }
    // splice (...args) { return Array$(object.get(this).splice (...args)) }
    unique (f) {
        f = f || (v => w => v === w)
        return this.filter( (v, i) => this.findIndex( f(v, i) ) === i )  }
    intersection (b, f) {
        let bIndex
        f = f || (v => w => v === w)
        return this.reduce(  ((a, v, i) => {
            if ( ( bIndex = b.findIndex( f(v, i) ) ) !== -1 )
                return a.concat(
                    __.isObject(v) ? v.set( b[bIndex] ) : v )
            else return a  }), new Array$()  )  }
    difference (b, f) {
        f = f || (v => w => v === w)
        return this.filter( (v, i) => b.findIndex( f(v, i) ) === -1 )  }
    union (b, f) {
        f = f || (v => w => v === w)
        return this.difference(b, f)
            .concat(this.intersection(b, f))
            .concat(b.difference(this, f))  }
    xmap (b, f) { f(v, w, i, a) }
    __coMap (b, f) {
        return this.reduce((a, v, i) => {
        a[i] = f(v, b[i], i, this)
        return a }, new Array$()  )  }
    insert (i, ...v) {              // if v is array?
        this.splice(i, 0, ...v)
        return this }
    delete (i, n, ...v) {
        this.splice(i, n, ...v)
        return this }
    sum (f) {
        f = f || (v => v)
        return this.reduce(((a,v) => a += f(v)), 0)  }
    average (f) {
        return this.sum(f) / this.length  }
    valueOf () { return this.__ }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return Array.from(this)  }  }


// let Array$ = v => v instanceof Array$ ? v : new Array$(v)//.concat(v)
class Function$ extends Function {
    constructor (arg) {
        super()
        property.set(this, {})
        object.set(this, arg)  }
    typeof (type, ...fn) {
        return __typeof('function',  type, this, ...fn)  }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }

    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return object.get(this)  }  }


class String$ extends String {
    constructor (arg) {
        super(arg instanceof String$ ? arg.__ : arg)
        property.set(this, {})  }
    is (str, ...fn) {
        return __is( str.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('string',  type, this, ...fn)  }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }

    path (...str) {
        return new String$( path.join( this.__, ...(str.map(v => v.valueOf())) ) ) }
    camelize () {
        return this.replace( /-([a-z])/g, (_, $1) => $1.toUpperCase() ) }
    dasherize () {
        return this.replace( /([A-Z])/g,  $1 => '-' + $1.toLowerCase() ) }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let String$ = v => v instanceof String$ ? v : new String$(v)



class Number$ extends Number {
    constructor (arg) {
        super(arg instanceof Number$ ? arg.__ : arg)
        property.set(this, {})  }
    is (num, ...fn) {
        return __is( num.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('number',  type, this, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }

    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let Number$ = v => v instanceof Number$ ? v : new Number$(v)



class Boolean$ extends Boolean {
    constructor (arg) {
        super(arg instanceof Boolean$ ? arg.__ : arg)
        property.set(this, {})  }
    is (bool, ...fn) {
        return __is( bool.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('boolean', type, this, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }

    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let Boolean$ = v => v instanceof Boolean$ ? v :new Boolean$(v)
class Date$ extends Date {
    constructor (arg) {
        super(arg)
        property.set(this, {})  }
    is (v, ...fn) {
        return __is( Object.is(v, this.__), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('date', type, this, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }


}
class Variable {
    constructor (arg) {
        this.value = arg
        property.set(this, {})  }
    is (v, ...fn) {
        return __is( Object.is(v, this.value), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('variable', type, this, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    pipe (f)    { return __pipe(this, f)    }
    prop (...p) { return __prop(this, ...p) }

    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ () { return this.value }  }


let any$ = v => {
    if ( v instanceof Date )     return new Date$    (v)
    else if ( __.isFunction(v) ) return new Function$(v)
    else if ( __.isObject  (v) ) return new Object$  (v)
    else if ( __.isArray   (v) ) return new Array$   (v)
    else if ( __.isString  (v) ) return new String$  (v)
    else if ( __.isNumber  (v) ) return new Number$  (v) // NaN is not here
    else if ( __.isBoolean (v) ) return new Boolean$ (v)
    else if ( undefined === v || null === v || Object.is(NaN, v) )
        return new Variable(v) // null, undefined, NaN,
    else return v  }

let prop = '$'
if (prop) {
    Object.defineProperty(  Function.prototype, prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Function$(this) }  })
    Object.defineProperty(  String.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new String$  (this) }  })
    Object.defineProperty(  Array.prototype,    prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Array$   (this) }  })
    Object.defineProperty(  Date.prototype,     prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Date$    (this) }  })
    Object.defineProperty(  Number.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Number$  (this) }  })
    Object.defineProperty(  Boolean.prototype,  prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Boolean$ (this) }  })  }

module.exports = {
        $:     any$
      , Map$:      Map$
      , Object$:   Object$
      , Array$:    Array$
      , Function$: Function$
      , Date$:     Date$
      , String$:   String$
      , Number$:   Number$
      , Boolean$:  Boolean$
      , Variable:  Variable  }
