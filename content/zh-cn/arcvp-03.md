---
title: ArcVP 开发日志#3
date: 2024-10-08
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 进展

经过一周的假期，我重新开始了这个项目的开发。然而，我意识到使用 `FFmpeg` 构建一个功能全面的视频编辑器比我最初预想的要复杂得多。鉴于这些挑战，我决定简化项目的范围，专注于开发一个视频播放器，而不是视频编辑器。

目前，我已经实现了视频的**跳转功能**，使播放器能够通过使用 `AVSEEK_BACKWARD` 标志跳转到最近的关键帧。此外，我还添加了一个控制面板，使视频播放更加简单直观。

## 概念

自上次开发日志以来，我一直在开发跳转功能，并在过程中遇到了一些挑战。

## av_seek_frame

FFmpeg 提供了一个方便的 API，名为 `av_seek_frame`，允许你指定目标位置的 PTS（Presentation Time Stamp，呈现时间戳），并指示解复用器和解码器跳转到该位置。然而，使用这个 API 时需要注意一些陷阱。

## 跳转标志

我遇到的第一个问题与跳转标志有关。在调用 `av_seek_frame` 时，如果没有提供标志（或使用空标志）并尝试向前跳转，程序不会有任何反应。另一方面，如果提供了 `AVSEEK_BACKWARD` 标志，它会跳转到指定时间之前最近的**关键帧**，也就是说，跳转的位置会比预期稍早一些。而使用 `AVSEEK_ANY` 可以精确跳转到目标位置，但这也会引入一些复杂性。为了保持简单，我决定暂时只使用关键帧跳转。

# SDL + ImGui

我最初尝试了几种将 Dear ImGui 与 SDL 集成的方法，但在渲染器中将 ImGui 窗口叠加在视频纹理上时遇到了困难。经过一番在线搜索，我找到了一个非常适合我需求的小型库：[imgui_sdl](https://github.com/Tyyppi77/imgui_sdl)。借助这个库，我成功实现了一个用于视频播放的基础控制面板。但遗憾的是，目前仍然存在一些需要修复的 bug。

![demo](/devlog/devlog3-demostrate.png)
