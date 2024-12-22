---
title: FLV file format
date: 2024-02-14
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: True
---
FLV data is stored in **big-endian** format, which needs to be considered during parsing. 
FLV is one of the simpler encapsulation formats, so let's analyze it.

First, use the following command to generate an FLV video file:
```
ffmpeg -i .\luckstar.mkv -c:v flv -c:a mp3 -q:a 4 luckstar.flv
```

Each FLV file contains a header and a body. 
Below, we will introduce them one by one.

## FLV Header

The `FLV Header` occupies a total of 9 bytes, and the fields of the `FLV Header` are as follows:

![flv streams insight](/media-processing/flv_header.png)
We open this FLV in binary:
![flv streams insight](/media-processing/flv_header_data.png)
We find that the content layout is indeed as described above.

## FLV Body

The FLV Body consists of multiple `Tags`, structured as follows:
The `Tag` is further divided into two parts: `Tag Header` + `Tag Data`, as shown below:
![flv streams insight](/media-processing/flv_body.png)
The structure of each tag is as follows:
The length of the data area (tag data) and other information. The tag header generally occupies 11 bytes of memory space.

### FLV Tag
The structure of the FLV tag is as follows:
![flv streams insight](/media-processing/flv_tag.png)

### Tag Data

The fields of `Tag Data` are not fixed but are determined by the `TagType` in the `Tag Header`.

#### Script Tag

When `TagType` equals 18 (Script Tag), the `Tag Data` contains all `AMF` packets, where `AMF` stands for Action Message Format.

In `juren-30s.flv`, there are two AMF packets, `AMF1` and `AMF2`, as shown below:

![1-2](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-2.png)

Note that the `Metadata` in the above image also belongs to the `AMF2` packet.

The `type` of `AMF1` equals 2, indicating that this is a **`String`** packet, with a String size of 10, meaning this string is 10 bytes long, and `onMetaData` is exactly 10 bytes.

The `type` of `AMF2` equals 8, indicating that this is an **array** packet, with a metadata count of 16, meaning the length of this array is 16, and we can see that `MetaData` contains exactly 16 key-value pairs.

The parsing rule for this key-value pair is as follows: the type of the key must be a string, and the first 2 bytes represent the length of the string, as shown below:

![1-3](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-3.png)

08 is the length of duration, 05 is the length of width, 06 is the length of height, and so on.

The first byte after the key string indicates the type of the value. There are several types of values defined in FFmpeg, as follows:

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

If the `value` type is `AMF_DATA_TYPE_NUMBER`, then the `value` occupies 8 bytes, storing a floating-point number.

If the `value` type is `AMF_DATA_TYPE_BOOL`, then the `value` occupies 1 byte, storing either 0 or 1.

If the `value` type is `AMF_DATA_TYPE_STRING`, then the `value` occupies x bytes, xxx.

In summary, the byte size of the `value` is determined by the `type`, and specific code parsing is discussed in "flv_read_packet reads AVPacket." 
When `TagType` equals 18 (Script Tag), the `Tag Data` contains all `AMF` packets.

#### Video Tag

When `TagType` equals 9 (Video Tag), there are two fixed fields in the Tag Data: `FrameType` and `CodecID`, each occupying 4 bits, as shown below:

![1-4](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-4.png)

`CodecID` specifies which encoding standard is used, as follows:

```
CodecID:
    1: JPEG (currently unused)
2: Sorenson H.263
3: Screen video 4: On2 VP6
5: On2 VP6 with alpha channel
6: Screen video version 2
7: AVC
```

In this article, the `CodecID` of `juren-30s.flv` is 7, so it is encoded with `H264`.

`FrameType` has 5 values, as follows:

```
FrameType:
    1: keyframe (for AVC, a seekable frame)
2: inter frame (for AVC, a non-seekable frame)
    3: disposable inter frame (H.263 only)
4: generated keyframe (reserved for server use only)
5: video info / command frame
```

However, although the `FrameType` in the above image is 1, the Tag Data contains **encoding information**, not a **keyframe**. It also needs to be determined using `AVCPacketType`, as shown below:

![1-5](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-5.png)

When `CodecID` is 7 (`AVC`), `AVCPacketType` has 3 values, as follows:

1. `AVCPacketType` equals 0, indicating that the subsequent data is the AVC sequence header.
2. `AVCPacketType` equals 1, indicating that the subsequent data is the AVC NALU unit.
3. `AVCPacketType` equals 2, indicating the end of the AVC sequence.

---

The CompositionTime Offset in the Video Data is a time compensation used to calculate the PTS of scenes with B-frames. The TimeStamp in the Tag Header is the decoding time, and adding the CompositionTime Offset gives the PTS.

---

#### Audio Tag 

When `TagType` equals 8 (Audio Tag), there are 4 fixed fields in the Tag Data, as shown below:

![1-6](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-6.png)

The parsing of these 4 fields is as follows:

SoundFormat: The audio format, which specifies the data type in the Tag Data, could be AAC encoded data or MP3 encoded data, as follows:

```
SoundFormat:  (4 bits)
    Start Offset: 469 (0x1d5)
    SoundFormat:
    1 = ADPCM
2 = MP3 3 = Linear PCM, little endian 4 = Nellymoser 16-kHz mono 5 = Nellymoser 8-kHz mono 6 = Nellymoser
7 = G.711 A-law logarithmic PCM 8 = G.711 mu-law logarithmic PCM
9 = reserved
10 = AAC
11 = Speex 14 = MP3 8-kHz
15 = Device-specific sound
```

In this article, the `SoundFormat` of the FLV file is 10, so the Audio Tag contains AAC encoded data.

SoundRate: The sampling rate has 4 values, as follows:

```
SoundRate: (2 bits)
0 = 5.5-kHz 1 = 11-kHz
2 = 22-kHz 3 = 44-kHz
```

SoundSize: The sampling depth, where 0 represents 8-bit sampling and 1 represents 16-bit sampling.

```
SoundSize:  (1 bit)
0 = snd8Bit
1 = snd16Bit
```

SoundType: The channel, where 0 represents mono and 1 represents stereo.

```
SoundType:  (1 bit)
    0 = sndMono
1 = sndStereo
```

However, every Audio Tag has the fields `SoundFormat`, `SoundRate`, `SoundSize`, and `SoundType`, which I personally think is a bit redundant since they all have the same values.

---

When `SoundFormat` equals 10 (AAC), the `AACAUDIODATA` contains the `AACPacketType` with 2 values:

1. When `AACPacketType` equals 0, it indicates this is `AudioSpecificConfig` (sequence header), which only appears in the first `Audio Tag`.
2. When `AACPacketType` equals 1, it indicates this is AAC Raw frame data, which is the raw stream of AAC.

---

![1-7](https://ffmpeg.xianwaizhiyin.net/base-knowledge/mux-flv/1-7.png)

After comprehensive decoding, the data of this FLV video is as follows:
![flv streams insight](/media-processing/flv_streams_insight.png)