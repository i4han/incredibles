
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

const TYPES = ['object', 'array', 'string', 'function', 'number', 'date', 'primitive']

let logic  = new WeakMap()
let result = new WeakMap()
let object   = new WeakMap()
let property = new Map() // getter, setter
let heap     = new Map()
let vars     = new Map()
let descriptor = new Map() // descriptor, value

const is = (x, y) => {
    if ( Object.is(x, y) ) return true
    if ( 'object' !== typeof y || 'object' !== typeof x ||
        x.constructor !== y.constructor ||
        Object.keys(x).length !== Object.keys(y).length ) return false
    for (let p in x)
        if ( ! is(x[p], y[p]) ) return false
    return true  }

const value = v => // && 'object' === typeof v.$
    'object' === typeof v && v.value ?
        v.value : v

const copy = v =>
    v instanceof Array$ ? new Array$(v.value)  :
    Array.isArray(v)    ? Object.assign([], v) :
    __.isObject(v)      ? Object.assign({}, v) : v

const __type = (self, type) => {
    result.set(self, self.$.type)
    logic.set(self, self.$.type === type)
    return self  }


// const __func  = (fn, o) => __.isFunction(fn) ? result.set(o, fn(o)) : result.set(o, fn)
// const __is = (answer, o, ...fn) =>
//     fn.length === 0 ? answer ? true     : false :
//     fn.length === 1 ? answer ? fn[0](o) : false :
//     fn.length === 2 ? answer ? fn[0](o) : fn[1](o)
//                     : console.log('error: is')

// const __checkProp = (self, o) => {
//     // console.log(0, Object.keys(o).map(k => self[k] === o[k]).every(v=>v))
//     return Object.keys(o).map(k => self[k] === o[k]).every(v=>v) }

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

