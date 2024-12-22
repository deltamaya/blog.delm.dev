---
title: FLV文件格式
date: 2024-02-14
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: false
---

FLV数据以**大端序**进行存储，在解析时需要注意
FLV是众多封装格式中比较简单的一种，我们先来对他进行分析

首先使用如下命令生成一份flv视频文件：
```
ffmpeg -i .\luckstar.mkv -c:v flv -c:a mp3 -q:a 4 luckstar.flv
```

每个FLV文件都包含一个header和body
下面我们对它们一一介绍

## FLV Header

`FLV Header` 一共占 9 个字节，`FLV Header` 的字段如下：

![flv streams insight](/media-processing/flv_header.png)
我们使用二进制打开这个flv：
![flv streams insight](/media-processing/flv_header_data.png)
发现内容布局确实如上面所述

## FLV Body

FLV Body 是由多个 `Tag` 组成的，结构如下：
`Tag` 里面还分为两部分，`Tag Header` + `Tag Data`，如下：
![flv streams insight](/media-processing/flv_body.png)
每个tag的结构是这样
数据区(tag data)的长度等信息。tag header一般占11个字节的内存空间。

### FLV Tag
FLV tag结构如下：
![flv streams insight](/media-processing/flv_tag.png)
### Tag Data

`Tag Data` 的字段不是固定的，而是根据 `Tag Header` 里面的 `TagType` 决定的。

#### Script Tag

当 `TagType` 等于 18（Script Tag）的时候，`Tag Data` 里面全部都是 `AMF` 包，`AMF` 全称是 Action Message Format（信息表）。

`juren-30s.flv` 里面有 两个 AMF 包，`AMF1` 与 `AMF2`，如下：

![1-2](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-2.png)

注意，上图中的 `Metadata` 也是属于 `AMF2` 包的。

`AMF1` 的 `type` 等于 2，代表这是一个 **`String`** 包，String size 等于 10，代表这个字符串是 10 个字节，而 `onMetaData` 刚好就是 10 字节了。

`AMF2` 的 `type` 等于 8，代表这是一个 **数组** 包，metadata count 等于 16，代表这个数组的长度是 16，可以看到 `MetaData` 里面刚好有 16 个 Key-value 键值对。

他这个 key-value 键值对的解析规则是这样的，key 的类型一定是字符串，前面 2 个字节代表字符串的长度，如下：

![1-3](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-3.png)

08 是 duration 的长度，05 是 width 的长度，06 是 height 的长度，以此类推。

key 字符串之后的第一个字节，就是 value 的 type，value 有好几种类型的，在 FFmpeg 里面有定义，如下：

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

如果 `value` 的 `type` 是 `AMF_DATA_TYPE_NUMBER`，那 `value` 就占 8 字节，存储的是浮点数。

如果 `value` 的 `type` 是 `AMF_DATA_TYPE_BOOL`，那 `value` 就占 1 个字节，存储的是 0 或者 1。

如果 `value` 的 `type` 是 `AMF_DATA_TYPE_STRING`，那 `value` 就占 x 个字节，xxx

总之，`value` 的字节大小是由 `type` 决定的，具体代码解析在《flv_read_packet读取AVPacket》有讲解。
当 `TagType` 等于 18（Script Tag）的时候，`Tag Data` 里面全部都是 `AMF` 包，`AMF` 全称是 Action Message Format（信息表）。


#### Video Tag

当 `TagType` 等于 9（Video Tag）的时候，Tag Data 里面有两个字段是固定的，这两个字段是 `FrameType` 与 `CodecID`，他们各占 4 位，如下：

![1-4](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-4.png)

`CodecID` 指名使用的是哪种编码标准，如下：

```
CodecID:
    1: JPEG (currently unused)
    2: Sorenson H.263
    3 : Screen video
    4 : On2 VP6
    5 : On2 VP6 with alpha channel
    6 : Screen video version 2
    7 : AVC
```

本文的 `juren-30s.flv` 的 `CodecID` 是 7，所以是 `H264` 编码的

`FrameType` 有 5 个值，如下：

```
FrameType:
    1: keyframe (for AVC, a seekableframe)
    2: inter frame(for AVC, a non -seekable frame)
    3 : disposable inter frame(H.263only)
    4 : generated keyframe(reserved forserver use only)
    5 : video info / command frame
```

不过上图的 `FrameType` 虽然是 1，但他的 Tag Data 里面的是**编码信息**，而不是**关键帧**，他还要用 `AVCPacketType` 来判断的，如下：

![1-5](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-5.png)

当 `CodecID` 是 7（`AVC`）的时候，`AVCPacketType` 有 3 个值，如下：

1. `AVCPacketType` 等于 0，代表后面的数据是 AVC 序列头
2. `AVCPacketType` 等于 1，代表后面的数据是 AVC NALU 单元
3. `AVCPacketType` 等于 2，代表 AVC 序列结束。

---

Video Data 里面的 CompositionTime Offset 是时间补偿，是用来计算有 B 帧场景的 PTS 的，Tag Header 里面的 TimeStamp 是解码时间，需要加上 CompositionTime Offset 才是 PTS。

---

#### Audio Tag 

当 `TagType` 等于 8（Audio Tag）的时候，Tag Data 里面有 4 个字段是固定的，如下：

![1-6](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-6.png)

上图这 4 个字段的解析如下：

SoundFormat：音频格式，实际上就是指名 Tag Data 里面是什么数据类型，可能是 AAC 的编码数据，也可能是 MP3 的编码数据，如下：

```
SoundFormat:  (4 bits)
    Start Offset: 469 (0x1d5)
    SoundFormat:
    1 = ADPCM
    2 = MP3
    3 = Linear PCM, little endian
    4 = Nellymoser 16 - kHz mono
    5 = Nellymoser 8 - kHz mono
    6 = Nellymoser
    7 = G.711 A - law logarithmic PCM
    8 = G.711 mu - law logarithmic PCM
    9 = reserved
    10 = AAC
    11 = Speex
    14 = MP3 8 - Khz
    15 = Device - specific sound
```

本文的 flv 文件他的 `SoundFormat` 是 10，所以他的 Audio Tag 里面是 AAC 的编码数据。

SoundRate：采样率，有 4 个值，如下：

```
SoundRate: (2 bits)
    0 = 5.5-kHz
    1 = 11 - kHz
    2 = 22 - kHz
    3 = 44 - kHz
```

SoundSize：采样深度，0 代表 8 位采样，1 代表 16 位采样。

```
SoundSize:  (1 bit)
    0 = snd8Bit
    1 = snd16Bit
```

SoundType：声道，0 代表 单声道，1 代表 双声道。

```
SoundType:  (1 bit)
    0 = sndMono
    1 = sndStereo
```

不过每个 Audio Tag 都有 `SoundFormat`，`SoundRate`，`SoundSize`，`SoundType` 这 4 个字段，其实有点多余，我个人觉得，因为都是一样的值。

---

当 `SoundFormat` 等于 10 （AAC）的时候，`AACAUDIODATA` 里面的 `AACPacketType` 有 2 个值：

1. 当 `AACPacketType` 等于 0，代表这是 `AudioSpecificConfig`（序列头），`AudioSpecificConfig` 只出现在第一个 `Audio Tag` 中
2. 当 `AACPacketType` 等于 1，代表这是 AAC Raw frame data，也就是AAC 的裸流

---

![1-7](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-7.png)


综合解码之后，这个flv视频的数据如下
![flv streams insight](/media-processing/flv_streams_insight.png)

