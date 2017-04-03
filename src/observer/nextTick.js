'use strict'
//https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/
let promise = Promise.resolve()
let mutateWithTask
let currTask

module.exports = function nextTick (task) {
  currTask = task
  if (mutateWithTask&&false) {
    mutateWithTask()
  } else {
    promise = promise.then(task)
  }
}

if (typeof MutationObserver !== 'undefined') {
  let counter = 0
  const observer = new MutationObserver(onTask)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {characterData: true})
  mutateWithTask = function mutateWithTask () {
    counter = (counter + 1) % 2
    textNode.textContent = counter
  }
}

function onTask () {
  console.log('running queued observers ======================================')
  if (currTask) {

    currTask()
  }
}
