---
title: 如何避免代理检测
date: 2024-12-27
authors:
  - Maya
ai: false
draft: false
tags:
  - cybersecurity
  - networking
---

# 代理检测网站

首先检测一下自己的代理的代理环境好不好吧,
你可以自己去网上搜索代理检测网站或者使用这个检测网站:
[link](https://proxy.incolumitas.com/proxy_detect.html)

![](proxy-detect-1.png)

上面是我的代理检测结果, 可以看出已经被判断成一定是一个代理了,
那么下面我们逐条学习这些测试项, 以及如何绕过这些检测.

## Blocklist

顾名思义, 这就是检测方的IP黑名单, 不同的网站服务的IP黑名单一般也不同.
如果你用的机场之类的服务, 其他人可能用这个代理IP干过坏事(比如发送骚扰邮件),
那么这个IP就会被加入黑名单中.

如果这一条被检测到了, 唯一的方法就是更换IP了.

## VPN High Latencies

这一条应该是通过检测用户的延迟是不是异常的高, 符合VPN的特征.
但是我从来没有在这个测试上红过, 所以这里就不研究了.

## Latency Test

这个测试项是通过对比TCP连接和WS连接之间的延迟来判断的.
服务器可以通过TCP检测自己与对方主机(也就是代理)的延迟,
然后通过websocket来检测自己与上游主机的延迟, 正常来说这两个连接的延迟不能差太多,
如果差了太多说明使用了代理.

这个测试的绕过方法就是使用一个与自己延迟较小的代理, **地理位置接近**,
**网络环境更好**的代理可以优先考虑.

## Flow Pattern Test

这个是通过检测网络流量的特征来判断的, Shadowsocks, V2Ray,
Trojan等协议都可以将自己伪装成HTTPS, 只要不是明文上网一般都没问题.

## Net Resolving

正常来说解析一个不存在的域名的时候, 应该立刻返回`DNS_PROBE_FINISHED_NXDOMAIN`,
不正常的情况是一个不存在的域名依然分配到了IP, 并且访问这个IP超时.
有些代理会这样, 但是我一般也没有遇到这个问题.

## WebRTC

WebRTC是UDP流量, 如果只开启系统代理或者使用浏览器插件是不会接管UDP的,
此时TCP和UDP流量的IP对不上就导致被识别为代理. 解决方法是安装禁用WebRTC的插件,
或者使用软路由和虚拟网卡来接管所有流量.

## TCP/IP Fingerprint

如果代理IP的某些OS特征与HTTP的User-Agent中的OS不符的话也可能被判断为代理,
比如这里

```json
{
  "tcpIpHighestOs": "Chromium OS",
  "userAgentOs": "Chromium OS"
}
```

服务器通过检测TCP连接的特征判断出远程主机最可能为ChromiumOS,
而如果Windows主机浏览器发出的`userAgentOS`为Windows, 此时就会被判断为代理,
我们可以通过下载浏览器插件来绕过这个测试.

## Datacenter Test

如果你的代理IP提供商是使用的hosting或者其他容易获得的IP, 可能就会被判断为代理.
比如这里的

```json
{
  "asn": {
    "asn": "xxx",
    "abuser_score": "0.0021 (Low)",
    "route": "xx.xxx.xxx.0/24",
    "descr": "xxx",
    "country": "xx",
    "active": true,
    "org": "xxx",
    "domain": "xxx",
    "abuse": "xxx",
    "type": "hosting",
    "created": "2023-xx-xx",
    "updated": "2024-xx-xx",
    "rir": "xxx",
    "whois": "xxx"
  }
}
```

其中`type`字段为`hosting`说明你的IP是由VPS或者其他公司提供的,
那么就可能被判断为代理. 解决方法是找一个`type`字段为`isp`的代理IP.

## IP Timezone vs Browser Timezone Test

这个就是判断用户OS上的时区和主机的时区是否匹配, 如果不匹配也会被判断为代理.
解决方法是更改自己OS上的时区.

## HTTP Proxy Headers Test

如果HTTP头中有Proxy的相关信息也会被判断为代理, 但这样就属于自报家门了,
一般都不会在HTTP头中添加这些字段.
