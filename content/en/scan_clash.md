---
title: 'Using Clash Proxies Without Authorization'
date: 2024-12-21
ai: true
tags: ['networking', 'cybersecurity', 'gfw']
authors: ['Maya']
---

## Scanning Networks with zmap

Today, while browsing Bilibili, I came across a video introducing `zmap` as a network scanning tool. It seemed very interesting, so I quickly downloaded it to try it out. On a whim, I decided to scan my campus network to see if anyone was using the Clash proxy on port 7890.

```bash
zmap -p 7890 10.78.0.0/15
```

After running the command above, I actually managed to discover several IP addresses!

```
10.79.11.174
10.78.161.150
10.78.77.92
10.78.186.4
10.78.71.72
10.78.19.209
10.79.155.62
10.79.17.43
10.78.43.125
10.78.58.53
10.78.30.112
...
```

### Unauthorized Proxy Use

The reason these IPs can be discovered using `zmap` is that the target machines allow connections from other IPs. In other words, their firewalls are disabled, and Clash is listening on `0.0.0.0:7890`. By configuring the network proxy on Windows to `IP:7890`, you can effectively "borrow" someone else's proxy traffic. (However, this is **not recommended** and is unethical.)

## Configuration and Usage

![configure proxy](/networking/scan_clash.png)

After configuring your system like this, you can access the internet through the external proxy, even if your own Clash is turned off.

![experiment result](/networking/result.png)
