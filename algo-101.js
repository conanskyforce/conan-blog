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

// 原地翻转(reverse)字符串
var O1ReverseChar = (charArr) => {
	let len = charArr.length;
	let mid = Math.floor(len/2);
	for(let i=0;i<=mid;i++){
		// 可以改成解构
		let tmp = charArr[i];
		charArr[i] = charArr[len - 1 - i];
		charArr[len - 1 - i] = tmp;
	}
	return charArr
}

var O1ReverseChar2 = (charArr) => {
	for(let i=0;i<charArr.length/2;i++){
		[charArr[i],charArr[charArr.length -1 - i]] = [charArr[charArr.length -1 - i],charArr[i]]
	}
	return charArr
}

// 第一个不重复字符串
var singleLit = (char) => {
	for(let a of char){
		if(char.indexOf(a) === char.lastIndexOf(a)){
			return char.indexOf(a)
		}
	}
	return -1
}

var singleLit2 = (char) => {
	let hash = {}
	for(let a of char){
		hash[a]?(hash[a] += 1): (hash[a] = 1)
	}
	for(let i = 0; i < char.length; i++){
		if(hash[char[i]] == 1) return i
	}
	return -1
}

// 回文
var isPalinDrome = (str) => {
	str = str.toLowerCase();
	let tmp = str.replace(/[^\d\w]/g,'')
	return tmp.split('').reverse().join('') == tmp
}

// 字符串匹配多字符串
// 给定 haystack = 'hello world', needle = 'll' 2
// 返回2
var strStr = (haystack,needle) => {
	let reg = new RegExp(needle);
	let mt = reg.exec(haystack)
	return mt ? mt.index : -1
}

var strStr2 = (haystack,needle) => {
	if(needle === '') return 0
	if(needle.length > haystack.length) return -1
	if(needle.length === haystack.length){
		if(needle === haystack) return 0
		return -1
	}
	for (let i = 0; i < haystack.length - needle.length; i++) {
		if(haystack[i] !== needle[0]){
			continue
		}
		if(haystack.substring(i,i + needle.length) === needle){
			return i
		}
	}
	return -1
}

// 最长公共前缀
// 输入: ["flower","flow","flight"]
// 输出: "fl"

var longestCommonPrefix = (arr) => {
	let arr1 = arr[0]
	let tmp = ''
	for(let a of arr1){
		if(arr.every(ar=>ar.indexOf(a)!=-1)){
			tmp += a
		}
	}
	return tmp
}
longestCommonPrefix(["flower","flow","flight"])

// 最长回文
// 输入: "babad"
// 输出: "bab"
// 注意: "aba" 也是一个有效答案
var longestPanlindrome = (s) => {
	const dp = []
	for(let i = 0; i < s.length;i++){
		dp[i] = []
	}
	let max = -1, str = '';
	for(let l = 0; l < s.length; l++){
		// l为所遍历的子串长度 - 1，即左下标到右下标的长度
		for(let i = 0; i + l < s.length; i++){
			const j = i + l;
			// i为子串开始的左下标，j为子串开始的右下标
			if(l === 0){
				// 当子串长度为1时，必定是回文子串
				dp[i][j] = true;
			} else if (l <=2){
				// 长度为2或3时，首尾字符相同则是回文子串
				if(s[i] === s[j]){
					dp[i][j] = true
				} else {
					dp[i][j] = false
				}
			} else {
				// 长度大于3时，若首尾字符相同且去掉首尾之后的子串仍为回文，则为回文子串
				if((s[i] === s[j]) && dp[i+1][j-1]){
					dp[i][j] = true
				} else {
					dp[i][j] = false
				}
			}
			if (dp[i][j] && l > max) {
				max = l;
				str = s.substring(i, j + 1)
			}
		}
	}
	return str
}
longestPanlindrome('ddffnnsddsnn')


// 罗马字符转数字

var rome2Number = (rome) => {
	let ret = 0
	for (let i = 0; i < rome.length; i++) {
		switch(rome[i]){
			case 'M':
				ret += 1000;
				break;
			case 'D':
				ret += 500;
				break;
			case 'L':
				ret += 50;
				break;
			case 'V':
				ret += 5;
				break;
			case 'C':
				if(rome[i+1] === 'D'){
					ret += 400
					i += 1
				} else if(rome[i+1] === 'M'){
					ret += 900
					i += 1
				} else {
					ret += 100
				}
				break;
			case 'X':
				if(rome[i+1] === 'L'){
					ret += 40
					i += 1
				} else if(rome[i+1] === 'C'){
					ret += 90
					i += 1
				} else {
					ret += 10
				}
				break;
			case 'I':
				if(rome[i+1] === 'V'){
					ret += 4
					i += 1
				} else if(rome[i+1] === 'X'){
					ret += 9
					i += 1
				} else {
					ret += 1
				}
				break;
		}
	}
	return ret
}

// 输入:"III"
// 输出:3
//
// 输入:"IV"
// 输出:4
//
// 输入:"LVIII"
// 输出:58
//
// 输入:"MCMXCIV"
// 输出:1994

var fizzBuzz = (n) => {
	let ret = []
	for (let i = 1; i <= n; i++) {
		if(i%3 === 0 && i % 5 ===0){
			ret.push('FizzBuzz')
		} else if( i % 3 === 0){
			ret.push('Fizz')
		} else if( i % 5 === 0){
			ret.push('Buzz')
		} else{
			ret.push(i)
		}
	}
	return ret
}

// 统计质数
// 输入:10
// 输出:4
// 解释: 小于 10 的质数一共有 4 个, 它们是 2,3,5,7 。
var primes = (n) => {
	let ret = []
	function isPrime(x){
		let prime = true;
		for(let i = 2; i <= Math.sqrt(x); i++){
			if(x % i == 0){
				prime = false
			}
		}
		return prime;
	}
	for(let i = 2; i< n;i++){
		if(isPrime(i)){
			ret.push(i)
		}
	}
	return ret
}
