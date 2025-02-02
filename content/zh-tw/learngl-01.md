---
title: 初見OpenGL-01
authors: ['Maya']
ai: True
draft: False
date: 2025-02-02
tags: ['opengl', 'graphics']
---
> [!NOTE]
> 此篇博客更傾向於自己的學習心得，而不是進行OpenGL的教學，如果你想學習OpenGL請移步[LearnOpenGL](https://learnopengl.com/)。

# 什麼是OpenGL?
在[ArcVP開發日誌](https://blog.delm.dev/blog/arcvp-01)中已有介紹，簡而言之，OpenGL是一個圖形API的標準，各家顯卡廠商會自行實現一套OpenGL，就像是C++標準與不同的編譯器之間的關係。

## GLAD
因為**OpenGL**僅僅是一個標準/規範，具體的實現是由驅動開發商針對特定顯卡設計的。由於**OpenGL**的驅動版本眾多，大多數函數的位置在編譯時無法確定，需要在運行時查詢。因此，這項任務就落在了開發者身上，開發者需要在運行時獲取函數地址並將其保存在函數指針中以供日後使用。而**GLAD**就是用來簡化這一過程的一個庫。

# 着色器
**着色器**是能在GPU上運行的程序，著色器分為許多種類，每個著色器只關心渲染或計算中的一小部分工作，GPU上可以同時運行大量的著色器實例，部分著色器則是可編程的。一般而言，一種著色器的輸入通常是另一種著色器的輸出。

![着色器](https://learnopengl.com/img/getting-started/pipeline.png)
## 頂點著色器
頂點著色器，即**Vertex Shader**，是幾個可編程著色器中的一個。如果我們打算進行渲染，現代OpenGL需要至少設置一個頂點和一個片段著色器。它用於處理每個頂點的數據（如位置、法線、紋理坐標等），將頂點從模型坐標轉換到屏幕坐標，並進行其他頂點相關的變換。一般來說，頂點著色器就是將空間中的點轉換到2D平面。

> [!TIP]
> 平面上的點**不是**屏幕上的像素！

## 片段著色器
**Fragment Shader**，通常用於結合紋理、光照計算、陰影效果和其他信息，生成每個像素的最終顏色。

## 着色器程序
一個著色器Program可以包含上面的一系列Shader，我們可以將多個shader附加到一個program上，然後執行鏈接操作來生成一個program管線。

# Vertex Array
![Vertex](https://learnopengl-cn.github.io/img/01/04/vertex_array_objects_ebo.png)
上圖顯示了Vertex Array、Vertex Buffer和Element Buffer之間的關係。Vertex Array是我們使用的所有頂點屬性的抽象，裡面可以包含多個Attribute Pointer，指向Vertex Buffer中的具體數據，這些數據用來描述一個頂點的屬性。而Element Buffer是一個緩衝區，就像Vertex Buffer一樣，它存儲OpenGL用來決定要繪製哪些頂點的索引。這種所謂的索引繪製(Indexed Drawing)正是我們問題的解決方案。