const __assign = (self, ...prop) => {
    prop.forEach( p => {
        p = p instanceof Bin$ ? p.value : p
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
    (! (o instanceof Bin$) && __.isObject(o)) || __.isArray(o) ?
        keys.length === 1 ? o[keys[0]]     : __get( o[keys[0]],     ...keys.slice(1) ) :
        keys.length === 1 ? o.get(keys[0]) : __get( o.get(keys[0]), ...keys.slice(1) )

const __set = (o, k, v) =>
    o instanceof Bin$ ? o.set(k, v) : o[k] = v

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


class WeakMap$ extends WeakMap {
    constructor (arg) {
        super(arg)
        this.type = 'weakmap' }
}

class Map$ extends Map {
    constructor (arg) {
        super(arg)
        this.type = 'map'  }
}

let bind = new Map$()

/**
 * @class {Object$}
 * @example in$({a:1, b:2, c:3}).keys() => ['a', 'b', 'c']
 * @method keys
 * @return {Array$} keys of the Object$
 */

class __CashProperty {
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
    on (e, p, f) {
        if (! (['onGet', 'onSet', 'onChange', 'onDelete', 'onError'].includes(e) && this.has(p)) )
            return this.self
        this.descriptor[p][e] = f
        return this.self  }  }

const init = (self, ...args) => {
    let arg = args.length > 0 ? args[0] : {}
    let type = args[1]
    // console.log(arg, type, isTypeof(arg, type, 'function', Function, Function$))
    if ( self.unchained )
        return from(copy(arg))
    arg = value(arg)
    if ( 'primitive' === type ||
        undefined === arg || 'boolean' === typeof arg ||
        null === arg || Object.is(NaN, arg) ) {
        self.$.type = 'primitive'
        self.primitive = new Primitive(arg, self)
        object.set(self, self.primitive)  }
    else if ( isTypeof(arg, 'array', type) ) {
        self.$.type = 'array'
        self.$.source = arg
        self.array = arg instanceof Array$ ? arg : new Array$(arg, self)
        object.set(self, arg)  } // self.array?
    else if ( isTypeof(arg, 'string',   type ) ) {
        self.$.type = 'string'
        self.string   = new String$(arg, self)
        object.set(self, self.string)  }
    else if ( isTypeof(arg, 'number',   type ) ) {
        self.$.type = 'number'
        self.number   = new Number$(arg, self)
        object.set(self, self.number)  }
    else if ( isTypeof(arg, 'function', type ) ) {
        self.$.type = 'function'
        self.function = new Function$(arg, self)
        object.set(self, self.function)  }
    else {
        self.$.type = (undefined !== type) ? type : 'object'
        self.object = new Object$(arg, self)
        object.set(self, self.object) }
    return self  }

let cashProp = (self, p) => {
    Object.defineProperty(self, p, { value: {}, enumberable: false })
    self[p].prop = new Object$(self[p], self, 'cash')
    self[p].setAt = function (p, v) {
        this.prop.setAt(p, v)
        return this.prop.$.bin  }
    return self[p].prop}

const setTo = (self, v, prop) => {
    if (v.length === 1 && 'string' === typeof v[0])
        global[v[0]]  = self[prop] // length === 1 not string to be error
    else if (v.length === 2)
        v[0][v[1]] = self[prop]
    return self  }

const fnValue = (self, f) => 'function' === typeof f ? f(self.value) : f
const __then = (self, f, logic) => {
    if (self.logic === logic)
        __.isFunction(f) ?  self.result = f(self) : self.result = f
    return self  }
const __if = (self, f, p) => {
    p = p || 'value'
    self.logic = __.isFunction(f) ? !!f(self[p]) : is(self[p], f)
    return self  }

// thenTap
// then
// thenOver
// thenChain
// elseIf ()
class Bin$ extends Object {
    constructor (arg, type) {
        super()
        cashProp(this, '$')
        .reactive('bin',    undefined)  // type, unchained, freeze, writable
        .reactive('type',   undefined) // result, logic, error
        .reactive('source', undefined)
        .reactive('store',  {} )
        init(this, arg, type)  }
        // this.cash = new CashProperty(this)  }
    // get $ () { return this.cash.prop }
    from (arg, type) { return init(this, arg, type)    }
    to (...v)        { return setTo(this, v, 'value')  }
    logicTo (...v)   { return setTo(this, v, 'logic')  } // if
    resultTo (...v)  { return setTo(this, v, 'result') } // switch
    type(v) { return __type(this, v) }
    if (f)      { return __if(this, f) }
    then (f)    { return __then(this, f, true) }
    else (f)    { return __then(this, f, false) }
    elseIf (f) { return this.logic === false ? __if(this, f) : this }
    switch (f)  { // setResult
        return this.void( this.result = fnValue(this, f) ) }
    case (f)    { return __if(this, f, 'result') }
    log (...f)  { return __log(this, ...f)  }
    void ()     { return this }
    // carry (f, ...v)     { return __carry(this, f, ...v) }
    // openCarry (f, ...v) { return __run(this, f, ...v)   }
    // prop (...p) { return __prop(this, ...p) }
    // setProp (p, v) { return this.void( this.$[p] = v ) }
    error (p, ...v) {
        console.log(p, ...v)
        return this  }

    chain (...f)     { return this.from( f.reduce( (a,v) =>
        Array.isArray(v) ? v[0](a, ...v.slice(1)) : v(a), this.value ) ) }
    chainOver (...f) { return f.reduce( (a,v) =>
        Array.isArray(v) ? v[0](a, ...v.slice(1)) : v(a), this ) }
    thru (f, ...args) { return this.from( f(this.value, ...args) ) }
    tap  (f, ...args) { return this.void( f(this.value, ...args) ) }
    return (f, ...args) { return 'function' === typeof f ? f(this.value, ...args) : f }
    over (f, ...args)    { return this.from( f(this, ...args) ) }
    tapOver (f, ...args) { return this.void( f(this, ...args) ) }
    returnOver (f, ...args) { return f(this, ...args) }

    cut (v) { //  change to loose
        if (v === undefined)
             this.unchained = true
        else this.unchained = v
        return this  }

// object
    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.value[v] )
        else delete this.value[ keys[0] ]
        return this  }
    remove (k)  { return this.save(k).delete(k) }
    restore (k) { return this.setAt( k, this.$.store[k] ) }
    save (k)    { return this.void( this.$.store[k] = this.at(k) ) }

    add (...o)  { return __add(this, ...o) }  // recursive assign

    set (key, value) {
        if (this.$.type === 'array')
            this.array.set(key, value)
        else this.value[key] = value
        return this  }
    setAt (...args) {
        if (args.length < 2) this.error('setAt', ...args)
        let value = args[ args.length - 1 ]
        let k = args.slice(0, args.length - 1).join('.').split('.')
        if (k.length === 1)
            return this.set(k[0], value)
        else
            this.setWhen(k[0], Number(k[1]).toString() === k[1] ? [] : {} )
            .putAt(k[0])
            .setAt(...k.slice(1), value)
        return this  }
    assign (...obj) {  // assign this.add is recursive, assign is not
        __assign(this, obj[0])  // recursive obj reference assign
        return obj.length > 1 ? this.assign( ...obj.slice(1) ) : this  }
    zip (key, value) { //   aset(['a', 'b', 'c'], [1,2,3])
        key.forEach( (v, i) => this.set( v, value[i] ) )
        return this  }
    // setEntries ([[key, value]]) {}
    setWhen (key, value, f) { // ...f => f[0](...f.slice(1)) <- arg
        (__.isFunction(f) ? f(this.at(key)) : this.at(key) === f) &&
            this.setAt(key, value)
        return this  }
    setDefault (key, value) { return this.setWhen(key, value) }

    // setResult (v) { return this.void( result.set(this, v) ) }
    get (...key) {
        // key.length > 3 & console.log(0, object.get(this))
        let k = this.value[ key[0] ]
        return key.length > 1 ? __get(k, ...key.slice(1)) : k  }
    at (...key) {
        return this.get( ...key.join('.').split('.') )  }
    pickAt (...key) { return this.from( this.at(...key) ) }
    putAt  (...key) { return  new Bin$( this.at(...key) ) }
    switchAt (...key) {}
    size ()  { return this.keys().length }
    clear () {
        for (let p in this.value)
            delete this.value[p]
        return this  } // to do: clear not assign new
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
        if (this.type('string').logic)
            return new Object$(this.value, this.$.type)
        else {
            o = o || {}
            return new Object$( Object.assign(o, this.value,   Object.assign({}, o)), this.$.type ) }  }
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
    pop (p) {
        if (0 === this.size()) return undefined // not found undefined
        if (undefined !== p) {
            let v = this.get(p)
            this.delete(p)
            return new Object({[p]: v}) }
        else {
            p = this.last
            let v = this.get(p)
            this.delete(p)
            return new Object$({[p]: v}) }  }
    // pop$ () {
    //     result.set(this, this.pop())
    //     return this  }
    shift () {
        if (0 === this.size()) return undefined
        let p = this.last
        let v = this.get(p)
        this.delete(p)
        return new Object$({[p]: v})  }
    // shift$ () {
    //     result.set(this, this.shift())
    //     return this  }
    get first ()  { return this.keys()[0] }
    get last ()   { return this.keys()[ this.size() - 1 ] }
    get result () { return result.get(this) }
    get logic ()  { return logic.get(this)  }
    get value ()  {
        if ('array' === this.$.type)
            return this.array.value
        if ('object' === this.$.type)
            return this.object.value
        let value // return value if 6 non value: false, null, NaN, undefined, '', 0
        return (value = object.get(this)) ? value.valueOf() : value  }
    // get __ ()        { return object.get(this)  }
    set result (v) { return result.set(this, v) }
    set logic (v)  { return logic.set(this, v)  }
}



