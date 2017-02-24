
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

const __return = (o, ...v) =>
    v.length === 1 ?                    __func(v[0], o) :
    v.length === 2 ? condition.get(o) ? __func(v[0], o) : __func(v[1], o)
                   : console.log('error: return')

const __assign = (obj, ...prop) => {
    prop.forEach( p => {
    p = p instanceof Object$ ? p.__ : p
    for ( let k in p )
        obj.set(k, p[k]) })
    // {
        // if ( __.isObject(p[k]) ) obj.set( k, p[k] )
        // else obj.set( k, p[k] ) } }  )
    return obj  }

const __fnValue = (o, self) => {
    Object.keys(o).forEach( k =>
        o[k] = __.isObject(o[k])   ? __fnValue(o[k], self) :
               __.isFunction(o[k]) ? o[k](self)            : o[k] )
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


let object = new WeakMap()

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
        arg instanceof Object$ ?
            object.set(this, arg.__) :
            object.set(this, arg || {})  }
    // clear(), create(),  entries(), forEach(f(v, k, a)), has(key), values()
    is (obj, ...fn) {
        return __is( __equal(object.get(this), obj),
            object.get(this), ...fn)  }
    typeof (type, ...fn) {
        return __typeof( 'object', type, this, ...fn ) }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    delete (key) {
        if ( __.isArray(key) ) key.map( v => delete object.get(this)[v] )
        else delete object.get(this)[key]
        return this  }
    add (key, value) {
        return this.set(key, value)  }
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
    aset (key, value) {
        key.forEach( (v, i) => this.set( v, value[i] ) )
        return this  }
    get$ (...key) {
        return any$( this.get(...key) ) }
    get (...key) {
        let k = object.get(this)[key[0]]
        // key.length > 2 && console.log(0,k,1,key.slice(1))
        return key.length > 1 ? __get(k, key.slice(1)) : k }
    dget (...key) {
        // key.length > 1 && console.log(...key.join('.').split('.'))
        return this.get( ...key.join('.').split('.') )  }
    // watch unwatch
    keys ()     { return Object.keys( this.__ ) }
    freeze ()   { return Object.freeze(this.__) && this }
    isFrozen () { return Object.isFrozen(this.__) }
    entries ()  { return Object.entries(this.__) }
    seal ()     { return Object.seal(this.__) && this }
    isExtensible()          { return Object.isExtensible(this.__) }
    getPrototypeOf()        { return Object.getPrototypeOf(this.__) }
    getOwnPropertyNames()   { return Object.getOwnPropertyNames(this.__) }
    getOwnPropertySymbols() { return Object.getOwnPropertySymbols(this.__) }
    getOwnPropertyDescriptor (prop) { return Object.getOwnPropertyDescriptor(this.__, prop) }
    valueOf ()   { return this.__.valueOf() }
    toString ()  { return this.__.toString() }
    unwatch (p)  { return this.__.unwatch(p) }
    watch (p, handler)      { return this.__.watch(p, handler) }
    hasOwnProperty (p)      { return this.__.hasOwnProperty(p) }
    isPrototypeOf (o)       { return this.__.isPrototypeOf(o) }
    propertyIsEnumerable(p) { return this.__.propertyIsEnumerable(p) }
    rekey (oldKey, newKey)  {
        if ( this.hasOwnProperty(oldKey) ) {
            this.set( newKey, this.get(oldKey) )
            this.delete(oldKey)  }
        return this  }
    fnValue (self) {
        this.keys().forEach(  v =>
            this.set(  v,
                __.isFunction(this.get(v)) ? this.get(v)(self) :
                __.isObject(  this.get(v)) ? __fnValue(this.get(v), self) : this.get(v)  ))
        return this  }
    //get size () {}
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return object.get(this)  }  }

// let Object$ = v => v instanceof Object$ ? v : new Object$(v)

