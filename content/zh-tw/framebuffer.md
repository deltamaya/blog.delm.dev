---
title: OpenGL中的幀緩衝
date: 2025-03-14
tags: ['opengl', 'graphics']
authors: ['Maya']
ai: True
draft: False
---
# 幀緩衝的概念

**幀緩衝**(Frame Buffer)是 OpenGL 中用於存儲渲染結果的內存區域。它是一個容器，包含了多個緩衝區，用來保存渲染圖像的各種信息，例如顏色、深度和模板等。幀緩衝是渲染管線的**終點**，渲染的結果最終會被寫入幀緩衝中，然後顯示在螢幕上，或者用於其他用途，例如後續的渲染處理。

OpenGL中有兩種幀緩衝:
1. 默認幀緩衝: 這通常由SDL或者GLFW自動定義，通常與窗口的顯示區域相關聯，渲染到默認緩衝會直接將結果顯示在螢幕上。
2. 用戶定義幀緩衝: 用戶創建的幀緩衝，允許將渲染結果存儲到自定義的**附件**中，例如紋理和渲染緩衝。通常用於離屏渲染、後處理效果等。

在使用一個幀緩衝之前需要它是完整的，一個完整的幀緩衝需要滿足以下的條件：

- 附加至少一個緩衝（顏色、深度或模板緩衝）。
- 至少有一個顏色附件(Attachment)。
- 所有的附件都必須是完整的（保留了內存）。
- 每個緩衝都應該有相同的樣本數(sample)。

## 附件

幀緩衝可以包含多種附件:
- 顏色附件
- 深度附件
- 模板附件

附件又有兩種類型:
**紋理**是多功能的圖像存儲對象，支持採樣和靈活的渲染後處理，適合需要後續訪問渲染結果的場景。
如下代碼我們創建了一個幀緩衝，並且為它綁定了一個顏色紋理附件:
```cpp
  GLuint framebuffer;
  glGenFramebuffers(1,&framebuffer);
  glBindFramebuffer(GL_FRAMEBUFFER,framebuffer);

  GLuint screenTexture;
  glGenTextures(1,&screenTexture);
  glBindTexture(GL_TEXTURE_2D,screenTexture);
  glTexImage2D(GL_TEXTURE_2D,0,GL_RGB,width,height,0,GL_RGB,GL_UNSIGNED_BYTE,nullptr);
  glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_CLAMP_TO_EDGE);
  glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_CLAMP_TO_EDGE);
  glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MIN_FILTER,GL_LINEAR);
  glTexParameteri(GL_TEXTURE_2D,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
  glBindTexture(GL_TEXTURE_2D,0);

  glFramebufferTexture2D(GL_FRAMEBUFFER,GL_COLOR_ATTACHMENT0,GL_TEXTURE_2D,screenTexture,0);

```
綁定這個顏色附件之後，綁定幀緩衝進行渲染，所有的內容都會以紋理的形式保存在這個texture中，我們之後可以使用這個紋理來做一些後處理，比如反色、灰度等。

**渲染緩衝** 是專為幀緩衝優化的存儲對象，性能更高，適合直接渲染到螢幕或不需要後續處理的情況。通常用於深度緩衝和模板緩衝，只用來進行測試而不需要進行渲染。
如下代碼為創建了一個深度和模板的渲染緩衝:
```cpp
  GLuint renderBuffer;
  glGenRenderbuffers(1,&renderBuffer);
  glBindRenderbuffer(GL_RENDERBUFFER,renderBuffer);
  glRenderbufferStorage(GL_FRAMEBUFFER,GL_DEPTH24_STENCIL8,width,height);
  glBindRenderbuffer(GL_RENDERBUFFER,0);
  glFramebufferRenderbuffer(GL_RENDERBUFFER,GL_DEPTH_STENCIL_ATTACHMENT,GL_RENDERBUFFER,renderBuffer);
```

如下代碼可以檢查這個幀緩衝的**完整性**，然後綁定了默認幀緩衝，指定接下來的渲染直接顯示在螢幕上:
```cpp
  if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) {
      std::cout << "ERROR::FRAMEBUFFER:: Framebuffer is not complete!" << std::endl;
      std::exit(1);
  }
  glBindFramebuffer(GL_FRAMEBUFFER, 0);
```

## 核效果

在一個紋理圖像上做後期處理的另外一個好處是，我們可以從紋理的其它地方採樣顏色值。比如說我們可以在當前紋理坐標的周圍取一小塊區域，對當前紋理值周圍的多個紋理值進行採樣。我們可以結合它們創建出很有意思的效果。

**核**(Kernel)（或**卷積矩陣**(Convolution Matrix)）是一個類矩陣的數值數組，它的中心為當前的像素，它會用它的核值乘以周圍的像素值，並將結果相加變成一個值。所以，基本上我們是在對當前像素周圍的紋理坐標添加一個小的偏移量，並根據核將結果合併。下面是核的一個例子：

$$
\begin{bmatrix}
2&2&2\\
2&-15&2\\
2&2&2\\
\end{bmatrix}
$$

這個核取了8個周圍像素值，將它們乘以2，而把當前的像素乘以-15。這個核的例子將周圍的像素乘上了一個權重，並將當前像素乘以一個比較大的負權重來平衡結果。

>[!TIP]
>你在網上找到的大部分核將所有的權重加起來之後都應該會等於1，如果它們加起來不等於1，這就意味著最終的紋理顏色將會比原紋理值更亮或者更暗了。

核是後期處理一個非常有用的工具，它們使用和實驗起來都很簡單，網上也能找到很多例子。我們需要稍微修改一下片段著色器，讓它能夠支持核。我們假設使用的核都是3x3核（實際上大部分核都是）

在片段著色器中，我們首先為周圍的紋理坐標創建了一個9個`vec2`偏移量的數組。偏移量是一個常量，你可以按照你的喜好自定義它。之後我們定義一個核，在這個例子中是一個銳化(Sharpen)核，它會採樣周圍的所有像素，銳化每個顏色值。最後，在採樣時我們將每個偏移量加到當前紋理坐標上，獲取需要採樣的紋理，之後將這些紋理值乘以加權的核值，並將它們加到一起。

這個銳化核看起來是這樣的：
![](bsc_kernel.png)