class Object$ extends Object {
    constructor (arg, bin, cash) {
        super()
        if (cash)
            this.$ = {bin: bin}
        else
            cashProp(this, '$')
            .reactive('bin',    bin )
            .reactive('source', value )
            .reactive('store', {} )
            .reactive('type',  'object')
            .on('set', 'type', (function (v, ov, self) { TYPES.includes(v) ? v : this.error(ov) }).bind(this) )
        object.set(this, arg)
        descriptor.set(this, {})
        heap.set(this, {})  }
    reactive (p, v, o) {
        let descObj = descriptor.get(this)  // bindTo onGet, onSet, onError
        let val  = heap.get(this)           // debug, UnneededAssigm
        let desc = descObj[p] = {bindTo:[]}
        val[p] = v
        Object.defineProperty(this.value, p, Object.assign({
            enumberable:  true
          , configurable: false
          , get: function () {
                if (desc.onGet)
                     return desc.onGet(val[p], this.self) // e = {newValue, oldValue, valueobj}
                else return val[p]  }
          , set: function (w) {
                if (desc.onSet)
                    w = desc.onSet(w, val[p], this.self)
                if (val[p] !== w) { // skip if value is same
                    val[p] = w
                    desc.bindTo.forEach( x => x[0][x[1]] = w ) }
                return   }  }, o))
        return this  }
    reactives (obj, o) {
        Object.keys(obj).forEach( p => this.reactive(p, obj[p], o) )
        return this  }
    descriptor (p) { return descriptor.get(this)[p] }
    on (e, p, f) {
        if (! ['get', 'set', 'error'].includes(e) ) // change, delete
            return this.self
        this.descriptor(p)[ 'on' + e[0].toUpperCase() + e.slice(1) ] = f
        return this.self  }
    bindTo (p, o, prop) {
        this.descriptor(p).bindTo.push([o, prop]) }

    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.value[v] )
        else delete this.value[ keys[0] ]
        return this  }
    remove (k)  { return this.save(k).delete(k) }
    restore (k) { return this.set( k, this.$.store[k] ) }
    save (k) {
        this.$.store[k] = this.get(k)
        return this  }
    add (...o) {
        return __add(this, ...o)  }

    set (key, value) {
        this.value[key] = value
        return this  }
    setAt (...args) {
        if (args.length < 2) this.error('setAt', ...args)
        let value = args[ args.length - 1 ]
        let k = args.slice(0, args.length - 1).join('.').split('.')
        if (k.length === 1)
            return this.set(k[0], value)
        else
            this.setWhen(k[0], Number(k[1]).toString() === k[1] ? [] : {} )
            .putAt(k[0])
            .setAt(...k.slice(1), value)
        return this  }
    assign (...obj) {  // add?
        __assign(this, obj[0])  // recursive obj reference assign
        return obj.length > 1 ? this.assign( ...obj.slice(1) ) : this }
    zip (key, value) { //   aset(['a', 'b', 'c'], [1,2,3])
        key.forEach( (v, i) => this.set( v, value[i] ) )
        return this  }
    setWhen (key, value, f) {
        (__.isFunction(f) ? f(this.at(key)) : this.at(key) === f) &&
            this.setAt(key, value)
        return this  }
    setDefault (key, value) { return this.setWhen(key, value) }
    put (...args) {   // <-> take
        if (args.length === 1 && 'string' === typeof args[0])
            global[args[0]]  = this.value // length === 1 not string to be error
        else if (args.length === 2)
            args[0][args[1]] = this.value
        return this  }
    get (...key) {
        let k = this.value[ key[0] ]
        return key.length > 1 ? __get(k, ...key.slice(1)) : k  }
    at (...key) {
        return this.get( ...key.join('.').split('.') )  }
    pickAt (...key) { return this.from( this.at(...key) ) }
    putAt (...key) { return new Object$( this.at(...key) ) }
    size () { return this.keys().length }
    clear () {
        object.set(this, {})
        return this  }
    has (k) { return k in this.value  }
    includes (v) { return this.entries().includes(v) }
    keys ()     { return Object.keys( this.value ) }
    values ()   { return this.keys().map( k => this.get(k) ) }
    entries ()  { return Object.entries(this.value) }
    valueOf ()  { return this.value }
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
    // MVCObject bindto, addListener, changed, notify
    // entries () {
    //     return this.keys().map( k => [k, this.get(k)] )  }
    // assign (...o)  { return Object.assign(this.__, ...o) }
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
        if (this.type('string').logic)
            return new Object$(this.value, this.$.type)
        else {
            o = o || {}
            return new Object$( Object.assign(o, this.value,   Object.assign({}, o)), this.$.type ) }  }
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
            p = this.last
            let v = this.get(p)
            this.delete(p)
            return new Object$({[p]: v}) }  }
    shift () {
        if (0 === this.size()) return undefined
        let p = this.last
        let v = this.get(p)
        this.delete(p)
        return new Object$({[p]: v})  }

    get first () { return this.keys()[0] }
    get last ()  { return this.keys()[ this.size() - 1 ] }
    get result () { return result.get(this) }
    get logic ()  { return logic.get(this)  }
    get value ()  {
        let value = object.get(this)
        return value ? value.valueOf() : value  }
} // return value if 6 non value: false, null, NaN, undefined, '', 0


