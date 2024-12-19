---
title: Common Methods in Cyber Attacks
date: 2024-09-05
tags: ['cybersecurity', 'networking']
authors: ['Maya']
ai: true
---

# DoS & DDoS

DoS, `Denial of Service`, is also known as a denial-of-service attack. In this scenario, attackers send a large volume of junk requests to a server, consuming extensive server resources and effectively paralyzing the service. DDoS, `Distributed Denial of Service`, refers to a denial-of-service attack conducted using two or more devices.

DDoS attacks utilize multiple compromised devices as sources of attack traffic, with `IoT` devices being particularly susceptible to control and a primary source of DDoS attack traffic.

## Countermeasures

One method to defend against DoS attacks is to filter requests, such as monitoring for suspicious client behavior (e.g., multiple requests from the same IP, same geographical location, or an unusual number of requests from a web browser in a short time). This can lead to limiting the attacker's devices.

Additionally, server performance can be optimized to combat DoS attacks, such as implementing load balancing or upgrading bandwidth. However, this method's effectiveness is _limited_, as the traffic from attackers can be extraordinarily massive, making it challenging to counter attacks that exceed dozens of GB/s.

# Man-in-the-Middle Attack

MitM, `Man-in-the-Middle`, describes a scenario where a malicious intermediary stands between the client and the server, communicating with both parties without their knowledge. In this case, the intermediary can intercept and modify the information (Modification Attack) or replay it (Replay Attack).

## Information Interception

Without encryption, an intermediary can easily obtain the information being transmitted between both parties, resulting in data leakage. Furthermore, the intermediary can disrupt the communication between the client and the server, causing users to be unable to access the server.

## Information Modification

In the early days of the internet in China, most network traffic was conducted over the HTTP protocol, during which ISPs would automatically inject advertisements into users' web pages. While this was relatively benign, the ISP acted as the largest intermediary, effectively executing a man-in-the-middle attack on all users. When attackers intercept communication data, they can modify it and then send the altered data to the recipient, resulting in a `Modification Attack`.

To illustrate a more severe instance, imagine transferring money through online banking when an attacker hijacks your router, becoming the intermediary. In this scenario, the attacker can observe the request you send to the bank server, intercepting it and changing the recipient to their bank account, leading to financial losses for the user.

### Countermeasures

Encryption can address the first two issues mentioned, but mere encryption is insufficient since the intermediary can modify the keys during the initial exchange, before any encryption takes place.

![Asymmetric Encryption + Digital Signature](https://cdn.xiaolincoding.com/gh/xiaolincoder/ImageHost/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C/HTTP/%E6%95%B0%E5%AD%97%E7%AD%BE%E5%90%8D.png)

To counteract this, we can implement **Asymmetric Encryption + Digital Signatures**. The public key is hashed and then encrypted using the server's private key, and this encrypted hash is sent alongside the plaintext public key. In this manner, even if the intermediary modifies the public key, the client will detect that the decrypted hash does not match the computed hash, since the intermediary does not possess the server's private key. Indeed, this is the methodology behind establishing HTTPS connections.

## Replay Attack

Another special type of attack is the `Replay Attack`. In this scenario, the attacker cannot see or modify the communication content, so they resort to manipulating the quantity of communication.

The intermediary caches requests from the client and, after some time, re-sends them to the server, constituting a replay attack. Using the previous example, while you are transferring money online, the intermediary replays the transfer request, resulting in multiple transfers of the same amount to the same recipient.

### Countermeasures

To defend against replay attacks, requests can be numbered or timestamped. If the session number between the client and the server is greater than the request's sequence number, that particular request is ignored.
