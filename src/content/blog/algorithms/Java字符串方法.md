---
title: Java 字符串方法速查
description: 通过简短示例整理 Java 字符串的比较、长度、字符访问、位置查找、判空、大小写转换、trim 与替换方法，记录常见返回值及调用形式。
tags:
  - Java
  - 算法
draft: false
date: 2026-02-05T16:22:31
link: b324aa57
categories:
  - 算法
---
## equals：比较字符串

eg：

```java
String name = "Bro";

boolean res = name.equals("Bro");

System.out.println(res);
```

equal可以比较两个字符串是否相同，得到的结果是布尔值，即true or false。



## length：获取长度

   得到字符串长度



## charAt：访问字符

eg:

```java
String name = "hainoir";

char res = name.charAt(0);
```

可得到对应参数的字符，结果是h



## indexOf：查找位置

eg:

```java
String name = "hainoir";

int res = name.indexOf(h);
```

可以得到参数字符的位置，结果是0；



## isEmpty：判断空字符串

eg: 

```java
String name = "";

boolean res = name.isEmpty();
```

可以判断字符串是否为空，结果类型是布尔值，得到true；



## 大小写转换

eg：

```java
String name = "hainoir";

String res = name.toUpperCase();
```

可以将字符串全部变为大写，即HAINOIR



小写用toLowerCase();





## trim

将删除字符串中的所有空格



## replace：替换字符

eg：

```java
String name = "hainoir";

String res = name.replace('o','a');
```

replace 中的两个参数，将第一个全部替换为第二个，故结果为hainair；









