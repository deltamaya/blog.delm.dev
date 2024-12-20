---
title: ArcVP DevLog#4
date: 2024-10-10
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: false
---

# Progress

The ArcVP project is nearing completion! I’ve implemented the core functionality of the video player, including playing both video and audio, synchronizing video and audio, seeking forward and backward, and handling window resizing. I’ve also added a control panel for easy access to these functions.

The main focus now is resolving some strange concurrency bugs in the program, which are causing segmentation faults and deadlocks. Once these issues are fixed, the project will be in great shape.

# Bug Fix Experience

I recently resolved a bug where the program would stop responding after a short period of idle playback. Interestingly, the program worked fine when seeking forward or skipping ahead, but after playing continuously for a while, it would stop and become unresponsive.

## Locate the Bug

At first, I suspected a deadlock issue, specifically related to `mutexWindow`. I added logging to track when it was being locked and unlocked, but that didn’t reveal any issues. After a lot of logs were generated, I noticed that the problem occurred when the `mutexVideoPacketQueue` was locked while waiting on the `videoPacketQueueCanConsume` condition variable—it simply wasn’t waking up again, indicating that the `videoPacketQueue` was empty.

## Analysis of the Bug

The question became: why was the `videoPacketQueue` empty? The decoding thread should have been working correctly. I added logs to track the size of `videoPacketQueue` and found that the decoding thread wasn’t waking from its wait on `videoPacketQueueCanProduce`. However, I had already called the notify method when popping packets from the queue. Upon further investigation, I realized that the queue size was stuck at 523—exactly half of its limit. Even when I removed the limit, the size stayed at 523. This explained why the thread was stuck: it wasn’t waiting for `videoPacketQueueCanProduce`, it was actually waiting on `audioPacketQueueCanProduce`.

## Fix the Bug

When I examined the code where audio packets were consumed, I discovered a simple oversight: I had forgotten to notify `audioPacketQueueCanProduce` when consuming audio packets. Once I added that notification, the program worked as expected.

![demo](/devlog/devlog4-demostrate.png)
