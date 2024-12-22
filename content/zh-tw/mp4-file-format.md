---
title: MP4檔案格式
date: 2024-02-14
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: True
---
**MP4**（或稱[MPEG-4](https://zh.wikipedia.org/wiki/MPEG-4)第14部分）封裝是我們日常生活中使用最多的封裝方式之一，下面對MP4的格式進行簡要介紹
## MP4 文件結構
MP4的文件結構就像json，是由一個個容器相互包含而成

![mp4 format intro](/media-processing/mp4_format_intro.png)

接下來我們就來分析一下這些容器，首先使用軟件打開這個mp4文件：
![mp4 format intro](/media-processing/mp4_insight.png)

首先，解析一個 MP4 文件是這樣的，剛開始的 0 ~ 3 字節是 box 的 size （大小），然後 4 ~ 7 字節是 box 的類型。從上圖可以看出 PAC_MAN.mp4 的第一個 box 的大小 是 0x18 字節（包含頭部），然後這個是 ftyp 類型的box，至於這 0x18 字節裡面是什麼內容 就按照 ftyp 類型去解析就行了。
![mp4 format intro](/media-processing/mp4_ftyp.png)

然後第一個ftyp box 是 0x18 字節大小，解析完第一個 box 就馬上到 第二個box了，第二個box 的大小是 第 0x18 ~ 0x21 字節 ，第二個box 是一個 free box，自由發揮 box，可以自定義內容。以此類推不斷解析。**box 裡面 可能會再套 box**，也是同樣的解析方法，

***前面4字節是大小，後面 4 字節是 box 的類型。***

---

分析到這裡， mp4 的box結構就比較清晰了，很簡單，前面4個字節是 size （大小），後4字節是 type （類型），box 裡面的數據按照類型繼續解析即可。

不過 size 有兩個特殊值 0 和 1，請看下圖。

- 當size等於0時，代表這個Box是文件的最後一個Box。
- 當size等於1時，說明Box長度需要更多的位來描述，在後面會定義一個64位的 largesize 用來描述Box的長度。

![img](https://www.xianwaizhiyin.net/wp-content/uploads/2022/02/mp4-4.png)


## Box (容器)
然後我們再來介紹一下幾個常見box的作用

- **ftyp**: 包含文件類型、描述和常用數據結構。
- **pdin**: 包含漸進式視頻加載/下載信息。
- **moov**: 所有電影元數據的容器。
- **moof**: 包含視頻片段的容器。
- **mfra**: 隨機訪問視頻片段的容器。
- **mdat**: 媒體數據容器。
- **stts**: 取樣到時間表。
- **stsc**: 取樣到塊表。
- **stsz**: 取樣大小（框架）。
- **meta**: 包含元數據信息的容器。

這裡是MP4中使用的二級原子列表：

- **mvhd**: 包含視頻標頭信息，詳細說明視頻。
- **trak**: 包含單個軌道的容器。
- **udta**: 包含用戶和軌道信息的容器。
- **iods**: MP4文件描述符

下面對幾個比較重要的表進行詳細介紹：
### mdhd (媒體標頭)
![mp4 format intro](/media-processing/mp4_mdhd.png)
這裡的time scale就是這個文件將一秒分為多少份，也就是下面的sample delta的單位
也就是$1000/24000=0.041ms$


### stts (取樣到時間戳)
![mp4 format intro](/media-processing/mp4_stts.png)

這個表的意思就是0-772幀的播放時間都是1000個time scale，也就是$0.041*1000=41ms$

### stss (同步取樣)
這個是視頻的關鍵幀表，也叫同步表，用來同步音視頻
![mp4 format intro](/media-processing/mp4_stss.png)


### stsz (取樣大小)
這個是每個幀的大小，第一幀比較大是因為它是關鍵幀
![mp4 format intro](/media-processing/mp4_stsz.png)
現在我們已經通過 stts 表 了解到 各幀的解碼時間，通過 stsz 表知道 各幀的大小，還差 位置就能定位找到各個幀的，位置的信息存儲在 stsc 跟 stco 這兩個表裡面。
### stsc (取樣到塊)
幀映射到 chunk 的表。MP4 格式定義了 chunk，一個chunk 裡面可以有 多個幀
![mp4 format intro](/media-processing/mp4_stsc.png)

上圖中有兩行數據，不是說只有兩個chunk，而是重複的數據被壓縮，同樣的套路。

上圖中 第一行 的 First Chunk 是 1，Samples per chunk 等於 10，Sample description index 等於 1，意思是 第一个chunk 裡面有 10個視頻幀。

最後的 Sample description index 字段是指 第幾個 Sample Description Box， 也就是 stsd 表，本文件只有 1個 Sample Description Box， Sample Description Box 有可能會有多個。

stsc 後面是省略的了，代表從 第78個 chunk 起，後面的每個chunk 都是只有2個視頻幀。因為本視頻流一共772幀，第一个chunk裡面有10幀，後面的都是2幀，所以計算出來只有$(772-(10*77))/2+77=78$個chunk。

chunk 跟 sample 這個概念比較重要，MP4 索引定位找到某一幀，就是先找到chunk，再找到sample。

### stco (塊偏移)
Sample 到 chunk 的映射了解完了，現在只要 找到 各個 chunk 的位置，自然就能找到 各個幀的位置,這個位置信息在 stco 表，全稱 Chunk Offset Box，chunk的位置表，請看下圖：
![mp4 format intro](/media-processing/mp4_stco.png)

打開文件驗證一下流的位置是否正確
![mp4 format intro](/media-processing/mp4_stco_data.png)

25472換算為十六進制為6380，從上圖可以看到，0x6380 的地方，前面緊緊挨著 mdat，mdat之後的8個字節是這個box的大小，之前說過 mdat 是存儲真正的音視頻流的 box ，說明我們正確的找到了視頻流的位置

---
分析 到這裡 可以看出 MP4 與 FLV 的區別，MP4 除了 mdata box 是存儲真正的音視頻數據之外，其他的box都是輔助表，所以 MP4 有很強的**編輯性**，各種場景的數據查找的性能都很高。
FLV 更像一個 單向鏈表，你想要什麼信息，只能遍歷查找。
MP4不一樣，你想查什麼，我都整理好 放在各個 box 給你了。你不用遍歷。所以MP4格式更像是加了很多索引的數據庫，查起來很快。

一般來說，MP4中的音視頻packet是交錯排放的，這取決於每個track的STBL表

對比 MP4 跟 FLV 可以知道，音視頻格式多種多種，FLV 沒有 stsz 這個表，但是 FFmpeg 無論是解析 FLV，還是解析mp4，出來的 AVpacket 的size還是可以用的。所以FFmpeg 實際上就是對紛繁複雜的各種格式進行了封裝，讓編程更通用一點。



## 優缺點

MP4 (MPEG-4 第14部分) 文件格式是一種廣泛使用的多媒體容器格式，用於存儲音頻、視頻和其他類型的數據。像任何技術一樣，它有其優勢和劣勢。以下是MP4格式的一些優缺點：
### 優點
- **多功能性**: MP4支持多種音頻和視頻編解碼器，允許在壓縮方法和質量方面的靈活性。
- **跨平台兼容性**: MP4在各種平台、操作系統和設備上廣泛支持，使其成為共享和分發多媒體內容的多功能選擇。
- **流媒體支持**: MP4是**適合流媒體**內容的格式。它支持漸進式下載和流媒體協議，使其與在線視頻平台兼容。
- **元數據支持**: MP4支持嵌入元數據，允許在文件中包含如標題、作者和版權詳細信息等信息。
- **章節和字幕支持**: MP4支持章節標記，使其對於將內容組織成章節或段落非常有用。它還支持字幕和隱藏字幕。
- **壓縮效率**: MP4文件可以在文件大小和視頻質量之間實現良好的平衡，得益於高效的壓縮算法。這使其適合存儲高質量視頻而文件大小合理。
### 缺點
- 不標準化: 嚴格來說，MP4不是一種視頻格式——它是一種容器格式。它沒有本地處理媒體的方法，因此依賴於編解碼器。媒體播放器必須支持這些編解碼器才能播放MP4文件。然而，由於MP4的巨大受歡迎程度，許多編解碼器已經成為標準。
- 編解碼器兼容性: 編解碼器兼容性問題有時會導致視頻與音頻不同步。
- **編碼和解碼所需的高性能**: 播放和編輯MP4文件需要相當大的處理能力，因為一個文件可以包含多種類型的多媒體內容和元數據。
- 壓縮損失: MP4壓縮能夠產生良好的視頻質量，但仍然是有損的。它不適合非常高畫質的視頻。
- 版權: MP4格式的便利性使得非法分發受版權保護的媒體內容成為可能，這對於出版商來說是一個主要問題。