---
title: MP4 file format
date: 2024-02-14
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: True
---
**MP4** (also known as [MPEG-4](https://en.wikipedia.org/wiki/MPEG-4) Part 14) encapsulation is one of the most commonly used encapsulation methods in our daily lives. Below is a brief introduction to the MP4 format.

## MP4 File Structure
The file structure of MP4 is similar to JSON, consisting of containers that are nested within each other.

![mp4 format intro](/media-processing/mp4_format_intro.png)

Next, let's analyze these containers by opening the MP4 file with software:
![mp4 format intro](/media-processing/mp4_insight.png)

First, parsing an MP4 file works like this: the first 0 to 3 bytes represent the size of the box, and the next 4 to 7 bytes represent the type of the box. From the image above, we can see that the first box of PAC_MAN.mp4 has a size of 0x18 bytes (including the header), and this is a box of type ftyp. As for the content within these 0x18 bytes, it can be parsed according to the ftyp type.
![mp4 format intro](/media-processing/mp4_ftyp.png)

The first ftyp box is 0x18 bytes in size. After parsing the first box, we immediately move to the second box, which has a size from 0x18 to 0x21 bytes. The second box is a free box, allowing for custom content. This process continues with further parsing. **Boxes can contain other boxes**, and the same parsing method applies.

***The first 4 bytes are the size, and the next 4 bytes are the box type.***

---

At this point, the box structure of MP4 is quite clear and simple: the first 4 bytes are the size, the last 4 bytes are the type, and the data within the box can be parsed according to its type.

However, the size has two special values: 0 and 1. Please see the image below.

- When the size equals 0, it indicates that this box is the last box in the file.
- When the size equals 1, it means that the box length requires more bits to describe, and a 64-bit largesize will be defined later to describe the box length.

![img](https://www.xianwaizhiyin.net/wp-content/uploads/2022/02/mp4-4.png)

## Box (Container)
Now let's introduce the functions of several common boxes:

- **ftyp**: Contains the file type, description, and common data structures used.
- **pdin**: Contains progressive video loading/downloading information.
- **moov**: Container for all the movie metadata.
- **moof**: Container with video fragments.
- **mfra**: The container with random access to the video fragment.
- **mdat**: Data container for media.
- **stts**: Sample-to-time table.
- **stsc**: Sample-to-chunk table.
- **stsz**: Sample sizes (framing).
- **meta**: The container with the metadata information.

Here is a list of second-level atoms used in MP4:

- **mvhd**: Contains the video header information with full details of the video.
- **trak**: Container with the individual track.
- **udta**: The container with user and track information.
- **iods**: MP4 file descriptor.

Next, let's provide a detailed introduction to several important tables:

### mdhd (Media Header)
![mp4 format intro](/media-processing/mp4_mdhd.png)
The time scale here indicates how many parts one second is divided into, which is also the unit of the sample delta below, specifically $1000/24000=0.041ms$.

### stts (Sample To Timestamp)
![mp4 format intro](/media-processing/mp4_stts.png)

This table indicates that the playback time for frames 0-772 is 1000 time scales, which equals $0.041*1000=41ms$.

### stss (Synchronize Sample)
This is the keyframe table for the video, also known as the synchronization table, used to synchronize audio and video.
![mp4 format intro](/media-processing/mp4_stss.png)

### stsz (Sample Size)
This indicates the size of each frame; the first frame is larger because it is a keyframe.
![mp4 format intro](/media-processing/mp4_stsz.png)
Now that we have learned about the decoding time of each frame through the stts table and the size of each frame through the stsz table, we just need the position information to locate each frame, which is stored in the stsc and stco tables.

### stsc (Sample To Chunk)
This is the table mapping frames to chunks. The MP4 format defines a chunk, which can contain multiple frames.
![mp4 format intro](/media-processing/mp4_stsc.png)

The image above shows two rows of data, which does not mean there are only two chunks; rather, the repeated data has been compressed in the same manner.

In the first row of the image, the First Chunk is 1, Samples per chunk equals 10, and Sample description index equals 1, meaning that the first chunk contains 10 video frames.

The final Sample description index field refers to which Sample Description Box it is, which is the stsd table. This file only has one Sample Description Box, although there may be multiple Sample Description Boxes.

The stsc table is abbreviated afterward, indicating that from the 78th chunk onward, each subsequent chunk contains only 2 video frames. Since this video stream has a total of 772 frames, with the first chunk containing 10 frames and the rest containing 2 frames, it calculates to $(772-(10*77))/2+77=78$ chunks.

The concepts of chunk and sample are quite important; to locate a specific frame in MP4, you first find the chunk and then the sample.

### stco (Chunk Offset)
Having understood the mapping from sample to chunk, we now need to find the positions of each chunk, which will naturally lead us to the positions of each frame. This position information is in the stco table, which stands for Chunk Offset Box, the chunk position table. Please see the image below:
![mp4 format intro](/media-processing/mp4_stco.png)

Open the file to verify whether the stream position is correct.
![mp4 format intro](/media-processing/mp4_stco_data.png)

25472 converted to hexadecimal is 6380. From the image above, we can see that at 0x6380, it is closely adjacent to mdat. The 8 bytes following mdat represent the size of this box. As mentioned earlier, mdat is the box that stores the actual audio and video stream, indicating that we have correctly located the position of the video stream.

---
From this analysis, we can see the difference between MP4 and FLV. Apart from the mdat box, which stores the actual audio and video data, all other boxes in MP4 are auxiliary tables. Therefore, MP4 has strong **editability**, and the performance of data retrieval in various scenarios is very high. FLV resembles a singly linked list; to find any information, you must traverse through it. In contrast, MP4 organizes everything neatly in various boxes for you, eliminating the need for traversal. Thus, the MP4 format is more like a database with many indexes, allowing for quick searches.

Generally, audio and video packets in MP4 are interleaved, depending on the STBL table of each track.

Comparing MP4 with FLV reveals that there are many audio and video formats. FLV does not have the stsz table, but FFmpeg can still use the size of AV packets whether parsing FLV or MP4. Therefore, FFmpeg effectively encapsulates various complex formats, making programming more universal.

## Pros and Cons

The MP4 (MPEG-4 Part 14) file format is a widely used multimedia container format for storing audio, video, and other types of data. Like any technology, it has its advantages and disadvantages. Here are some pros and cons of the MP4 format:

### Pros
- **Versatility**: MP4 supports a wide range of audio and video codecs, allowing for flexibility in terms of compression methods and quality.
- **Cross-Platform Compatibility**: MP4 is widely supported across various platforms, operating systems, and devices, making it a versatile choice for sharing and distributing multimedia content.
- **Streaming Support**: MP4 is **suitable for streaming** content over the internet. It supports progressive download and streaming protocols, making it compatible with online video platforms.
- **Metadata Support**: MP4 supports the embedding of metadata, allowing for the inclusion of information such as title, author, and copyright details within the file.
- **Chapter and Subtitle Support**: MP4 supports chapter markers, making it useful for organizing content into chapters or segments. It also supports subtitles and closed captions.
- **Compression Efficiency**: MP4 files can achieve a good balance between file size and video quality, thanks to efficient compression algorithms. This makes it suitable for storing high-quality videos with reasonable file sizes.

### Cons
- Not Standardized: MP4 is strictly speaking not a video format—it is a container format. It does not have a native method of processing media, so it relies on codecs. A media player must support these codecs to play an MP4 file. However, due to the huge popularity of MP4, many of its codecs have become standards themselves.
- Codec Compatibility: Codec compatibility issues can sometimes result in video being out of sync with audio.
- **Intensive ability needed for encoding and decoding**: Playback and editing of MP4 files requires significant processing power, because a file can contain several types of multimedia content and metadata.
- Compression Loss: MP4 compression results in good quality video, but it is still lossy. It is not a suitable choice for very high-definition video.
- Copyright: The convenience of the MP4 format has made it possible to illegally distribute copyrighted media content, which is a major problem for publishers.