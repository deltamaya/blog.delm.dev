---
title: Basics of Number Theory
date: 2024-09-13
tags: ['number-theory', 'mathematics']
authors: ['Maya']
ai: true
---

# GCD, Modular Arithmetic and Congruences

## Euclidean Algorithm

In the study of algorithms, we often encounter the need to compute the GCD (Greatest Common Divisor) of large numbers. Trying each factor individually would be too slow, so we need to use the **Euclidean algorithm** to speed up this process.

The modulus has the following property: $(a*b)\ mod\ p = ((a\ mod\ p)*(b\ mod\ p))\ mod\ p$

## Congruences and Their Properties

If \( a \) is an integer and \( n \) is a positive integer, we define the remainder of \( a \) divided by \( n \) as \( a \ mod\ n \), where \( n \) is called the modulus. If \( (a\ mod\ n) = (b\ mod\ n) \), we say \( a \) is congruent to \( b \) modulo \( n \), denoted as \( a \equiv b \ (mod \ n) \).

Congruences have the following properties:

1. If \( n \mid (a-b) \), then \( a \equiv b \ (mod \ n) \)
2. If \( a \equiv b \ (mod \ n) \), then \( b \equiv a \ (mod \ n) \)
3. If \( a \equiv b \ (mod \ n) \) and \( b \equiv c \ (mod \ n) \), then \( a \equiv c \ (mod \ n) \)

# Prime Numbers

Prime numbers are the cornerstone of number theory. A prime number has only two factors: 1 and itself. Any non-prime number can be expressed as

$$ a = \prod \limits_{p \in P} p^{a_p}, \ a_p \geq 0 $$

where \( P \) denotes all prime numbers, most of which have \( a_p = 0 \).

# Fermat's Theorem and Euler's Theorem

## Fermat's Theorem

A useful form of Fermat's Theorem is:
If \( p \) is a prime and \( a \) is any positive integer, then

$$ a^p \equiv a \ (mod \ p) $$

We will not prove it here, but for example, with \( a = 3 \) and \( p = 5 \):

$$ 3^5 = 243\ mod\ 5 = 3 \ and \ 3\ mod\ 5 = 3 $$

## Euler's Function

Euler's function \( \phi(n) \) counts the number of positive integers less than \( n \) that are coprime to \( n \), and it is conventionally defined as \( \phi(1) = 1 \).
Euler's function has the following properties:

For a prime \( n \), \( \phi(n) = n - 1 \).

If \( p \) and \( q \) are two primes, for \( n = pq \), we have \( \phi(n) = \phi(pq) = \phi(p) _ \phi(q) = (p-1) _ (q-1) \).

## Euler's Theorem

Euler's Theorem states that for any integers \( a \) and \( n \) that are coprime, we have:

$$ a^{\phi(n)} \equiv 1 \ (mod \ n) $$

For example,

$$ a = 3; n = 10; \phi(10) = 4; a^{\phi(n)} = 3^4 = 81 \equiv 1 \ (mod \ 10) $$

Similar to Fermat's Theorem, Euler's Theorem has another representation:

$$ a^{\phi(n)+1} \equiv a \ (mod \ n) $$

In this case, \( a \) does not need to be coprime to \( p \).

## Primality Testing

How can we quickly construct a large prime number? As of the writing of this document, no commonly used algorithm can definitively generate a large prime. However, we have an algorithm that can almost certainly construct a large prime number, namely the Miller-Rabin algorithm.

### Miller-Rabin Algorithm

The Miller-Rabin algorithm uses the properties of primes to perform simple checks, allowing us to quickly determine if a large number is not prime, although it cannot definitively confirm that it is prime. Its approach is somewhat similar to that of a Bloom filter.

For any odd integer greater than 1, it can be expressed as \( n - 1 = 2^kq, k > 0, q \) is odd.

By combining the aforementioned theorems, we can quickly identify when a large number is not prime. An example C++ implementation is as follows:

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
  // randomly choose an integer a, 1 < a < n-1
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

### Repeated Use of the Miller-Rabin Algorithm

How can we use the Miller-Rabin algorithm to determine with higher certainty whether an integer is prime? We can achieve this by selecting different \( a \) values and performing multiple tests. If the number of test cases \( t = 10 \), then a composite number passing all tests has a probability of less than \( 10^{-6} \). Therefore, by choosing a sufficiently large \( t \), we can be quite confident that \( n \) is indeed a prime.

Large primes are frequently used in cryptography for encryption operations, such as generating huge prime factors in RSA.