class Array$ extends Array {
    constructor (arg) {
        super()
        let value = arg instanceof Array$ ? arg.__ : arg
        if (value)
            for(let i = 0; i < value.length; i++)
                this[i] = arg[i]  }
    is (a, ...fn) {
        return __is(  (() => {
            if (this.length !== a.length) return false
            for(let i = 0; i < this.length; i++)
                if (this[i] !== a[i]) return false
            return true  })(), this, ...fn ) }
    typeof (type, ...fn) {
        return __typeof('array', type, this, ...fn) }
    if   (f)    { return __if  (this, f)  }
    then (f)    { return __then(this, f)  }
    else (f)    { return __else(this, f)  }
    else_if (f) { return __else_if(this, f)  }
    // pipe
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
    until (f) { // find
        for (let i = 0; i < this.length; i++)
            if ( f(this[i], i, this) ) return this[i]
        return new Boolean$(false)  }
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
        return this.filter( (v, i) => this.indexOf( f(v, i) ) === i )  }
    intersection (b, f) {
        let bIndex
        f = f || (v => w => v === w)
        return this.reduce(  ((a, v, i) => {
            if ( ( bIndex = b.indexOf( f(v, i) ) ) !== -1 )
                return a.concat(
                    __.isObject(v) ? v.set( b[bIndex] ) : v )
            else return a  }), new Array$()  )  }
    difference (b, f) {
        f = f || (v => w => v === w)
        return this.filter( (v, i) => b.indexOf( f(v, i) ) === -1 )  }
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
    insert (i, v) {              // if v is array?
        this.splice(i, 0, v)
        return this }
    delete (i, n, v) {
        this.splice(i, n, v)
        return this }
    sum (f) {
        f = f || (v => v)
        return this.reduce(((a,v) => a += f(v)), 0)  }
    average (f) {
        return this.sum(f) / this.length  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return Array.from(this)  }  }


// let Array$ = v => v instanceof Array$ ? v : new Array$(v)//.concat(v)



class String$ extends String {
    constructor (arg) {
        super(arg instanceof String$ ? arg.__ : arg)  }
    is (str, ...fn) {
        return __is( str.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('string',  type, this, ...fn)  }
    if (...fn) { return __if(this, ...fn)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
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
        super(arg instanceof Number$ ? arg.__ : arg)  }
    is (num, ...fn) {
        return __is( num.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('number',  type, this, ...fn)  }
    if   (f)   { return __if(this, f)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let Number$ = v => v instanceof Number$ ? v : new Number$(v)



class Boolean$ extends Boolean {
    constructor (arg) {
        super(arg instanceof Boolean$ ? arg.__ : arg)  }
    is (bool, ...fn) {
        return __is( bool.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('boolean', type, this, ...fn)  }
    if (...fn) { return __if(this, ...fn)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let Boolean$ = v => v instanceof Boolean$ ? v :new Boolean$(v)

let any$ = arg => {
    if ( __.isFunction(arg) ) return arg
    else if ( __.isObject (arg) )  return new Object$ (arg)
    else if ( __.isArray  (arg) )  return new Array$  (arg)
    else if ( __.isString (arg) )  return new String$ (arg)
    else if ( __.isNumber (arg) )  return new Number$ (arg) // NaN is not here
    else if ( __.isBoolean(arg) )  return new Boolean$(arg)
    else return arg } // null, undefined

module.exports = prop => {

    if (prop) {
        Object.defineProperty(String.prototype,  prop, {
            enumerable:   false,
            configurable: true,
            get: function () { return new String$ (this) }  }  )
        Object.defineProperty(Array.prototype,   prop, {
            enumerable:   false,
            configurable: true,
            get: function () { return new Array$  (this) }  }  )
        Object.defineProperty(Number.prototype,  prop, {
            enumerable:   false,
            configurable: true,
            get: function () { return new Number$ (this) }  }  )
        Object.defineProperty(Boolean.prototype, prop, {
            enumerable:   false,
            configurable: true,
            get: function () { return new Boolean$(this) }  }  )  }
    prop = prop || '$'
    return {
       [prop]:    any$
      , Map$:     Map$
      , Object$:  Object$
      , Array$:   Array$
      , String$:  String$
      , Number$:  Number$
      , Boolean$: Boolean$  }  }
