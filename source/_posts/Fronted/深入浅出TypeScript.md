---
title: 深入浅出TypeScript
tags:
  - TypeScript
  - 前端
categories:
  - - 前端
abbrlink: e86ee304
date: 2026-02-05 16:22:41
---

# 深入浅出TypeScript

### 1.为什么要学TS

|                   TypeScript                   |           JavaScript           |
| :--------------------------------------------: | :----------------------------: |
| JavaScript的超集，用于解决大型项目的代码复杂性 | 一种脚本语言，用于创建动态网页 |
|           强类型，支持静态和动态类型           |         动态弱类型语言         |
|          可以在编译期间发现并纠正错误          |      只能在运行时发现错误      |
|            不允许改变变量的数据类型            |    变量可以被赋值成不同类型    |

#### 特性

- 类型安全
- 下一代JS特性
- 完善的工具链



js的缺点：

1. 数据类型
2. 逻辑问题
3. 访问不存在的属性
4. 拼写错误不提示



# 编译Typescript

#### 一.命令行编译

1.创建`.ts`文件

2.全局安装typescript

```shell
pnpm i typescript -g
```

3.使用`tsc`命令编译

```shel
tsc index.ts
```



#### 二.自动化编译

1.创建`tsconfig.json`文件

```shell
tsc --init
```

2.监视目录中.ts的文件变化

```shell
tsc --w
```



### 2. TS基础

1. 基础类型

```ts
1.boolean,number,string
2.枚举enum
3.any，unknown，void
4.never
5.数组类型[]
6.元组类型tuple
```



2.类型声明

使用`:`来对变量或函数形参，进行类型声明：

```ts
let a: string
funtion(x:number, y:number):number {
	return x+y
}
let res = funtion(1,2)
```

`:`也可以给变量附加上字面型变量，但不常见

```ts
let s:'hello' （无法改变）
```



3.类型推断

`TS`会根据我们的代码进行类型推导

```ts
let d = 99 //ts会推断变量d的类型是数字
d = false //警告：不能将类型"boolean"分配给类型"number"
```

> 类型推断不是万能的，面对复杂类型时推断容易出问题，尽量明确编写类型声明



4.interface 接口

```ts
定义：接口是为了定义对象类型
特点：
	-可选属性
	-只读属性：readonly
	-可以描述函数类型
	-可以描述自定义属性
```



5.类

```ts
定义：写法和JS差不多，增加了一些定义
特点：
	-增加了public，private，protected等修饰符
	-抽象类；
		-只能被继承，不能被实例化
		-作为基类，抽象方法必须被子类实现
	-interface约束类，使用implements关键字
	
```



### 3.TS进阶

##### 1.高级类型

1. 联合类型	|

   ```ts
   let num: number | string
   num = 8
   num = 'eight'
   ```

   

2. 交叉类型	&		

   ```ts
   interface Person {
   	name: string
   	age: number
   }
   
   type Student= Person & { grade: number }
   
   const stu:Student
   stu.//age
   	//grade
   	//name
   ```

3. 类型断言

4. 类型别名（type VS interface）

```ts
-定义：给类型起个别名
-相同点：
	1.都可以定义函数或对象
	2.都允许继承
-差异点：
	1.interface是TS用来定义对象，type时用来定义别名方便使用；
	2.type可以定义基本类型，interface不行；
	3.interface可以合并重复声明，type不行；
	
---相同点
	interface Person1 {
		name: string
		age: number
	}
	
	type Person2 = {
		name: string
		age: number
	}
	
	const person1:Person1 = {
		name:'lin,
		age: 18
	}
	
	const person2:Person2 = {
		name:'lin',
		age: 18
	}
	
	
	
---不同点
1.
interface Person {
	name: string
}
interface Person {
	age: number
}
const person: Person = {
	name :'lin',
	age:18
}

2.
type Person = {//Person报错
	name:string
}
type Person = {//Person报错
	age: number
}
const person : Person = {
    name: 'lin',
    age:18//整条报错
} 
```



