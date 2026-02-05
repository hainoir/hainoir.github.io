---
title: JavaScript 编码原则
date: 2026-02-05 16:22:41
tags:
- JavaScript
- 前端
categories:
- [前端]
---

# JavaScript 编码原则

### 写好JS的一些原则

1. 各司其职

​		让HTML，CSS，Javascript职能分离

2. 组件封装

​		好的UI组件具备正确性、拓展性、复用性。

3. 过程抽象

​		应用函数式编程思维





# 1.各司其责

![image-20241113154710962](C:\Users\hainoir\AppData\Roaming\Typora\typora-user-images\image-20241113154710962.png)

- HTML / CSS / JS 各司其责
- 应当避免不必要的由JS直接操作样式
- 可以用class来表示状态
- 纯展示累交互寻求零JS方案





# 2.组件封装

###### 	组件：指Web页面上抽出来一个个包含模板（HTML）、功能（JS）和样式（CSS）的单元，好的组件具备封装性、正确性、扩展性、复用性。

#### 			1.总结：

#### 基本方法

- #### 结构设计

- #### 展现效果

- #### 行为设计

  - API   （功能）
  - Event  （控制流）



#### 			2.重构

1.插件化

##### 	解耦

- 将控制元素抽取成插件
- 插件与组件之间通过***依赖注入***的方式建立联系



2.模板化

- 将HTML模板化，更易于扩展 （解耦）



3.抽象

- 将通用的组件模型抽象出来



#### 总结：

- 组件设计的原则：封装性、正确性、扩展性、复用性。
- 实现组件的步骤：结构设计、展现效果、行为设计
- 三次重构
  - 插件化
  - 模板化
  - 抽象化（组件框架）



# 3.过程抽象

- 用来处理局部细节控制的一些方法
- 函数式编程思想的基础应用



eg：操作次数限制

- 一些异步交互
- 一次性的HTTP请求

```javascript
Once //为了能够让“只执行一次”的需求覆盖不同的事件处理，我们可以将这个需求剥离出来。这个过程我们称为过程抽象。

funtion once(fn){
	return function(...args){
        if(fn){
			const ret = fn.apply(this, args);
            fn = null;
            return ret;
        }
    };
}
button.addEventListener('click', once((evt)=>{
    const target =evt.target;
    target.parentNode.className ='completed';
    setTimeout(()=>{
        list.removeChild(target.parentNode);
    }，2000);
}));
```



### 	高级函数

##### 1.特点：

- 以函数作为参数
- 以函数作为返回值
- 常用于作为函数修饰器



##### 2.为什么使用高阶函数？

​	减少使用非纯函数的次数，增强可维护性



##### 3.常用的高级函数

- Once
- Throttle
- debounce
- Consumer
- Iterative





#### 	命令式与声明式

eg：命令式：

```javascript
let list = [1, 2, 3, 4];

let mapl = [];

for(let i = 0;i < list.length; i++){
    mapl.push(list[i] * 2);
}
```



eg:声明式：

```js
let list = [1, 2, 3, 4];

const double = x => x * 2;

list.map(double);
```



