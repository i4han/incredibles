
'use strict'

require('./polyfill.js')

// chained if typeof __ isTypeof.
//
// history
// reactive object, cash like
// error handling

if ('undefined' === typeof Meteor) {
    let bypassRequire = require
    bypassRequire('underscore2')  }
    // path = bypassRequire('path')  }

let logic  = new WeakMap()
let result = new WeakMap()

const is = (x, y) => {
    if ( Object.is(x, y) ) return true
    if ( 'object' !== typeof y || 'object' !== typeof x ||
        x.constructor !== y.constructor ||
        Object.keys(x).length !== Object.keys(y).length ) return false
    for (let p in x)
        if ( ! is(x[p], y[p]) ) return false
    return true  }

const __func  = (fn, o) => __.isFunction(fn) ? result.set(o, fn(o)) : result.set(o, fn)

const __is = (answer, o, ...fn) =>
    fn.length === 0 ? answer ? true     : false :
    fn.length === 1 ? answer ? fn[0](o) : false :
    fn.length === 2 ? answer ? fn[0](o) : fn[1](o)
                    : console.log('error: is')

const __typeof = (self, type, ...fn) =>
    fn.length === 0 ? self.type === type ? true        : false :
    fn.length === 1 ? self.type === type ? fn[0](self) : false :
    fn.length === 2 ? self.type === type ? fn[0](self) : fn[1](self)
                    : console.log('error: typeof')

const __checkProp = (self, o) => {
    // console.log(0, Object.keys(o).map(k => self[k] === o[k]).every(v=>v))
    return Object.keys(o).map(k => self[k] === o[k]).every(v=>v) }

const __if = (self, f) => {
    logic.set( self, __.isFunction(f) ? !!f(self) :
        __.isObject(f)   ?   __checkProp(self, f) : is(self.value, f) )
    return self  }

const __then = (self, f) => {
    if (logic.get(self) === true )
        __.isFunction(f) ? __func(f, self) : result.set(self, f)
    return self  }

const __else = (self, f) => {
    if (logic.get(self) === false)
        __.isFunction(f) ? __func(f, self) : result.set(self, f)
    return self  }

const __else_if = (self, f) => {
    if ( logic.get(self) === true )
         logic.set(self, undefined)
    else logic.set(self, __.isFunction(f) ? !!f(self) : is(self.value, f) )
    return self  }

const __carry = (self, f, ...v) => {
    if (! __.isFunction(f)) return f
    let ret
    result.set(self, ret = f(self, ...v))
    return ret  }

const __run = (self, f, ...v) => {
    f(self, ...v)
    return self  }

const __prop__ = (o, ...args) => { // property { writable: true watch: f(k, oval, nval) value: }
    let key = args[0]
    let obj = property.get(o)
    if   (args.length === 1)
        return obj[key] ? obj[key].value : undefined
    else if (args.length === 2) {
        let value  = args[1]
        if ( undefined === obj )
            property.set( o, {[key]: {value: value, writable: true}} )
        else if ( undefined === obj[key] )
            obj[key] = {value: value, writable: true}
        else if ( obj[key].writable !== false ) {
            obj[key].watch && obj[key].watch(key, obj[key].value, value)
            obj[key].value = value  }
        else consosle.log('write protected') }
    return o  }

const __prop = (self, ...args) => { // property { writable: true watch: f(k, oval, nval) value: }
    let p = args[0]
    if (args.length === 1) return self.$[p]
    if (args.length === 2) self.cash.set(p, args[1])
    return self  }

const __propWatch = (self, p, w) => {
    property.get(self)[p].watch = w
    return self  }

const __propWritable = (self, p, w) => {
    property.get(self)[p].writable = w
    return self  }


const __assign = (self, ...prop) => {
    prop.forEach( p => {
        p = p instanceof In$ ? p.value : p
        for ( let k in p )
            self.set(k, p[k]) })
    return self  }

const __add__ = (a, b) =>
    Object.keys(b).forEach( k =>
        'object' === typeof a[k] && 'object' === typeof b[k] ?
            __add__(a[k], b[k]) : (a[k] = b[k]) )

const __add = (self, ...o) => {
    o.reduce( (a,v) => __add__(a, v), self.value)
    return self  }

const __invokeProperties = (o, self) => {
    Object.keys(o).forEach( k =>
        o[k] = __.isObject(o[k])   ? __invokeProperties(o[k], self) :
               __.isFunction(o[k]) ? o[k](self) : o[k] )
    return o  }

const __get = (o, ...keys) =>
    __.isScalar(o) || !o ? undefined :
    (! (o instanceof In$) && __.isObject(o)) || __.isArray(o) ?
        keys.length === 1 ? o[keys[0]]     : __get( o[keys[0]],     ...keys.slice(1) ) :
        keys.length === 1 ? o.get(keys[0]) : __get( o.get(keys[0]), ...keys.slice(1) )

const __set = (o, k, v) =>
    o instanceof In$ ? o.set(k, v) : o[k] = v

const __log = (self, ...args) => {
    if (args.length > 1) console.log( ...args, self.value )
    else if (args.length === 1)
        if ('function' === typeof args[0]) console.log(args[0](self)) //
        else console.log( args[0], self.value )
    else console.log( self.value )
    return self   }

const __recursive = (o, f) => {
    f(o)
    for (let p in o.value) {
        if ( __.isObject(o.value[p]) )
            __recursive( from(o.value[p]), f )
        if ( __.isArray(o.value[p]) )
            for ( let q in o.value[p] )
                if ( __.isObject( o.value[p][q] ) )
                    __recursive( from(o.value[p][q]), f )  }
    return o  }

const __at = (...args) => {
    if ( __.isObject(args[0]) ) return __at(args[0][args[1]], ...args.slice(2))
    else return args[0]  }

// Function.prototype.typeof = (type, ...fn) => __typeof('function', type, this, ...fn)
// Function.prototype.is = (f, ...fn) => __is(f.toString === this.toString, this, fn)
// String.prototype.into$ = function() { return new String$(this) }


let object     = new WeakMap()
let property   = new Map() // getter, setter
let descriptor = new Map() // descriptor, value
let vars       = new Map()

