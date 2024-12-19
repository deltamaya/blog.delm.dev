---
title: ArcVP DevLog#2
date: 2024-09-27
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 進度

目前我正在建立基本的視頻播放器以練習媒體處理。
在這個階段，播放器已經可以處理視頻的暫停和調整大小（儘管調整大小可能仍需要一些改進）。

這裡是我遇到的一個視頻調整大小的問題。
![不正確的視頻調整大小](/devlog/incorrect-resize.png)

此外，我已經從使用 `GLFW` 切換為 `SDL2` 來管理介面。
這個變化是必要的，因為 Apple 已經不再支持某些 OpenGL 函數，迫使用戶
使用煩人的著色器。由於我現在尚未準備好深入研究這個問題，
我選擇了 `SDL2` 以在 Windows 和 MacOS 上獲得一致的開發體驗。

以下是我在本周開發過程中學到的內容：

# 概念

## PTS、DTS 和 AVRational

如果你在代碼中不控制解碼和顯示速度，播放將會非常快速，
這是不可取的。為了解決這個問題，我們需要
引入兩個關鍵概念：`PTS` 和 `DTS`。

### PTS（顯示時間戳）

PTS 表示這一幀應該顯示的時間戳。
需要注意的是，PTS 和 DTS 的時間單位 **不是**
現實世界的秒或毫秒。相反，它使用一種叫做
`TimeScale`，也就是 `Tick`，這在不同的視頻中可以有所不同。

不過，我們可以使用以下公式始終獲得一個 tick 的長度：

$\frac{1}{timebase}$。

這裡，`timebase` 是一個 `AVRational` 對象，定義了每秒有多少個 ticks。
這讓我們能夠確定視頻的 `TimeScale`。`timebase` 可以從 `AVStream` 對象中獲得。

### DTS（解碼時間戳）

DTS 表示幀被解碼的時間戳。

## 取樣和音頻播放

就像視頻一樣，媒體中的音頻也被編碼。通常，
它使用 `AAC` 編碼器進行壓縮，這可以將音頻文件的
大小減少最多 10 倍。

### 取樣

在錄製音頻時，我們將1秒劃分為多個 ticks，并在特定的時間點捕獲音頻數據。
每秒捕獲數據的次數稱為 **取樣率**。
例如，取樣率為 44.1kHz 的音頻文件意味著每秒捕獲 44,100 個不同的聲音樣本。

另外，音頻數據可以以不同格式存儲，如 `float32` 和 `int16`，
這稱為 **格式**。

### 音頻播放

當我們在代碼中配置 `SDL_AudioSpec` 時，系統會定期請求一些要播放的音頻數據。因此，我們可以撰寫一個回調函數，
當它需要數據時，我們進行解碼並提供給它。

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

## 錯誤

此時，程序感覺像是一個巨大的錯誤。當它按預期工作時，效果非常好，但功能仍然遠未完美。

此外，還有一個內存泄漏問題，每秒約 0.4MB 的內存泄漏。我懷疑可能是我錯過了未釋放某些數據包或幀，但我仍在調查中……
