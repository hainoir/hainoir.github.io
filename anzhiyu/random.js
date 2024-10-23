var posts=["2024/10/23/1.前缀和与差分/","2024/10/23/C++中各类函数的用法/","2024/10/23/Java字符串方法/","2024/10/23/1.创建vite项目/","2024/10/23/2.位运算双指针排序二分/","2024/10/23/vue 中 ref和reactive/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };