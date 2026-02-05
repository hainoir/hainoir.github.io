---
title: C++中各类函数的用法
tags:
  - C++
  - 算法
categories:
  - - C++
    - 算法
abbrlink: 5513a8e3
date: 2026-02-05 16:22:31
---

# C++中各类函数和方法的用法



### 1.bitset

```c++
bitset<n>(x) //将x转换为n进制数
```



### 2.vector

```c++
vector<int> a;             //可以自动维护数组长度，适合用在增删查改数组上

vector中的方法：
    a.push_back(n)         //将放入a的最后一位
    a.begin()			   //代指a的第一个数据的位置
    a.end()				   //代指a的最后一个数据的位置
    a.erase(x,y)		   //将a中的x——y范围的数据全部删除，此时vector会自动维护长度
    a.pop_back()		   //将a中的最后一个元素清除
```



### 3.reverse

```c++
reverse(x,y); 					//翻转数组中范围为x——y的元素
```



### 4.memset

```c++
memset(c, 0 ,sizeof(int) * (n + 1) ); //将c中在n+1之前的所有元素更改为0
```



### 5.abs()

求绝对值



### 6.sort()
