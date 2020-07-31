## 栈应用于计算

```javascript
//输入一个算术表达式
var inputStr = '9+(3-1)*3+10/2'
function middle2suffix(inputStr){
	var inputStrExp = inputStr.split(/(''|\d+|\(|\))/g).filter(e=>e)
	var result = ''
	var stack = []
	for(let exp of inputStrExp){
		var pop
		var _top
		if(Number(exp) == exp){
			result += exp + ' '
			continue
		}
		if (exp == '('){
			stack.push(exp)
		} else if( exp == Number(exp)) {
			result += pop + ' '
			continue
		} else if( exp == ')') {
			pop = stack.pop()
			while(pop != '('){
				result += pop + ' '
				pop = stack.pop()
			}	
		} else if (exp == '+' || exp == '-') {
			_top = stack[stack.length -1]
			while(_top == '*' || _top == '/' || _top == '+' || _top == '-') {
				var pop = stack.pop()
				result += pop + ' '
				_top = stack[stack.length -1]
			}
			stack.push(exp)
		} else {
			stack.push(exp)
		}
		console.log(stack.list)
	}
	var pop = stack.pop()
	while(pop){
		result += pop + ' '
		pop = stack.pop()
	}
	return result
}
```
// 输出一个后缀表达式
// console.log(middle2suffix(inputStr))
// '9 3 1 - 3 * + 10 2 / + '

```javascript
// 计算中缀表达式的结果
var evalRPN = (tokens) => {
	if(typeof tokens === 'string'){
		tokens = tokens.split(/\s+/)
	}
	let stack = []
	let num
	for(let token of tokens){
		switch(token){
			case '+':
				stack.push(stack.pop() + stack.pop())
				break;
			case '-':
				num = stack.pop()
				stack.push(stack.pop() - num)
				break;
			case '*':
				stack.push(stack.pop() * stack.pop())
				break;
			case '/':
				num = stack.pop()
				stack.push(parseInt(stack.pop()/num,10))
				break;
			default:
				stack.push(parseInt(token,10))
		}
	}
	return stack.pop()
}
```