class WeakMap$ extends WeakMap {
    constructor (arg) {
        super(arg)
        this.type = 'weakmap' }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn )  }
}

class Map$ extends Map {
    constructor (arg) {
        super(arg)
        this.type = 'map'  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn )  }
}

let bind = new Map$()

/**
 * @class {Object$}
 * @example in$({a:1, b:2, c:3}).keys() => ['a', 'b', 'c']
 * @method keys
 * @return {Array$} keys of the Object$
 */

class CashProperty {
    constructor (self) {
        this.self = self
        vars.set(this, {keys:[]})
        object.set(this, {})
        property.set(this, {})
        descriptor.set(this, {})  }
    create (p) {
        if (p in this.vars.keys) return
        this.vars.keys.push(p)
        let desc = this.descriptor[p]
        Object.defineProperty(this.prop, p, {
            enumberable: true
          , configurable: false
          , get: () => {
                if (desc && desc.onGet)
                     return desc.onGet(this.self, this.value[p], p) // e = {newValue, oldValue, valueobj}
                else return this.value[p]  }
          , set: (v) => {
                if (desc && desc.onSet)
                    desc.onSet(this.self, this.value[p], p, v)
                else this.value[p] = v
                return this.self  }  })
        this.descriptor[p] = {  // type, bindTo
            type: undefined
          , bindTo: []  }  }
    let(...p) {
        p.forEach(v => this.create(v))
        return this.self  }
    get prop ()  { return property.get(this) }
    get vars ()  { return vars.get(this) }
    get value () { return object.get(this) }
    get descriptor ()  { return descriptor.get(this) }
    assign (o) {}
    assignDefaults (o) {}
    set (p, v) {
        if (this.has(p)) this.prop[p] = v
        else {
            this.create(p)
            this.prop[p] = v }
        return this.self  }
    setDefault (p, v) {
        if (this.value[p] === undefined)
            this.set(p, v)
        return this.self  }
    setEagerly (p, f) {
        this.set(p, f(this.self))
        return this.self  }
    get (p) { return this.prop[p] }
    change (bindFrom, bindProp, p, v) {
        this.prop[p] = v
        return this.self  }
    has (p)   { return this.vars.keys.includes(p) }
    keys ()   { return this.vars.keys }
    values () { return this.vars.keys.map(v => this.prop[v]) }
    watch (p) {}
    freeze () {}
    isFrozen () {}
    // this.savedProperties = []
    push (p, v) {}
    pop (p) {}
    shift (p) {}
    unshift (p, v) {}
    saveValueTo (p) { return this.set(p, this.self.value) }
    restoreValueFrom (p) {
        object.set(this.self, this.get(p))
        return this.self  }
    saveValuePropertyTo (...p)  {
        p.forEach( v => this.set(v, this.self.at(v) ) )
        return this.self  }
    restoreValuePropertyFrom (...p) {
        p.forEach( v => this.self.setAt(v, this.get(v) ) )
        return this.self  }
    removeValuePropertyTo (...p)  {
        p.forEach( v => this.saveValuePropertyTo(v).delete(v)  )
        return this.self  }
    bindto (p, os, ps) {}
    on (e, p, f) {
        if (! (['onGet', 'onSet', 'onChange', 'onDelete'].includes(e) && this.has(p)) )
            return this.self
        this.descriptor[p][e] = f
        return this.self  }  }

const __copy = v =>
    v instanceof Array$ ? new Array$(v.value)  :
    Array.isArray(v)    ? Object.assign([], v) :
    __.isObject(v)      ? Object.assign({}, v) : v

const __init = (self, ...args) => {
    let arg = args.length > 0 ? args[0] : {}
    let type = args[1]
    // console.log(arg, type, isTypeof(arg, type, 'function', Function, Function$))
    if ( self.unchained ) {
        // console.log(9, arg, 'unchained', self.value)
        return from(__copy(arg), type)  }
    if ( arg instanceof In$ )
        arg = arg.value
    if ( undefined === arg ) {
        self.type = 'undefined'
        object.set(self, arg)  }
    else if ( null === arg || Object.is(NaN, arg) ) {
        self.type = 'value'
        object.set(self, arg)  }
    else if ( isTypeof(arg, 'array', type) ) {
        self.type = 'array'
        if (arg instanceof Array$)
            self.array = arg
        else
            self.array = new Array$(arg, self)
        object.set(self, arg)  } // self.array?
    else if ( isTypeof(arg, 'string', type ) ) {
        self.type = 'string'
        self.string    = new String$(arg, self)
        object.set(self, self.string)  }
    else if ( isTypeof(arg, 'number', type ) ) {
        self.type = 'number'
        self.number    = new Number$(arg, self)
        object.set(self, self.number)  }
    else if ( isTypeof(arg, 'function', type ) ) {
        self.type = 'function'
        self.function  = new Function$(arg, self)
        object.set(self, self.function)  }
    else if ( 'code' === type ) {
        self.type = 'code'
        object.set(self, arg) }
    else {
        self.type = (undefined !== type) ? type : 'object'
        object.set(self, arg) }
    return self  }

