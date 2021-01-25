// record some design pattern, fun functions...

/**
 * mapLimit run js tasks in concurrent mode
 * @param {task[]} tasks 
 * @param {number} concurrency 
 * @param {function} cb 
 * @param {boolean} showProcess 
 */
const mapLimit = (tasks, concurrency = 5, cb, showProcess) => {
  let index = 0,
    running = 0,
    completed = 0;
  function nextTick() {
    showProcess && (console.log(`running :${running + 1}, process: ${index + 1}/${tasks.length}`))
    while (index < tasks.length - 1 && running < concurrency) {
      const task = tasks[index++]
      running++
      task(() => {
        running--
        completed++
        if (completed >= tasks.length) {
          return cb()
        }
        nextTick()
      })
    }
  }
  nextTick()
}

// ## atob btoa
const btoa = (str) => Buffer.from(str, 'binary').toString('base64')
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8')

btoa('conan')
//"Y29uYW4="
atob("Y29uYW4=")
//'conan'

// ## call
const call = (key, ...args) => (context) => context[key](...args)

Promise.resolve([1, 2, 3])
  .then(call('map', x => x * 2))
  .then(console.log)
// [2,4,6]

const map = call.bind(null, 'map')
Promise.resolve([1, 2, 3])
  .then(map(x => x * 2))
  .then(console.log)
// [2,4,6]

// ## chainAsync 
const chainAsync = fns => {
  let cursor = 0;
  const last = fns.length - 1
  const next = () => {
    const fn = fns[cursor++]
    cursor <= last ? fn(next) : fn()
  }
  next()
}

chainAsync([
  next => {
    console.log('async1')
    setTimeout(next, 1000)
  },
  next => {
    console.log('async2')
    setTimeout(next, 1500)
  },
  () => {
    console.log('sync3')
  }
])