// let Object$ = Bin$
const method = (name, func) =>
    __.isObject(name) ? Object.keys(name).forEach( k =>
        (Bin$.prototype[k] =
            Array.isArray(name[k]) ?
                function (...x) { return this.chain([...name[k]].concat(x)) } :
                function (...x) { return this.chain([name[k], ...x]) }  ) )
    :   (Bin$.prototype[name] = function (...v) {
        return this.chain([func, ...v]) })

class HtmlElement extends Bin$ { constructor (arg) { super(arg) } }
['appendChild', 'addEventListener'].forEach( v =>
    HtmlElement.prototype[v] = function (...x) {
        return this.switch( this.value[v](...x) )  })

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

class Xml extends Bin$ {
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
        this.$.root = from( stepIn(this.value) )
    }
    root (p)     { return this.void( this.$.root = from( findRoot(this.value, p)[0] ) ) }
    insert (obj) { return this.void( this.$.root.assign( xmlObject(obj) ) ) }
    removeElement (p)  { return this.void( this.$.root.remove(p) )  }
    restoreElement (p) { return this.void( this.$.root.restore(p) ) }
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
        element([this.$.root.value], p)
        return this  }
    insertEvery (p, obj) { return this.findEvery( p, v => v.assign(xmlObject( obj )) ) }
    removeEvery (p)      { return this.findEvery( p, (v, w) => w.delete(p) )  }  }