class In$ extends Object {
    constructor (arg, type) {
        super()
        __init(this, arg, type)
        this.cash = new CashProperty(this)  }
        // property.set(this, {}) Yes. arg can be an array.
    take (arg, type) { return __init(this, arg, type) }
    get $ () { return this.cash.prop }
    is (obj, ...fn) {
        return __is( is(this.value, obj), this.value, ...fn)  }
    if_type (type) {
        return __if(this, this.type === type)  }
    else_if_type (type) {
        return __else_if(this, this.type === type)  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn )  }
    if (f)      { return __if(this, f)   }
    then (f)    { return __then(this, f) }
    else (f)    { return __else(this, f) }
    else_if (f) { return __else_if(this, f) }
    carry (f, ...v)     { return __carry(this, f, ...v) }
    openCarry (f, ...v) { return __run(this, f, ...v)   }
    log (...f)  { return __log(this, ...f)  }
    prop (...p) { return __prop(this, ...p) }
    // backupPropTo (...p)  {
    //     p.forEach(  v =>
    //         __prop(this, '@prop:' + v, this.at(v) )  )
    //     return this  }
    // restorePropFrom (...p) {
    //     p.forEach(  v =>
    //         this.setAt( v, __prop(this, '@prop:' + v) )  )
    //     return this  }
    // removeProp (...p)  {
    //     p.forEach(  v =>
    //         this.backupPropTo(v).delete(v)  )
    //     return this  }
    // restoreAll () { return this.restore( ...this.keys() ) }
    // removeAll ()  { return this.removeProp ( ...this.keys() ) }
    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.value[v] )
        else delete this.value[ keys[0] ]
        return this  }

    add (...o) {
        return __add(this, ...o)  }

    set (key, value) {
        //this[key] = value Object.assign
        // console.log(0, key, value)
        this.value[key] = value
        return this  }
    setAt (...args) {
        let value = args[ args.length - 1 ]
        let k = args.slice(0, args.length - 1).join('.').split('.')
        if (args.length === 0) console.log('error: setAt args null')
        if (args.length === 1)
            k[0] = value
        if (k.length === 1)
            return this.set(k[0], value)
        let o0 = this.get(k[0])
        o0 = this.set(k[0], o0 ||
            (Number(k[1]).toString() === k[1] ? [] : {}) ).get(k[0])
        let wo0 = new In$(o0)
        k.length === 2 ?
            __set (o0, k[1], value) : wo0.setAt(...k.slice(1), value)
        return this  }
    // __dset (...v) { return this.setAt(...v) }
    // oset (...obj) { return this.assign (...obj) }
    assign (...obj) {  // assign
        __assign(this, obj[0])  // recursive obj reference assign
        return obj.length > 1 ? this.assign( ...obj.slice(1) ) : this }
    zip (key, value) { //   aset(['a', 'b', 'c'], [1,2,3])
        key.forEach( (v, i) => this.set( v, value[i] ) )
        return this  }
    // setEntries ([[key, value]]) {}
    setIf (key, value, f) {
        (__.isFunction(f) ? f(this.at(key)) : this.at(key) === f) &&
            this.setAt(key, value)
        return this  }
    setDefault (key, value) { return this.setIf(key, value) }
    __setValue (...v) { return this.put(...v) }
    put (...args) {   // <-> take
        if (args.length === 1 && 'string' === typeof args[0])
            global[args[0]]  = this.value // length === 1 not string to be error
        else if (args.length === 2)
            args[0][args[1]] = this.value
        return this  }
    setResult (v) { return this.void( result.set(this, v) ) }
    void () { return this }
    get (...key) {
        // key.length > 3 & console.log(0, object.get(this))
        let k = this.value[ key[0] ]
        return key.length > 1 ? __get(k, ...key.slice(1)) : k  }

    // __get$ (...key) {    // for object
    //     return from( this.get(...key) )  }
    // __dget$ (...key) {
    //     return from( this.at(...key) )  }
    // put, take
    at (...key) {
        return this.get( ...key.join('.').split('.') )  }
    pick (...key) {
        return this.take( this.at(...key) ) }
    __reset (v) {
        return this.take(v) }
    // __dget (...key) { return this.at(...key) }
    size ()  { return this.keys().length }
    clear () { return this.void( object.set(this, {}) ) }
    has (k)      { return k in this.value  }
    includes (v) { return this.values().includes(v) }
    forEach (f) {
        this.keys().forEach( k => f( this.get(k), k, this ) )
        return this  }
    map (f)    { return this.keys().map( k => f( this.get(k), k, this ) ) }
    filter (f) {
        let ret = from({})
        for (let p in this.value)
            if ( f(this.get(p), p, this) )
                ret.set(p, this.get(p))
        return ret  }
    reduce (f, init) {
        let accumulator = init
        for (let p in this.value)
            accumulator = f( accumulator, this.get(p), p, this)
        return accumulator  }
    keys ()    { return Object.keys( this.value ) }
    values ()  { return this.keys().map( k => this.get(k) )  }
    // MVCObject bindto, addListener, changed, notify
    // entries () {
    //     return this.keys().map( k => [k, this.get(k)] )  }
    // assign (...o)  { return Object.assign(this.__, ...o) }
    // entries ()  { return Object.entries(this.value) }
    // freeze ()   { return Object.freeze(this.value) && this }
    // isFrozen () { return Object.isFrozen(this.value) }
    // seal ()     { return Object.seal(this.value) && this }
    // isExtensible()     { return Object.isExtensible(this.value) }
    // getPrototypeOf()   { return Object.getPrototypeOf(this.value) }
    // getOwnPropertyNames()    { return Object.getOwnPropertyNames(this.value) }
    // getOwnPropertySymbols()  { return Object.getOwnPropertySymbols(this.value) }
    // getOwnPropertyDescriptor (prop) { return Object.getOwnPropertyDescriptor(this.value, prop) }
    // valueOf ()   { return this.value }
    // toString ()  { return this.value.toString() }
    // unwatch (p)  { return this.value.unwatch(p) }
    // watch (p, handler) { return this.value.watch(p, handler) }
    // hasOwnProperty (p) { return this.value.hasOwnProperty(p) }
    // isPrototypeOf (o)  { return this.value.isPrototypeOf(o) }
    // propertyIsEnumerable(p) { return this.value.propertyIsEnumerable(p) }

    rekey (oldKey, newKey)  {
        this.set( newKey, this.get(oldKey) )
        if ( this.value.hasOwnProperty(oldKey) ) this.delete(oldKey)
        return this  }
    recursive (f) {
        return __recursive(this, f)  }
    copy (o)  {
        if (this.typeof('string'))
            return new Object$(this.value, this.type)
        else {
            o = o || {}
            return new Object$( Object.assign(o, this.value,   Object.assign({}, o)), this.type ) }  }
    // paste (o) {
    //     let copied = this.cash.get('@clipboard')
    //     if ('string' === copied.type)
    //         return new Object$(copied.value, 'string')
    //     else {
    //         o = o || {}
    //         return new Object$( Object.assign(o, copied.value, Object.assign({}, o)), 'object')  }  }
    // __stringify$ (...args) { return new String$( JSON.stringify(this.__, ...args) ) }
    invokeProperties (self) { // invokeProperties invokeProperties
        this.forEach(  (v,k) => this.set(  k,
            __.isFunction(v) ? v(self) :
            __.isObject(v)   ? __invokeProperties(v, self) : v  ))
        return this  }
    // valueOf ()       { return this.__  }
    argument (...args) {
        return args.map(v =>
            !v ? v : // undefined, null, false, 0, '', NaN
            v.type === 'code' ? eval(v.value) :
            v.type === 'cash_property_name' ? this.$[v.value] : v
        )}
    openChain (f, ...args) {
        f(this.value, ...this.argument(...args))
        return this  }
    // chain (f, ...args)  { return this.take( f(this.value, ...this.argument(...args)) ) }
    chain (...f)  { return this.take( f.reduce( (a,v) =>
        Array.isArray(v) ? v[0](a, ...v.slice(1)) : v(a) , this.value ) ) }
    // __unchain (v) { return this.loose(v) }
    loose (v) { return this.cut(v) }
    cut (v) { //  change to loose
        if (v === undefined)
            this.unchained = true
        else this.unchained = v
        return this  }
    __invoke$ (f) {
        result.set(this, from( this.invoke(f) ))
        return this  }
    pop (p) {
        if (0 === this.size()) return undefined // not found undefined
        if (undefined !== p) {
            let v = this.get(p)
            this.delete(p)
            return new Object({[p]: v}) }
        else {
            p = this.lastKey
            let v = this.get(p)
            this.delete(p)
            return new Object$({[p]: v}) }  }
    pop$ () {
        result.set(this, this.pop())
        return this  }
    shift () {
        if (0 === this.size()) return undefined
        let p = this.lastKey
        let v = this.get(p)
        this.delete(p)
        return new Object$({[p]: v})  }
    shift$ () {
        result.set(this, this.shift())
        return this  }

    get firstKey ()  { return this.keys()[0] }
    get lastKey ()   { return this.keys()[ this.size() - 1 ] }
    get result ()    { return result.get(this)  }
    get logic () { return logic.get(this)  }
    get value ()     {
        let value // return value if 6 non value: false, null, NaN, undefined, '', 0
        return (value = object.get(this)) ? value.valueOf() : value  }
    // get __ ()        { return object.get(this)  }
}


class Object$ extends Object {
    constructor (arg, type) {
        super()
        object.set(this, arg)  }
    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.value[v] )
        else delete this.value[ keys[0] ]
        return this  }
    add (...o) {
        return __add(this, ...o)  }
    set (key, value) {
        this.value[key] = value
        return this  }
    setAt (...args) {
        let value = args[ args.length - 1 ]
        let k = args.slice(0, args.length - 1).join('.').split('.')
        if (args.length === 0) console.log('error: setAt args null')
        if (args.length === 1)
            k[0] = value
        if (k.length === 1)
            return this.set(k[0], value)
        let o0 = this.get(k[0])
        o0 = this.set(k[0], o0 ||
            (Number(k[1]).toString() === k[1] ? [] : {}) ).get(k[0])
        let wo0 = new In$(o0)
        k.length === 2 ?
            __set (o0, k[1], value) : wo0.setAt(...k.slice(1), value)
        return this  }
    assign (...obj) {  // add?
        __assign(this, obj[0])  // recursive obj reference assign
        return obj.length > 1 ? this.assign( ...obj.slice(1) ) : this }
    zip (key, value) { //   aset(['a', 'b', 'c'], [1,2,3])
        key.forEach( (v, i) => this.set( v, value[i] ) )
        return this  }
    setIf (key, value, f) {
        (__.isFunction(f) ? f(this.at(key)) : this.at(key) === f) &&
            this.setAt(key, value)
        return this  }
    setDefault (key, value) { return this.setIf(key, value) }
    put (...args) {   // <-> take
        if (args.length === 1 && 'string' === typeof args[0])
            global[args[0]]  = this.value // length === 1 not string to be error
        else if (args.length === 2)
            args[0][args[1]] = this.value
        return this  }
    __setValue (...v) { return this.put(...v) }
    setResult (v) {
        result.set(this, v)
        return this  }
    get (...key) {
        let k = this.value[ key[0] ]
        return key.length > 1 ? __get(k, ...key.slice(1)) : k  }
    at (...key) {
        return this.get( ...key.join('.').split('.') )  }
    pick (...key) {
        return this.take( this.at(...key) ) }
    size () { return this.keys().length }
    clear () {
        object.set(this, {})
        return this  }
    has (k) {
        return k in this.value  }
    includes (v) {}
    forEach (f) {
        this.keys().forEach( k => f( this.get(k), k, this ) )
        return this  }
    map (f)    { return this.keys().map( k => f( this.get(k), k, this ) ) }
    filter (f) {
        let ret = from({})
        for (let p in this.value)
            if ( f(this.get(p), p, this) )
                ret.set(p, this.get(p))
        return ret  }
    reduce (f, init) {
        let accumulator = init
        for (let p in this.value)
            accumulator = f( accumulator, this.get(p), p, this)
        return accumulator  }
    keys ()    { return Object.keys( this.value ) }
    values ()  {
        return this.keys().map( k => this.get(k) )  }
    // MVCObject bindto, addListener, changed, notify
    // entries () {
    //     return this.keys().map( k => [k, this.get(k)] )  }
    // assign (...o)  { return Object.assign(this.__, ...o) }
    entries ()  { return Object.entries(this.value) }
    valueOf ()   { return this.value }
    // toString ()  { return this.value.toString() }
    // unwatch (p)  { return this.value.unwatch(p) }
    // watch (p, handler) { return this.value.watch(p, handler) }
    // hasOwnProperty (p) { return this.value.hasOwnProperty(p) }
    // isPrototypeOf (o)  { return this.value.isPrototypeOf(o) }
    // propertyIsEnumerable(p) { return this.value.propertyIsEnumerable(p) }

    rekey (oldKey, newKey)  {
        this.set( newKey, this.get(oldKey) )
        if ( this.hasOwnProperty(oldKey) ) this.delete(oldKey)
        return this  }
    recursive (f) {
        return __recursive(this, f)  }
    copy (o)  {
        if (this.typeof('string'))
            return new Object$(this.value, this.type)
        else {
            o = o || {}
            return new Object$( Object.assign(o, this.value,   Object.assign({}, o)), this.type ) }  }
    // paste (o) {
    //     let copied = this.cash.get('@clipboard')
    //     if ('string' === copied.type)
    //         return new Object$(copied.value, 'string')
    //     else {
    //         o = o || {}
    //         return new Object$( Object.assign(o, copied.value, Object.assign({}, o)), 'object')  }  }
    // __stringify$ (...args) { return new String$( JSON.stringify(this.__, ...args) ) }
    invokeProperties (self) { // invokeProperties invokeProperties
        this.forEach(  (v,k) => this.set(  k,
            __.isFunction(v) ? v(self) :
            __.isObject(v)   ? __invokeProperties(v, self) : v  ))
        return this  }
    pop (p) {
        if (0 === this.size()) return undefined // not found undefined
        if (undefined !== p) {
            let v = this.get(p)
            this.delete(p)
            return new Object({[p]: v}) }
        else {
            p = this.lastKey
            let v = this.get(p)
            this.delete(p)
            return new Object$({[p]: v}) }  }
    pop$ () {
        result.set(this, this.pop())
        return this  }
    shift () {
        if (0 === this.size()) return undefined
        let p = this.lastKey
        let v = this.get(p)
        this.delete(p)
        return new Object$({[p]: v})  }
    shift$ () {
        result.set(this, this.shift())
        return this  }

    get firstKey ()  { return this.keys()[0] }
    get lastKey ()   { return this.keys()[ this.size() - 1 ] }
    get result ()    { return result.get(this)  }
    get logic () { return logic.get(this)  }
    get value ()     {
        let value // return value if 6 non value: false, null, NaN, undefined, '', 0
        return (value = object.get(this)) ? value.valueOf() : value  }
}


