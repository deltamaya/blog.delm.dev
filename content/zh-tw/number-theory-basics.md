---
title: 數論基礎
date: 2024-09-13
tags: ['number-theory', 'mathematics']
authors: ['Maya']
ai: true
---

# GCD、模運算與同餘

## 歐幾里得算法

在算法的學習中，我們經常會遇到對大數求 GCD（Greatest Common Divider，最大公因數）的情況。如果逐一試除，效率非常低，這時我們需要使用**輾轉相除法**來加速該過程，這個方法也叫做歐幾里得算法。

模數有如下性質：$(a*b)\ mod \ p=((a\ mod \ p)*(b \ mod \ p))\ mod\ p$

## 同餘及其性質

如果 $a$ 是一個整數，$n$ 是正整數，則我們定義 $a$ 除以 $n$ 所得到的餘數為 $a \mod n$。其中 $n$ 稱為模數。如果 $(a\ mod\ n)=(b\ mod \ n)$，此時我們稱 $a$ 與 $b$ 是模 $n$ 同餘的，記為 $a\equiv b(mod \ n)$。

同餘具有如下性質：

1. 若 $n|(a-b)$，則 $a\equiv b(mod \ n)$
2. 若 $a\equiv b(mod \ n)$，則 $b\equiv a(mod \ n)$
3. 若 $a\equiv b(mod \ n)$，且 $b\equiv c(mod \ n)$，則 $a\equiv c(mod \ n)$

# 素數

素數是數論的核心。素數是指它的因子只有 1 和它本身的數字。任何一個非素數都可以表示為：

$$ a= \prod \limits_{p \in P} p^{a_p}, a_p \geq 0$$

其中 $P$ 表示所有的素數，大多數的 $a_p$ 都是 0。

# 費馬定理和歐拉定理

## 費馬定理

費馬定理的一種有用表示形式是：
若 $p$ 是素數且 $a$ 是任意的正整數，則：

$$a^p\equiv a \ mod \ p$$

具體證明此處略去，舉例來說：

當 $a=3, p=5$ 時，$3^5=243\ mod\  5 = 3$ 且 $3\  mod\  5 = 3$。

## 歐拉函數

歐拉函數 $\phi(n)$ 指小於 $n$ 且與 $n$ 互素的正整數的個數，習慣上定義 $\phi(1)=1$。歐拉函數具有如下性質：

- 對於素數 $n$，$\phi(n)=n-1$
- 如果兩個素數 $p$ 和 $q$，對於 $n=pq$，有 $\phi(n)=\phi (pq)=\phi (p) \phi (q)=(p-1)(q-1)$

## 歐拉定理

歐拉定理說明，對任意互素的 $a$ 和 $n$，有：

$$a^{\phi(n)} \equiv 1(mod \ n)$$

舉例來說：

$$a=3;\ n=10;\ \phi(10)=4;\ a^{\phi(n)}=3^4=81\equiv 1\  mod \ 10 = 1(mod \ n)$$

類似於費馬定理，歐拉定理還有另一種表示形式：

$$a^{\phi(n)+1}\equiv a(mod \ n)$$

此時不要求 $a$ 與 $p$ 互素。

## 素性測試

那麼我們應該如何快速構造一個大的素數呢？截至本文編寫時，還沒有任何一種高效常用算法能夠一定確定構造出一個大素數。然而，我們有一種算法可以幾乎肯定構造出一個大素數，那就是 Miller-Rabin 算法。

### Miller-Rabin 算法

Miller-Rabin 算法通過利用素數的性質進行快速校驗，可以在較短時間內判斷一個大數不是素數，但無法確定其是素數。其思想類似於布隆過濾器。

對於任意一個大於 1 的奇數，都可以表示為 $n-1=2^kq,\ k > 0,\ q$ 是奇數。

結合上述幾個定理，我們可以快速判斷一個大數不是素數。以下是 C++ 示例代碼：

```cpp
bool MillerRabinTest(const std::int64_t n) {
  // 找到滿足 n-1 == (2^k) * q 的 k 和 q
  std::int64_t temp = n;
  temp--;
  std::int64_t k = 0;
  while (temp % 2 == 0) {
    temp /= 2;
    k++;
  }
  std::int64_t q = n;
  // 隨機選擇 1 < a < n-1 的整數 a
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

### 重複使用 Miller-Rabin 算法

如何使用 Miller-Rabin 算法以更高的可信度判斷一個整數是否為素數呢？我們可以選取不同的 $a$ 多次進行測試。如果測試用例數 $t=10$，那麼一個非素數通過所有測試的概率小於 $10^{-6}$。因此，取足夠大的 $t$ 就可以高概率確定 $n$ 是素數。

在密碼學中，大素數經常用於加密操作，比如 RSA 中的大素數分解需要生成巨大的素數。
