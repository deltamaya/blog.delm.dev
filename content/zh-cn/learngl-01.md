---
title: 初见OpenGL-01
authors:
  - Maya
ai: false
draft: false
date: 2025-02-02
tags:
  - opengl
  - graphics
---
> [!NOTE]
> 此篇博客更倾向于自己的学习心得, 而不是进行OpenGL的教学, 如果你想学习OpenGL请移步[LearnOpenGL](https://learnopengl.com/).

# 什么是OpenGL?
在[ArcVP开发日志](https://blog.delm.dev/blog/arcvp-01)中以及介绍过了这一点, 简而言之OpenGL是一个图形API的标准, 各家显卡厂商会自己实现一套OpenGL, 就像是C++标准和不同的编译器之间的关系.

## GLAD
因为**OpenGL**只是一个标准/规范，具体的实现是由驱动开发商针对特定显卡实现的。由于**OpenGL**驱动版本众多，它大多数函数的位置都无法在编译时确定下来，需要在运行时查询。所以任务就落在了开发者身上，开发者需要在运行时获取函数地址并将其保存在一个函数指针中供以后使用。
而**GLAD**就是用于简化这一过程的一个库.

# 着色器
**着色器**就是能够在GPU上运行的程序, 着色器分为很多种, 每一个着色器只关心渲染或者计算中的一小部分工作, GPU上可以同时运行大量着色器实例, 并且有一部分着色器是可以编程的. 一般来说, 一种着色器的输入通常是另一种着色器的输出.

![着色器](https://learnopengl.com/img/getting-started/pipeline.png)
## 顶点着色器
顶点着色器, 即**Vertex Shader**, 是几个可编程着色器中的一个. 如果我们打算做渲染的话, 现代OpenGL需要我们至少设置一个顶点和一个片段着色器. 它用于处理每个顶点的数据（如位置、法线、纹理坐标等）。将顶点从模型坐标转换到屏幕坐标，并进行其他顶点相关的变换。一般来说, 顶点着色器就是将空间中的点进行变换到2D平面.

> [!TIP]
> 平面上的点**不是**屏幕上的像素!

## 片段着色器
**Fragment Shader**, 通常用于结合纹理、光照计算、阴影效果和其他信息，生成每个像素最终的颜色。

## 着色器程序
一个着色器Program可以包含上面的一系列Shader, 我们可以将多个shader attach 到一个program上, 然后执行link操作来生成一个program管线.

# Vertex Array
![Vertex](https://learnopengl-cn.github.io/img/01/04/vertex_array_objects_ebo.png)
上图Vertex Array, Vertex Buffer, Element Buffer之间的关系, 一个Vertex Array是我们使用的所有顶点属性的抽象, 其中可以包含多个Attribute Pointer, 指向Vertex Buffer中的具体数据, 这些数据用来描述一个顶点的属性. 而Element Buffer是一个缓冲区，就像Vertex Buffer一样，它存储 OpenGL 用来决定要绘制哪些顶点的索引。这种所谓的索引绘制(Indexed Drawing)正是我们问题的解决方案。