---
title: ArcVP 開發日誌#4
date: 2024-10-10
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 進展

ArcVP 項目已接近完成！我已經實現了視頻播放器的核心功能，包括視頻和音頻的播放、視頻與音頻的同步、前後快進快退以及窗口大小調整功能。此外，我還添加了一個控制面板，方便用戶訪問這些功能。

目前的主要工作是解決程序中一些奇怪的併發性錯誤，這些錯誤會導致段錯誤（segmentation fault）和死鎖（deadlock）。一旦這些問題解決，項目就會進入一個非常理想的狀態。

# 調試 Bug 的經歷

最近，我解決了一個 Bug，這個 Bug 會導致程序在播放一段時間後停止響應。有趣的是，當快進或跳轉時程序工作正常，但在連續播放一段時間後，它會停止並變得無響應。

## 定位 Bug

一開始，我懷疑是與 `mutexWindow` 相關的死鎖問題。我添加了日誌來跟蹤它的加鎖和解鎖情況，但並沒有發現問題。生成了大量日誌後，我注意到問題出現在 `mutexVideoPacketQueue` 被鎖定時，它正等待 `videoPacketQueueCanConsume` 條件變量的喚醒，但條件變量並未喚醒，這表明 `videoPacketQueue` 為空。

## Bug 分析

問題的關鍵變成了：為什麼 `videoPacketQueue` 為空？按理說，解碼線程應該正常工作。我添加了日誌來跟蹤 `videoPacketQueue` 的大小，發現解碼線程在等待 `videoPacketQueueCanProduce` 時並未被喚醒。然而，當從隊列中彈出包時，我明明已經調用了 notify 方法。進一步調查後，我意識到隊列大小卡在了 523——剛好是其限制的一半。即使我移除了限制，隊列大小仍然停留在 523。這解釋了線程為何卡住：它實際上並不是在等待 `videoPacketQueueCanProduce`，而是在等待 `audioPacketQueueCanProduce`。

## 修復 Bug

在檢查消耗音頻包的代碼時，我發現了一個簡單的疏漏：我忘記在消耗音頻包後通知 `audioPacketQueueCanProduce`。在添加了這一通知後，程序恢復了正常運行。

![demo](/devlog/devlog4-demostrate.png)
