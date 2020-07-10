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
