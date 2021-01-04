/// ## 设计模式

const { concat, templateSettings } = require("lodash")
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

var e = new EventEmitter()
e.listen(() => {console.log('1')})
e.listen((...args) => {console.log(args)})
e.trigger(1,2,3)
// = = = = = = = = = = = = = = = = = = = = 
class EventEmitter {
  constructor(){
    this.listeners = {}
    this.on = this.listen.bind(this)
  }
  listen(name, fn) {
    if(!this.listeners[name]){
      this.listeners[name] = []
    }
    this.listeners[name].push(fn)
  }
  trigger (name,...args) {
    if (this.listeners[name]) {
      this.listeners[name].forEach(fn => {
        fn.apply(this, args)
      })
    }
  }
  off(name,fn){
    try {
      this.listeners[name] = this.listeners[name].filter(listen => listen != fn)
    } catch (err) { console.log(err) }
  }
}

var e = new EventEmitter()
e.listen('log',() => {console.log('1')})
e.listen('log',(...args) => {console.log(args)})
const logFn = () =>alert(123)
e.on('log',logFn)
e.off('log',logFn)
e.trigger(1,2,3)
e.trigger('log',1,2,3)

// ### 命令模式（利用command对象，解耦请求者 和 接受者）

const setCommand = (button, command) => {
  button.onclick = () => command.execute()
}

const menuBar = {
  refresh : () => console.log('刷新菜单')
}
const subMenu = {
  add: () => console.log('增加子菜单'),
  del: () => console.log('删除子菜单')
}
const MenuBarCommand = function(receiver){
  this.receiver = receiver
}
MenuBarCommand.prototype.execute = function(){
  this.receiver.refresh()
}
const AddSubMenu = function(receiver){
  this.receiver = receiver
}
AddSubMenu.prototype.execute = function(){
  this.receiver.add()
}
const DelSubMenu = function(receiver){
  this.receiver = receiver
}
DelSubMenu.prototype.execute = function(){
  this.receiver.del()
}
const menuBarCommand = new MenuBarCommand(menuBar)
const addSubMenu = new AddSubMenu(subMenu)
const delSubMenu = new DelSubMenu(subMenu)

setCommand(button1, menuBarCommand)
setCommand(button2, addSubMenu)
setCommand(button3, delSubMenu)

// ### Macro 宏命令
const closeDoorCommand = {
  execute: () => console.log('关门')
}
const closeWindowCommand = {
  execute: () => console.log('关窗')
}
const openLight = {
  execute: () => console.log('开灯')
}
const openTV = {
  execute: () => console.log('开电视')
}
const MacroCommand = function() {
  const commands = []
  return {
    add: (command) => commands.push(command),
    execute: () => {
      commands.forEach(command => command.execute())
    }
  }
}
const macroCommand = MacroCommand()
macroCommand.add(closeDoorCommand)
macroCommand.add(closeWindowCommand)
macroCommand.add(openLight)
macroCommand.add(openTV)
macroCommand.execute()

// ### 组合模式 (用小的子对象来构建大对象，而这些小的子对象本身可以由更小的孙对象组成)

const Folder = function(name) {
  this.name = name
  this.parent = null
  this.files = []
}
Folder.prototype.add = function(file){
  file.parent = this
  this.files.push(file)
}
Folder.prototype.scan = function(){
  console.log('开始扫描文件夹')
  for(let i = 0 ,files, files = this.files;file = files[i++];) {
    file.scan()
  }
}
Folder.prototype.remove = function(){
  if(!this.parent) return
  const files = this.parent.files
  let len = files.length
  for ( len ; len > 0;len-- ) {
    const file = files[len]
    if (file === this) { files.splice(len, 1) }
  }
}

const File = function(name){
  this.name = name
}
File.prototype.add = () => new Error('文件下边不能再添加文件！')
File.prototype.scan = function(){
  console.log('开始扫描文件！')
}
File.prototype.remove = function(){
  if(!this.parent) return
  const files = this.parent.files
  let len = files.length
  for ( len ; len > 0;len-- ) {
    const file = files[len]
    if (file === this) { files.splice(len, 1) }
  }
}

