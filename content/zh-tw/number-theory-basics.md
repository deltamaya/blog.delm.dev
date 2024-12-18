---
title: 數論基礎
date: 2024-09-13
tags: ['number-theory', 'mathematics']
authors: ['Maya']
ai: true
---

# 最大公因數、模運算與同餘
## 歐几里得算法
在算法的研究中，我們經常需要計算大數字的最大公因數（GCD，Greatest Common Divisor）。逐一測試每個因數會太慢，因此我們需要使用**歐幾里得算法**來加速這個過程。

模運算具有以下性質：$(a*b)\ mod\ p = ((a\ mod\ p)*(b\ mod\ p))\ mod\ p$
## 同餘與其性質
如果 \( a \) 是一個整數，且 \( n \) 是一個正整數，我們將 \( a \) 除以 \( n \) 的餘數定義為 \( a \ mod\ n \)，其中 \( n \) 被稱為模數。如果 \( (a\ mod\ n) = (b\ mod\ n) \)，則稱 \( a \) 與 \( b \) 在模 \( n \) 下同餘，記作 \( a \equiv b \ (mod \ n) \)。

同餘有以下性質：
1. 如果 \( n \mid (a-b) \)，則 \( a \equiv b \ (mod \ n) \)
2. 如果 \( a \equiv b \ (mod \ n) \)，則 \( b \equiv a \ (mod \ n) \)
3. 如果 \( a \equiv b \ (mod \ n) \) 且 \( b \equiv c \ (mod \ n) \)，則 \( a \equiv c \ (mod \ n) \)

# 質數
質數是數論的基石。質數只有兩個因數：1 和它自己。任何非質數都可以表示為

$$ a = \prod \limits_{p \in P} p^{a_p}, \ a_p \geq 0 $$

其中 \( P \) 表示所有質數，其中大多數 \( a_p = 0 \)。

# 費馬定理與歐拉定理

## 費馬定理
費馬定理的一個有用形式是：
如果 \( p \) 是質數，且 \( a \) 是任意正整數，則有

$$ a^p \equiv a \ (mod \ p) $$

我們在這裡不證明它，但以 \( a = 3 \) 和 \( p = 5 \) 為例：

$$ 3^5 = 243\ mod\ 5 = 3 \ 和 \ 3\ mod\ 5 = 3 $$

## 歐拉函數
歐拉函數 \( \phi(n) \) 計算小於 \( n \) 且與 \( n \) 互質的正整數的個數，並約定 \( \phi(1) = 1 \)。
歐拉函數有以下性質：

對於質數 \( n \)，\( \phi(n) = n - 1 \)。

如果 \( p \) 和 \( q \) 是兩個質數，對於 \( n = pq \)，有 \( \phi(n) = \phi(pq) = \phi(p) * \phi(q) = (p-1) * (q-1) \)。

## 歐拉定理
歐拉定理指出，對於任何與 \( n \) 互質的整數 \( a \) 和 \( n \)，都有：

$$ a^{\phi(n)} \equiv 1 \ (mod \ n) $$

例如，

$$ a = 3; n = 10; \phi(10) = 4; a^{\phi(n)} = 3^4 = 81 \equiv 1 \ (mod \ 10) $$

與費馬定理類似，歐拉定理還有另一種表示：

$$ a^{\phi(n)+1} \equiv a \ (mod \ n) $$

在這種情況下，\( a \) 不必與 \( p \) 互質。

## 質數測試

我們如何快速構造一個大質數？截至本文撰寫時，沒有任何常用算法能夠確定性地生成一個大質數。然而，我們有一個幾乎可以確定構造出大質數的算法，即米勒-拉賓算法。
### 米勒-拉賓算法
米勒-拉賓算法利用質數的性質進行簡單檢查，使我們能夠快速判定一個大數是否為非質數，雖然它無法確定地證明一個數是質數。其方法與布隆過濾器（Bloom filter）有些相似。

對於任意大於 1 的奇數，可以表示為 \( n - 1 = 2^kq, k > 0, q \) 為奇數。

通過結合上述定理，我們可以快速識別一個大數是否為非質數。以下是 C++ 實現的一個範例：
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
  // 隨機選擇一個整數 a，1 < a < n-1
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

### 重複使用米勒-拉賓算法
我們如何使用米勒-拉賓算法來更高確定性地判斷一個整數是否為質數？我們可以通過選擇不同的 \( a \) 值並執行多次測試來實現這一點。如果測試案例數量 \( t = 10 \)，則一個合成數通過所有測試的機率小於 \( 10^{-6} \)。因此，通過選擇足夠大的 \( t \)，我們可以非常有信心地確定 \( n \) 確實是質數。

大質數在加密學中經常被用於加密操作，如在 RSA 中生成巨大的質因數。