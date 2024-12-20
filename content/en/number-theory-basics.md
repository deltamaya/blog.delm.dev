---
title: Fundamentals of Number Theory
date: 2024-09-13
tags: ['number-theory', 'mathematics']
authors: ['Maya']
ai: true
---

# GCD, Modular Arithmetic, and Congruences

## Euclidean Algorithm

When learning algorithms, we often encounter the need to calculate the GCD (Greatest Common Divisor) of large numbers. Using trial division is too slow in such cases, so we use the **method of successive division**, also known as the Euclidean Algorithm, to speed up the process.

Modular arithmetic has the following property: $(a*b)\ \text{mod} \ p=((a\ \text{mod} \ p)*(b\ \text{mod} \ p))\ \text{mod}\ p$

## Congruences and Their Properties

If $a$ is an integer and $n$ is a positive integer, we define the remainder of $a$ divided by $n$ as $a \mod n$, where $n$ is called the modulus. If $(a\ \text{mod}\ n)=(b\ \text{mod}\ n)$, we say $a$ and $b$ are congruent modulo $n$, denoted as $a \equiv b (\text{mod}\ n)$.

Congruences have the following properties:

1. If $n|(a-b)$, then $a \equiv b (\text{mod}\ n)$.
2. If $a \equiv b (\text{mod}\ n)$, then $b \equiv a (\text{mod}\ n)$.
3. If $a \equiv b (\text{mod}\ n)$ and $b \equiv c (\text{mod}\ n)$, then $a \equiv c (\text{mod}\ n)$.

# Prime Numbers

Prime numbers are at the core of number theory. A prime number has only two factors: 1 and itself. Any composite number can be expressed as:

$$ a = \prod \limits_{p \in P} p^{a_p}, a_p \geq 0 $$

Here, $P$ represents all prime numbers, and most of the $a_p$ are 0.

# Fermat's Theorem and Euler's Theorem

## Fermat's Theorem

A useful representation of Fermat's Theorem is:

If $p$ is a prime number and $a$ is any positive integer, then:

$$a^p \equiv a \ (\text{mod}\ p)$$

We won't prove this here, but as an example:
For $a=3$ and $p=5$, $3^5 = 243 \mod 5 = 3$, and $3 \mod 5 = 3$.

## Euler's Totient Function

The Euler's totient function $\phi(n)$ is the count of positive integers less than $n$ that are coprime to $n$. By convention, $\phi(1)=1$. The function has the following properties:

- For a prime $n$, $\phi(n) = n-1$.
- For two primes $p$ and $q$, if $n = pq$, then: 

  $$ \phi(n) = \phi(pq) = \phi(p) \phi(q) = (p-1)(q-1) $$

## Euler's Theorem

Euler's Theorem states that for any $a$ and $n$ that are coprime:

$$a^{\phi(n)} \equiv 1 (\text{mod}\ n)$$

For example:

$$a = 3, \ n = 10, \ \phi(10) = 4, \ a^{\phi(n)} = 3^4 = 81 \equiv 1 \ (\text{mod}\ 10) = 1 (\text{mod}\ n)$$

Similar to Fermat's Theorem, Euler's Theorem also has an alternative form:

$$a^{\phi(n)+1} \equiv a (\text{mod}\ n)$$

In this case, $a$ and $p$ do not need to be coprime.

## Primality Testing

How can we efficiently construct a large prime number? At the time of writing, there isn't a definitive algorithm to reliably construct large primes. However, there is an algorithm that can almost certainly construct a large prime: the Miller-Rabin Algorithm.

### Miller-Rabin Algorithm

The Miller-Rabin Algorithm uses properties of primes for quick checks. It can efficiently determine that a large number is not prime, but it cannot definitively confirm that it is prime. The concept is somewhat similar to a Bloom filter.

For any odd number greater than 1, it can be expressed as $n-1 = 2^kq, \ k > 0, \ q$ is odd.

Using the properties outlined earlier, we can quickly determine cases where a large number is not prime. Here's an example in C++:

```cpp
bool MillerRabinTest(const std::int64_t n) {
  // find k, q that satisfies n-1 == (2^k) * q
  std::int64_t temp = n;
  temp--;
  std::int64_t k = 0;
  while (temp % 2 == 0) {
    temp /= 2;
    k++;
  }
  std::int64_t q = temp;
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

How can we use the Miller-Rabin Algorithm to increase the confidence of determining whether a number is prime? By choosing different values of $a$ and running multiple tests. If the number of test cases $t=10$, the probability of a composite number passing all tests is less than $10^{-6}$. Therefore, selecting a sufficiently large $t$ makes it highly likely that $n$ is a prime.

In cryptography, large primes are often used for encryption and other operations. For example, RSA requires the generation of large primes for its factorization-based security.
