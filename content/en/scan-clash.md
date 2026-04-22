---
title: "Misappropriation of clash proxy"
date: 2024-12-21
ai: True
tags: ['networking', 'cybersecurity', 'gfw']
authors: ['Maya']
---
## zmap Scanning the Network

Today, while browsing Bilibili, I came across a video introducing `zmap` as a network scanning tool. I found it very interesting, so I immediately downloaded it to play around with. I suddenly had the idea to scan for users on the campus network using the clash (7890) port.

```bash
zmap -p 7890 10.78.0.0/15
```

After executing the above command, I actually found these IPs!

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

### "Stealing" Proxy

The reason I was able to scan with zmap is that the target host allows other IPs to connect, meaning the firewall is turned off, and clash is listening on `0.0.0.0:7890`. At this point, you can directly configure the network proxy in Windows to `ip:7890` to "steal" the proxy traffic from the other party. (However, it's not recommended to do this.)

## Configuration and Usage

![configure proxy](/networking/scan_clash.png)  
With this configuration, even if you turn off your own clash, you can still access the external network.  
![experiment result](/networking/result.png)