const folder = new Folder('学习')
const folder2 = new Folder('写作')
const folder3 = new Folder('JavaScript')

const file = new Folder('JavaScript.pdf')
const file1 = new Folder('重构2.0.pdf')

folder1.add(file)
folder2.add(file)
folder2.add(file1)
folder.add(folder3)
folder.add(folder2)

// ### 享元模式 (共享支持大量细粒度的对象)

const Model = function(sex, underwear){
  this.sex = sex
  this.underwear = underwear
}
Model.prototype.takePhoto = function(){
  console.log('sex:',this.sex,' underware:',this.underwear)
}
for(let i = 0; i < 50; i++){
  var maleModel = new Model('male', 'underware'+i)
  maleModel.takePhoto()
}
for(let i = 0; i < 50; i++){
  var femaleModel = new Model('female', 'underware'+i)
  femaleModel.takePhoto()
}
// 需要新建100个对象

var maleModel = new Model('male', 'underware'+i)
for(let i = 0; i < 50; i++){
  maleModel.underwear = 'underware'+i
  maleModel.takePhoto()
}
var femaleModel = new Model('female', 'underware'+i)
for(let i = 0; i < 50; i++){
  maleModel.underwear = 'underware'+i
  femaleModel.takePhoto()
}

// 只需要创建2对象
// 将内部状态想同的对象指定为同一个共享对象，将外部状态从对象身上剥离出来，并储存在外部
// 共享达到性能优化的目的
// ### 对象池（共享资源池（buffer池））

const toolTipFactory = (function(){
  const toolTipPool = []
  return {
    create: () => {
      if(toolTipPool.length === 0){
        const div = document.createElement('div')
        document.body.appendChild(div)
        return div
      } else {
        return toolTipPool.unshift()
      }
    },
    recover: (toolTipDom) => {
      return toolTipPool.push(toolTipDom)
    }
    }
  }
)()
// ### 通用对象池
const objectPoolFactory = (createFn) => {
  const objectPool = []
  return {
    create: (...args) => {
      const obj = objectPool.length === 0 ?
        createFn.apply(this, args): objectPool.shift()
      return obj
    },
    recover: (obj) => objectPool.push(obj)
  }
}
const iframeFactory = objectPoolFactory(function(){
  const iframe = document.createElement('iframe')
  document.body.appendChild(iframe)
  iframe.onload = function(){
    iframe.onload = null
    iframeFactory.recover(iframe)
  }
  return iframe
})
const iframe1 = iframeFactory.create()
iframe1.src = 'https://www.baidu.com'
const iframe2 = iframeFactory.create()
iframe2.src = 'https://www.zhihu.com'

setTimeout(() => {
  const iframe3 = iframeFactory.create()
  iframe3.src = 'https://163.com'
}, 3000)

// ### 职责链模式（请求经过一系列对象，在其中依次传递，直到遇到一个可以处理他的对象）

const order500 = (orderType, pay, stock) => {
  if(orderType === 1 && pay === true) {
    console.log('order500类型')
  } else {
    order200(orderType, pay, stock)
  }
}
const order200 = (orderType, pay, stock) => {
  if(orderType === 2 && pay === true) {
    console.log('order200类型')
  } else {
    orderNormal(orderType, pay, stock)
  }
}
const orderNormal = (orderType, pay, stock) => {
  console.log('orderNormal')
}

// 职责链模式修改耦合
const order500 = (orderType, pay, stock) => {
  if(orderType === 1 && pay === true) {
    console.log('order500类型')
  } else {
    return 'nextSuccessor'
  }
}
const order200 = (orderType, pay, stock) => {
  if(orderType === 2 && pay === true) {
    console.log('order200类型')
  } else {
    return 'nextSuccessor'
  }
}
const orderNormal = (orderType, pay, stock) => {
  console.log('orderNormal')
}