// let Object$ = In$
const method = (name, func) =>
    __.isObject(name) ? Object.keys(name).forEach( k =>
        (In$.prototype[k] =
            Array.isArray(name[k]) ?
                function (...x) { return this.chain([...name[k]].concat(x)) } :
                function (...x) { return this.chain([name[k], ...x]) }  ) )
    :   (In$.prototype[name] = function (...v) {
        return this.chain([func, ...v]) })

class HtmlElement extends In$ { constructor (arg) { super(arg) } }
['appendChild', 'addEventListener'].forEach( v =>
    HtmlElement.prototype[v] = function (...x) {
        return this.setResult( this.value[v](...x) )  })

const xmlObject = o => {
    let value = {}
    for (let p in o) {
        if (p[0] === '$') {
            value.$ = value.$ || {}
            value.$[ p.slice(1) ] = o[p]  }
        else if (__.isObject(o[p]))
            value[p] = [xmlObject( o[p] )]
        else
            value[p] = [o[p].toString()] }
    return value  }

class Xml extends In$ {
    constructor (arg) {
        const stepIn = o => {
            let keys = Object.keys(o)
            if (keys.length === 1)
                return stepIn( o[keys[0]] )
            else (keys.length === 2)
                if (keys[0] === '$')
                    return stepIn( o[keys[1]] )
                else if (keys[1] === '$')
                    return stepIn( o[keys[0]] )
            return o  }
        super(arg)
        this.prop('@root', from( stepIn(this.value) ))
    }
    root (p) {
        const findRoot = (o, prop) => {
            let keys = Object.keys(o)
            if (keys.length === 1)
                return keys[0] === prop ? o[keys[0]] : findRoot( o[keys[0]], prop )
            else (keys.length === 2)
                if (keys[0] === '$')
                    return keys[1] === prop ? o[keys[1]] : findRoot( o[keys[1]], prop )
                else if (keys[1] === '$')
                    return keys[0] === prop ? o[keys[0]] : findRoot( o[keys[0]], prop )
            return o  }
        let root = findRoot(this.value, p)[0]
        this.prop('@root', from(root))
        return this  }
    insert (obj) {
        this.prop('@root').assign( xmlObject(obj) )
        return this  }
    removeElement (p) {
        this.prop('@root').cash.removeValuePropertyTo(p)
        return this  }
    restoreElement (p) {
        this.prop('@root').cash.restoreValuePropertyFrom(p)
        return this  }
    findEvery (p, f) {
        const element = (o, prop) => {
            for (let i = 0; i < o.length; i++) {
                if ( ! __.isObject(o[i]) ) continue
                for (let q in o[i])
                    if (q === prop)
                        for (let r in o[i][q]) {
                            if ( ! __.isObject(o[i][q][r]) ) continue
                            f( from(o[i][q][r]), from(o[i]) )  }
                    else if (q !== '$') element( o[i][q], prop )  }  }
        element([this.prop('@root').value], p)
        return this  }
    insertEvery (p, obj) {
        return this.findEvery( p, v => v.assign(xmlObject( obj )) ) }
    removeEvery (p) {
        return this.findEvery( p, (v, w) => w.delete(p) )  }  }

//{Style: {"$id": "pline", LineStyle:{color: "ff00ff", width: 4} } }
const newProp = (self, p, v) =>
    Object.defineProperty(self, p, { value: v, enumberable: false })


