var runSomeTimesCost = (task, times = 1e4) => {
	const start = performance.now();

	for (let i = 0; i < times; i++) {
		task()
	}
	const end = performance.now();
	console.log(`Task:${task.name}, Time cost: ${end - start}ms`)
}
// O(1) 时间复杂度
var _1 = () => {
	Math.random()
}
// O(n) 时间复杂度
var n1 = (n = 1e3) => {
	let i = 0;
	while(++i < n){
		Math.random()
	}
}
// O(n^2) 时间复杂度
var n2 = (n = 1e3) => {
	let i = 0, j = 0;
	while(++i < n){
		while(++j < n){
			Math.random()
		}
	}
}
// O(log(n)) 时间复杂度
var logN = (n = 1e3) => {
	let i = 0, j = 0;
	while(i < n){
		Math.random()
		i += 2
	}
}

// 递归的斐波拉契数列 时间复杂度（O(2^n)）.好复杂的呀\\(^o^)/~
var fib = (n) => {
	if (n === 1 || n === 0) {
		return 1
	}
	return fib(n - 1) + fib(n - 2)
}

// 复杂度依次上升 O(1),O(logN),O(n),O(nlogN),O(n^2),O(2^n),O(n!)

// 翻转数字
var reverseNum = (num) => parseInt((num+'').split('').reverse().join(''))
var reverseNum2 = (x) => {
	let num = Math.abs(x)
	let tmp = 0;
	while(num != 0){
		tmp = num % 10+ tmp * 10;
		num = Math.floor(num/10)
	}
	return x > 0? tmp: -tmp
}

// 有效字母异位词
// 输入: s = "anagram", t = "nagaram"
// 输出: true
var isAnagram = (a,b) => {
	if(a.length != b.length) return false
	return a.split('').sort().join('') == b.split('').sort().join('')
}

var isAnagram = (a,b) => {
	if(a.length != b.length) return false
	let hash = {};
	for(const i of a){
		hash[i]?(hash[i]+=1):(hash[i] = 1)
	}
	for(const i of b){
		if(!hash[i]) return false
		hash[i] -= 1
	}
	return true
}























