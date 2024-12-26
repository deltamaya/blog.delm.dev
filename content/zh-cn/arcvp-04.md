---
title: ArcVP 开发日志#4
date: 2024-10-10
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 进展

ArcVP 项目已经接近完成！我已经实现了视频播放器的核心功能，包括视频和音频的播放、视频与音频的同步、前后快进快退以及窗口大小调整功能。此外，我还添加了一个控制面板，方便用户访问这些功能。

目前的主要工作是解决程序中一些奇怪的并发性错误，这些错误会导致段错误（segmentation fault）和死锁（deadlock）。一旦这些问题解决，项目就会进入一个非常理想的状态。

# 调试 Bug 的经历

最近，我解决了一个 Bug，这个 Bug 会导致程序在播放一段时间后停止响应。有趣的是，当快进或跳转时程序工作正常，但在连续播放一段时间后，它会停止并变得无响应。

## 定位 Bug

一开始，我怀疑是与 `mutexWindow` 相关的死锁问题。我添加了日志来跟踪它的加锁和解锁情况，但并没有发现问题。生成了大量日志后，我注意到问题出现在 `mutexVideoPacketQueue` 被锁定时，它正等待 `videoPacketQueueCanConsume` 条件变量唤醒，但条件变量并未唤醒，这表明 `videoPacketQueue` 为空。

## Bug 分析

问题的关键变成了：为什么 `videoPacketQueue` 为空？按理说，解码线程应该正常工作。我添加了日志来跟踪 `videoPacketQueue` 的大小，发现解码线程在等待 `videoPacketQueueCanProduce` 时并未被唤醒。然而，当从队列中弹出包时，我明明已经调用了 notify 方法。进一步调查后，我意识到队列大小卡在了 523——刚好是其限制的一半。即使我移除了限制，队列大小仍然停留在 523。这解释了线程为何卡住：它实际上并不是在等待 `videoPacketQueueCanProduce`，而是在等待 `audioPacketQueueCanProduce`。

## 修复 Bug

在检查消耗音频包的代码时，我发现了一个简单的疏漏：我忘记在消耗音频包后通知 `audioPacketQueueCanProduce`。在添加了这一通知后，程序恢复了正常运行。

![demo](/devlog/devlog4-demostrate.png)
