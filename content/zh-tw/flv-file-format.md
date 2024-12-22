---
title: FLV文件格式
date: 2024-02-14
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: True
---
FLV數據以**大端序**進行存儲，在解析時需要注意  
FLV是眾多封裝格式中比較簡單的一種，我們先來對它進行分析

首先使用如下命令生成一份flv視頻文件：  
```
ffmpeg -i .\luckstar.mkv -c:v flv -c:a mp3 -q:a 4 luckstar.flv
```

每個FLV文件都包含一個header和body  
下面我們對它們一一介紹

## FLV Header

`FLV Header` 一共占 9 個字節，`FLV Header` 的字段如下：

![flv streams insight](/media-processing/flv_header.png)  
我們使用二進制打開這個flv：  
![flv streams insight](/media-processing/flv_header_data.png)  
發現內容佈局確實如上面所述

## FLV Body

FLV Body 是由多個 `Tag` 組成的，結構如下：  
`Tag` 裡面還分為兩部分，`Tag Header` + `Tag Data`，如下：  
![flv streams insight](/media-processing/flv_body.png)  
每個tag的結構是這樣  
數據區(tag data)的長度等信息。tag header一般占11個字節的內存空間。

### FLV Tag  
FLV tag結構如下：  
![flv streams insight](/media-processing/flv_tag.png)  
### Tag Data

`Tag Data` 的字段不是固定的，而是根據 `Tag Header` 裡面的 `TagType` 決定的。

#### Script Tag

當 `TagType` 等於 18（Script Tag）時候，`Tag Data` 裡面全部都是 `AMF` 包，`AMF` 全稱是 Action Message Format（信息表）。

`juren-30s.flv` 裡面有 兩個 AMF 包，`AMF1` 與 `AMF2`，如下：

![1-2](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-2.png)

注意，上圖中的 `Metadata` 也是屬於 `AMF2` 包的。

`AMF1` 的 `type` 等於 2，代表這是一個 **`String`** 包，String size 等於 10，代表這個字符串是 10 個字節，而 `onMetaData` 剛好就是 10 字節了。

`AMF2` 的 `type` 等於 8，代表這是一個 **數組** 包，metadata count 等於 16，代表這個數組的長度是 16，可以看到 `MetaData` 裡面剛好有 16 個 Key-value 鍵值對。

他這個 key-value 鍵值對的解析規則是這樣，key 的類型一定是字符串，前面 2 個字節代表字符串的長度，如下：

![1-3](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-3.png)

08 是 duration 的長度，05 是 width 的長度，06 是 height 的長度，以此類推。

key 字符串之後的第一個字節，就是 value 的 type，value 有好幾種類型的，在 FFmpeg 裡面有定義，如下：

```c
typedef enum {
    AMF_DATA_TYPE_NUMBER      = 0x00,
    AMF_DATA_TYPE_BOOL        = 0x01,
    AMF_DATA_TYPE_STRING      = 0x02,
    AMF_DATA_TYPE_OBJECT      = 0x03,
    AMF_DATA_TYPE_NULL        = 0x05,
    AMF_DATA_TYPE_UNDEFINED   = 0x06,
    AMF_DATA_TYPE_REFERENCE   = 0x07,
    AMF_DATA_TYPE_MIXEDARRAY  = 0x08,
    AMF_DATA_TYPE_OBJECT_END  = 0x09,
    AMF_DATA_TYPE_ARRAY       = 0x0a,
    AMF_DATA_TYPE_DATE        = 0x0b,
    AMF_DATA_TYPE_LONG_STRING = 0x0c,
    AMF_DATA_TYPE_UNSUPPORTED = 0x0d,
} AMFDataType;
```

如果 `value` 的 `type` 是 `AMF_DATA_TYPE_NUMBER`，那 `value` 就占 8 字節，存儲的是浮點數。

如果 `value` 的 `type` 是 `AMF_DATA_TYPE_BOOL`，那 `value` 就占 1 個字節，存儲的是 0 或者 1。

如果 `value` 的 `type` 是 `AMF_DATA_TYPE_STRING`，那 `value` 就占 x 個字節，xxx

總之，`value` 的字節大小是由 `type` 決定的，具體代碼解析在《flv_read_packet讀取AVPacket》有講解。  
當 `TagType` 等於 18（Script Tag）時候，`Tag Data` 裡面全部都是 `AMF` 包，`AMF` 全稱是 Action Message Format（信息表）。

