
'use strict'

let path = {}

if ('undefined' === typeof Meteor) {
    let bypassRequire = require
    bypassRequire('underscore2')
    path = bypassRequire('path') }

const anyIs = (answer, o, ...fn) =>
    fn.length === 0 ? answer ? true
                             : false :
    fn.length === 1 ? answer ? __.isFunction(fn[0]) ? fn[0](o) : fn[0]
                             : false :
    fn.length === 2 ? answer ? __.isFunction(fn[0]) ? fn[0](o) : fn[0]
                             : __.isFunction(fn[1]) ? fn[1](o) : fn[1]
                    : console.log('error: is')

const anyTypeOf = (answer, type, o, ...fn) =>
    fn.length === 0 ? answer === type ? true
                                      : false :
    fn.length === 1 ? answer === type ? __.isFunction(fn[0]) ? fn[0](o) : fn[0]
                                      : false :
    fn.length === 2 ? answer === type ? __.isFunction(fn[0]) ? fn[0](o) : fn[0]
                                      : __.isFunction(fn[1]) ? fn[1](o) : fn[1]
                    : console.log('error: typeof')


Function.prototype.typeof = (type, ...fn) => anyTypeOf('function', type, {}, ...fn)
// Function.prototype.is = (f, ...fn) => anyIs(f.toString === this.toString, this, fn)

class incObject extends Object {
    constructor (...args) {
        super(...args)  }
    keys () {
        return Object.keys(this)  }
    is (obj, ...fn) {
        return anyIs(Object.is(this, obj), this, ...fn)  }
    typeof (type, ...fn) {
        return anyTypeOf( 'object', type, this, ...fn ) }
    remove (key) {
        if ( __.isArray(key) ) key.map( v => delete this[v] )
        else delete this[key]
        return this  }
    set (key, value) {
        return this.add(key, value)  }
    add (key, value) {
        if (  __.isString(key)   &&
              key.includes('.')  &&
              key.indexOf('.')   &&
              key[key.length -1] !== '.'  ) {
            let re = key.match(/^([^.]+)\.(.*$)/)
            let [firstKey, restKey] = [re[1], re[2]]
            this[firstKey] = this[firstKey] || new incObject()
            this[firstKey].add( restKey, value )  }
        else if ( __.isObject(key) && __.isUndefined(value) )
            for ( let k in key )     this[k]   = key[k]  // recursive obj reference assign
        else if ( __.isScalar(key) ) this[key] = value  // this one need to copy not reference
        else if ( __.isArray(key)  )
            if      ( __.isArray(value) )     key.map( (v, i) => this[v] = value[i] )
            else if ( __.isUndefined(value) ) this[ key[0] ] = key[1]
            else console.log('add error: add(array, value)')
        return this }
    rekey (oldKey, newKey) {
        if ( this.hasOwnProperty(oldKey) ) {
            this[newKey] = this[oldKey]
            delete this[oldKey] }
        return this }
    fnValue (self) {
        this.keys().forEach(  v => this[v] =
            __.isFunction(this[v]) ? this[v](self) :
            __.isObject(this[v])   ? in$(this[v]).fnValue(self) : this[v]  )
        return this } }


class incArray extends Array {
    constructor (...args) {
        super(...args)  }
    typeof (type, ...fn) {
        return anyTypeOf('array', type, this, ...fn) }
    is (a, ...fn) {
        return anyIs(  (() => {
        if (this.length !== a.length) return false
        for(let i = 0; i < this.length; i++)
            if (this[i] !== a[i]) return false
        return true  })(), this, ...fn ) }
    indexOf (f) {
        let fn
        if ( __.isFunction(f) ) fn = f
        else fn = arg => arg === f
        for (let i = 0; i < this.length; i++)
            if ( fn(this[i], i, this) ) return i
        return -1  }
    firstValue (f) {
        for (let i = in$(0); i < this.length; i++)
            if ( f(in$(this[i]), i, this) ) return in$(this[i])
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
                    __.isObject(v) ? v.add( b[bIndex] ) : v )
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
        return this.length ? this.sum() / this.length : NaN  }  }

class incString extends String {
    constructor (arg) {
        super(arg)  }
    is (str, ...fn) {
        return anyIs( str === this.valueOf(), this, ...fn )  }
    typeof (type, ...fn) {
        return anyTypeOf('string',  type, this, ...fn)  }
    path (...str) {
        return in$( path.join( this.valueOf(), ...(str.map(v => v.valueOf())) ) ) }
    get val () {
        return this.valueOf()  }  }

class incNumber extends Number {
    constructor (arg) {
        super(arg)  }
    is (num, ...fn) {
        return anyIs( num === this.valueOf(), this, ...fn )  }
    typeof (type, ...fn) {
        return anyTypeOf('number',  type, this, ...fn)  }
    get val () {
        return this.valueOf()  }  }

class incBoolean extends Boolean {
    constructor (arg) {
        super(arg)  }
    is (bool, ...fn) {
        return anyIs( bool === this.valueOf(), this, ...fn )  }
    typeof (type, ...fn) {
        return anyTypeOf('boolean', type, this, ...fn)  }
    get val () {
        return this.valueOf()  }  }

let in$ = arg => {
    if ( arg instanceof incObject ||
         arg instanceof incArray  ||
         arg instanceof incString ||
         arg instanceof incNumber ||
         arg instanceof incBoolean ) return arg
    else if ( __.isObject(arg) )   return (new incObject()).set(arg)
    else if ( __.isArray(arg) )    return (new incArray()) .concat(arg)
    else if ( __.isFunction(arg) ) return arg
    else if ( __.isString(arg) )   return new incString(arg)
    else if ( __.isNumber(arg) )   return new incNumber(arg) // NaN is not here
    else if ( __.isBoolean(arg) )  return new incBoolean(arg)
    else return arg } // null, undefined

module.exports = in$