class Array$ extends Array {
    constructor (arg, self) {
        super()
        self && newProp(this, 'self', self)
        let value = arg instanceof Array$ ? arg.value : arg || []
        newProp(this, 'type',  'array')
        newProp(this, 'source', value)
        if (value)
            for(let i = 0; i < value.length; i++)
                this[i] = value[i]  }
    //
    is (a, ...fn) {
        return __is(  is(this.value, a.valueOf() ), this, ...fn ) }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn) }
    if   (f)    { return __if  (this, f)   }
    then (f)    { return __then(this, f)   }
    else (f)    { return __else(this, f)   }
    else_if (f) { return __else_if(this, f) }
    carry (f, ...v)   { return __carry(this, f, ...v) }
    openCarry (f, ...v)   { return __run(this, f, ...v) }
    prop (...p) { return __prop(this, ...p) }    // ... is to tell between prop('p', undefined) or prop('p')
    propSetIf (p, v, f) {
        (__.isFunction(f) ? f(this.prop(p)) : this.prop(p) === f) &&
            this.prop(p, v)
        return this  }
    propOrValue (p, v, f) {
        f = f || (v => undefined !== v)
        let prop = this.prop(p)
        return f(prop) ? prop : v  }
    valueOrProp (v, p, f) {
        f = f || (v => undefined !== v)
        return f(v) ? v : this.prop(p)  }
    log (...f)  { return __log(this, ...f)  }
    out (v) {
        v = undefined === v ? ' ' : v
        console.log( this.join(v) )
        return this }
    //

    get (i)    { return this[i]  }
    set (i, v) { return this[i] = v  }
    reload () {
        let origin = this.source
        this.length = 0
        for(let i = 0; i < origin.length; i++)
             this[i] = origin[i]
        return this  }
    sync () {
        let origin = this.source
        origin.length = 0
        for(let i = 0; i < this.length; i++)
            origin[i] = this[i]
        return this  }
    // find$ (f) {
    //     return from( this.find(f) )  }
    // push$ (...arg) {
    //     this.push(...arg)
    //     return this  }
    // pop$ () {
    //     this.pop()
    //     return this  }
    // shift$ (...v) {
    //     'undefined' !== typeof v && this.push(...v)
    //     this.shift()
    //     return this  }
    // unshift$ (...v) {
    //     this.unshift(...v)
    //     return this  }
    append (a) {
        Array.isArray(a) && this.push(...a)
        return this  }
    reduceFn (f, initialValue) {
        return from( this.reduce(f, initialValue(this)) )  }
    // map    (...args) { return Array$(object.get(this).map    (...args)) }
    // forEach(...args) { return Array$(object.get(this).forEach(...args)) }
    // filter (...args) { return Array$(object.get(this).filter (...args)) }

    // concat (...args) { return Array$(object.get(this).concat (...args)) }
    // slice  (...args) { return Array$(object.get(this).slice  (...args)) }
    // splice (...args) { return Array$(object.get(this).splice (...args)) }
    unique (f) {
        f = f || (v => w => v === w)
        return this.filter( (v, i) => this.findIndex( f(v, i) ) === i )  }
    intersection (b, f) {
        let bIndex
        f = f || (v => w => v === w)
        if ( b instanceof In$ )
            b = b.array
        let ret = new Array$()
        this.forEach( (v,i) => b.findIndex( f(v, i) ) !== -1 && ret.push(v)  )
        return ret  }
        // return this.reduce(  ((a,v,i) => {
        //     if ( ( bIndex = b.findIndex( f(v, i) ) ) !== -1 )
        //         return a.concat(
        //             __.isObject(v) ? v.set( b[bIndex] ) : v )
        //     else return a  }), new Array$()  )  }
    difference (b, f) {
        f = f || (v => w => v === w)
        if ( b instanceof In$ )
            b = b.array
        return this.filter( (v,i) => b.findIndex( f(v, i) ) === -1 )  }
    union (b, f) {
        f = f || (v => w => v === w)
        if ( b instanceof In$ )
            b = b.array
        if ( ! (b instanceof Array$) )
            b = new Array$(b)  // to check b is array
        let ret = this.self.unchained ? __copy(this) : this
        return ret.append(b.filter( (v,i) => this.findIndex( f(v, i) ) === -1 ) ) }
        // return this.difference(b, f)
        //     .concat(this.intersection(b, f))
        //     .concat(b.difference(this, f))  }
    // xmap (b, f) { f(v, w, i, a) }
    // __coMap (b, f) {
    //     return this.reduce((a, v, i) => {
    //     a[i] = f(v, b[i], i, this)
    //     return a }, new Array$()  )  }
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
    valueOf ()    { return Array.from(this) }
    get value ()  { return Array.from(this) }
    get result ()    { return result.get(this)  }
    get logic () { return logic.get(this) }  }

const __htmlTag = (self, tag, attr, ...a) =>
    self.append([HTML[tag](  attr, ...a.map(  v =>
        __.isFunction(v) ? v( new Template(self) ) : v  ))])

class BlazView extends In$ {
    constructor (arg) {
        property.set(this, {view: arg, name: name}) }
    lookup () {}
    lookupInView () {}
    lookupInAttr () {}
    include () {}
    includeBlock () {}
    includeAttr () {}
    includeAttrBlock () {}
}

let range = (start, end, step) => {}

class Template extends Array$ {
    constructor (arg, name) {
        super()
        if (arg instanceof Template) {
            name = arg.name
            arg = arg.view }
        property.set(this, {view: arg, name: name}) }
    include (name, ...a) { return this.append([
        __.isUndefined(a)
                     ? cube.include(     this.view, name) :
        a.length === 1 && __.isBlazeElement(a[0])
                     ? cube.includeBlock(this.view, name, () => a) :
        a.length > 1 ? cube.includeAttrBlock(this.view, name, a[0], () => a.slice(1))
                     : cube.includeAttr( this.view, name, a[0]) ])}
    id    (v, ...a) { return __htmlTag(this, 'DIV', {id: v},    ...a) }
    class (v, ...a) { return __htmlTag(this, 'DIV', {class: v}, ...a) }
    toHTML () { return HTML.toHTML(this.value) }
    get name () { return property.get(this).name }
    get view () { return property.get(this).view }
}

// I will clean up when I have time.

const htmlTags = 'a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command data datagrid datalist dd del details dfn dir div dl dt em embed eventsource fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins isindex kbd keygen label legend li link main map mark menu meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'.toUpperCase().split(' ')
let attributeClass = (key, value) => __.isString(value) ? value.replace(/\*/g, __.key2class(key)) : __.key2class(key)
  // *-ok *-good
const htmlEntities = { '123': '{', '125': '}' }

