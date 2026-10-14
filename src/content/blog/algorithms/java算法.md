---
title: Java 数论基础：最大公约数、最小公倍数与素数
description: 汇总 Java 中最大公约数、最小公倍数、素数判断与素数筛的基础模板，对照递归求 gcd、试除法判断素数和批量预处理素数的实现。
tags:
  - Java
  - 算法
draft: false
date: 2026-02-05T16:22:31
link: 2f8a531c
categories:
  - 算法
---
## 最大公约数 gcd

```java
public static int gcd(int x,int y)
{
    return y==0?x:gcd(y,x%y);
}
```

## 最小公倍数 lcm

```java
public static int lcm(int a, int b) 
{
        return a / gcd(a, b)*b;
}
```

## 判断素数

```java
public static boolean isPrime2(int n) {
	if (n <= 3) {
		return n > 1;
	}
	int sqrt = (int) Math.sqrt(n);
	for (int i = 2; i <= sqrt; i++) {
		if (n % i == 0) {
			return false;
		}
	}
	return true;
}
```

## 素数筛：批量预处理

```java
for(int i = 2;i < v.length;++i) 
		{
			if(v[i] == 0) 
			{
				list.add(i);
				for(int j = i * i;j < v.length;j+=i) 
				{
					v[j] = 1;
				}
			}
		}
```



