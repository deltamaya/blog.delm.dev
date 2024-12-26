---
title: ArcVP 开发日志#2
date: 2024-09-27
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 进展

目前，我正在构建一个基础的视频播放器，用以练习媒体处理技术。
在这一阶段，播放器现在已经可以处理视频的暂停和窗口大小调整功能（不过窗口大小调整可能还需要一些改进）。

以下是我遇到的视频缩放问题：
![视频缩放错误](/devlog/incorrect-resize.png)

此外，我已将界面管理从 `GLFW` 切换为 `SDL2`。这一更改是必要的，因为 Apple 已经废弃了一些 OpenGL 函数，迫使开发者使用令人头疼的着色器。由于我现在还没准备好深入研究这些内容，所以选择了 `SDL2`，以便在 Windows 和 macOS 上获得一致的开发体验。

以下是我在本周开发过程中学到的内容：

# 概念

## PTS、DTS 和 AVRational

如果你在代码中不控制解码和显示的速度，播放将会变得非常快，这是不可取的。为了解决这个问题，我们需要引入两个关键概念：`PTS` 和 `DTS`。

### PTS（显示时间戳）

PTS 表示该帧应该显示的时间戳。需要注意的是，PTS 和 DTS 的时间单位**并不是**现实世界中的秒或毫秒，而是使用一种被称为 `TimeScale` 或 `Tick` 的时间单位，这个单位在不同视频中可能不同。

但我们可以通过以下公式计算每个 tick 的时长：

$$\frac{1}{timebase}$$

其中，`timebase` 是一个 `AVRational` 对象，用于定义每秒有多少个 tick。这让我们可以确定视频的 `TimeScale`。`timebase` 可以从 `AVStream` 对象中获取。

### DTS（解码时间戳）

DTS 表示帧被解码的时间戳。

## 采样与音频播放

与视频类似，媒体中的音频也需要编码。通常，它使用 `AAC` 编码器进行压缩，可以将音频文件的大小减少到原来的十分之一。

### 采样

在录制音频时，我们将 1 秒钟划分为许多 tick，并在特定时间点捕获音频数据。每秒捕获数据的次数称为**采样率**。例如，采样率为 44.1 kHz 的音频文件表示每秒捕获 44,100 个独立的声音样本。

此外，音频数据可以以不同的格式存储，比如 `float32` 和 `int16`，这被称为**格式**。

### 音频播放

当我们在代码中配置 `SDL_AudioSpec` 时，系统会定期请求一些音频数据以供播放。因此，我们可以编写一个回调函数，当系统需要数据时，我们对其进行解码并提供。

```cpp
void audioCallback(void *userdata, Uint8 *stream, int len) {
  auto vr = static_cast<VideoReader *>(userdata);
  if (pauseVideo) {
    memset(stream, 0, len);
    return;
  }
  while (vr->audioFrameBuffer_.empty()) {
    if (vr->decodeAudioPacket()) {
      vr->resampleAudioFrame();
      break;
    }
  }
  auto &bufPos = vr->audioCurBufferPos_;
  int bytesCopied = 0;
  while (len > 0) {
    if (bufPos >= vr->audioFrameBuffer_.size()) {
      bufPos -= vr->audioFrameBuffer_.size();
      vr->audioFrameBuffer_.clear();
    }
    while (vr->audioFrameBuffer_.empty()) {
      if (vr->decodeAudioPacket()) {
        vr->resampleAudioFrame();
        break;
      }
    }
    auto &curBuf = vr->audioFrameBuffer_;
    bytesCopied = std::min(curBuf.size() - bufPos, (std::size_t)len);
    memcpy(stream, curBuf.data() + bufPos, bytesCopied);
    len -= bytesCopied;
    stream += bytesCopied;
    bufPos += bytesCopied;
  }
}
```

# 杂项

## Bug

目前，这个程序看起来就像一个巨大的 Bug 集合。当它按预期工作时，确实很酷，但功能仍然远未完善。

此外，还有一个内存泄漏问题，每秒大约泄漏 0.4MB 的内存。我怀疑可能是忘记释放一些包或帧了，但还在排查中……
