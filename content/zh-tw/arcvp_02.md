---
title: ArcVP 開發日誌#2
date: 2024-09-27
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 進展

目前，我正在構建一個基礎的視頻播放器，用以練習媒體處理技術。
在這一階段，播放器現在可以處理視頻的暫停和窗口大小調整功能（不過窗口大小調整可能還需要一些改進）。

以下是我遇到的視頻縮放問題：
![視頻縮放錯誤](/devlog/incorrect-resize.png)

此外，我已將介面管理從 `GLFW` 切換為 `SDL2`。這一更改是必要的，因為 Apple 已經廢棄了一些 OpenGL 函數，迫使開發者使用令人頭疼的著色器。由於我現在還沒準備好深入研究這些內容，所以選擇了 `SDL2`，以便在 Windows 和 macOS 上獲得一致的開發體驗。

以下是我在本週開發過程中學到的內容：

# 概念

## PTS、DTS 和 AVRational

如果你在代碼中不控制解碼和顯示的速度，播放將會變得非常快，這是不可取的。為了解決這個問題，我們需要引入兩個關鍵概念：`PTS` 和 `DTS`。

### PTS（顯示時間戳）

PTS 表示該幀應該顯示的時間戳。需要注意的是，PTS 和 DTS 的時間單位**並不是**現實世界中的秒或毫秒，而是使用一種被稱為 `TimeScale` 或 `Tick` 的時間單位，這個單位在不同視頻中可能不同。

但我們可以通過以下公式計算每個 tick 的時長：

$$\frac{1}{timebase}$$

其中，`timebase` 是一個 `AVRational` 對象，用於定義每秒有多少個 tick。這讓我們可以確定視頻的 `TimeScale`。`timebase` 可以從 `AVStream` 對象中獲取。

### DTS（解碼時間戳）

DTS 表示幀被解碼的時間戳。

## 取樣與音頻播放

與視頻類似，媒體中的音頻也需要編碼。通常，它使用 `AAC` 編碼器進行壓縮，可以將音頻文件的大小減少到原來的十分之一。

### 取樣

在錄製音頻時，我們將 1 秒鐘劃分為許多 tick，並在特定時間點捕獲音頻數據。每秒捕獲數據的次數稱為**取樣率**。例如，取樣率為 44.1 kHz 的音頻文件表示每秒捕獲 44,100 個獨立的聲音樣本。

此外，音頻數據可以以不同的格式存儲，比如 `float32` 和 `int16`，這被稱為**格式**。

### 音頻播放

當我們在代碼中配置 `SDL_AudioSpec` 時，系統會定期請求一些音頻數據以供播放。因此，我們可以編寫一個回調函數，當系統需要數據時，我們對其進行解碼並提供。

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

# 雜項

## Bug

目前，這個程序看起來就像一個巨大的 Bug 集合。當它按預期工作時，確實很酷，但功能仍然遠未完善。

此外，還有一個內存泄漏問題，每秒大約泄漏 0.4MB 的內存。我懷疑可能是忘記釋放一些包或幀了，但還在排查中……
