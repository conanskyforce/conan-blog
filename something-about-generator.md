## something-about-generator(迭代器)

```javascript
function *range(start,end){
	for(let i = start; i < end; i++){
		const res1 = yield i
		const res2 = yield new Promise((resolve,reject)=>setTimeout(resolve,1200))
		const res3 = yield () => 666
		console.log(`response of ${i} is ${res1}`)
		console.log(`response is ${res2}`)
		console.log(`response is ${res3}`)
	}
}
function next(arg,err){
	if(err) return gen.throw(err)
	let { value, done } = gen.next(arg)
	console.log(`getting:${value}`)
	if(done) return value
	if(value && value.then){
		value.then(next).catch(err=>next(null,err))
	} else if(typeof value === 'function'){
		next(value())
	}else{
		next(value * 2)
	}
}
var gen = range(2,10)
next()

- - - - - - - - - - - - 
var fs = require('fs')

var readFile = function (fileName) {
	return new Promise((resolve,reject)=>{
		fs.readFile(fileName,(err,data)=>{
			if(err)reject(err)
			resolve(data)
		})
	})
}

var gen = function * () {
	var f1 = yield readFile('/etc/fstab')
	var f2 = yield readFile('/etc/shells')
	console.log(f1.toString())
	console.log(f2.toString())
}

var generator = gen()

generator.next().value.then((data)=>{
	generator.next(data).value.then(data2=>{
		g.next(data2)
	})
})

```

