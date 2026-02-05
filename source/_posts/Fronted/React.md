---
title: React
date: 2026-02-05 16:22:41
tags:
- React
- 前端
categories:
- [前端]
---

# React



#### 一.Effect

##### 1. 概念

在 React 中，Effect 指的是在组件渲染过程之外发生的一切事情。也就是说，任何 React 不直接处理的与渲染 UI 相关的操作。

> 常见的例子包括获取数据、更新浏览器标签页的标题、读取或写入浏览器的本地存储、获取用户的位置等。这些操作与外部世界进行交互，被称为副作用。

##### 2.使用方法

首先需要导入

```react
import { useEffect } from "react";
```

然后像函数一样使用它

```react
useEffect(()=>{
	// Your side effect logic (usually a function) here
},[dependencies]);
```

`useEffect`内的逻辑/函数，在组件渲染后运行，而可选的`dependencies`参数控制这个`useEffect`何时运行。



1. `dependencies`

注意` dependencies `可以是一个包含"响应式值"（state, props, functions, variables, and so on）的数组，也可以是一个空数组，或者完全省略。下面是这些选项如何控制` useEffect `的行为：

- 如果 `dependencies `是一个包含一个或多个响应式值的数组，那么该`effect`将在这些值发生变化时运行。

```react
useEffect(() => {
  document.title = `The current count is ${count}`;
  console.log('component renders');
}, [count]);
```



- 如果` dependencies `是一个空数组，` useEffect `仅在组件首次渲染时运行一次。

```react
useEffect(() => {
  console.log('Component renders');
}, []);
```



- 如果你省略` dependencies `，`useEffect`会在每次组件渲染或更新时运行。

```react
import { useState, useEffect } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component renders");
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h2>{count}</h2>
      <div>
        <button onClick={() => setCount(count + 1)}>Increase</button>
        <button onClick={() => setCount(count - 1)}>Decrease</button>
      </div>
    </div>
  );
};

export default Counter;
```



#### 二.创建自定义Hook

1. ##### 创建的理由

React 提供了许多内置的钩子，使你能够在项目中实现不同的功能。这些包括 `useState` ， `useEffect` ， `useContext` ，等等。

自定义钩子并不像它们看起来那么复杂。它们只是可重用的函数，让你能够在多个组件之间共享逻辑。

- 需要添加一个内置钩子无法实现的功能
- 可重用性



2. ##### 创建的好处

- 将任何使用它们的组件中的逻辑提取出来

> like data fetching, state management, toggling, side effects like checking for the online or offline status of users, and so on.

- 在任何组件中导入这个钩子，这样你就可以专注于这些组件中的渲染和展示。

> 这意味着更少的重复和复制，当你需要进行任何更新时，修改的地点也会更少。



3. ##### 使用方法

接下来，创建一个 `useDebounce` 函数，它接受 `value` 和 `delay` 作为参数。 `value` 是你想要等待的资源， `delay` 是你希望等待的时间段。由于你希望等待一段时间， `setTimeout` 和 `clearTimeout` 函数会很有用：

```react
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export { useDebounce };
```

