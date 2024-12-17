---
title: ArcVP DevLog#2
date: 2024-09-27
tags: ['graphics','devlog','opengl','ffmpeg','media-processing','arcvp']
authors: ['Maya']
ai: true
---

# 进展

目前我正在构建基本的视频播放器以练习媒体处理。
在这个阶段，播放器现在可以处理视频的暂停和调整大小（尽管调整大小可能仍需要一些工作）。

这是我遇到的视频调整大小问题。
![视频调整大小不正确](
/devlog/incorrect-resize.png)

此外，我已将界面管理从 `GLFW` 切换到 `SDL2`。
这个变化是必要的，因为苹果已经弃用了某些 OpenGL 函数，迫使用户
使用纰漏的着色器。因为我现在还不准备深入研究这个，
所以我选择了 `SDL2` 以在 Windows 和 MacOS 上保持一致的开发体验。

这是我在本周开发中学到的内容：

# 概念

## PTS、DTS 和 AVRational

如果您在代码中不控制解码和显示速度，播放将会非常快，
这是不希望的。为了解决这个问题，我们需要引入两个关键概念：`PTS` 和 `DTS`。

### PTS（展示时间戳）

PTS 表示这帧应该显示的时间戳。
重要的是要注意，PTS 和 DTS 的时间单位**不是**
现实世界中的秒或毫秒。相反，它使用一种称为
`TimeScale`（也叫 `Tick`）的时间单位，这在不同视频之间可能会有所不同。

但是我们总是可以使用以下公式得到一个 Tick 的长度：

 $\frac{1}{timebase}$。

在这里，`timebase` 是一个 `AVRational` 对象，用于定义一秒钟内有多少个 Tick。
这使我们能够确定视频的 `TimeScale`。`timebase` 可以从 `AVStream` 对象中获得。

### DTS（解码时间戳）
DTS 表示帧被解码时的时间戳。

## 采样和音频播放

与视频一样，媒体中的音频也被编码。通常， 
它使用 `AAC` 编码器进行压缩，这可以将音频文件
大小减少到 10 倍。

### 采样

在录制音频时，我们将 1 秒划分为多个 Tick，并在特定时间点捕获音频数据。
每秒捕获数据的次数称为**采样率**。
例如，采样率为 44.1kHz 的音频文件表示每秒捕获 44,100 个不同的声音样本。

此外，音频数据可以以不同格式存储，比如 `float32` 和 `int16`，
这称为**格式**。

### 音频播放

当我们在代码中配置 `SDL_AudioSpec` 时，系统将定期请求一些音频数据进行播放。因此我们可以编写一个回调函数，
当它需要数据时，我们解码并提供数据。

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

# 其他

## Bugs
在这一点上，程序感觉就像一个巨大的漏洞。当它按预期工作时，真的很酷，但功能仍然远非完美。

此外，还有一个内存泄漏问题，每秒大约泄漏 0.4MB 的内存。我怀疑我可能遗漏了一些未释放的包或帧，但我还在调查中……