class Array$ extends Array {
    constructor (arg, bin) {
        super()
        let value = arg instanceof Array$ ? arg.value : arg || []
        cashProp( this, '$')
        .reactive('bin',    bin )
        .reactive('source', value )
        .reactive('type',  'array')
        .on('set', 'type', (function (v, ov, self) { TYPES.includes(v) ? v : this.error(ov) }).bind(this) )
        if (value)
            for(let i = 0; i < value.length; i++)
                this[i] = value[i]  }
    error (v) {
        console.log('error')
        return v  }
    carry (f, ...v)   { return __carry(this, f, ...v) }
    out (v) {
        v = undefined === v ? ' ' : v
        console.log( this.join(v) )
        return this }
    get (i)    { return this.$.source[i]  }
    set (i, v) {
        this[i] = v
        this.$.source[i] = v
        return this  }
    reload () {
        let origin = this.$.source
        this.length = 0
        for(let i = 0; i < origin.length; i++)
             this[i] = origin[i]
        return this  }
    sync () {
        let origin = this.$.source
        origin.length = 0
        for(let i = 0; i < this.length; i++)
            origin[i] = this[i]
        return this  }
    append (a) {
        Array.isArray(a) && this.push(...a)
        return this  }
    reduceFn (f, initialValue) {
        return from( this.reduce(f, initialValue(this)) )  }
    unique (f) {
        f = f || (v => w => v === w)
        return this.filter( (v, i) => this.findIndex( f(v, i) ) === i )  }
    intersection (b, f) {
        let bIndex
        f = f || (v => w => v === w)
        if ( b instanceof Bin$ )
            b = b.array
        let ret = new Array$()
        this.forEach( (v,i) => b.findIndex( f(v, i) ) !== -1 && ret.push(v)  )
        return ret  }
    difference (b, f) {
        f = f || (v => w => v === w)
        if ( b instanceof Bin$ )
            b = b.array
        return this.filter( (v,i) => b.findIndex( f(v, i) ) === -1 )  }
    union (b, f) {
        f = f || (v => w => v === w)
        if ( b instanceof Bin$ )
            b = b.array
        if ( ! (b instanceof Array$) )
            b = new Array$(b)  // to check b is array
        let ret = this.$.bin.unchained ? copy(this) : this
        return ret.append(b.filter( (v,i) => this.findIndex( f(v, i) ) === -1 ) ) }
    sum (f) {
        f = f || (v => v)
        return this.reduce(((a,v) => a += f(v)), 0) }
    count (f) {
        f = f || (v => v)
        return this.reduce(((a,v) => __.isNumber(f(v)) ? a += 1 : a), 0)  }
    average (f) {
        return this.sum(f) / this.count(f)  }
    get value ()  { return this.sync().$.source }
    get result () { return result.get(this) }
    get logic ()  { return logic.get(this)  }  }

