var posts=["2025/04/14/1.前缀和与差分/","2025/04/14/1-前缀和与差分/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };