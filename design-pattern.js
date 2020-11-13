/// ## 设计模式

const { concat } = require("lodash")
const { func } = require("prop-types")


// ### AOP
Function.prototype.before = function(beforeFn){
  const _self = this
  return function(){
    beforeFn.apply(this,arguments)
    return _self.apply(this,arguments)
  }
}

Function.prototype.after = function(afterFn){
  const _self = this
  return function(){
    let ret = _self.apply(this,arguments)
    afterFn.apply(this,arguments)
    return ret
  }
}

function a(){
  console.log(a.name)
}

a.before(function(){
  console.log('before:a')
})
.after((...args)=>{
  console.log('after:a, args:',...args)
})
(1,2,3)

// ### 单例模式

function Singleton(name, age){
  this.name = name
  this.age = age
}
Singleton.prototype.info = function(){
  return this.name + ',' + this.age
}

Singleton.getInstance = function(name,age){
  console.log(this)
  if(!this.instance) {
    this.instance = new Singleton(name,age)
  }
  return this.instance
}
// or 惰性单利，JavaScript中重要程度可能超出你的想象
Singleton.getInstance = (function(...args){
  let instance = null
  return function(){
    if(!instance){
      instance = new Singleton(...args)
    }
    return instance
  }
})()
var conan = Singleton.getInstance('conan',29)
var steven = Singleton.getInstance('steven',59)
conan === steven // true

// version 2
const SingleInstance = (function(){
  let instance
  function CreateInstance(...args){ // 构造函数内容太多，违法了单一职责约束
    if (instance) return instance
    this.args = args
    this.init()
    return instance = this
  }
  CreateInstance.prototype.init = function(){
    instance = CreateInstance
    console.log('only init once')
  }
  return CreateInstance
}())

const a = new SingleInstance('a')
const b = new SingleInstance('b')
a === b // true

// version 3 (代理模式, 职责分离，解耦)
const SingleInstance = function(...args){
  this.args = args
  this.init()
}
SingleInstance.prototype.init = function(){
  console.log('only init once...')
}

const ProxySingleton = (function(){
  let instance = null
  return function(...args){
    if (!instance) {
      instance = new SingleInstance(...args)
    }
    return instance
  }
}())

c = new ProxySingleton('12',3)
d = new ProxySingleton('23','adasd')

// 抽象出通用性惰性单例
const getSingle = (fn) => {
  let instance = null
  return function(){
    return instance || (instance = fn.apply(this,arguments))
  }
}
const single = getSingle((...args)=>console.log(...args))
single()

// ### 策略模式 (定义一系列算法，并将它们一个个封装起来，并使它们可以相互替换)
const performA = salary => salary * 6
const performB = salary => salary * 4
const performC = salary => salary * 2

function Bonus(){
  this.salary = null
  this.strategy = null
}
Bonus.prototype.setStrategy = function(strategy){
  this.strategy = strategy
  return this
}
Bonus.prototype.setSalary = function(salary){
  this.salary = salary
  return this
}
Bonus.prototype.calculate = function(salary){
  return this.strategy(this.salary)
}

const bonus = new Bonus()
bonus.setSalary(2e4)
.setStrategy(performA)
.calculate()

// js版本的策略模式

var strategies = {
  "A": salary => salary * 6,
  "B": salary => salary * 4,
  "C": salary => salary * 2,
}
const calculateBonus = (level, salary) => {
  return strategies[level] && strategies[level](salary)
}
calculateBonus('A', 52000)
calculateBonus('B', 32000)
calculateBonus('C', 12000)