const __htmlTag = (self, tag, attr, ...a) =>
    self.append([HTML[tag](  attr, ...a.map(  v =>
        __.isFunction(v) ? v( new Template(self) ) : v  ))])

class BlazView extends Bin$ {
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

/*
;['Each', 'With'].forEach(tag => blaze[tag] = (_, lookup, func) => {
//    __.isFunction(func) || console.log('blaze: arg3 must be a function')
    return Blaze[tag](() => cube.lookup(_, lookup), func) })

blaze.Each = (_, lookup, func) => Blaze.Each(() => cube.lookup(_, lookup), func)
*/
class Template extends Array$ {
    constructor (arg, name) {
        super()
        if (arg instanceof Template) {
            name = arg.name
            arg = arg.view }
        property.set(this, {view: arg, name: name}) }
    each (lookup, f) {
        return this.append([
            Blaze.Each(()=>cube.lookup(this.view, lookup), ()=>f(new Template(this.view)) )  ])
    }
    with (lookup, f) {
        return this.append([
            Blaze.With(()=>cube.lookup(this.view, lookup), ()=>f(new Template(this.view)) )  ])        
    }
    include (name, ...a) { return this.append([ // append because push returns number of element not this.
        __.isUndefined(a)
                     ? cube.include(this.view, name) :
        a.length === 1 && __.isBlazeElement(a[0])
                     ? cube.includeBlock(this.view, name, ()=>a) :
        a.length > 1 ? cube.includeAttrBlock(this.view, name, a[0], ()=>a.slice(1))
                     : cube.includeAttr( this.view, name, a[0]) ])}
    // id    (v, ...a) { return __htmlTag(this, 'DIV', {id: v},    ...a) }
    id    (v, ...a) { return this.DIV({id:    v}, ...a) }
    class (v, ...a) { return this.DIV({class: v}, ...a) }
    toHTML () { return HTML.toHTML(this.value) }
    get name () { return property.get(this).name }
    get view () { return property.get(this).view }
}

// I will clean up when I have time.

const htmlTags = 'a abbr acronym address applet area article aside audio b base basefont bdi bdo big blockquote body br button canvas caption center cite code col colgroup command data datagrid datalist dd del details dfn dir div dl dt em embed eventsource fieldset figcaption figure font footer form frame frameset h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins isindex kbd keygen label legend li link main map mark menu meta meter nav noframes noscript object ol optgroup option output p param pre progress q rp rt ruby s samp script section select small source span strike strong style sub summary sup table tbody td textarea tfoot th thead time title tr track tt u ul var video wbr'.toUpperCase().split(' ')
let attributeClass = (key, value) => __.isString(value) ? value.replace(/\*/g, __.key2class(key)) : __.key2class(key)
  // *-ok *-good
const htmlEntities = { '123': '{', '125': '}' }

let displayValue = v =>
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
    return this.append(
        [ 0 === arr.length ? HTML[tag]() :
            HTML[tag](
                ...arr.into$.reduceFn( (a,v) =>  a.append(
                [mustacheAttr(v, cube.lookupInView.bind(null, this.view), this.view)]),
                w=>__.isBlazeAttr(w[0]) ? [ blazeAttr(this.view, w.shift()) ].into$ : [].into$ ).value )  ]  )  })

