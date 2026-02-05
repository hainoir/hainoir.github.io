---
title: Java字符串方法
date: 2026-02-05 16:22:31
tags:
- Java
- 算法
categories:
- [Java, 算法]
---

# Java字符串方法

1.equals

eg：

```java
String name = "Bro";

boolean res = name.equals("Bro");

System.out.println(res);
```

equal可以比较两个字符串是否相同，得到的结果是布尔值，即true or false。



2.length

   得到字符串长度



3.charAt

eg:

```java
String name = "hainoir";

char res = name.charAt(0);
```

可得到对应参数的字符，结果是h



4.indexOf

eg:

```java
String name = "hainoir";

int res = name.indexOf(h);
```

可以得到参数字符的位置，结果是0；



5.isEmpty

eg: 

```java
String name = "";

boolean res = name.isEmpty();
```

可以判断字符串是否为空，结果类型是布尔值，得到true；



6.toUpperCase  

eg：

```java
String name = "hainoir";

String res = name.toUpperCase();
```

可以将字符串全部变为大写，即HAINOIR



小写用toLowerCase();





7.trim

将删除字符串中的所有空格



8.replace

eg：

```java
String name = "hainoir";

String res = name.replace('o','a');
```

replace 中的两个参数，将第一个全部替换为第二个，故结果为hainair；









