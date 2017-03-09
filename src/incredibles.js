
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
const __carry = (self, f) => {
    let ret
    result.set(self, ret = f(self, property.get(self)))
    return ret  }

const __prop = (o, ...args) => { // property { writable: true watch: f(k, oval, nval) value: }
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
    o instanceof Object$ ?
        keys.length === 1 ? o.get(keys[0]) : __get( o.get(keys[0]), ...keys.slice(1) ) :
        keys.length === 1 ? o[keys[0]]     : __get( o[keys[0]],     ...keys.slice(1) )

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

const __log = (o, ...args) => {
    if (args.length > 1) console.log( ...args, o.__ )
    else if (args.length === 1)
        if ('function' === typeof args[0]) console.log( args[0](o) )
        else console.log( args[0], o.__ )
    else console.log( o.__ )
    return o   }

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



// Function.prototype.typeof = (type, ...fn) => __typeof('function', type, this, ...fn)
// Function.prototype.is = (f, ...fn) => __is(f.toString === this.toString, this, fn)
// String.prototype.into$ = function() { return new String$(this) }


let object   = new WeakMap()
let property = new WeakMap()
let descriptor = new WeakMap()
class Map$ extends Map {
    constructor (arg) {
        super(arg)  }
    typeof (type, ...fn) {
        return __typeof( 'map', type, this, ...fn )  }
}

let bind     = new Map$()

/**
 * @class {Object$}
 * @example in$({a:1, b:2, c:3}).keys() => ['a', 'b', 'c']
 * @method keys
 * @return {Array$} keys of the Object$
 */

class Object$ extends Object {
    constructor (arg) {
        super()
        arg = arg instanceof Object$ ? arg.__: arg || {}
        // Object.assign(this, arg)
        property.set(this, {}) // Yes. arg can be an array.
        object.set(this, arg)  }
    is (obj, ...fn) {
        return __is( __equal(this.__, obj), this.__, ...fn)  }
    typeof (type, ...fn) {
        return __typeof( 'object', type, this, ...fn )  }
    if (f)      { return __if(this, f)      }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)   }
    log (...f)  { return __log(this, ...f)  }
    prop (...p) { return __prop(this, ...p) }
    propWatch    (p, f) { return __propWatch(this, p, f)    }
    propWritable (p, f) { return __propWritable(this, p, f) }
    backup (...p)  {
        p.forEach(  v =>
            __prop(this, '@prop:' + v, this.at(v) )  )
        return this  }
    restore (...p) {
        p.forEach(  v =>
            this.setAt( v, __prop(this, '@prop:' + v) )  )
        return this  }
    remove (...p)  {
        p.forEach(  v =>
            this.backup(v).delete(v)  )
        return this  }
    // restoreAll () { return this.restore( ...this.keys() ) }
    removeAll ()  { return this.remove ( ...this.keys() ) }
    delete (...keys) {
        if ( keys.length > 1 ) keys.map( v => delete this.__[v] )
        else delete this.__[ keys[0] ]
        return this  }

    add (...o) {
        return __add(this, ...o)  }

    set (key, value) {
        //this[key] = value Object.assign
        object.get(this)[key] = value
        return this  }
    setAt (key, value) {
        if (key.indexOf('.') === -1) return this.set(key, value)
        let k = key.split('.')

        let o0 = this.get(k[0])
        o0 = this.set(k[0], o0 ||
            (Number(k[1]).toString() === k[1] ? [] : {}) ).get(k[0])
        o0 = new Object$(o0)
        k.length === 2 ?
            __set (o0, k[1], value) : o0.setAt(k.slice(1).join('.'), value)
        return this  }
    dset (...v) { return this.setAt(...v) }
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

    __get$ (...key) {    // for object
        return from( this.get(...key) )  }
    get (...key) {
        // key.length > 3 & console.log(0, object.get(this))
        let k = object.get(this)[ key[0] ]
        return key.length > 1 ? __get(k, ...key.slice(1)) : k  }
    __dget$ (...key) {
        return from( this.at(...key) )  }
    at (...key) {
        return this.get( ...key.join('.').split('.') )  }
    dget (...key) { return this.at(...key) }
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
        let ret = new Object$()
        for (let p in this.__)
            if ( f(this.get(p), p, this) )
                ret.set(p, this.get(p))
        return ret  }
    reduce (f, init) {
        let accumulator = init
        for (let p in this.__)
            accumulator = f( accumulator, this.get(k), k, this)
        return accumulator  }
    keys ()    { return Object.keys( this.__ ) }
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
    copy$ (o)   {
        o = o || {}
        return new Object( Object.assign(o, this.__, Object.assign({}, o)) )  }
    stringify$ (...args) { return new String$( JSON.stringify(this.__, ...args) ) }
    invokeProperties (self) { // invokeProperties invokeProperties
        this.forEach(  (v,k) => this.set(  k,
            __.isFunction(v) ? v(self) :
            __.isObject(v)   ? __invokeProperties(v, self) : v  ))
        return this  }
    // valueOf ()       { return this.__  }
    invoke (f)  {
        console.log(20, this.__, f)
        return f(this.__) }
    invoke$ (f) {
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
    get dot ()       { return property.get(this) }
    get firstKey ()  { return this.keys()[0] }
    get lastKey ()   { return this.keys()[ this.size() - 1 ] }
    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return object.get(this)  }  }

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


class XmlValue extends Object$ {
    constructor (arg) {
        super(arg)
        object.set(this, arg instanceof Object$ ? arg.__: arg || {}) // why?
            }
    value (...p) {
        // console.log(10, this.__)
        // console.log(...p.join('.').split('.').reduce( (a,v) => a.concat(v, 0), [] ) )
        return this.at( ...p.join('.').split('.').reduce( (a,v) => a.concat(v, 0), [] ))  }
    toSet (...p) {
        return [ this.value(...p) ]  }
}


