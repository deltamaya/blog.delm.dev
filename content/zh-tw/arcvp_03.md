---
title: ArcVP 開發日誌#3
date: 2024-10-08
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 進展

經過一週的假期，我重新開始了這個項目的開發。然而，我意識到使用 `FFmpeg` 建立一個功能全面的影片編輯器比我最初想像的要複雜得多。鑑於這些挑戰，我決定簡化專案的範圍，專注於開發一個影片播放器，而不是影片編輯器。

目前，我已經實現了影片的**跳轉功能**，使播放器能夠使用 `AVSEEK_BACKWARD` 標誌跳轉到最近的關鍵幀。此外，我還添加了一個控制面板，使影片播放更加簡單直觀。

## 概念

自上次開發日誌以來，我一直在開發跳轉功能，並在過程中遇到了一些挑戰。

## av_seek_frame

FFmpeg 提供了一個方便的 API，名為 `av_seek_frame`，允許你指定目標位置的 PTS（Presentation Time Stamp，呈現時間戳），並指示解復用器和解碼器跳轉到該位置。然而，使用這個 API 時需要注意一些陷阱。

## 跳轉標誌

我遇到的第一個問題與跳轉標誌有關。在調用 `av_seek_frame` 時，如果沒有提供標誌（或使用空標誌）並嘗試向前跳轉，程式不會有任何反應。另一方面，如果提供了 `AVSEEK_BACKWARD` 標誌，它會跳轉到指定時間之前最近的**關鍵幀**，也就是說，跳轉的位置會比預期稍早一些。而使用 `AVSEEK_ANY` 可以精確跳轉到目標位置，但這也會引入一些複雜性。為了保持簡單，我決定暫時只使用關鍵幀跳轉。

# SDL + ImGui

我最初嘗試了幾種將 Dear ImGui 與 SDL 整合的方法，但在渲染器中將 ImGui 窗口疊加在影片紋理上時遇到了困難。經過一番線上搜索，我找到了一個非常適合我需求的小型庫：[imgui_sdl](https://github.com/Tyyppi77/imgui_sdl)。借助這個庫，我成功實現了一個用於影片播放的基礎控制面板。但遺憾的是，目前仍然存在一些需要修復的 bug。

![demo](/devlog/devlog3-demostrate.png)