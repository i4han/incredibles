
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
    fn.length === 0 ? answer ? true             : false :
    fn.length === 1 ? answer ? __func(fn[0], o) : false :
    fn.length === 2 ? answer ? __func(fn[0], o) : __func(fn[1], o)
                    : console.log('error: is')

const __typeof = (answer, type, o, ...fn) =>
    fn.length === 0 ? answer === type ? true             : false :
    fn.length === 1 ? answer === type ? __func(fn[0], o) : false :
    fn.length === 2 ? answer === type ? __func(fn[0], o) : __func(fn[1], o)
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
    p = p instanceof incObject ? p.value : p
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
    o instanceof incObject ?
        keys.length === 1 ? o.get(keys[0]) : __get( o.get(keys[0]), keys.slice(1) ) :
        keys.length === 1 ? o[keys[0]]     : __get( o[keys[0]], keys.slice(1) )

const __set = (o, k, v) =>
    o instanceof incObject ? o.set(k, v) : o[k] = v


Function.prototype.typeof = (type, ...fn) => __typeof('function', type, this, ...fn)
//Function.prototype.is = (f, ...fn) => __is(f.toString === this.toString, this, fn)
String.prototype.in$ = function() { return $String(this) }

let object = new WeakMap()

class incObject extends Object {
    constructor () { super()  }
    init (arg) {
        object.set(this, arg || {})
        return this  }
    keys () {
        return $Array( Object.keys( object.get(this) || {} ) )  }
    is (obj, ...fn) {
        return __is(Object.is(this, obj), this, ...fn)  }
    typeof (type, ...fn) {
        return __typeof( 'object', type, this, ...fn ) }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    remove (key) {
        if ( __.isArray(key) ) key.map( v => delete object.get(this)[v] )
        else delete object.get(this)[key]
        return this  }
    add (key, value) {
        return this.set(key, value)  }
    set (key, value) {
        //this[key] = value
        object.get(this)[key] = value
        return this  }
    dset (key, value) {
        let re = key.match(/^([^.]+)\.(.*$)/)
        let [firstKey, restKey] = [re[1], re[2]]
        let objFirst = this.get(firstKey)
        objFirst = this.set(firstKey, objFirst || {}).get(firstKey)
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
        return in$( this.get(...key) ) }
    get (...key) {
        let k = object.get(this)[key[0]]
        // key.length > 2 && console.log(0,k,1,key.slice(1))
        return key.length > 1 ? __get(k, key.slice(1)) : k }
    dget (...key) {
        // key.length > 1 && console.log(...key.join('.').split('.'))
        return this.get( ...key.join('.').split('.') )  }
    wrap () {
        this.keys().forEach(  k =>
            __.isObject( this.get(k), () => this.set( k, $Object(this.get(k)) ) ) && this.get(k).wrap()  )
        return this  }
    strip () {
        let obj = {}
        this.keys().forEach( k => obj[k] = this[k].valueOf() ) // not finished <====**************
        return obj  }
    rekey (oldKey, newKey) {
        if ( this.hasOwnProperty(oldKey) ) {
            this.set( newKey, this.get(oldKey) )
            this.remove(oldKey)  }
        return this  }
    fnValue (self) {
        this.keys().forEach(  v => this.set(  v,
            __.isFunction(this.get(v)) ? this.get(v)(self) :
            __.isObject(  this.get(v)) ? __fnValue(this.get(v), self) : this.get(v)  ))
        return this  }
    hasOwnProperty (key) {
        return object.get(this).hasOwnProperty(key) }
    get _ () {
        return result.get(this)  }
    get condition () {
        return condition.get(this)  }
    get value () {
        return object.get(this)  }  }

let $Object = v =>
    v instanceof incObject ? v : (new incObject()).init(v)



