---
title: RGB顏色模型
date: 2024-09-06
tags: ['graphics','media-processing']
authors: ['Maya']
ai: true
---
# RGB顏色模型
RGB（紅、綠、藍）顏色模型基於**加法顏色理論**，顏色是通過組合不同強度的**紅、綠和藍**光來創造的。
<div style={{display:'flex',alignItems:'center',flexWrap:'wrap'}}>
    <img src={'https://upload.wikimedia.org/wikipedia/commons/9/91/Venn_diagram_rgb.svg'} style={{marginRight: '20px',width:'10rem',height:'10rem',}} alt="rgb"/>
    <p style={{flex:'1 1 0',minWidth:'200px'}}>
        RGB是一種**設備依賴性**的顏色模型：不同的設備對給定的RGB值的檢測或重現是不一樣的，因為顏色元素及其對紅、綠和藍各自水平的反應因製造商而異，甚至在同一設備上隨時間變化。因此，一個RGB值在未經某種顏色管理的情況下**並不**定義跨設備相同的顏色。
    </p>
</div>

然而，還有一種基於RGB的顏色模型，稱為**RGBA**顏色模型。

## RGBA顏色模型

**RGBA**代表**紅、綠、藍、透明度**。雖然有時被描述為顏色空間，但它實際上是一種三通道的RGB顏色模型，並增加了第四個*透明度通道*。透明度表示每個像素的不透明程度，並允許圖像在其他圖像上進行結合，使用`Alpha Compositing`，並允許不透明區域邊緣的`Transparency`和`Anti-Aliasing`。

![test](https://upload.wikimedia.org/wikipedia/commons/0/0e/PixelSamples32bppRGBA.png)