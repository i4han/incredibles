
'use strict'

require('./polyfill.js')

let path, fs

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

const __typeof = (self, type, ...fn) =>
    fn.length === 0 ? self.type === type ? true     : false :
    fn.length === 1 ? self.type === type ? fn[0](self) : false :
    fn.length === 2 ? self.type === type ? fn[0](self) : fn[1](self)
                    : console.log('error: typeof')

const __if = (self, f) => {
    condition.set( self, __.isFunction(f) ? !!f(self) : !!f )
    return self  }

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
const __carry = (self, f) => {
    if (! __.isFunction(f)) return f
    let ret
    result.set(self, ret = f(self, property.get(self)))
    return ret  }

const __run = (self, f) => {
    f(self)
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
        p = p instanceof Object$ ? p.__ : p
        for ( let k in p )
            self.set(k, p[k]) })
    // {
        // if ( __.isObject(p[k]) ) self.set( k, p[k] )
        // else self.set( k, p[k] ) } }  )
    return self  }

const __add__ = (a, b) =>
    Object.keys(b).forEach( k =>
        'object' === typeof a[k] && 'object' === typeof b[k] ?
            __add__(a[k], b[k]) : (a[k] = b[k]) )

const __add = (self, ...o) => {
    o.reduce( (a,v) => __add__(a, v), self.__)
    return self  }

const __invokeProperties = (o, self) => {
    Object.keys(o).forEach( k =>
        o[k] = __.isObject(o[k])   ? __invokeProperties(o[k], self) :
               __.isFunction(o[k]) ? o[k](self) : o[k] )
    return o  }

const __get = (o, ...keys) =>
    __.isScalar(o) || !o ? undefined :
    (! (o instanceof Object$) && __.isObject(o)) || __.isArray(o) ?
        keys.length === 1 ? o[keys[0]]     : __get( o[keys[0]],     ...keys.slice(1) ) :
        keys.length === 1 ? o.get(keys[0]) : __get( o.get(keys[0]), ...keys.slice(1) )

const __set = (o, k, v) =>
    o instanceof Object$ ? o.set(k, v) : o[k] = v

const __equal = (x, y) => {
    if ( Object.is(x, y) ) return true
    if ( 'object' !== typeof y || 'object' !== typeof x ||
        x.constructor !== y.constructor ||
        Object.keys(x).length !== Object.keys(y).length ) return false
    for (let p in x)
        if ( ! __equal(x[p], y[p]) ) return false
    return true  }

const __log = (self, ...args) => {
    if (args.length > 1) console.log( ...args, self.value )
    else if (args.length === 1)
        if ('function' === typeof args[0]) console.log(args[0](self)) //
        else console.log( args[0], self.value )
    else console.log( self.value )
    return self   }

