---
title: RGB颜色模型  
date: 2024-09-06  
tags: ['graphics', 'media-processing']  
authors: ['Maya']  
ai: true
---

# RGB颜色模型

RGB（红、绿、蓝）颜色模型基于**加色理论**，通过组合不同强度的**红色、绿色和蓝色**光来创建颜色。

RGB是一种**设备相关的**颜色模型：不同的设备对给定的RGB值的检测或再现方式可能不同，因为颜色元件及其对红、绿、蓝单独级别的响应会因制造商不同或同一设备的时间变化而有所不同。因此，在没有任何颜色管理的情况下，RGB值**并不**在所有设备上定义相同的颜色。

然而，从RGB派生出另一种颜色模型，称为**RGBA**颜色模型。

## RGBA颜色模型

**RGBA**代表**红、绿、蓝、透明度（Alpha）**。虽然有时它被描述为一种颜色空间，但实际上它是一个三通道的RGB颜色模型，补充了一个第四通道——_Alpha通道_。Alpha通道表示每个像素的不透明程度，并允许通过`Alpha合成`将图像与其他图像叠加，实现图像边缘区域的`透明度`和`抗锯齿`。

![test](https://upload.wikimedia.org/wikipedia/commons/0/0e/PixelSamples32bppRGBA.png)

