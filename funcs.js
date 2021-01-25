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

const btoa = (str) => Buffer.from(str, 'binary').toString('base64')
const atob = (str) => Buffer.from(str, 'base64').toString('utf-8')

btoa('conan')
//"Y29uYW4="
atob("Y29uYW4=")
//'conan'