let displayValue = (v) =>
  __.isEnclosedBy(v, '&#', ';') ? v.replace(/&#([0-9]{3});/g, (m, $1) => $1 in htmlEntities ? htmlEntities[$1] : m) : v

let mustacheAttr = (v, f, _) =>
  __.isEmpty(v) ? '' :
  __.isArray(v) ? () => v :
  __.isFunction(v) ? v( new Template(_) ) :
  __.isEnclosedBy(v, '{', '}') ? v.split(/[{}]/).map( (v, i) => i % 2 === 1 ? f(v) : displayValue(v) ).filter( (v) => v ) :
    displayValue(v)

let blazeAttr = (_, obj) => {
  let f  = cube.lookupInAttr.bind(null, _)
  let fo = __.fixup.call({ part: __._AttrParts }, obj)
  let o  = __.reduceKeys(fo, {}, (o, k) =>
      __.check('class', k) && fo[k].indexOf('*') > -1 ?
        __.object(o, 'class', mustacheAttr(attributeClass(k, fo[k]), f, _)) :
      'local' === k ?
        __.object(o, 'id', __.isBlazeView(_) ? __.key2id.call(__.module(_), fo[k]) : mustacheAttr(fo[k], f, _)) :
        __.object(o, k, mustacheAttr(fo[k], f, _)))
  return __.keys(o).length === 1 && o[__.theKey(o)] === '' ? __.theKey(o) : o }

htmlTags.forEach(tag => Template.prototype[tag] = function(...arr) {
    return this.append([ 0 === arr.length ? HTML[tag]() : HTML[tag](...arr.into$
        .reduce$( (a,v) => a.append(
            mustacheAttr(v, cube.lookupInView.bind(null, this.view), this.view) ),
            v=>__.isBlazeAttr(v[0]) ? [ blazeAttr(this.view, v.shift()) ].into$ : [].into$ ).value  )])  })


class Function$ extends Function {
    constructor (arg, self) {
        super()
        this.type = 'function'
        this.self = self
        object.set(this, arg)  }
    // typeof (type, ...fn) {
    //     return __typeof(this, type, ...fn)  }
    // if (f)      { return __if(this, f)      }
    // then (f)    { return __then(this, f)    }
    // else (f)    { return __else(this, f)    }
    // else_if (f) { return __else_if(this, f) }
    // carry (f)   { return __carry(this, f)   }
    // prop (...p) { return __prop(this, ...p) }
    // log (...f)  { return __log(this, ...f)  }
    invoke (...v) { return this.value(...v) }
    get value ()     { return object.get(this)  }
    // get result ()    { return result.get(this)  }
    // get logic () { return logic.get(this)  }
    // get __ ()        { return object.get(this)  }  }
}

class String$ extends String {
    constructor (arg, self) {
        arg = arg instanceof In$ ||
              arg instanceof String$ ? arg.value : arg
        super(arg)
        this.self = self
        this.type = 'string' }
    // is (str, ...fn) {
    //     return __is( str.valueOf() === this.value, this, ...fn )  }
    // typeof (type, ...fn) {
    //     return __typeof(this, type, ...fn)  }
    // if (f)      { return __if(this, f)      }
    // then (f)    { return __then(this, f)    }
    // else (f)    { return __else(this, f)    }
    // else_if (f) { return __else_if(this, f) }
    // carry (f)   { return __carry(this, f)   }
    // prop (...p) { return __prop(this, ...p) }
    //
    // __path (...str) { // path$
    //     return new String$( path.join( this.value, ...(str.map(v => v.valueOf())) ) ) }
    camelize () {
        return this.replace( /-([a-z])/g, (_, $1) => $1.toUpperCase() ) }
    dasherize () {
        return this.replace( /([A-Z])/g,  $1 => '-' + $1.toLowerCase() ) }
    // __require$ () {
    //     return new Object$( require(this.__) )  }
    // __parseJson$ () {
    //     return new Object$( JSON.parse(this.__) )  }
    // __invoke (f) {
    //     return f(this.__, this)  }
    // __invoke$ (f) {
    //     return from( this.invoke(f) )  }
    // log (...f)       { return __log(this, ...f) }
    get value ()     { return this.valueOf()  }
    // get result ()    { return result.get(this)  }
    // get logic () { return logic.get(this)  }
    // get __ ()        { return this.valueOf()  }
}


class Number$ extends Number {
    constructor (arg, self) {
        super(arg instanceof Number$ ? arg.value : arg)
        if (self) {
            this.self = self
            this.type = 'number' } }
    get value () { return this.valueOf() }
}

// let Number$ = v => v instanceof Number$ ? v : new Number$(v)
class Boolean$ extends Boolean {
    constructor (arg, self) {
        super(arg instanceof Boolean$ ? arg.value : arg)
        if (self) {
            this.self = self
            this.self.type = 'boolean'  }  }
    get value () { return this.valueOf() }
}

// let Boolean$ = v => v instanceof Boolean$ ? v :new Boolean$(v)
class Date$ extends Date {
    constructor (arg, self) {
        super(arg)
        if (self) {
            this.self = self
            this.self.type = 'date'  }  }
    get value () { return this.valueOf() }
}

class Buffer$ extends Buffer {
    constructor (arg, self) {
        super(arg)
        if (self) {
            this.self = self
            this.self.type = 'buffer' }  }
    get value () { return this.valueOf() }
}

class Value {
    constructor (arg, self) {
        this.value = arg
        if (self) {
            this.self = self
            this.self.type = 'value' } }
}

let from = v => {
    if ( v instanceof Date )     return new Date$    (v)
    // else if ( __.isFunction(v) ) return new Object$  (v, 'function')
    else if ( __.isFunction(v) ) return new In$  (v, 'function')
    else if ( __.isObject  (v) ) return new In$  (v, 'object')
    else if ( __.isArray   (v) ) return new In$  (v, 'array')
    else if ( __.isString  (v) ) return new In$  (v, 'string')
    // else if ( __.isString  (v) ) return new String$  (v)
    else if ( __.isNumber  (v) ) return new Number$  (v) // NaN is not here
    else if ( __.isBoolean (v) ) return new Boolean$ (v)
    else if ( undefined === v || null === v || Object.is(NaN, v) )
        return new Value(v) // null, undefined, NaN,
    else return v  }

let strip = v => {
    if ( v instanceof In$ ) v = v.value
    if ( v instanceof String$ || v instanceof Function$ ) v = v.value
    return v ? v.valueOf() : v  }

let code = str => new In$(str[0], 'code')
// let range = (start, end, step) =>

from({
    array: ['length']
})
.forEach( (v,k)=>
    v.forEach( w => In$.prototype[w] = function (...x) {
        return this[k].value[w]  })  )

from({
    array: ['sync', 'reload']
})
.forEach( (v,k)=>
    v.forEach( w => In$.prototype[w] = function (...x) {
        this[k][w](...x)
        return this  })  )

from({
    array: ['push', 'pop', 'shift', 'unshift', 'splice', 'append']
})
.forEach( (v,k)=>
    v.forEach( w => In$.prototype[w] = function (...x) {
        return this.setResult( this[k][w](...x) )  })  )


from({
    array:
        [ 'unique'   , 'difference'  , 'intersection' , 'union'  , 'slice'
        , 'find'     , 'findIndex'   , 'join' ]
  , string:
        [ 'camelize' , 'dasherize'
        , 'charAt'   , 'charCodeAt'  , 'codePointAt'  , 'concat' , 'endsWith'
        , 'includes' , 'indexOf'     , 'lastIndexOf'  , 'match'
        , 'padEnd'   , 'padStart'    , 'repeat'       , 'replace'
        , 'search'   , 'slice'       , 'split'        , 'startsWith'  , 'substr' , 'substring'
                     , 'toLowerCase' , 'toUpperCase'  , 'trim']
  , function: ['invoke']
})
.forEach(  (v,k)=>
    v.forEach(   w => In$.prototype[w] = function (...x) {
        return this.take( this[k][w](...x) )  })  )


let prop = 'into$'
if (prop) {
    Object.defineProperty(  Object.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new In$  (this, 'object') }  })
    Object.defineProperty(  Function.prototype, prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new In$  (this, 'function') }  })
    Object.defineProperty(  String.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new In$  (this, 'string') }  })
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
      , get: function () { return new Boolean$ (this) }  })
    Object.defineProperty(  Buffer.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new In$  (this.toString(), 'buffer') }  })  }


