
'use strict'

if ('undefined' === typeof Meteor) {
    let bypassRequire = require
    bypassRequire('underscore2') }

Function.prototype.is = type => 'function' === type

class incObject extends Object {
    constructor (...args) {
        super(...args)  }
    keys () {
        return Object.keys(this)  }
    is (type) {
        return 'object' === type ? true : false }
    equals (obj) { }
    remove (key) {
        if ( __.isArray(key) ) key.map( v => delete this[v] )
        else delete this[key]
        return this  }
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
        return this }  }


class incArray extends Array {
    constructor (...args) {
        super(...args)  }
    indexOf (f) {
        let fn
        if ( __.isFunction(f) ) fn = f
        else fn = arg => arg === f
        for (let i = 0; i < this.length; i++)
            if ( fn(this[i], i, this) ) return i
        return -1  }
    is (type) {
        return 'array' === type ? true : false  }
    equals (a) {
        if (this.length !== a.length) return false
        for(let i = 0; i < this.length; i++)
            if (this[i] !== a[i]) return false
        return true  }
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
    __lastN(n, f) { // no need
        f = f || (() => true)
        return this.filter((v, i, a) => f(v, i, a)).slice(-n) }
    __reduceN(n, f, f2) {
        f2 = f2 || (() => true)
        return this.reduce((a, v, i) => {
        a[i] = f.apply({}, this.slice(0, i + 1).lastN(n, f2) )
        return a }, new incArray()  )  }
    sum () {
        return this.reduce(((a,v) => a += v), 0)  }
    average () {
        return this.length ? this.sum() / this.length : NaN  }  }

class incFunction extends Function {
    constructor (arg) {
        super(arg)  }
    is (type) {
        return 'function' === type  }  }

class incString extends String {
    constructor (arg) {
        super(arg)  }
    is (type) {
        return 'string' === type  }  }

class incNumber extends Number {
    constructor (arg) {
        super(arg)  }
    is (type) {
        return 'number' === type  }  }

class incBoolean extends Boolean {
    constructor (arg) {
        super(arg)  }
    is (type) {
        return 'boolean' === type  }  }


module.exports = arg => {
    if (  __.isObject(arg) )       return ( new incObject() ).add(arg)
    else if ( __.isArray(arg) )    return ( new incArray()  ).concat(arg)
    else if ( __.isFunction(arg) ) return arg
    else if ( __.isString(arg) )   return new incString(arg)
    else if ( __.isNumber(arg) )   return new incNumber(arg)
    else if ( __.isBoolean(arg) )  return new incBoolean(arg)  }