const __recursive = (o, f) => {
    f(o)
    for (let p in o.__) {
        if ( __.isObject(o.__[p]) )
            __recursive( new Object$(o.__[p]), f )
        if ( __.isArray(o.__[p]) )
            for ( let q in o.__[p] )
                if ( __.isObject( o.__[p][q] ) )
                    __recursive( new Object$(o.__[p][q]), f )  }
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

const __isType = (arg, type, is, ...o) =>
    (is === type || undefined === type) && (is === typeof arg || o.map(v => arg instanceof v).some(v => v) )

const __init = (self, ...args) => {
    let arg = args.length > 0 ? args[0] : {}
    let type = args[1]
    // console.log(arg, type, __isType(arg, type, 'function', Function, Function$))
    if ( self.unchained )
        return new Object$(arg, type)
    if ( arg instanceof Object$ )
        arg = arg.value
    if ( undefined === arg ) {
        self.type = 'value'
        object.set(self, undefined)  }
    else if ( __isType(arg, type, 'string',   String,   String$  ) ) {
        self.type = 'string'
        self.string   = new String$(arg, self)
        object.set(self, self.string)  }
    else if ( __isType(arg, type, 'function', Function, Function$) ) {
        self.type = 'function'
        self.function = new Function$(arg, self)
        object.set(self, self.function)  }
    else if ( 'code' === type ) {
        self.type = 'code'
        object.set(self, arg) }
    else {
        // arg = arg instanceof Object$ ? arg.value: arg || {}
        self.type = (undefined !== type) ? type : 'object'
        object.set(self, arg) }
    return self  }

class Object$ extends Object {
    constructor (arg, type) {
        super()
        __init(this, arg, type)
        this.cash = new CashProperty(this)  }
        // property.set(this, {}) // Yes. arg can be an array.
    reset (arg, type) { return __init(this, arg, type) }
    get $ () { return this.cash.prop }
    is (obj, ...fn) {
        return __is( __equal(this.__, obj), this.__, ...fn)  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn )  }
    if (f)      { return __if(this, f)   }
    then (f)    { return __then(this, f) }
    else (f)    { return __else(this, f) }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)   }
    run (f)     { return __run(this, f)     }
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
    // // restoreAll () { return this.restore( ...this.keys() ) }
    // removeAll ()  { return this.removeProp ( ...this.keys() ) }
    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.__[v] )
        else delete this.__[ keys[0] ]
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
        let wo0 = new Object$(o0)
        k.length === 2 ?
            __set (o0, k[1], value) : wo0.setAt(...k.slice(1), value)
        return this  }
    __dset (...v) { return this.setAt(...v) }
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
    setValue (...args) {
        if (args.length === 1 && 'string' === typeof args[0])
            global[args[0]]  = this.value
        else if (args.length === 2)
            args[0][args[1]] = this.value
        return this  }
    get (...key) {
        // key.length > 3 & console.log(0, object.get(this))
        let k = this.value[ key[0] ]
        return key.length > 1 ? __get(k, ...key.slice(1)) : k  }

    // __get$ (...key) {    // for object
    //     return from( this.get(...key) )  }
    // __dget$ (...key) {
    //     return from( this.at(...key) )  }
    at (...key) {
        return this.get( ...key.join('.').split('.') )  }
    take (...key) {
        return this.reset( this.at(...key) ) }
    __dget (...key) { return this.at(...key) }
    size () { return this.keys().length }
    clear () {
        object.set(this, {})
        return this  }
    has (k) {
        return k in this.__  }
    forEach (f) {
        this.keys().forEach( k => f( this.get(k), k, this ) )
        return this  }
    map (f)    { return this.keys().map( k => f( this.get(k), k, this ) ) }
    filter (f) {
        let ret = new Object$({})
        for (let p in this.value)
            if ( f(this.get(p), p, this) )
                ret.set(p, this.get(p))
        return ret  }
    reduce (f, init) {
        let accumulator = init
        for (let p in this.value)
            accumulator = f( accumulator, this.get(k), k, this)
        return accumulator  }
    keys ()    { return Object.keys( this.value ) }
    values ()  {
        return this.keys().map( k => this.get(k) )  }
    // MVCObject bindto, addListener, changed, notify
    // entries () {
    //     return this.keys().map( k => [k, this.get(k)] )  }

    // assign (...o)  { return Object.assign(this.__, ...o) }
    entries ()  { return Object.entries(this.__) }
    freeze ()   { return Object.freeze(this.__) && this }
    isFrozen () { return Object.isFrozen(this.__) }
    seal ()     { return Object.seal(this.__) && this }
    isExtensible()     { return Object.isExtensible(this.__) }
    getPrototypeOf()   { return Object.getPrototypeOf(this.__) }
    getOwnPropertyNames()    { return Object.getOwnPropertyNames(this.__) }
    getOwnPropertySymbols()  { return Object.getOwnPropertySymbols(this.__) }
    getOwnPropertyDescriptor (prop) { return Object.getOwnPropertyDescriptor(this.__, prop) }
    valueOf ()   { return this.__ }
    toString ()  { return this.__.toString() }
    unwatch (p)  { return this.__.unwatch(p) }
    watch (p, handler) { return this.__.watch(p, handler) }
    hasOwnProperty (p) { return this.__.hasOwnProperty(p) }
    isPrototypeOf (o)  { return this.__.isPrototypeOf(o) }
    propertyIsEnumerable(p) { return this.__.propertyIsEnumerable(p) }

    rekey (oldKey, newKey)  {
        this.set( newKey, this.get(oldKey) )
        if ( this.hasOwnProperty(oldKey) ) this.delete(oldKey)
        return this  }
    recursive (f) {
        return __recursive(this, f)  }
    copy (o)  {
        if (this.typeof('string'))
            return new Object$(this.value, 'string')
                .cash.set( '@clipboard', {value: this.value, type: this.type} )
        // else if (this.typeof('object')) {
        else {
            o = o || {}
            return new Object$( Object.assign(o, this.value,   Object.assign({}, o)), 'object' )
                .cash.set( '@clipboard', {value: this.value, type: this.type} )  }  }
    paste (o) {
        let copied = this.cash.get('@clipboard')
        if ('string' === copied.type)
            return new Object$(copied.value, 'string')
        else {
            o = o || {}
            return new Object$( Object.assign(o, copied.value, Object.assign({}, o)), 'object')  }  }
    __stringify$ (...args) { return new String$( JSON.stringify(this.__, ...args) ) }
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
    chain (f, ...args)  { return this.reset( f(this.value, ...this.argument(...args)) ) }
    chainLinked (...f)  { return this.reset( f.reduce( (a,v)=> v(a) , this.value ) ) }
    unchain (v) { return this.loose(v) }
    loose (v) { //  change to loose
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
    get condition () { return condition.get(this)  }
    get value ()     {
        let value // return value if 6 non value: false, null, NaN, undefined, '', 0
        return (value = object.get(this)) ? value.valueOf() : value  }
    get __ ()        { return object.get(this)  }  }