2. ##### 泛型

   ```ts
   基本定义：
   1.泛型的语法是<>里面写类型参数
   2.使用时有两种方法指定类型：
   	1.定义要使用的类型
   	2.通过TS类型推断，自动推导类型
   !3.泛型的作用时临时占位，之后通过传来的类型进行推导；
   
   //
   function print<T>(arg: T): T {
       console.log(arg);
       return arg;
   }
   
   print<string>('hello') // 定义T为 string
   
   print('hello') //TS 类型推断，自动推导类型为string
   
   ```

   基础操作符

   - typeof：获取类型
   - keyof：获取所有键
   - in：遍历枚举类型
   - T[K]：索引访问
   - extends：泛型约束

   常用工具类型

   - Partial<T>: 将类型属性变为可选
   - Required<T> : 将类型属性变为必选
   - Readonly<T> : 将类型属性变为只读

   ​	
   
   

### 4.TS实战

1. 声明文件

   - declear：三方库需要类型声明文件
   - .d.ts：声明文件定义
   - @types：三方库TS类型包
   - tsconfig.json：定义TS的配置

   

2.  泛型约束后端接口类型

```ts
import axios from 'axios'

interface API {
    'book/detail': {
        id: number,
    },
    'book/comment': {
        id: number
        comment: string
    }
}

function request<T extends keyof API>(url: T,obj : API[T]){
    return axios.post(url, obj)
}

request('book/comment' , {
    id: 1,
    comment: 'good'
})
```



## 5.ts常用类型

##### 一.any

`any`的含义是：任意类型。一旦将变量类型限制为`any`，意味着***放弃了***对该变量的类型检查。

```ts
let a
a = 99 
a = false

let b: string //any的坑害
b = a //将一个boolean赋值给string类型
console.log(b)//结果为“false”
```

 

##### 二.unknown

`unknown`:未知类型

1. 可以理解为一个类型安全的 `any`
```ts
let a: unknown
a = 99 
a = false

let b: string
b = a //warning: 不能将类型‘unknown’分配给类型‘string’
```
2. 会强制开发者在使用前进行类型检查，可以通过类型判断或类型断言的方式实现安全操作变量

```ts
let a: unknown
a = 1

let x: string
x = a //Type unknown is not assignable to type string

//第一种方法：类型判断
if(typeof a === "string"){
    x = a
}
//第二种方法：类型断言
x = a as string
//第三种方法：类型断言
x = <string>a
```

```ts
let str3: unknown
str3 = "hello"
(str3 as string).toUpperCase()
```



### 3. never

`never`:任何值都不是,不能有值。

1. 几乎不使用`never`,对变量赋值无意义。

```ts
let a: never
// 任何赋值都无意义
```

2. `never`﻿一般是﻿TypeScript﻿主动推断出来的

```ts
let a: string
a = "hello"

if(typeof a === "string"){
    console.log(a)
}else{
    console.log(a) //a: never
}
```

3. `never`可用于限制函数的返回值(如抛出错误的情况)，表示函数不能结束，或者不能正常结束。

```ts
function throwError(str:string):never{
    throw new Error('程序异常退出'+str)
}
```



### 4. void

`void`:用于函数返回值声明，表示函数返回值为空。

1. 函数返回值为空，调用者也不应该依赖其返回值进行任何操作。

```ts
const logMsg = (msg:string):void =>{
    console.log(msg)
}
logMsg('TS你好')
```

> 注意：编码者没有编写return﻿指定函数返回值，所以﻿logMessage﻿函数是没有显式返回值的，但会有一个隐式返回值 ，是`﻿undefined`﻿。虽然函数返回类型为﻿`void﻿`，但也是可以接受undefined﻿的，简单记： ﻿`undefined﻿`是﻿`void`﻿可以接受的一种“空”。

1. 对函数返回值声明为`void`的函数，TS接受如下写法

```ts
// 无警告
function logMessage(msg:string):void{
console.log(msg)
}
// 无警告
function logMessage(msg:string):void{
console.log(msg)
return;
}
// 无警告
function logMessage(msg:string):void{
console.log(msg)
return undefined
}
```

