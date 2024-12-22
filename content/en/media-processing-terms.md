---
title: Basic Audio and Video Terminology
date: 2023-12-10
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: True
---
## Video Processing
- **Video Frames:** Common types include I-frames (keyframes, containing a full picture, hence large data size), P-frames (predictive frames, referencing image information encoded in preceding I-frames), and B-frames (bi-predictive frames, referencing preceding I-frames, preceding P-frames, and subsequent I-frames). Have you ever noticed a slight rewind of 1-2 seconds when dragging the progress bar while watching videos online? This happens because the current frame at that position is not an I-frame, meaning it lacks a complete image.
- **Resolution:** Refers to the size or dimensions of the image, such as 720, 1080, 2k, or 4k. The suffix "p" represents progressive scan, while "i" represents interlaced scan.
- **Bitrate (Data Rate):** The **number of bits** (units of information) played per second of media (including video and audio). The file size calculation formula is:  
  **File Size ($b$) = Bitrate ($b/s$) × Duration ($s$)**  
- **Frame Rate (FPS):** The number of frames transmitted per second, measured in fps (frames per second) or in "Hertz" (Hz). The range perceptible to the human eye is typically 15–75 fps.
- **Refresh Rate:** The number of times the screen refreshes (redraws the image) per second, measured in Hertz (Hz).
- **Bit Depth:** Refers to the number of bits used to represent each sample, impacting the quality and detail of images or audio. For example, if RGB uses one byte to represent a single color, the bit depth is 8 bits.
- **DPI (Dots Per Inch):** Represents the number of pixels per inch. While not strictly a video parameter, it is often used in printing. For example, 300 dpi is standard for high-quality posters.
- **PTS (Presentation Time Stamp):** Indicates when a particular frame or sample should be presented or rendered to the user.
- **DTS (Decoding Time Stamp):** Represents the time at which a frame or sample should be decoded.

The limitation on bitrate is essentially a limitation on data size. For live streaming and other streaming media, a maximum bitrate is usually set to prevent stuttering caused by insufficient bandwidth on the client side.

Encoders use maximum bitrate settings to perform lossy compression on the video.

I-frames, P-frames, and B-frames are compression methods used in codecs like `h264`/`h265`. These concepts may not exist in other encoding formats.

- **GOP (Group of Pictures):** A complete group of video frames. Each group must start with an I-frame, though other frames within the group may also be I-frames. GOP is typically configured for live streaming and other streaming media to mitigate visual artifacts caused by network issues.
- GOP is generally set to 1–2 times the frame rate.

## Audio Processing
1. **Sampling Rate:**
    - Defines the number of samples extracted from the audio signal per second. Common sampling rates include 44.1 kHz (CD quality) and 48 kHz (commonly used in video production).
2. **Bit Depth:**
    - Specifies the number of bits per audio sample, determining the dynamic range of the audio signal. Common bit depths include 16-bit and 24-bit.
3. **Channels:**
    - Refers to independent paths of audio signal transmission. Mono audio consists of a single sound path, while stereo audio includes both left and right channels.
4. **Codec:**
    - Algorithms or devices used to encode audio signals into a digital format or decode them back into audio signals. Common audio codecs include MP3, AAC, and FLAC.
5. **Frequency:**
    - Represents the vibration frequency of sound waves, usually measured in Hertz (Hz). Humans can hear frequencies ranging from approximately 20 Hz to 20,000 Hz.
6. **Waveform:**
    - Represents the graphical shape of a sound, used to visualize audio signals. Common waveforms include sine waves, square waves, and sawtooth waves.
7. **Acoustic Model:**
    - In speech recognition, it associates sounds with speech units (phonemes) using statistical models.
8. **Mixing:**
    - The process of combining multiple audio signals into a single output. Mixing often involves balancing volume and channels.
9. **Echo Cancellation:**
    - Technology to reduce or eliminate echoes during communication, commonly used in voice calls and audio-video conferencing.
10. **Audio Effects:**
    - Various processes to modify or enhance audio signals, such as equalization, reverb, and chorus effects.
11. **Real-time Audio Processing:**
    - Techniques used to process audio in real-time applications, such as live audio stream processing or real-time audio effects.
12. **MIDI (Musical Instrument Digital Interface):**
    - A digital communication protocol used for controlling audio equipment, instruments, and computers, widely applied in music production.

- **Audio Frames:** Since storing a timestamp for each sample is inefficient, audio frames are introduced. Each audio frame is a collection of multiple audio samples, and the playback time depends on the PTS. The PTS represents the time the first sample in the audio frame begins playback.
- **Bitrate:** Audio also has a bitrate, commonly 128 Kbps.

It is generally accepted that smooth, distortion-free audio requires a sampling rate of at least 40 kHz.

### Common Audio Sampling Rates:
- 8 kHz: Audio calls and surveillance recordings
- 22.05 kHz, 24 kHz: FM radio broadcasts
- 44.1 kHz: CD quality
- 48 kHz: Common for online videos and movies