#### Video Tag

當 `TagType` 等於 9（Video Tag）時候，Tag Data 裡面有兩個字段是固定的，這兩個字段是 `FrameType` 與 `CodecID`，他們各占 4 位，如下：

![1-4](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-4.png)

`CodecID` 指名使用的是哪種編碼標準，如下：

```
CodecID:
1: JPEG (currently unused)
    2: Sorenson H.263 3 : Screen video
4 : On2 VP6 5 : On2 VP6 with alpha channel 6 : Screen video version 2 7 : AVC
```

本文的 `juren-30s.flv` 的 `CodecID` 是 7，所以是 `H264` 編碼的

`FrameType` 有 5 個值，如下：

```
FrameType:
    1: keyframe (for AVC, a seekableframe)
2: inter frame(for AVC, a non -seekable frame)
3 : disposable inter frame(H.263only)
4 : generated keyframe(reserved forserver use only)
5 : video info / command frame
```

不過上圖的 `FrameType` 雖然是 1，但他的 Tag Data 裡面的是**編碼信息**，而不是**關鍵幀**，他還要用 `AVCPacketType` 來判斷的，如下：

![1-5](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-5.png)

當 `CodecID` 是 7（`AVC`）的時候，`AVCPacketType` 有 3 個值，如下：

1. `AVCPacketType` 等於 0，代表後面的數據是 AVC 序列頭
2. `AVCPacketType` 等於 1，代表後面的數據是 AVC NALU 單元
3. `AVCPacketType` 等於 2，代表 AVC 序列結束。

---

Video Data 裡面的 CompositionTime Offset 是時間補償，是用來計算有 B 幀場景的 PTS 的，Tag Header 裡面的 TimeStamp 是解碼時間，需要加上 CompositionTime Offset 才是 PTS。

---

#### Audio Tag 

當 `TagType` 等於 8（Audio Tag）時候，Tag Data 裡面有 4 個字段是固定的，如下：

![1-6](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-6.png)

上圖這 4 個字段的解析如下：

SoundFormat：音頻格式，實際上就是指名 Tag Data 裡面是什麼數據類型，可能是 AAC 的編碼數據，也可能是 MP3 的編碼數據，如下：

```
SoundFormat:  (4 bits)
    Start Offset: 469 (0x1d5)
    SoundFormat:
    1 = ADPCM
2 = MP3 3 = Linear PCM, little endian 4 = Nellymoser 16 - kHz mono
5 = Nellymoser 8 - kHz mono 6 = Nellymoser
7 = G.711 A - law logarithmic PCM
8 = G.711 mu - law logarithmic PCM
9 = reserved
10 = AAC
11 = Speex 14 = MP3 8 - Khz 15 = Device - specific sound
```

本文的 flv 文件他的 `SoundFormat` 是 10，所以他的 Audio Tag 裡面是 AAC 的編碼數據。

SoundRate：採樣率，有 4 個值，如下：

```
SoundRate: (2 bits)
0 = 5.5-kHz 1 = 11 - kHz 2 = 22 - kHz 3 = 44 - kHz
```

SoundSize：採樣深度，0 代表 8 位採樣，1 代表 16 位採樣。

```
SoundSize:  (1 bit)
    0 = snd8Bit 1 = snd16Bit
```

SoundType：聲道，0 代表 單聲道，1 代表 雙聲道。

```
SoundType:  (1 bit)
    0 = sndMono
1 = sndStereo
```

不過每個 Audio Tag 都有 `SoundFormat`，`SoundRate`，`SoundSize`，`SoundType` 這 4 個字段，其實有點多餘，我個人覺得，因為都是一樣的值。

---

當 `SoundFormat` 等於 10 （AAC）時候，`AACAUDIODATA` 裡面的 `AACPacketType` 有 2 個值：

1. 當 `AACPacketType` 等於 0，代表這是 `AudioSpecificConfig`（序列頭），`AudioSpecificConfig` 只出現在第一個 `Audio Tag` 中
2. 當 `AACPacketType` 等於 1，代表這是 AAC Raw frame data，也就是AAC 的裸流

---

![1-7](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-7.png)

綜合解碼之後，這個flv視頻的數據如下  
![flv streams insight](/media-processing/flv_streams_insight.png)