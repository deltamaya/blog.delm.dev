---
title: 如何避免代理檢測
date: 2024-12-27
authors: ['Maya']
ai: True
draft: False
tags: ['cybersecurity', 'networking']
---
# 代理檢測網站

首先檢測一下自己的代理環境好不好吧，
你可以自己去網上搜索代理檢測網站或者使用這個檢測網站：
[link](https://proxy.incolumitas.com/proxy_detect.html)

![](proxy-detect-1.png)

上面是我的代理檢測結果，可以看出已經被判定為一定是代理，
那麼接下來我們逐條學習這些測試項，以及如何繞過這些檢測。

## Blocklist

顧名思義，這是檢測方的IP黑名單，不同的網站服務的IP黑名單通常也不同。
如果你使用的機場等服務，其他人可能使用這個代理IP幹過壞事（比如發送騷擾郵件），
那麼這個IP就會被加入黑名單。

如果這一條被檢測到了，唯一的方法就是更換IP了。

## VPN High Latencies

這一項應該是通過檢測用戶的延遲是否異常地高，以符合VPN的特徵。
不過我從來沒有在這項測試中被判定，所以這裡就不深入研究了。

## Latency Test

這個測試項是通過對比TCP連接和WS連接之間的延遲來判定的。
伺服器可以通過TCP檢測自己與對方主機（也就是代理）的延遲，
然後通過websocket來檢測自己與上游主機的延遲，正常來說這兩個連接的延遲不能差太多，
如果差異過大就說明使用了代理。

這個測試的繞過方法就是使用一個與自己延遲較小的代理，**地理位置接近**，
**網路環境更好**的代理可以優先考慮。

## Flow Pattern Test

這是通過檢測網路流量的特徵來判定的，Shadowsocks、V2Ray、
Trojan等協議都可以將自己偽裝成HTTPS，只要不是明文上網一般都沒問題。

## Net Resolving

正常來說解析一個不存在的域名時，應該立刻返回`DNS_PROBE_FINISHED_NXDOMAIN`，
不正常的情況是不存在的域名依然分配到IP，並且訪問這個IP超時。
有些代理會這樣，但我一般也沒有遇到過這個問題。

## WebRTC

WebRTC是UDP流量，如果只開啟系統代理或者使用瀏覽器插件是無法接管UDP的，
此時TCP和UDP流量的IP對不上就會導致被識別為代理。解決方法是安裝禁用WebRTC的插件，
或者使用軟路由和虛擬網卡來接管所有流量。

## TCP/IP Fingerprint

如果代理IP的某些作業系統特徵與HTTP的User-Agent中的作業系統不符的話也可能被判定為代理，
例如這裡：

```json
{
  "tcpIpHighestOs": "Chromium OS",
  "userAgentOs": "Chromium OS"
}
```

伺服器通過檢測TCP連接的特徵判斷出遠程主機最可能為ChromiumOS，
而如果Windows主機瀏覽器發出的`userAgentOS`為Windows，這時候就會被判定為代理，
我們可以通過下載瀏覽器插件來繞過這個測試。

## Datacenter Test

如果你的代理IP提供商是使用的hosting或者其他容易獲得的IP，可能就會被判定為代理。
例如這裡的：

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

其中`type`字段為`hosting`說明你的IP是由VPS或其他公司提供的，
那麼就可能被判定為代理。解決方法是找一個`type`字段為`isp`的代理IP。

## IP Timezone vs Browser Timezone Test

這個是判斷用戶作業系統上的時區和主機的時區是否匹配，如果不匹配也會被判定為代理。
解決方法是更改自己作業系統上的時區。

## HTTP Proxy Headers Test

如果HTTP頭中有Proxy的相關信息也會被判定為代理，但這樣就屬於自報家門了，
一般都不會在HTTP頭中添加這些字段。