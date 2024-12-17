---
title: ArcVP DevLog#3
date: 2024-10-08
tags: ['graphics','devlog','opengl','ffmpeg','media-processing','arcvp']
authors: ['Maya']
ai: false
---
# Progress

After taking a week off for vacation, I'm back to working on this project. However, I've realized that building a full-fledged video editor using `FFmpeg` is more complex than I initially anticipated. Given the challenges, I've decided to simplify the scope and focus on creating a video player instead of a video editor.

At the current stage, I've implemented the seek functionality, allowing the player to jump to the nearest keyframe using the `AVSEEK_BACKWARD` flag. Additionally, I've added a control panel to make video playback easier and more intuitive for users.
## Concepts

Since my last devlog, I’ve been working on the seek functionality and encountered a few challenges along the way.

## av_seek_frame

FFmpeg provides a convenient API called `av_seek_frame`, which allows you to specify the PTS (Presentation Time Stamp) of the desired position, and the API instructs the demuxer and decoder to jump to that point. However, there are some pitfalls to watch out for.

## Seek Flag

One of the first issues I encountered was related to the seek flags. After calling av_seek_frame, if you don’t provide a flag (or use an empty flag) and attempt to seek forward, nothing happens. On the other hand, if you provide the `AVSEEK_BACKWARD` flag, it will jump to the nearest **keyframe** before the specified time, meaning the seek will land slightly earlier than the desired position. Using `AVSEEK_ANY` allows you to seek to the exact position, but it introduces some complexities. To keep things simple, I decided to stick with keyframe seeking for now.

# SDL + ImGui
I initially tried several approaches to integrate Dear ImGui with SDL but struggled to render the ImGui window on top of the video texture in the renderer. After searching online for solutions, I came across a small library that fits my needs perfectly: [imgui_sdl](https://github.com/Tyyppi77/imgui_sdl). With this, I was able to implement a basic control panel for video playback. Unfortunately, there are still some bugs that need to be ironed out.

![demo](
/devlog/devlog3-demostrate.png)