1. **返回值类型为﻿void﻿的函数，调用者不应依赖其返回值进行任何操作！**:理解来说,被`void`声明的函数返回值,TS希望开发者从语义层面上不要关注其返回值,不期望依赖该函数用于其他的操作。

```ts
function logMessage(msg:string):void{
console.log(msg)
}
let result = logMessage('你好')
if(result){ // 此行报错：无法测试 "void" 类型的表达式的真实性
console.
function logMessage(msg:string):undefined{
console.log(msg)
}
let result = logMessage('你好')
if(result){ // 此行无警告
console.log('logMessage')
```

**理解 void 与 undefined:**
`void﻿`是一个广泛的概念，用来表达“空”，而 ﻿`undefined﻿`则是这种“空”的具体
实现。
因此可以说 `﻿undefined`﻿是﻿`void﻿`能接受的一种“空”的状态。
也可以理解为： `void`﻿包含`﻿undefined`﻿，但﻿`void﻿`所表达的语义超越了﻿`undefi ned﻿`， ﻿`void﻿`是一种意图上的约定，而不仅仅是特定值的限制。

**总结:**

如果一个函数返回类型为`void`﻿，那么：

1. 从语法上讲：函数是可以返回`undefined﻿`的，至于显式返回，还是隐式返回，这无所谓！
2. 从语义上讲：函数调用者不应关心函数返回的值，也不应依赖返回值进行任何操作！即使我们知道它返回了`undefined﻿`。



### 5.object

#### object与Object

- `object`:所有非原始类型，可存储对象，函数，数组等。
- `Object`:所有可以调用 Object﻿方法的类型，即除了`undefined`和`null`的任何值

```ts
let a:object //a的值可以是任何【非原始类型】，包括：对象、函数、数组等
// 以下代码，是将【非原始类型】赋给a，所以均符合要求
a = {}
a = {name:'张三'}
a = [1,3,5,7,9]
a = function(){}
a = new String('123')
class Person {}
a = new Person()
// 以下代码，是将【原始类型】赋给a，有警告
a = 1 // 警告：不能将类型“number”分配给类型“object”
a = true // 警告：不能将类型“boolean”分配给类型“object”
a = '你好' // 警告：不能将类型“string”分配给类型“object”
a = null // 警告：不能将类型“null”分配给类型“object”
a = undefined // 警告：不能将类型“undefined”分配给类型“object”


let b:Object //b的值必须是Object的实例对象（除去undefined和null的任何值）
// 以下代码，均无警告，因为给a赋的值，都是Object的实例对象
b = {}
b = {name:'张三'}
b = [1,3,5,7,9]
b = function(){}
b = new String('123')
class Person {}
b = new Person()
b = 1 // 1不是Object的实例对象，但其包装对象是Object的实例
b = true // truue不是Object的实例对象，但其包装对象是Object的实例
b = '你好' // “你好”不是Object的实例对象，但其包装对象是Object的实例
// 以下代码均有警告
b = null // 警告：不能将类型“null”分配给类型“Object”
b = undefined // 警告：不能将类型“undefined”分配给类型“Object”
```

#### 声明类型

##### 声明对象类型

1. 对象类型字面量

```ts
// 限制person1对象必须有name属性，age为可选属性
let person1: { name: string, age?: number }
// 含义同上，也能用分号做分隔
let person2: { name: string; age?: number }
// 含义同上，也能用换行做分隔
let person3: {
name: string
age?: number
}
// 如下赋值均可以
person1 = {name:'李四',age:18}
person2 = {name:'张三'}
person3 = {name:'王五'}
// 如下赋值不合法，因为person3的类型限制中，没有对gender属性的说明
person3 = {name:'王五',gender:'男'}
```

1. 索引签名：允许定义对象可以具有**任意数量**的属性，这些属性的键和类型是**可变的**。常用于：描述类型不确定的属性，（具有动态属性的对象）。

