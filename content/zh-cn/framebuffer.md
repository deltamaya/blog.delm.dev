---
title: OpenGL中的帧缓冲
date: 2025-03-14
tags:
  - opengl
  - graphics
authors:
  - Maya
ai: false
draft: False
---
# 帧缓冲的概念

**帧缓冲**(Frame Buffer)是 OpenGL 中用于存储渲染结果的内存区域。它是一个容器，包含了多个缓冲区，用来保存渲染图像的各种信息，例如颜色、深度和模板等。帧缓冲是渲染管线的**终点**，渲染的结果最终会被写入帧缓冲中，然后显示在屏幕上，或者用于其他用途，例如后续的渲染处理。

OpenGL中有两种帧缓冲:
1. 默认帧缓冲: 这通常由SDL或者GLFW自动定义, 通常与窗口的显示区域相关联, 渲染到默认缓冲会直接将结果显示在屏幕上.
2. 用户定义帧缓冲: 用户创建的帧缓冲, 允许将渲染结果存储到自定义的**附件**中, 例如纹理和渲染缓冲. 通常用于离屏渲染, 后处理效果等.

在使用一个帧缓冲之前需要它是完整的, 一个完整的帧缓冲需要满足以下的条件：

- 附加至少一个缓冲（颜色、深度或模板缓冲）。
- 至少有一个颜色附件(Attachment)。
- 所有的附件都必须是完整的（保留了内存）。
- 每个缓冲都应该有相同的样本数(sample)。

## 附件

帧缓冲可以包含多种附件:
- 颜色附件
- 深度附件
- 模板附件

附件又有两种类型:
**纹理**是多功能的图像存储对象，支持采样和灵活的渲染后处理，适合需要后续访问渲染结果的场景。
如下代码我们创建了一个帧缓冲, 并且为它绑定了一个颜色纹理附件:
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
绑定这个颜色附件之后, 绑定帧缓冲进行渲染, 所有的内容都会以纹理的形式保存在这个texture中, 我们之后可以使用这个纹理来做一些后处理, 比如反色, 灰度等.


**渲染缓冲** 是专为帧缓冲优化的存储对象，性能更高，适合直接渲染到屏幕或不需要后续处理的情况。通常用于深度缓冲和模板缓冲, 只用来进行测试而不需要进行渲染.
如下代码为创建了一个深度和模板的渲染缓冲:
```cpp
  GLuint renderBuffer;
  glGenRenderbuffers(1,&renderBuffer);
  glBindRenderbuffer(GL_RENDERBUFFER,renderBuffer);
  glRenderbufferStorage(GL_FRAMEBUFFER,GL_DEPTH24_STENCIL8,width,height);
  glBindRenderbuffer(GL_RENDERBUFFER,0);
  glFramebufferRenderbuffer(GL_RENDERBUFFER,GL_DEPTH_STENCIL_ATTACHMENT,GL_RENDERBUFFER,renderBuffer);
```

如下代码可以检查这个帧缓冲的**完整性**, 然后绑定了默认帧缓冲, 指定接下来的渲染直接显示在屏幕上:
```cpp
  if(glCheckFramebufferStatus(GL_FRAMEBUFFER) != GL_FRAMEBUFFER_COMPLETE) {
      std::cout << "ERROR::FRAMEBUFFER:: Framebuffer is not complete!" << std::endl;
      std::exit(1);
  }
  glBindFramebuffer(GL_FRAMEBUFFER, 0);
```

## 核效果

在一个纹理图像上做后期处理的另外一个好处是，我们可以从纹理的其它地方采样颜色值。比如说我们可以在当前纹理坐标的周围取一小块区域，对当前纹理值周围的多个纹理值进行采样。我们可以结合它们创建出很有意思的效果。

**核**(Kernel)（或**卷积矩阵**(Convolution Matrix)）是一个类矩阵的数值数组，它的中心为当前的像素，它会用它的核值乘以周围的像素值，并将结果相加变成一个值。所以，基本上我们是在对当前像素周围的纹理坐标添加一个小的偏移量，并根据核将结果合并。下面是核的一个例子：

$$
\begin{bmatrix}
2&2&2\\
2&-15&2\\
2&2&2\\
\end{bmatrix}
$$

这个核取了8个周围像素值，将它们乘以2，而把当前的像素乘以-15。这个核的例子将周围的像素乘上了一个权重，并将当前像素乘以一个比较大的负权重来平衡结果。

>[!TIP]
>你在网上找到的大部分核将所有的权重加起来之后都应该会等于1，如果它们加起来不等于1，这就意味着最终的纹理颜色将会比原纹理值更亮或者更暗了。

核是后期处理一个非常有用的工具，它们使用和实验起来都很简单，网上也能找到很多例子。我们需要稍微修改一下片段着色器，让它能够支持核。我们假设使用的核都是3x3核（实际上大部分核都是）


在片段着色器中，我们首先为周围的纹理坐标创建了一个9个`vec2`偏移量的数组。偏移量是一个常量，你可以按照你的喜好自定义它。之后我们定义一个核，在这个例子中是一个锐化(Sharpen)核，它会采样周围的所有像素，锐化每个颜色值。最后，在采样时我们将每个偏移量加到当前纹理坐标上，获取需要采样的纹理，之后将这些纹理值乘以加权的核值，并将它们加到一起。

这个锐化核看起来是这样的：
![](bsc_kernel.png)