class HtmlElement extends Object$ {
    constructor (arg) {
        super(arg)  }
    appendChild (...v) {
        this.__.appendChild(...v)
        return this  }
    addEventListener (...v) {
        this.__.addEventListener(...v)
        return this}
}

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
        this.prop('@root').remove(p)
        return this  }
    restoreElement (p) {
        this.prop('@root').restore(p)
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
        return this.findEvery( p, (v, w) => w.delete(p) )  }
}

//{Style: {"$id": "pline", LineStyle:{color: "ff00ff", width: 4} } }

class Array$ extends Array {
    constructor (arg) {
        super()
        property.set(this, {}) // write error if arg is object.
        let value = arg instanceof Array$ ? arg.__ : arg || []
        this.prop('@value', value)
        if (value)
            for(let i = 0; i < value.length; i++)
                this[i] = value[i]  }
    is (a, ...fn) {
        return __is(  __equal(this.__, a.valueOf() ), this, ...fn ) }
    typeof (type, ...fn) {
        return __typeof('array', type, this, ...fn) }
    if   (f)    { return __if  (this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)   { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }    // ... is to tell between prop('p', undefined) or prop('p')
    propInvoke (p, f)   { return __prop(this, p, f(this)) }
    propWatch  (p, f)   { return __propWatch(this, p, f)    }
    propWritable (p, b) { return __propWritable(this, p, b) }
    propPush () {}
    propPop () {}
    propShift () {}
    propUnshift () {}
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
    __indexOf (f) { // findIndex
        let fn
        if ( __.isFunction(f) ) fn = f
        else fn = arg => arg === f
        for (let i = 0; i < this.length; i++)
            if ( fn(this[i], i, this) ) return i
        return -1  }

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
        initialValue = this.valueOrProp(initialValue, '@initialValue')
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
    valueOf () { return this.__ }
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
        .if( v=>__.isBlazeAttr(v[0]) )
        .then( v=>v.prop('@initialValue', [ blazeAttr(this.view, v.shift()) ].into$) )
        .propSetIf('@initialValue', [].into$)
        .reduce$( (a,v) => a.append(
            mustacheAttr(v, cube.lookupInView.bind(null, this.view), this.view) ) ).__  ))  })


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
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

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
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }

    path (...str) { // path$
        return new String$( path.join( this.__, ...(str.map(v => v.valueOf())) ) ) }
    require$ () {
        return new Object$( require(this.__) )  }
    camelize () {
        return this.replace( /-([a-z])/g, (_, $1) => $1.toUpperCase() ) }
    dasherize () {
        return this.replace( /([A-Z])/g,  $1 => '-' + $1.toLowerCase() ) }
    parseJson$ () {
        return new Object$( JSON.parse(this.__) )  }
    invoke (f) {
        return f(this.__, this)  }
    invoke$ (f) {
        return from( this.invoke(f) )  }
    log (...f)       { return __log(this, ...f) }
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
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

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
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

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
        property.set(this, {})  }
    is (v, ...fn) {
        return __is( Object.is(v, this.value), this, ...fn )  }
    typeof (type, ...fn) {
        return __typeof('variable', type, this, ...fn)  }
    if   (f)    { return __if(  this, f)    }
    then (f)    { return __then(this, f)    }
    else (f)    { return __else(this, f)    }
    else_if (f) { return __else_if(this, f) }
    carry (f)    { return __carry(this, f)    }
    prop (...p) { return __prop(this, ...p) }
    log (...f)  { return __log(this, ...f)  }

    get result ()    { return result.get(this)  }
    get condition () { return condition.get(this)  }
    get __ ()        { return this.value }  }


let from = v => {
    if ( v instanceof Date )     return new Date$    (v)
    else if ( __.isFunction(v) ) return new Function$(v)
    else if ( __.isObject  (v) ) return new Object$  (v)
    else if ( __.isArray   (v) ) return new Array$   (v)
    else if ( __.isString  (v) ) return new String$  (v)
    else if ( __.isNumber  (v) ) return new Number$  (v) // NaN is not here
    else if ( __.isBoolean (v) ) return new Boolean$ (v)
    else if ( undefined === v || null === v || Object.is(NaN, v) )
        return new Value(v) // null, undefined, NaN,
    else return v  }

// let range = (start, end, step) =>


let prop = 'into$'
if (prop) {
    Object.defineProperty(  Object.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new Object$  (this) }  })
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
      , get: function () { return new Boolean$ (this) }  })
    Object.defineProperty(  Buffer.prototype,   prop, {
        enumerable:   false
      , configurable: true
      , get: function () { return new String$ (this.toString()) }  })  }


let exported = {
    from:      from
  , Map$:      Map$
  , Object$:   Object$
  , Array$:    Array$
  , Function$: Function$
  , Date$:     Date$
  , String$:   String$
  , Number$:   Number$
  , Boolean$:  Boolean$
  , Value:     Value
  , Xml:       Xml
  , map:       v => new Map$(v)
  , function:  v => new Function$(v)
  , date:      v => new Date$(v)
  , object:    v => new Object$(v)
  , array:     v => new Array$(v) // range(1,20) (2,20,3)
  , string:    v => new String$(v)
  , number:    v => new Number$(v)
  , boolean:   v => new Boolean$(v)
  , xml:       v => new Xml(v)
  , xmlValue:  v => new XmlValue(v)
  , module:    v => __.Module(v)
  , template:   (v, name) => new Template(v, name)
  , htmlElement: v        => new HtmlElement(v)
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

module.exports  = exported
