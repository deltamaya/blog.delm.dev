---
title: RGB顏色模型
date: 2024-09-06
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: True
---
# RGB 色彩模型

RGB（紅、綠、藍）色彩模型基於**加法色彩理論**，通過組合不同強度的**紅、綠、藍**光來創造顏色。

RGB 是一種**設備相關**的色彩模型：不同設備對於某個給定的 RGB 值會有不同的檢測或重現效果，因為顏色元素及其對紅、綠、藍各通道的響應會因生產商不同而有所差異，甚至同一設備隨著時間的推移也會有所改變。因此，在沒有任何色彩管理的情況下，RGB 值**無法**在不同設備間呈現相同的顏色。

然而，從 RGB 衍生出來的另一種色彩模型被稱為 **RGBA 色彩模型**。

## RGBA 色彩模型

**RGBA** 代表 **紅、綠、藍、透明度**。雖然它有時被描述為一種色彩空間，但實際上它是三通道的 RGB 色彩模型，並補充了第四個 _透明通道_。透明通道用於指示每個像素的透明程度，並允許圖像使用 `Alpha 合成`（Alpha Compositing）進行疊加，從而實現圖像的 `透明效果` 以及不透明區域邊緣的 `抗鋸齒`。

![test](https://upload.wikimedia.org/wikipedia/commons/0/0e/PixelSamples32bppRGBA.png)