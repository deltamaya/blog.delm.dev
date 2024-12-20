---
title: Common Methods in Network Attacks
date: 2024-09-05
tags: ['cybersecurity', 'networking']
authors: ['Maya']
ai: true
---

# DoS & DDoS

DoS, `Denial of Service`, also known as a denial-of-service attack, is when an attacker sends a large number of junk requests to a server, consuming substantial server resources and effectively crippling the service.  
DDoS, `Distributed Denial of Service`, or distributed denial-of-service attack, occurs when an attacker uses two or more devices to perform a DoS attack.

DDoS attacks often rely on multiple compromised devices as the sources of attack traffic. Among these, `IoT` devices are particularly vulnerable to control and serve as the primary sources of DDoS attack traffic.

## Countermeasures

DoS attacks can be mitigated by filtering requests, such as monitoring suspicious client behavior (e.g., a single IP or geographic location, or the same web browser version generating a high volume of requests in a short time) and restricting the attacker’s devices.

Additionally, server performance can be optimized to combat DoS attacks through methods such as load balancing or upgrading bandwidth. However, this approach is *not very effective* because the volume of traffic from attackers is often massive, sometimes reaching tens of gigabytes per second, making it difficult to counteract with basic optimizations.

# Man-in-the-Middle Attack

MitM, `Man-in-the-Middle`, refers to a scenario where a malicious intermediary communicates with both the client and the server without either party realizing their presence. The intermediary can intercept, modify (Modification Attack), or replay (Replay Attack) the information being exchanged.

## Information Interception

If information is not encrypted, the intermediary can easily obtain the data transmitted between the two parties, leading to data breaches. Furthermore, the intermediary can disrupt communication between the client and server, resulting in users being unable to access the server.

## Information Modification

In the early days of the internet in China, most network traffic used the HTTP protocol. During this time, ISPs (Internet Service Providers) would inject advertisements into users' web pages automatically. While this may seem harmless, the ISP essentially acted as the largest man-in-the-middle, performing a MitM attack on all users.  

An attacker intercepts communication data and modifies it before sending the tampered data to the recipient. This is known as a `Modification Attack`.

For a more serious example, consider making a bank transfer online. If an attacker hijacks your router and acts as a man-in-the-middle, they could intercept your request to the bank server. The attacker could then modify the information, replacing the recipient's account details with their own, leading to financial loss for the user.

### Countermeasures

Encryption can solve the two problems mentioned above, but encryption alone is insufficient because the intermediary can tamper with the keys during the initial key exchange, which happens before encryption is in place.
![非对称加密+数字签名](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/%E6%95%B0%E5%AD%97%E7%AD%BE%E5%90%8D.png)

To address this, we use **asymmetric encryption combined with digital signatures**. The public key is hashed and then encrypted with the server's private key. This encrypted hash is sent along with the plaintext public key. Even if the public key is modified by the intermediary, they cannot use the server’s private key to generate the correct encrypted hash. Thus, the client can detect that the decrypted hash does not match the computed hash. In fact, this is the foundation of how HTTPS establishes secure connections.

## Replay Attack

A unique attack method is the `Replay Attack`. Since the attacker cannot view or modify the content of the communication, they instead manipulate the number of communications.

The intermediary caches requests from the client and resends them to the server at a later time, forming a replay attack. Using the previous example of making a bank transfer, if the intermediary replays the transfer request, you may end up transferring the same amount multiple times to the recipient.

### Countermeasures

Replay attacks can be mitigated by assigning sequence numbers (or timestamps) to requests. If the session sequence number between the client and the server is greater than the sequence number of the incoming request, the request is ignored.