```ts
// 限制person对象必须有name属性，可选age属性但值必须是数字，同时可以有任意数
量、任意类型的其他属性
let person: {
name: string
age?: number
[key: string]: any // 索引签名，完全可以不用key这个单词，换成其他的也可以
}
// 赋值合法
person = {
name:'张三',
age:18,
gender:'男'
}
```

##### 声明函数类型

**函数类型注解**

```ts
let count: (a: number, b: number) => number
count = function (x, y) {
return x + y
}
```

> - TypeScript 中的﻿=>﻿在函数类型声明时表示函数类型，描述其参数类型和返回类型。
> - JavaScript 中的﻿=>﻿是一种定义函数的语法，是具体的函数实现。

##### 声明数组类型

```ts
//类型声明
let arr: string[]
//泛型定义
let arr2: Array<string>
```



### 6.tuple

`Tuple`是一种特殊的数组类型，可以存储**固定数量**的元素，并且每个元素的类型是**已知**的且**可以不同**。元组用于精确描述一组值的类型，` ?`﻿表示可选元素。

```ts
// 第一个元素必须是 string 类型，第二个元素必须是 number 类型。
let arr1: [string,number]
// 第一个元素必须是 number 类型，第二个元素是可选的，如果存在，必须是 boolean 类型。
let arr2: [number,boolean?]
// 第一个元素必须是 number 类型，后面的元素可以是任意数量的 string 类型
let arr3: [number,...string[]]
// 可以赋值
arr1 = ['hello',123]
arr2 = [100,false]
arr2 = [200]
arr3 = [100,'hello','world']
arr3 = [100]
// 不可以赋值，arr1声明时是两个元素，赋值的是三个
arr1 = ['hello',123,false]
```

### 7.enum

`enum﻿`:枚举，定义一组命名常量，它能增强代码的可读性，也让代码更好维护。也可以指定枚举成员的初始值，其后的成员值会自动递增。

```ts
enum Direction {
    Up,
    Down,
    Left,
    Right
}
```

- **数字枚举**:数字枚举一种最常见的枚举类型，其成员的值会自动递增，且数字枚举还具备反向映射的特点，在下面代码的打印中，不难发现：可以通过值来获取对应的枚举成员名称 。好处是语义性更强，便于维护。

```ts
// 定义一个描述【上下左右】方向的枚举Direction
enum Direction {
Up,
Down,
Left,
Right
}
console.log(Direction) // 打印Direction会看到如下内容
/*
{
0:'Up',
1:'Down',
2:'Left',
3:'Right',
Up:0,
Down:1,
Left:2,
Right:3
}
*/
// 反向映射
console.log(Direction.Up)
console.log(Direction[0])
// 此行代码报错，枚举中的属性是只读的
Direction.Up = 'shang'
```

- **字符串枚举**:同理,枚举成员的值是字符串
- **常量枚举:** 常量枚举是一种特殊枚举类型，它使用 const﻿关键字定义，在编译时会被内联，避免生成一些额外的代码，推荐使用。

> **何为编译时内联？**
> 所谓“内联”其实就是 TypeScript 在编译时，会将枚举成员引用替换为它们的实际值，而不是生成额外的枚举对象。这可以减少生成JavaScript 代码量，并提高运行时性能。

```ts
enum Directions {
Up,
Down,
Left,
Right
}
let x = Directions.Up;


"use strict";
let x = 0 /* Directions.Up */;
```



### 8.type

`type`:为任何类型创建别名,让代码更简洁,可读性更强；同时更方便的进行类型复用和扩展。

1. **类型别名**:使用 type﻿关键字定义， ﻿type﻿后跟类型名称，即类型别名。

```ts
type num = number;
let price: num
price = 100
```

2. **联合类型**:联合类型是一种高级类型，它表示一个值可以是几种不同类型之一。

```ts
type Status = number | string
type Gender = '男' | '女'
function printStatus(status: Status) {
console.log(status);
}
function logGender(str:Gender){
console.log(str)
}
printStatus(404);
printStatus('200');
printStatus('501');
logGender('男')
logGender('女')
```

