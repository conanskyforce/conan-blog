class P {
	static PENDING = 'pending'
	static RESOLVED = 'resolved'
	static REJECT = 'reject'
	constructor(executor) {
		this.value = null
		this.status = 'pending'
		this.callbacks = []
		executor(this.resolve.bind(this),this.reject.bind(this))
	}
	resolve(value){
		if (this.status === P.PENDING) {
			this.status = P.RESOLVED
			this.value = value
			setTimeout(()=>{
				this.callbacks.forEach(callback=>callback.onFulfill(value))
			})
		}
	}
	reject(value){
		if (this.status === P.PENDING) {
			this.status = P.REJECT
			this.value = value
			setTimeout(()=>{
				this.callbacks.forEach(callback=>callback.onReject(value))
			})
		}
	}
	then(onFulfill, onReject){
		if (typeof onFulfill != 'function'){
			onFulfill = x => x
		}if (typeof onReject != 'function'){
			onReject = x => x
		}
		if (this.status === P.RESOLVED) {
			setTimeout(()=>{
				onFulfill(this.value)
			})
		}
		if (this.status === P.REJECT) {
			setTimeout(()=>{
				onReject(this.value)
			})
		}
		if (this.status === P.PENDING) {
			this.callbacks.push({
				onFulfill,
				onReject
			})
		}
	}
}

var p = new P((resolve,reject)=>{
    console.log(2)
	setTimeout(()=>{
		resolve(123)
		console.log(3)
	},1000)
}).then(res=>{
	console.log(res)
})
console.log(1)