class Function$ extends Function {
    constructor (v, bin) {
        super()
        cashProp(this, '$').reactives({
            type: 'function'
          , bin:   bin
          , value: value(v)  })  }
    bind (...v)   { return this.$.value.bind(...v) }
    call (...v)   { return this.$.value.call(...v) }
    execute (...v) {
        this.$.value(...v)
        return this  }
    invoke (...v) { return this.$.value(...v) }
    get legnth () { return this.$.value.length }
    get name ()   { return this.$.value.name }
    toString ()   { return this.$.value.toString() }
    get value ()  { return this.$.value  }
}

class String$ extends String {
    constructor (v, bin) {
        // arg = arg instanceof Bin$ ||
        //       arg instanceof String$ ? arg.value : arg
        super(value(v))
        cashProp(this, '$').reactives({
            type: 'string'
          , bin:   bin  })  }
    camelize ()  {
        return this.replace( /-([a-z])/g, (_, $1) => $1.toUpperCase() ) }
    dasherize () {
        return this.replace( /([A-Z])/g,  $1 => '-' + $1.toLowerCase() ) }
    get value () { return this.valueOf()  }
}


class Number$ extends Number {
    constructor (v, bin) {
        super(value(v))
        cashProp(this, '$').reactives({
            type: 'number'
          , bin:   bin  })  }
    get value () { return this.valueOf() }
}


class Date$ extends Date {
    constructor (v, bin) {
        super(value(v))
        cashProp(this, '$').reactives({
            type: 'date'
          , bin:   bin  })  }
    get value () { return this.valueOf() }
}

class Primitive {
    constructor (v, bin) {
        cashProp(this, '$').reactives({
            type: 'primitive'
          , value: value(v)
          , bin:   bin  })  }
    valueOf()    { return this.$.value }
    get value () { return this.$.value }
}

let from = (...args) => {
    if ( args.length > 1 )   return new Bin$(  args, 'array' )
    let v = args[0]
    if ( v instanceof Date )     return new Bin$ (v, 'date'  )
    else if ( __.isFunction(v) ) return new Bin$ (v, 'function')
    else if ( __.isObject  (v) ) return new Bin$ (v, 'object')
    else if ( __.isArray   (v) ) return new Bin$ (v, 'array' )
    else if ( __.isString  (v) ) return new Bin$ (v, 'string')
    else if ( __.isNumber  (v) ) return new Bin$ (v, 'number') // NaN is not here
    else if ( __.isBoolean (v) ) return new Bin$ (v, 'primitive')
    else if ( undefined === v || null === v || Object.is(NaN, v) )
        return new Bin$(v, 'primitive') // null, undefined, NaN,
}

let strip = v => {
    if ( v instanceof Bin$ ) v = v.value
    if ( v instanceof String$ || v instanceof Function$ ) v = v.value
    return v ? v.valueOf() : v  }

