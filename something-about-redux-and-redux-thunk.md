## something-about-redux-and-redux-thunk

```javascript
compose = (f,g) => (...args) =>f(g(...args))

```

```javascript
const reduxThunk = ({dispatch,getState}) => next => action => {
  console.log(`%c redux-thunk: next`,'color:white;background-color:green',next)
  console.log(`%c redux-thunk: action`,'color:white;background-color:green',action)
  if(typeof action === 'function'){
    return action(dispatch,getState)
  }
  return next(action)
} 

const logger = ({dispatch,getState}) => next => action => {
  console.log('%c logger: next: ','color:white;background-color:red;', next)
  console.log('%c logger: dispatch: ','color:white;background-color:black;', dispatch)
  console.log(`logger: action:${action.type? action.type: action } start:`,getState())
  next(action)
  console.log(`logger: action:${action.type? action.type: action } end:`,getState())
}

// chain = middlewares.map(middleware=>middleware(middlewareApi))
// chain [reduxThunk,logger]
reduxThunk = next => action => {
	console.log(`%c redux-thunk: next`,'color:white;background-color:green',next)
  console.log(`%c redux-thunk: action`,'color:white;background-color:green',action)
  if(typeof action === 'function'){
    return action(dispatch,getState)
  }
  return next(action)
}

logger = next => action => {
  console.log('%c logger: next: ','color:white;background-color:red;', next)
  console.log('%c logger: dispatch: ','color:white;background-color:black;', dispatch)
  console.log(`logger: action:${action.type? action.type: action } start:`,getState())
  next(action)
  console.log(`logger: action:${action.type? action.type: action } end:`,getState())
}

// dispatch = compose(...chain)(store.dispatch)
// - - - - - >
// reduxThunk(logger(store.dispatch))

// reduxThunk 的 next 即为 store.dispatch
logger = action => {
	console.log('%c logger: next: ','color:white;background-color:red;', next)
  console.log('%c logger: dispatch: ','color:white;background-color:red;', dispatch)
  console.log(`logger: action:${action.type? action.type: action } start:`,getState())
  next(action)
  console.log(`logger: action:${action.type? action.type: action } end:`,getState())
}

// reduxThunk 的 next 即为 logger

reduxThunk = action => {
	console.log(`%c redux-thunk: next`,'color:white;background-color:green',next)
  console.log(`%c redux-thunk: action`,'color:white;background-color:green',action)
  if(typeof action === 'function'){
    return action(dispatch,getState)
  }
  return next(action)
}

// dispatch = reduxThunk(logger(store.dispatch))
```