3. **交叉类型**:允许将多个类型合并为一个类型。合并后的类型将拥有所有被合并类型的成员。交叉类型通常用于对象类型。

```ts
//面积
type Area = {
height: number; //高
width: number; //宽
};
//地址
type Address = {
num: number; //楼号
cell: number; //单元号
room: string; //房间号
};
// 定义类型House，且House是Area和Address组成的交叉类型
type House = Area & Address;
const house: House = {
height: 180,
width: 75,
num: 6,
cell: 3,
room: '702'
};
```



### 9.特殊情况

使用**类型声明**限制函数返回值为void﻿时， ﻿TypeScript﻿并不会严格要求函数返回空。

- 为什么?
- 是为了确保如下代码成立，我们知道 ﻿`Array.prototype.push`﻿ 的返回值是一个数字，而 `Array.prototype.forEach`﻿方法期望其回调的返回类型是﻿`void`﻿。

```ts
type LogFunc = () => void

const f1: LogFunc = () => {
 return 100; // 允许返回⾮空值
};
const f2: LogFunc = () => 200; // 允许返回⾮空值

const f3: LogFunc = function () {
 return 300; // 允许返回⾮空值
};
```

```ts
const src = [1, 2, 3];
const dst = [0];
src.forEach((el) => dst.push(el))
```



### 10.属性修饰符

| 修饰符      | 含义     | 具体规则                           |
| ----------- | -------- | ---------------------------------- |
| `public`    | 公开的   | 可以被**类内部、子类、类外部**访问 |
| `protected` | 受保护的 | 可以被**类内部、子类**访问         |
| `private`   | 私有的   | 可以被**类内部**访问               |
| `readonly`  | 只读属性 | 属性无法修改                       |



### 11.抽象类

**定义:** 抽象类是一种无法被实例化的类，专门用来定义类的结构和行为，类中可以写抽象方法，也可以写具体实现。抽象类主要用来为其派生类提供一个基础结构，要求其派生类必须实现其中的抽象方法。

**简单来说:** 抽象类不能实例化，其意义是可以被继承，抽象类里可以有普通方法、也可以有抽象方法。

```ts
abstract class Package{
    // 构造方法
    constructor(
        public weight:number
    ){

    }
    // 抽象方法
    abstract calculate():number
    // 具体方法
    printPackage(){
        console.log(`包裹重量为:${this.weight}\n运费为:${this.calculate()}`)
    }
}

class StandardPackage extends Package{
    constructor(
        weight:number,
        public unitPrice:number

    ){
        super(weight)
    }
    calculate(): number {
        return (this.weight * this.unitPrice)
    }
}

const pkg1 = new StandardPackage(10,5)
pkg1.printPackage()
```

**总结:何时使用抽象类**

1. **定义通用接口**:为一组相关的类定义通用的行为（方法或属性）时。
2. **提供基础实现:** 在抽象类中提供某些方法或为其提供基础实现，这样派生类就可以继承这些实现。
3. **确保关键实现:** 强制派生类实现一些关键行为。
4. **共享代码和逻辑:** 当多个类需要共享部分代码时，抽象类可以避免代码重复。



### 12.interface

`interface`﻿:一种定义结构的方式，主要作用是为：类、对象、函数等规定一种契约，这样可以确保代码的一致性和类型安全，但要注意interface﻿只能定义格式，不能包含任何实现 ！

- 定义类结构

```ts
interface PersonInterface {
name: string
age: number
speak(n: number): void
}
// 定义一个类 Person，实现 PersonInterface 接口
class Person implements PersonInterface {
constructor(
public name: string,
public age: number
) { }
// 实现接口中的 speak 方法
speak(n: number): void {
for (let i = 0; i < n; i++) {
// 打印出包含名字和年龄的问候语句
console.log(`你好，我叫${this.name}，我的年龄是${this.age}`);
}
}
}
// 创建一个 Person 类的实例 p1，传入名字 'tom' 和年龄 18
const p1 = new Person('tom', 18);
p1.speak(3)
```

- 定义对象结构