class incArray extends Array {
    constructor (...args) {
        super(...args)  }
    is (a, ...fn) {
        return __is(  (() => {
        if (this.length !== a.length) return false
        for(let i = 0; i < this.length; i++)
            if (this[i] !== a[i]) return false
        return true  })(), this, ...fn ) }
    typeof (type, ...fn) {
        return __typeof('array', type, this, ...fn) }
    if (...fn) { return __if(this, ...fn)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
    indexOf (f) {
        let fn
        if ( __.isFunction(f) ) fn = f
        else fn = arg => arg === f
        for (let i = 0; i < this.length; i++)
            if ( fn(this[i], i, this) ) return i
        return -1  }
    until (f) {
        for (let i = $Number(0); i < this.length; i++)
            if ( f(in$(this[i]), i, this) )
                return in$(this[i])
        return new incBoolean(false)  }
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
            else return a  }), new incArray()  )  }
    difference (b, f) {
        f = f || (v => w => v === w)
        return this.filter( (v, i) => b.indexOf( f(v, i) ) === -1 )  }
    union (b, f) {
        f = f || (v => w => v === w)
        return this.difference(b, f)
            .concat(this.intersection(b, f))
            .concat(b.difference(this, f))  }
    coMap (b, f) {
        return this.reduce((a, v, i) => {
        a[i] = f(v, b[i], i, this)
        return a }, new incArray()  )  }
    insert (i, v) {              // if v is array?
        this.splice(i, 0, v)
        return this }
    delete (i, n, v) {
        this.splice(i, n, v)
        return this }
    sum () {
        return this.reduce(((a,v) => a += v), 0)  }
    average () {
        return this.length ? this.sum() / this.length : NaN  }
    get _ () {
        return result.get(this)  }
    get condition () {
        return condition.get(this)  }  }

let $Array = v => v instanceof incArray ? v : (new incArray()).concat(v)



class incString extends String {
    constructor (arg) {
        super(arg)  }
    is (str, ...fn) {
        return __is( str === this.valueOf(), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('string',  type, this, ...fn)  }
    if (...fn) { return __if(this, ...fn)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
    path (...str) {
        return in$( path.join( this.valueOf(), ...(str.map(v => v.valueOf())) ) ) }
    camelize () {
        return this.replace( /-([a-z])/g, (_, $1) => $1.toUpperCase() ) }
    dasherize () {
        return this.replace( /([A-Z])/g,  $1 => '-' + $1.toLowerCase() ) }
    get _ () {
        return result.get(this)  }
    get condition () {
        return condition.get(this)  }
    get val () {
        return this.valueOf()  }  }

let $String = v => v instanceof incString ? v : new incString(v)



class incNumber extends Number {
    constructor (arg) {
        super(arg)  }
    is (num, ...fn) {
        return __is( num === this.valueOf(), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('number',  type, this, ...fn)  }
    if (...fn) { return __if(this, ...fn)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
    get _ () {
        return result.get(this)  }
    get condition () {
        return condition.get(this)  }
    get val () {
        return this.valueOf()  }  }

let $Number = v => v instanceof incNumber ? v : new incNumber(v)



class incBoolean extends Boolean {
    constructor (arg) {
        super(arg)  }
    is (bool, ...fn) {
        return __is( bool === this.valueOf(), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('boolean', type, this, ...fn)  }
    if (...fn) { return __if(this, ...fn)  }
    then (f)   { return __then(this, f)    }
    else (f)   { return __else(this, f)    }
    get _ () {
        return result.get(this)  }
    get condition () {
        return condition.get(this)  }
    get val () {
        return this.valueOf()  }  }

let $Boolean = v => v instanceof incBoolean ? v :new incBoolean(v)



let in$ = arg => {
    if ( arg instanceof incObject ||
         arg instanceof incArray  ||
         arg instanceof incString ||
         arg instanceof incNumber ||
         arg instanceof incBoolean ) return arg
    else if ( __.isFunction(arg) )   return arg
    else if ( __.isObject (arg) )  return $Object (arg)
    else if ( __.isArray  (arg) )  return $Array  (arg)
    else if ( __.isString (arg) )  return $String (arg)
    else if ( __.isNumber (arg) )  return $Number (arg) // NaN is not here
    else if ( __.isBoolean(arg) )  return $Boolean(arg)
    else return arg } // null, undefined

module.exports = in$
