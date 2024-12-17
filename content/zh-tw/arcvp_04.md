---
title: ArcVP DevLog#4
date: 2024-10-10
tags: ['graphics','devlog','opengl','ffmpeg','media-processing','arcvp']
authors: ['Maya']
ai: true
---


# 進度

ArcVP 專案即將完成！我已經實施了視頻播放器的核心功能，包括播放視頻和音頻、視頻和音頻的同步、前進和後退尋找以及處理視窗大小調整。我還添加了一個控制面板，以便輕鬆訪問這些功能。

目前的主要重點是解決程式中的一些奇怪的並發錯誤，這些錯誤導致了段錯誤和死鎖。一旦這些問題得到解決，該專案將會達到很好的狀態。


# 錯誤修復經驗

我最近解決了一個錯誤，該錯誤導致程式在短暫的空閒播放後停止響應。有趣的是，當前進尋找或快進時，程式運行正常，但在持續播放一段時間後，它會停止並變得無響應。
## 定位錯誤
起初，我懷疑是死鎖問題，特別是與 `mutexWindow` 相關。我添加了日誌來跟踪其鎖定和解鎖的時間，但這並未揭示任何問題。在生成了大量日誌後，我注意到當 `mutexVideoPacketQueue` 在等待 `videoPacketQueueCanConsume` 條件變數時被鎖定，問題就出現了——它簡單地沒有再醒來，這表明 `videoPacketQueue` 是空的。
## 分析錯誤
問題變成了：為什麼 `videoPacketQueue` 是空的？解碼線程應該是正常工作的。我添加了日誌來跟踪 `videoPacketQueue` 的大小，發現解碼線程並未從其等待的 `videoPacketQueueCanProduce` 中醒來。但是，我已經在從隊列中彈出封包時調用了通知方法。進一步調查後，我意識到隊列大小卡在 523——正好是其限制的一半。即使我移除了限制，大小仍然保持在 523。這解釋了為什麼線程被卡住：它並不是在等待 `videoPacketQueueCanProduce`，而是實際上在等待 `audioPacketQueueCanProduce`。

## 修復錯誤

當我檢查消耗音頻封包的程式碼時，發現了一個簡單的疏忽：我在消耗音頻封包時忘記通知 `audioPacketQueueCanProduce`。一旦我添加了該通知，程式就按預期運作了。

![demo](/devlog/devlog4-demostrate.png)