```ts
interface UserInterface {
name: string
readonly gender: string // 只读属性
age?: number // 可选属性
run: (n: number) => void
}
const user: UserInterface = {
name: "张三",
gender: '男',
age: 18,
run(n) {
console.log(`奔跑了${n}米`)
}
};
```

- 定义函数结构

```ts
interface CountInterface {
(a: number, b: number): number;
}
const count: CountInterface = (x, y) => {
return x + y
}
```

- **接口继承:** 使用`extends`关键字实现接口继承
- 接口自动合并

```ts
// PersonInterface接口
interface PersonInterface {
// 属性声明
name: string
age: number
}
// 给PersonInterface接口添加新属性
interface PersonInterface {
// 方法声明
speak(): void
}
// Person类实现PersonInterface
class Person implements PersonInterface {
name: string
age: number
// 构造器
constructor(name: string, age: number) {
this.name = name
this.age = age
}
// 方法
speak() {
console.log('你好！我是老师:', this.name)
}
}
```

> **何时使用接口**:
>
> 1. **定义对象格式:** 描述数据类型、API响应格式、配置对象……
> 2. **类的契约:** 规定一个类需要视线的哪些方法和属性
> 3. **扩展已有接口:** 一般用于扩展第三方库的类型



### 13.相似概念的区别

#### 13.1 interface 与 type 的区别

- **相同点:** interface﻿和﻿type﻿ 都可以用于定义对象结构，在定义对象结构时两者可以互换。
- **不同点:**
  1. `interface`:更专注于定义对象和类的结构，支持继承、合并。
  2. `type`:可以定义**类型别名**、**联合类型**、**交叉类型**，但不支持继承和自动合并。

简言之，对于需要复杂继承和扩展的类型，推荐使用`interface`&`extends`实现继承。

#### 13.2 interface与抽象类的区别

- **相同点:** 都用于定义一个类的格式 
- **不同点:**

​    1. 接口:只能描述结构,不能有任何实现代码，一个类可以有多个接口。

​    2. 抽象类:既可以包含抽象方法，也可以包含具体方法，一个类只能继承一个抽象类。



## 八.泛型

**定义：** 泛型运行我们在定义函数，类或接口时，使用类型参数来表示未指定的类型，这些参数在具体使用时，才被指定具体的类型，泛型能让同一段代码适用于多种类型，同时仍然保持类型的安全性。

### 泛型函数

```ts
function logData<T>(data:T){
    console.log(data)
}
logData<number>(100)
logData<string>('Hi')
```

注:泛型可以有多个

### 泛型接口

```ts
interface PersonInterface<T>{
    name:string,
    age:number,
    extraInfo:T
}
let p:PersonInterface<string>
```

注:泛型接口本身也可以嵌套

### 泛型类

```ts
class Person<T> {
constructor(
public name: string,
public age: number,
public extraInfo: T
) { }
speak() {
console.log(`我叫${this.name}今年${this.age}岁了`)
console.log(this.extraInfo)
}
}
// 测试代码1
const p1 = new Person<number>("tom", 30, 250);
// 测试代码2
type JobInfo = {
title: string;
company: string;
}
const p2 = new Person<JobInfo>("tom", 30, { title: '研发总监', company: '发发发
科技公司' });
```

### 泛型约束

```ts
interface LengthInterface {
length: number
}
// 约束规则是：传入的类型T必须具有 length 属性
function logPerson<T extends LengthInterface>(data: T): void {
console.log(data.length)
}
logPerson<string>('hello')
// 报错：因为number不具备length属性
// logPerson<number>(100) 
```

## 九.类型声明文件

类型声明文件是 TypeScript 中的一种特殊文件，通常以﻿.d.ts﻿ 作为扩展名。它的主要作用
是为现有的 JavaScript 代码提供类型信息，使得 TypeScript 能够在使用这些 JavaScript 库
或模块时进行类型检查和提示。

在浏览器引入脚本时,注明类型`type:module`

```ts
// demo.js
export function add(a, b) {
return a + b;
}
export function mul(a, b) {
return a * b;
}
```
