var runSomeTimesCost = (task, times = 1e4) => {
	const start = performance.now();

	for (let i = 0; i < times; i++) {
		task()
	}
	const end = performance.now();
	console.log(`Task:${task.name}, Time cost: ${end - start}ms`)
}






















