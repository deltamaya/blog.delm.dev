---
title: ArcVP DevLog#4
date: 2024-10-10
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 进展

ArcVP项目即将完成！我已经实现了视频播放器的核心功能，包括播放视频和音频、同步视频和音频、前后拖动以及处理窗口大小调整。我还添加了一个控制面板，以方便访问这些功能。

现在的主要任务是解决程序中一些奇怪的并发错误，这些错误导致了段错误和死锁。一旦修复这些问题，项目将会处于很好的状态。

# 修复错误的经验

我最近解决了一个错误，程序在短时间的空闲播放后会停止响应。有趣的是，程序在前进或跳过时工作正常，但在连续播放一段时间后，它会停止并变得无响应。

## 定位错误

起初，我怀疑是死锁问题，特别是与 `mutexWindow` 相关。我添加了日志以追踪它何时被锁定和解锁，但并没有发现任何问题。在生成了大量日志后，我注意到问题出现在 `mutexVideoPacketQueue` 被锁定时，同时等待 `videoPacketQueueCanConsume` 条件变量——它根本没有再次唤醒，这表明 `videoPacketQueue` 是空的。

## 分析错误

问题就是：为什么 `videoPacketQueue` 是空的？解码线程应该正常工作。我添加了日志以跟踪 `videoPacketQueue` 的大小，发现解码线程没有从 `videoPacketQueueCanProduce` 的等待中唤醒。然而，在从队列中弹出数据包时，我已经调用了通知方法。经过进一步调查，我意识到队列的大小卡在523——恰好是它的上限的一半。即使我移除了限制，大小仍然保持在523。这就解释了为什么线程被卡住：它不是在等待 `videoPacketQueueCanProduce`，而实际上是在等待 `audioPacketQueueCanProduce`。

## 修复错误

当我检查处理音频包的代码时，我发现了一个简单的疏忽：我忘记在消费音频包时通知 `audioPacketQueueCanProduce`。一旦我添加了这个通知，程序就如预期般正常运行。

![demo](/devlog/devlog4-demostrate.png)