// 缓动算法
var tween = {
  linear: function(t,b,c,d){
    return c * t / d + b
  },
  easeIn: function(t,b,c,d){
    return c * (t /= d ) * t + b
  },
  strongEaseIn: function(t,b,c,d) {
    return c * ( t /= d) * t * t * t * t + b
  },
  strongEaseOut: function(t,b,c,d) {
    return c * ((t = t / d - 1) * t *t *t *t + 1) + b
  },
  sineaseIn: function(t,b,c,d) {
    return c * ( t /= d) * t * t + b
  },
  sineaseOut: function(t,b,c,d) {
    return c * ((t = t / d - 1) * t *t + 1) + b
  }
}
const Animate = function(dom) {
  this.dom = dom // 动画dom节点
  this.startTime = 0 // 动画开始时间
  this.startPos = 0 // 动画开始时dom位置
  this.endPos = 0 // 动画结束时dom位置
  this.propertyName = null // 需要被改变的css属性名
  this.easing = null // 缓动算法
  this.duration = null // 动画持续时间
}
Animate.prototype.start = function(propertyName, endPos, duration, easing){
  this.startTime = +new Date()
  this.startPos = this.dom.getBoundingClientRect()[propertyName] // dom节点初始位置
  this.endPos = endPos
  this.propertyName = propertyName
  this.easing = tween[easing]
  this.duration = duration
  const timer = setInterval(()=>{
    if(this.step() === false){
      clearInterval(timer)
    }
  }, 19)
}
Animate.prototype.step = function(){
  const t = +new Date()
  if (t >= this.startTime + this.duration) {
    this.update(this.endPos)
    return false
  }
  const pos = this.easing(t - this.startTime,this.startPos,this.endPos - this.startPos, this.duration)
  this.update(pos)
}
Animate.prototype.update = function(pos){
  this.dom.style[this.propertyName] = pos + 'px'
}
var div = document.querySelector('.source-box'); 
var animate = new Animate( div );
animate.start( 'top', 500, 2000, 'strongEaseOut' );

// ## 虚拟代理实现图片加载
const myImage = (function(){
  var imgNode = document.createElement('img')
  document.body.appendChild(imgNode)
  return {
    setSrc: (src) => {
      imgNode.src = src
    }
  }
}())
const proxyImage = (function(){
  var img = new Image
  img.onload = () => myImage.setSrc(this.src)
  return {
    setSrc: (src) => {
      myImage.setSrc('xxxx.loading.gif')
      img.src = src
    }
  }
}())

// ## 代理HTTP请求(请求防抖)
const syncFile = (id)=>{
  console.log(`Sync files: id`)
}
const proxySyncFile = (()=>{
  const cache = []
  const timer = null
  return function(id){
    cache.push(id)
    if(timer) return
    timer = setTimeout(()=>{
      syncFile(cache.join(','))
      clearTimeout(timer)
      timer = null
      cache.length = 0
    },2000)
  }
})()

// ## 缓存代理
const multi = () => {
  console.log('start calculate')
  let ret  = 1
  for(let i = 0; i < arguments.length; i++) {
    ret *= arguments[i]
  }
  return ret
}
const proxyMulti = (()=>{
  var cache = {}
  return function(){
    const args = Array.prototype.slice.call(arguments,',')
    if(args in cache) {
      return cache[args]
    }
    return cache[args] = multi.apply(this,args,arguments)
  }
})()

// ## 缓存代理工厂

const createProxyFactory = (fn) => {
  const cache = {}
  return (...args) => {
    let args = Array.prototype.slice.call(arguments,',')
    if(cache[args]) return cache[args]
    return cache[args] = fn.apply(this,arguments  )
  }
}

// ### 迭代器模式

const each = (arr, fn) => {
  for(let i = 0; i < arr.length; i++){
    fn(i, arr[i])
  }
}
each([1, 2, 3, 4, 5], (idx, val) =>console.log(idx, val))

// 外部迭代器
const Iterator = function(obj) {
  var current = 0
  var next = () => {
    current += 1
  }
  var getCurrentItem = () => obj[current]
  var isDone = () => current >= obj.length
  var getIndex = () => current
  return {
    next,
    isDone,
    getCurrentItem,
    getIndex
  }
}

const compareTwo = (iterator1,iterator2) => {
  while (!iterator1.isDone() || !iterator2.isDone()) {
    if (iterator1.getCurrentItem() !== iterator2.getCurrentItem()){
      console.log(`index: ${iterator1.getIndex()}`)
      console.log(`iterator1: ${iterator1.getCurrentItem()},iterator2: ${iterator2.getCurrentItem()}`)
      return false
    }
    iterator1.next()
    iterator2.next()
  }
  return true
}
var it1 = Iterator([1,2,3])
var it2 = Iterator([1,2,3,4,5])
compareTwo(it1, it2)

// ### 发布订阅模式

const EventEmitter =  function() {
  this.listeners = []
}
EventEmitter.prototype.listen = function(fn) {
  this.listeners.push(fn)
}
EventEmitter.prototype.trigger = function(){
  this.listeners.forEach((listenFn,idx) => {
    listenFn.apply(this, arguments)
  })
}
