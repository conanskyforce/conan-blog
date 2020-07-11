## something-about-redux-and-redux-thunk

```javascript
compose = (f,g) => (...args) =>f(g(...args))

```

```javascript
const reduxThunk = ({dispatch,getState}) => next => action => {
  console.black(`redux-thunk: next`,next)
  console.black(`redux-thunk: action`,action)
  if(typeof action === 'function'){
    return action(dispatch,getState)
  }
  return next(action)
} 

const logger = ({dispatch,getState}) => next => action => {
  console.green('logger: next: ', next)
  console.green('logger: dispatch: ', dispatch)
  console.green(`logger: action:${action.type? action.type: action } start:`,getState())
  next(action)
  console.green(`logger: action:${action.type? action.type: action } end:`,getState())
}

// chain = middlewares.map(middleware=>middleware(middlewareApi))
// chain [reduxThunk,logger]
reduxThunk = next => action => {
	console.black(`redux-thunk: next`,next)
  console.black(`redux-thunk: action`,action)
  if(typeof action === 'function'){
    return action(dispatch,getState)
  }
  return next(action)
}

logger = next => action => {
  console.green('logger: next: ', next)
  console.green('logger: dispatch: ', dispatch)
  console.green(`logger: action:${action.type? action.type: action } start:`,getState())
  next(action)
  console.green(`logger: action:${action.type? action.type: action } end:`,getState())
}

// dispatch = compose(...chain)(store.dispatch)
// - - - - - >
// reduxThunk(logger(store.dispatch))

// logger 的 next 即为 store.dispatch
logger = action => {
  console.green(`logger: action:${action.type? action.type: action } start:`,getState())
  next(action)
  console.green(`logger: action:${action.type? action.type: action } end:`,getState())
}

// reduxThunk 的 next 即为 logger

reduxThunk = action => {
	console.red(`redux-thunk: next`,next)
  console.red(`redux-thunk: action`,action)
  if(typeof action === 'function'){
    return action(dispatch,getState)
  }
  return next(action)
}

// dispatch = reduxThunk(logger(store.dispatch))
```

```javascript
[
 'red',
 'green',
 'black',
].forEach(color => {
	console[color] = (...args) => console.log(`%c ${args[0]}`,`color:white;background-color:${color}`,args.slice(1))
})
```