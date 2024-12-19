---
title: 数论基础
date: 2024-09-13
tags: ['number-theory', 'mathematics']
authors: ['Maya']
ai: false
---

# GCD, 模运算与同余

## 欧几里得算法

在算法的学习中，我们经常会遇到对大数求GCD(Greatest Common Divider，最大公因数)的情况，如果挨个试除就太慢了，此时我们就需要使用**辗转相除法**来加速这一过程，这个方法也叫欧几里得算法。

模数有如下性质：$(a*b)\ mod \ p=((a\ mod \ p)*(b \ mod \ p))\ mod\ p$

## 同余及其性质

如果a是一个整数，n是正整数，则我们定义a除以n所得到的余数就是a模n。其中n称为模数。如果$(a\ mod\ n)=(b\ mod \ n )$
此时我们称a与b是模n同余的，记为$a\equiv b(mod \ n)$

同余有如下的性质：

1. 若n|(a-b), 则$a\equiv b(mod \ n)$
2. 若$a\equiv b(mod \ n)$, 则 $b\equiv a(mod \ n)$
3. 若$a\equiv b(mod \ n)$, 且$b\equiv c(mod \ n)$, 则$a\equiv c(mod \ n)$

# 素数

素数是数论的核心，素数指它的因子只有1和它本身，任何一个非素数都可以表示为

$$ a= \prod \limits\_{p \in P} p^{a_p}, a_p \geq 0$$

其中P表示所有的素数，其中大部分的$a_p$都是0。

# 费马定理和欧拉定理

## 费马定理

费马定理一种有用的表示形式是：
若p是素数且a是任意的正整数，则

$$a^p\equiv a \ mod \ p$$

具体剁成这里不做证明，举个例子来说就是
a=3, p=5时，$3^5=243\ mod\  5 = 3$且$3\  mod\  5 = 3$

## 欧拉函数

欧拉函数$\phi(n)$，指小于n且与n互素的正整数的个数，习惯上令$\phi(1)=1$。
欧拉函数有如下的性质：

对于素数n, $\phi(n)=n-1$

如果两个素数$p$和$q$，对于$n=pq$，有$ \phi(n)=\phi (pq)=\phi (p)_\phi (q)=(p-1)_(q-1)$

## 欧拉定理

欧拉定理说明，对任意互素的a和n，有

$$a^{\phi(n)} \equiv 1(mod \ n)$$

举个例子来说，

$$a=3;n=10;\phi(10)=4;a^{\phi(n)}=3^4=81\equiv 1\  mod \ 10 = 1(mod \ n)$$

类似于费马定理，欧拉定理还有另一种表示形式，

$$a^{\phi(n)+1}\equiv a(mod \ n)$$

此时不要求a与p互素。

## 素性测试

那我们应该如何迅速构造一个很大的素数呢？截至本文编写时，还有每一种较好的常用算法能够一定确定构造一个大素数。但是我们有一种算法可以几乎可以肯定构造一个大素数，那就是Miller-Rabin算法。

### Miller-Rabin算法

Miller-Rabin算法就是通过使用素数的性质进行简单校验，能够在比较快的时间内确定一个大数不是素数，但不能确定是素数，思想比较类似于布隆过滤器。

对于任何一个大于1的奇数，都可以表示为 $n-1=2^kq,k > 0,q是奇数$。

结合上面的几个定理，我们就可以快速的判断一个大数不是素数的情况，C++示例代码如下：

```cpp
bool MillerRabinTest(const std::int64_t n) {
  // find k,q that satisfies n-1 == (2^k) * q
  std::int64_t temp = n;
  temp--;
  std::int64_t k = 0;
  while (temp % 2 == 0) {
    temp /= 2;
    k++;
  }
  std::int64_t q = n;
  // randomly choose a integer a, 1 < a < n-1
  std::mt19937_64 rng(
      std::chrono::steady_clock::now().time_since_epoch().count());
  std::uniform_int_distribution<std::int64_t> range(1, n - 1);
  std::int64_t a = range(rng);
  if (QuickPower(a, q) % n == 1) {
    return true;
  }
  for (auto j = 0ll; j < k; j++) {
    if (QuickPower(a, (1ll << j) * q) % n == n - 1) {
      return true;
    }
  }
  return false;
}
```

### 重复使用Miller-Rabin算法

如何使用Miller-Rabin算法以更高的可信度来判断一个整数是不是素数呢？我们可以通过选取不同的a来多次进行测试，如果测试用例数t=10，那么一个非素数通过所有测试的概率小于$10^{-6}$。因此，取足够大的t就有很大把握确定n就是一个素数。

密码学中经常会使用大的素数来进行加密等操作，比如RSA中的大素数分解就需要生成一个巨大的素数。