// ;[ 'camelize' , 'dasherize'   , 'path'
// , 'charAt'   , 'charCodeAt'  , 'codePointAt' , 'concat'      , 'endsWith'
// , 'includes' , 'indexOf'     , 'lastIndexOf' , 'match'
// , 'padEnd'   , 'padStart'    , 'repeat'      , 'replace'
// , 'search'   , 'slice'       , 'split'       , 'startsWith'  , 'substr' , 'substring'
//              , 'toLowerCase' , 'toUpperCase' , 'trim']
// .forEach(  method => Object$.prototype[method] = function (...v) {
//     return this.reset( this.string[method](...v) )  }  )



class HtmlElement extends Object$ {
    constructor (arg) {
        super(arg)  }
    appendChild (...v) {
        this.value.appendChild(...v)
        return this  }
    addEventListener (...v) {
        this.value.addEventListener(...v)
        return this  }
}

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

class Xml extends Object$ {
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
        this.prop('@root', new Object$( stepIn(this.__) ))
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
        let root = findRoot(this.__, p)[0]
        this.prop('@root', new Object$(root))
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
                            f( new Object$(o[i][q][r]), new Object$(o[i]) )  }
                    else if (q !== '$') element( o[i][q], prop )  }  }
        element([this.prop('@root').__], p)
        return this  }
    insertEvery (p, obj) {
        return this.findEvery( p, v => v.assign(xmlObject( obj )) ) }
    removeEvery (p) {
        return this.findEvery( p, (v, w) => w.delete(p) )  }  }

//{Style: {"$id": "pline", LineStyle:{color: "ff00ff", width: 4} } }

class Array$ extends Array {
    constructor (arg) {
        super()
        // property.set(this, {}) // write error if arg is object.
        let value = arg instanceof Array$ ? arg.__ : arg || []
        Object.defineProperty(this, 'type', {
            value: 'array'
          , enumberable: false })
        Object.defineProperty(this, 'cash', {
            value: new CashProperty(this)
          , enumerable: false })
        this.cash.set('@value', value)
        if (value)
            for(let i = 0; i < value.length; i++)
                this[i] = value[i]  }
    get $ () { return this.cash.prop }
    is (a, ...fn) {
        return __is(  __equal(this.__, a.valueOf() ), this, ...fn ) }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn) }
    if   (f)    { return __if  (this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)   }
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

    get (i) {
        return this[i]  }
    set (i, v) {
        return this[i] = v  }
    reload () {
        let origin = this.prop('@value')
        this.length = 0
        for(let i = 0; i < origin.length; i++)
             this[i] = origin[i]
        return this  }
    sync () {
        let origin = this.prop('@value')
        origin.length = 0
        for(let i = 0; i < this.length; i++)
            origin[i] = this[i]
        return this  }
    // __indexOf (f) { // findIndex
    //     let fn
    //     if ( __.isFunction(f) ) fn = f
    //     else fn = arg => arg === f
    //     for (let i = 0; i < this.length; i++)
    //         if ( fn(this[i], i, this) ) return i
    //     return -1  }
    find$ (f) {
        return from( this.find(f) )  }
    push$ (...arg) {
        this.push(...arg)
        return this  }
    pop$ () {
        this.pop()
        return this  }
    append (a) { return this.push$(...a) }
    shift$ (...v) {
        'undefined' !== typeof v && this.push(...v)
        this.shift()
        return this  }
    unshift$ (...v) {
        this.unshift(...v)
        return this  }
    reduce$ (f, initialValue) {
        if (__.isFunction(initialValue))
            initialValue = initialValue(this)
        // initialValue = this.valueOrProp(initialValue, '@initialValue')
        // console.log(9, initialValue)
        return from( this.reduce(f, initialValue) )  }
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
    get condition () { return condition.get(this)  }
    get __ ()        { return Array.from(this)  }  }

const __htmlTag = (o, tag, attr, ...a) =>
    o.push$( HTML[tag](  attr, ...a.map(  v =>
        __.isFunction(v) ? v( new Template(o) ) : v  )) )

class BlazView extends Object$ {
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
    include (name, ...a) { return this.push$(
        __.isUndefined(a)
                     ? cube.include(     this.view, name) :
        a.length === 1 && __.isBlazeElement(a[0])
                     ? cube.includeBlock(this.view, name, () => a) :
        a.length > 1 ? cube.includeAttrBlock(this.view, name, a[0], () => a.slice(1))
                     : cube.includeAttr( this.view, name, a[0])  )}
    id    (v, ...a) { return __htmlTag(this, 'DIV', {id: v},    ...a) }
    class (v, ...a) { return __htmlTag(this, 'DIV', {class: v}, ...a) }
    toHTML () { return HTML.toHTML(this.__) }
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
    return this.push$( 0 === arr.length ? HTML[tag]() : HTML[tag](...arr.into$
        .reduce$( (a,v) => a.append(
            mustacheAttr(v, cube.lookupInView.bind(null, this.view), this.view) ),
            v=>__.isBlazeAttr(v[0]) ? [ blazeAttr(this.view, v.shift()) ].into$ : [].into$ ).value  ))  })


                // arr.slice(1).reduct( (a,v)=> a = a.concat(
                //     mustacheAttr(v, cube.lookupInView.bind(null, this.view), this.view)
                // ), __.isBlazeAttr(obj[0]) ? [])

// let mustache = (_, a) => {
//   let f = cube.lookupInView.bind(null, _)
//   return __.reduce(a, [], (o, v) => __.array(o, mustacheAttr(v, f, _)))  }

  // return __.isArray(a) ? __.reduce(a, [], (o, v) => __.array(o, mustacheAttr(v, f)))
  //                      : mustacheAttr(a, f)  }


// htmlTags.forEach(tag => Template.prototype[tag] = function(...obj) { return this.push$(
//     __.isBlazeAttr(obj[0]) ? //
//       obj.length === 1 ? HTML[tag](blazeAttr(this.view, obj[0]))
//                        : HTML[tag](blazeAttr(this.view, obj[0]), mustache(this.view, obj.slice(1))) :
//       obj.length === 0 ? HTML[tag]()
//                        : HTML[tag](mustache(this.view, obj ))  )})

// let blazeElement = (view, ...arg) => {
//     let it = []
//     __.isBlazeAttr(arg[0]) && it.push(blazeAttr(view, arg.shift() ))
//     it.push(...arg.reduce( (a,v) => a.push$(
//         ...mustacheAttr(v, cube.lookupInView.bind(null, view), view)  ), [].into$).__)
//     return it  }

// htmlTags.forEach(tag =>
//     Template.prototype[tag] = function(...obj) {
//         return this.push$(
//             0 === obj.length ? HTML[tag]() : HTML[tag](...blazeElement(this.view, ...obj))  )})

// let Array$ = v => v instanceof Array$ ? v : new Array$(v)//.concat(v)
class Function$ extends Function {
    constructor (arg, self) {
        super()
        this.type = 'function'
        this.self = self
        object.set(this, arg)  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn)  }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)   }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }
    invoke (...v) { return this.value(...v) }
    get value ()     { return object.get(this)  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return object.get(this)  }  }


