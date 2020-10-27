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
