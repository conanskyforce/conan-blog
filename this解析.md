> this 是在运行时绑定的

## this 的几种场景

- 1. 默认绑定
```javascript
function foo(){
  console.log(this.a) // 2
}
var a = 2
foo()
```
- 2. 隐式绑定
```javascript
function foo(){
  console.log(this.a) // 23
}
var obj = {
  foo,
  a: '23'
}
obj.foo()
// 隐式绑定绑到的最顶层
function foo() { console.log( this.a );
}
var obj2 = { a: 42, foo: foo };
var obj1 = { a: 2, obj2: obj2 };
obj1.obj2.foo(); // 42
// 隐式绑定丢失this
var c = obj1.obj2.foo;
c() // undefined
```
- 3. 显式绑定
```javascript
function foo(){
  console.log(this.a) // 23
}
var obj = {
  a: '23'
}
foo.call(obj) // 23
foo.apply(obj) // 23

// forEach 的 上下文(?thisArg)
function foo(el) {
  console.log( el, this.id );
}
var obj = {
id: "awesome"
};
// 调用 foo(..) 时把 this 绑定到 obj [1, 2, 3].forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```

- 4. new绑定
```javascript
function foo(){
  console.log(this.a)
  this.a = 'foo' // 2
}
var bar = new foo()
bar.a // foo
```
-----
|方法|类型|
|---|---|
|bind|apply|

----
## 实现一个bind方法

```javascript
var obj = {
  id: "awesome"
};
function bind (fn, obj) {
  return function(){
    fn.apply(obj,arguments)
  }
}
function foo(name){
  console.log(this.id,name)
}
bind(foo,obj)('conan') //awesome conan

Function.prototype.bind = function (oThis) {
  let toBind = this,
      argsOne = Array.prototype.slice.call(arguments,1),
      noop = function(){},
      bindFn = function () {
        return toBind.apply(
          this instanceof noop && oThis ? this: oThis,argsOne.concat(Array.prototype.slice.call(arguments)))
      };
  noop.prototype = this.prototype;
  bindFn.prototype = new noop()
  return bindFn
}
function foo(a,b){
  this.xxx = a + b
}
var a = foo.bind(null,'a')
var b = new a('b')
b.xxx // 'ab'
```















