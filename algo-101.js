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