function Chain(fn){
  this.fn = fn
  this.successor = null
}
Chain.prototype.setNextSuccessor = function(successor){
  return this.successor = successor
}
Chain.prototype.passRequest = function(){
  const ret = this.fn.apply(this, arguments)
  if(ret === 'nextSuccessor'){
    return this.successor && this.successor.passRequest.apply(this.successor,arguments)
  }
  return ret
}

const chainOrder500 = new Chain(order500)
const chainOrder200 = new Chain(order200)
const chainOrderNormal = new Chain(orderNormal)

chainOrder500.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(chainOrderNormal)

chainOrder500.passRequest(1, true, 500)
chainOrder500.passRequest(2, false, 500)

// 如果要增加order300类型
const order300 = function(orderType, pay, stock){
  if(orderType === 5 && pay === false){
    console.log('order300')
  } else {
    return 'nextSuccessor'
  }
}
const chainOrder300 = new Chain(order300)
chainOrder500.setNextSuccessor(chainOrder300)
chainOrder300.setNextSuccessor(chainOrder200)
chainOrder200.setNextSuccessor(orderNormal)

// 异步职责链

Chain.prototype.next = function(){
  return this.successor && this.successor.passRequest.apply(this.successor, arguments)
}

// 请求不用知道自己和N个接受者的关系，只用传递给第一个节点即可

// 利用js的AOP实现职责链

Function.prototype.after = function(fn){
  const self = this
  return function(){
    const ret = self.apply(this,arguments)
    if (ret === 'nextSuccessor'){
      return fn.apply(this, arguments)
    }
    return ret
  }
}
order500.after(order200).after(orderNormal)

// 中介者模式 (解除对象与对象之间的耦合吗，多对多的关系改为多对一的关系，hub，迪米特法则，最少知识原则，尽可能少的需要了解外部对象)

function Player(name, teamColor) {
  this.name = name
  this.teamColor = teamColor
  this.state = 'alive'
}

Player.prototype.win = function(){
  console.log(this.name + ' won')
}
Player.prototype.lose = function(){
  console.log(this.name + ' lose')
}
Player.prototype.die = function(){
  this.state = 'died'
  playerDirector.receiveMessage('playerDead',this) // 向中介者发送消息
}
Player.prototype.remove = function(){
  playerDirector.receiveMessage('playerRemove',this) // 向中介者发送消息
}
Player.prototype.changeTeam = function(color){
  playerDirector.receiveMessage('changeTeam',this, color) // 向中介者发送消息
}
var playerFactory = function(name, teamColor){
  var newPlayer = new Player(name, teamColor)
  playerDirector.receiveMessage('addPlayer', newPlayer)
  return newPlayer
}
var playerDirector = (function(){
  var players = {}
  var operations = {}
  operations.addPlayer = function(player){
    var teamColor = player.teamColor
    players[teamColor] = players[teamColor] || []
    players[teamColor].push(Player)
  }
  operations.removePlayer = function(player){
    var teamColor = player.teamColor
    var teamPlayers = players[teamColor] || []
    for(var i = teamPlayers.length - 1; i >= 0; i--){
      if(teamPlayers[i] === player){
        teamPlayers.splice(i, 1)
      }
    }
  }
  operations.changeTeam = function(player, newTeamColor){
    operations.removePlayer(Player)
    player.teamColor = newTeamColor
    operations.addPlayer(player)
  }
  //...
  var receiveMessage = function(){
    var message = Array.prototype.shift.call(arguments)
    operations[message].apply(this, arguments)
  }
  return {
    receiveMessage
  }
}())

// 装饰者模式 (给对象动态增加职责、方法的模式)

var Plane = function(){}
Plane.prototype.fire = function(){
  console.log('Normal')
}
var MissileDecorator = function(plane) {
  this.plane = plane
}
MissileDecorator.prototype.fire = function(){
  this.plane.fire()
  console.log("Missile")
}

var AtomDecorator = function(plane) {
  this.plane = plane
}
AtomDecorator.prototype.fire = function(){
  this.plane.fire()
  console.log("Atom")
}

var p = new Plane()
var mP = new MissileDecorator(p)
var aP = new AtomDecorator(mP)
aP.fire()

// 不影响原本对象的执行，透明，
