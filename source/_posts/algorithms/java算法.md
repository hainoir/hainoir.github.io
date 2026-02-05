---
title: java算法
date: 2026-02-05 16:22:31
tags:
- Java
- 算法
categories:
- [Java, 算法]
---

1.最大公约数gcd

```java
public static int gcd(int x,int y)
{
    return y==0?x:gcd(y,x%y);
}
```

2.最小公倍数lcm

```java
public static int lcm(int a, int b) 
{
        return a / gcd(a, b)*b;
}
```

3.素数

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

4.素数筛（预处理素数）

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