let exported = {
    from:      from
  , code:      code
  , In$:       In$
  , Map$:      Map$
  , Object$:   Object$
  , Array$:    Array$
  , Function$: Function$
  , Date$:     Date$
  , String$:   String$
  , Number$:   Number$
  , Boolean$:  Boolean$
  , Value:     Value
  , CashProperty: CashProperty
  , Xml:       Xml
  , map:       v => new Map$(v)
  , in:        (v, type) => new In$(v, type)
  , function:  v => new Function$(v)
  , date:      v => new Date$(v)
  , object:    v => new Object$(v)
  , array:     v => new Array$(v)   // range(1,20) (2,20,3)
  , string:    v => new String$(v)
  , number:    v => new Number$(v)
  , boolean:   v => new Boolean$(v)
  , module:    v => __.Module(v)
  , template:   (v, name) => new Template(v, name)
  , htmlElement: v        => new HtmlElement(v)
  , strip: strip
  , method: method
  , is: is
  // , range:     range
  // , IncredifyProperty: augument
  // , fileFrom('hello')
  // return function and property. Is there ES6 way?
}


let meteor = {}
meteor.queryString = o => from(o)
    .carry(  v => v.get('query').into$
        .map( (w,k) => encodeURIComponent(k) + "=" + encodeURIComponent(w) )
        .join( v.value.delimeter || '&' )  )
meteor.getUrlfromSettings = p => {
    // console.log(0, new Object$(__._Settings))
    return from(__._Settings).at(p).into$
    .carry( v => v.value.url + '?' + meteor.queryString(v.value.options) ) }


let types = {
    string:   [String,   String$]
  , number:   [Number,   Number$]
  , boolean:  [Boolean,  Boolean$]
  , function: [Function, Function$]
}

function isTypeof (arg, typeString, type) {
    if ('array' === typeString)
        return ('array' === type || undefined === type) && Array.isArray(arg)
    return  (typeString === type || undefined === type) &&
        (typeString === typeof arg || types[typeString].map(v => arg instanceof v).some(v => v) ) }


__.t     = (v, t) => 'function' === typeof t ? (v === t ? t() : t(v)) : 'undefined' === typeof t ? true  : t
__.f     = (v, f) => 'function' === typeof f ? (v === f ? f() : f(v)) : 'undefined' === typeof f ? false : f
__.isTrue  = (v, t) => { v && __.t(v, t); return !!v === true  }
__.isFalse = (v, f) => { v || __.f(v, f); return !!v === false }
__.isIt  = (v, it, t, f) => it ? (__.t(v, t) || true) : (__.f(v, f) && false)
__.isFunction   = (v, t, f) => __.isIt(v, 'function'  === typeof v, t, f)
__.isUndefined  = (v, t, f) => __.isIt(v, 'undefined' === typeof v, t, f)
__.isString     = (v, t, f) => __.isIt(v, 'string'    === typeof v, t, f)
__.isNumber     = (v, t, f) => __.isIt(v, ! isNaN(v) && 'number' === typeof v, t, f)
__.isBoolean    = (v, t, f) => __.isIt(v, 'boolean'   === typeof v, t, f)
__.isDate       = (v, t, f) => __.isIt(v, v instanceof Date, t, f)
__.isScalar     = (v, t, f) => __.isIt(v, __.isNumber(v) || __.isString(v) || __.isBoolean(v), t, f)
__.isArray      = (v, t, f) => __.isIt(v, '[object Array]'     === Object.prototype.toString.call(v), t, f)
__.isObject     = (v, t, f) => __.isIt(v, '[object Object]'    === Object.prototype.toString.call(v), t, f)
__.isArguments  = (v, t, f) => __.isIt(v, '[object Arguments]' === Object.prototype.toString.call(v), t, f)
__.isArrayLike  = (v, t, f) => __.isIt(v, __.isArray(v) || __.isArguments(v), t, f)

function type (v, type) {
    if (v === null || Object.is(v, NaN)) return 'value' === type // typeof null is 'object', NaN !== NaN
    if (type === 'array')  return Array.isArray(v) // typeof array is 'object'
    else if (type === 'string')  return isTypeof(v, 'string')
    else if (type === 'number')  return isTypeof(v, 'number')
    else if (type === 'boolean') return isTypeof(v, 'boolean')
    else if (type === typeof v)  return true // function, string, boolean, number, undefined, symbol, object
    else return false
}

// if ('undefined' !== typeof Meteor)
exported.meteor = meteor

if ( ! ('in$' in global) )
    global.in$ = exported
global.re = () => {
    delete require.cache[process.env.INCREDIBLES_PATH.into$.path('src','incredibles.js').value ]
    require('incredibles')  }

module.exports  = exported