let code = str => new Bin$(str[0], 'code')
// let range = (start, end, step) =>

// from({
//     array: ['length']
// })
// .forEach( (v,k)=>
//     v.forEach( w => Bin$.prototype[w] = function (...x) {
//         return this[k].value[w]  })  )

from({
    array:    ['sync', 'reload', 'out']
})
.forEach( (v,k)=>
    v.forEach( w => Bin$.prototype[w] = function (...x) {
        this[k][w](...x)
        return this  })  )

from({
    array: ['push', 'pop', 'shift', 'unshift', 'splice', 'append']
})
.forEach( (v,k)=>
    v.forEach( w => Bin$.prototype[w] = function (...x) {
        return this.switch( this[k][w](...x) )  })  )

from({
    array:
        [ 'unique'  , 'difference' , 'intersection', 'union'     , 'slice'
        , 'find'    , 'findIndex'  , 'join' ]
  , string:
        [ 'camelize', 'dasherize'
        , 'charAt'  , 'charCodeAt' , 'codePointAt' , 'concat'    , 'endsWith'
        , 'includes', 'indexOf'    , 'lastIndexOf' , 'match'
        , 'padEnd'  , 'padStart'   , 'repeat'      , 'replace'
        , 'search'  , 'slice'      , 'split'       , 'startsWith', 'substring'
        , 'substr'  , 'toLowerCase', 'toUpperCase' , 'trim']
  , function: ['invoke']
})
.forEach(  (v,k)=>
    v.forEach(  w => Bin$.prototype[w] = function (...x) {
        return this.from( this[k][w](...x) )  })  )


let prop = 'into$'
if (prop) {
    Object.defineProperty(  Object.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Bin$  (this, 'object') }  })
    Object.defineProperty(  Function.prototype, prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Bin$  (this, 'function') }  })
    Object.defineProperty(  String.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Bin$  (this, 'string') }  })
    Object.defineProperty(  Array.prototype,    prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Array$   (this) }  })
    Object.defineProperty(  Date.prototype,     prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Bin$  (this, 'date'  ) }  })
    Object.defineProperty(  Number.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Bin$  (this, 'number') }  })
    Object.defineProperty(  Boolean.prototype,  prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Bin$  (this, 'primitive') }  })
}


let exported = Object.assign(from, {
    from:      from
  , code:      code
  , Bin$:      Bin$
  , Map$:      Map$
  , Object$:   Object$
  , Array$:    Array$
  , Function$: Function$
  , Date$:     Date$
  , String$:   String$
  , Number$:   Number$
  , Primitive:    Primitive
  // , CashProperty: CashProperty
  , Xml:       Xml
  , map:       v => new Map$(v)
  , bin:      (v, type) => new Bin$(v, type)
  , function:  v => new Function$(v)
  , date:      v => new Date$(v)
  , object:    v => new Object$(v)
  , array:     v => new Array$(v)   // range(1,20) (2,20,3)
  , string:    v => new String$(v)
  , number:    v => new Number$(v)
  , primitive: v => new Primitive(v)
  , module:    (...v) => __.Module(...v)
  , template:   (v, name) => new Template(v, name)
  , htmlElement: v        => new HtmlElement(v)
  , strip: strip
  , method: method
  , is: is
  // , range:     range
  // , IncredifyProperty: augument
  // , fileFrom('hello')
  // return function and property. Is there ES6 way?
})


let meteor = {}
meteor.queryString = o => from(o).pickAt('query')
    .over( v=>v
        .map( (w,k) => encodeURIComponent(k) + "=" + encodeURIComponent(w) )
        .join( v.value.delimeter || '&' )  )
meteor.getUrlfromSettings = p => from(__._Settings).pickAt(p)
    .return( v => v.url + '?' + meteor.queryString(v.options).value )


let types = {
    string:   [String,   String$]
  , number:   [Number,   Number$]
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

if ( !('in$' in global) )
    global.in$ = exported
module.exports = exported