class String$ extends String {
    constructor (arg, self) {
        arg = arg instanceof Object$ ? arg.value : arg
        arg = arg instanceof String$ ? arg.value : arg
        super(arg)
        this.self = self
        this.type = 'string' }
    is (str, ...fn) {
        return __is( str.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn)  }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)   }
    prop (...p) { return __prop(this, ...p) }

    path (...str) { // path$
        return new String$( path.join( this.__, ...(str.map(v => v.valueOf())) ) ) }
    __require$ () {
        return new Object$( require(this.__) )  }
    camelize () {
        return this.replace( /-([a-z])/g, (_, $1) => $1.toUpperCase() ) }
    dasherize () {
        return this.replace( /([A-Z])/g,  $1 => '-' + $1.toLowerCase() ) }
    __parseJson$ () {
        return new Object$( JSON.parse(this.__) )  }
    __invoke (f) {
        return f(this.__, this)  }
    __invoke$ (f) {
        return from( this.invoke(f) )  }
    log (...f)       { return __log(this, ...f) }
    get value ()     { return this.valueOf()  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let String$ = v => v instanceof String$ ? v : new String$(v)



class Number$ extends Number {
    constructor (arg) {
        super(arg instanceof Number$ ? arg.__ : arg)
        this.type = 'number'
        property.set(this, {})  }
    is (num, ...fn) {
        return __is( num.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

    get value ()     { return this.valueOf()  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let Number$ = v => v instanceof Number$ ? v : new Number$(v)



class Boolean$ extends Boolean {
    constructor (arg) {
        super(arg instanceof Boolean$ ? arg.__ : arg)
        this.type = 'boolean'
        property.set(this, {})  }
    is (bool, ...fn) {
        return __is( bool.valueOf() === this.__, this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }
    get value ()     { return this.valueOf()  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.valueOf()  }  }

// let Boolean$ = v => v instanceof Boolean$ ? v :new Boolean$(v)
class Date$ extends Date {
    constructor (arg) {
        super(arg)
        this.type = 'date'
        property.set(this, {})  }
    is (v, ...fn) {
        return __is( Object.is(v, this.__), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

}

class Buffer$ extends Buffer {
    constructor (arg) {
        super(arg)
        property.set(this, {})  }
}

class Value {
    constructor (arg) {
        this.value = arg
        this.type = 'value'
        property.set(this, {})  }
    is (v, ...fn) {
        return __is( Object.is(v, this.value), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof(this, type, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

    //get value ()     { return this.valueOf()  }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.value }  }


let from = v => {
    if ( v instanceof Date )     return new Date$    (v)
    // else if ( __.isFunction(v) ) return new Object$  (v, 'function')
    else if ( __.isFunction(v) ) return new Object$  (v, 'function')
    else if ( __.isObject  (v) ) return new Object$  (v, 'object')
    else if ( __.isArray   (v) ) return new Array$   (v)
    //else if ( __.isString  (v) ) return new Object$  (v, 'string')
    else if ( __.isString  (v) ) return new String$  (v)
    else if ( __.isNumber  (v) ) return new Number$  (v) // NaN is not here
    else if ( __.isBoolean (v) ) return new Boolean$ (v)
    else if ( undefined === v || null === v || Object.is(NaN, v) )
        return new Value(v) // null, undefined, NaN,
    else return v  }

let strip = v => {
    if ( v instanceof Object$ ) v = v.value
    if ( v instanceof String$ || v instanceof Function$ ) v = v.value
    return v ? v.valueOf() : v  }

let code = str => new Object$(str[0], 'code')
// let range = (start, end, step) =>
from({
    string:
        [ 'camelize' , 'dasherize'   , 'path'
        , 'charAt'   , 'charCodeAt'  , 'codePointAt' , 'concat'      , 'endsWith'
        , 'includes' , 'indexOf'     , 'lastIndexOf' , 'match'
        , 'padEnd'   , 'padStart'    , 'repeat'      , 'replace'
        , 'search'   , 'slice'       , 'split'       , 'startsWith'  , 'substr' , 'substring'
                     , 'toLowerCase' , 'toUpperCase' , 'trim']
  , function: ['invoke']  })
.forEach(  (v,k)=>
    v.forEach(   w => Object$.prototype[w] = function (...x) {
        return this.reset( this[k][w](...x) )  })  )


let prop = 'into$'
if (prop) {
    Object.defineProperty(  Object.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Object$  (this, 'object') }  })
    Object.defineProperty(  Function.prototype, prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Object$  (this, 'function') }  })
    Object.defineProperty(  String.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Object$  (this, 'string') }  })
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
      , get: function () { return new Object$  (this.toString(), 'buffer') }  })  }


let exported = {
    from:      from
  , code:      code
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
  , function:  v => new Function$(v)
  , date:      v => new Date$(v)
  , object:    v => new Object$(v)
  , array:     v => new Array$(v) // range(1,20) (2,20,3)
  , string:    v => new String$(v)
  , number:    v => new Number$(v)
  , boolean:   v => new Boolean$(v)
  , module:    v => __.Module(v)
  , template:   (v, name) => new Template(v, name)
  , htmlElement: v        => new HtmlElement(v)
  , strip: strip
  , is: __equal
  // , range:     range
  // , IncredifyProperty: augument
  // , fileFrom('hello')
  // return function and property. Is there ES6 way?
}


let meteor = {}
meteor.queryString = o => new Object$(o)
    .carry(  v => v.get('query').into$
        .map( (w,k) => encodeURIComponent(k) + "=" + encodeURIComponent(w) )
        .join( v.__.delimeter || '&' )  )
meteor.getUrlfromSettings = p => {
    // console.log(0, new Object$(__._Settings))
    return new Object$(__._Settings).at(p).into$
    .carry( v => v.__.url + '?' + meteor.queryString(v.__.options) ) }


// if ('undefined' !== typeof Meteor)
exported.meteor = meteor

if ( ! ('in$' in global) )
    global.in$ = exported
global.re = () => {
    delete require.cache[process.env.INCREDIBLES_PATH.into$.path('src','incredibles.js').__ ]
    require('incredibles')  }

module.exports  = exported
