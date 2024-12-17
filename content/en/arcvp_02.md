---
title: ArcVP DevLog#2
date: 2024-09-27
tags: ['graphics','devlog','opengl','ffmpeg','media-processing','arcvp']
authors: ['Maya']
ai: false
---

# Progress

Currently I'm building the basic video player to practice media processing.
At this stage, the player now could handle video pausing and resizing(though resizing may still needs some work).

Here is a video resizing issue I encountered.
![Incorrectly Video Resizing](/devlog/incorrect-resize.png)


Additionally, I've switched from using `GLFW` to `SDL2` for managing interface.
This change is necessary, because Apple has deprecated some OpenGL functions, forcing user
to use the freking shader. Since I'm not ready to dive into that right now,
I opted for `SDL2` to have a consistant develop experience on both Windows and MacOS.

Here's what I've learned during this week's development:

# Concepts

## PTS, DTS, and AVRational

If you don't control the decode and display speed in your code, the playback will be extremly fast,
which is undesirable. To solve this, we need to
introduce to two key concepts: the `PTS` and `DTS`.

### PTS(Presentation Timestamp)

PTS represents the timestamp when this single frame should be displayed.
It is important to note that the time unit of PTS and DTS is **NOT** 
in real-world seconds or milliseconds. Instead, it uses the time unit called
`TimeScale`, aka `Tick`, which can vary between videos.

But we can alway get a tick's length by using this formula:

 $\frac{1}{timebase}$.


Here, `timebase` is a `AVRational` object which defines how many ticks are there in a second.
This allows us to determine the `TimeScale` for a video. The `timebase` can be obtained from the `AVStream` object.

### DTS(Decode Timestamp)
DTS indicates the timestamp when the frame was decoded. 


## Sampling and Audio Playback

Just like video, audio in the media is also encoded. Typically, 
it is compressed using an `AAC` encoder, which can reduce the audio file
size up to 10 times.

### Sampling

When recoding audio, we divide 1 seconds into many ticks, and we capture the audio data
at specific time points. The number of times we capture data per second is called **Sample Rate**.
For example, an audio file with a sample rate of 44.1kHz means it captures 44,100 distinct sound samples per second.

Besides, the audio data can be stored in different formats, like `float32` and `int16`,
this is called **Format**.

### Audio Playback

When we configured the `SDL_AudioSpec` in our code, the system will periodcally request some audio data to play. So we could write a callback function,
when it needs data, we decode and give it.

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

# Miscellaneous

## Bugs
At this point, the program feels like one giant bug. When it works as expected, it's pretty cool, but the functionality is still far from perfect.


On top of that, there's a memory leak issue, where about 0.4MB of memory is leaked per second. I suspect I may have missed unref some packets or frames, but I'm still investigating…

