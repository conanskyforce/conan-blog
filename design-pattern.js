/// ## 设计模式


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




