---
title: C++ 常用方法速查：vector、reverse 与 memset
description: 一份 C++ 刷题方法速查，记录 vector 的追加、删除与迭代器用法，以及 bitset、reverse、memset 和 abs 的基本写法，便于回看常用操作。
tags:
  - C++
  - 算法
draft: false
date: 2026-02-05T16:22:31
link: 5513a8e3
categories:
  - 算法
---
C++ 中常用函数和方法的基本写法。



## bitset

```c++
bitset<n>(x) //将x转换为n进制数
```



## vector

```c++
vector<int> a;             //可以自动维护数组长度，适合用在增删查改数组上

vector中的方法：
    a.push_back(n)         //将放入a的最后一位
    a.begin()			   //代指a的第一个数据的位置
    a.end()				   //代指a的最后一个数据的位置
    a.erase(x,y)		   //将a中的x——y范围的数据全部删除，此时vector会自动维护长度
    a.pop_back()		   //将a中的最后一个元素清除
```



## reverse

```c++
reverse(x,y); 					//翻转数组中范围为x——y的元素
```



## memset

```c++
memset(c, 0 ,sizeof(int) * (n + 1) ); //将c中在n+1之前的所有元素更改为0
```



## abs

求绝对值



## sort
