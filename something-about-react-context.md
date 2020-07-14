## something-about-react-context

React Context Api的两种使用方式

### 1.老版本React-redux 5.x.x 以及之前，使用的便是这种方式

```javascript
class Parent extends Component{
  static childContextTypes = {
    store: proptypes.object
  }
  constructor(props,context){
    super(props,context)
    this.state = props.store
  }
  getChildContext(){
    return {
      store: this.state
    }
  }
  render(){
    return (
      <Child />
    )
  }
}
class Child extends Component{
  static contextTypes = {
    store: proptypes.object
  }
  render(){
    console.log(this.context) // {store:{...}}
    return <div></div>
  }
}


```

### 2.React.createContext (react-redux 在 6.x.x只用便使用的这个方式，没法从子组件中直接获取context了)

```javascript
const Parent = (props) => {
  const Context = React.createContext({a:1,b:2})

  return (
    <Context.Provider>
      <Child />
    </Context.Provider>
  )
}
const Child = (props) => {
  return (
    <Context.Consumer>
      {(context) => {
        return (
          <div>
            <p>{context.a}</p>
            <p>{context.b}</p>
          </div>
        )
      }}
    </Context.Consumer>
  )
}
<Context.Provider value={state}>
  <Context.Consumer>
    {(context)=>{
      return context.a + context.b
    }}
  </Context.Consumer>
</Context.Provider>

```