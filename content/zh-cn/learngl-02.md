---
title: 进阶OpenGL
date: 2025-03-11
tags:
  - graphics
  - opengl
authors:
  - Maya
ai: false
draft: false
---
# 深度测试
现在我们知道OpenGL中的每一个片段都有一个自己的坐标, 其中的z坐标表示距离屏幕的距离, 比如当我们需要近处的物体遮挡远处的物体时, 就需要进行**深度测试**. 深度测试是指根据片段的深度(z坐标)来判断该片段是否应该被展示. 深度测试在没有优化的情况下是在**片段着色器之后**(以及后面的模板测试之后), 在**屏幕空间**运行的.

> [!NOTE]
> 现在大部分的GPU都提供一个叫做**提前深度测试**(Early Depth Testing)的硬件特性。提前深度测试允许深度测试在片段着色器之前运行。只要我们清楚一个片段永远不会是可见的（它在其他物体之后），我们就能提前丢弃这个片段。
> 片段着色器通常开销都是很大的，所以我们应该尽可能避免运行它们。当使用提前深度测试时，片段着色器的一个限制是你不能写入片段的深度值。如果一个片段着色器对它的深度值进行了写入，提前深度测试是不可能的。OpenGL不能提前知道深度值。



深度测试默认是关闭的, 可以通过`GL_DEPTH_TEST`选项来启用它.
```cpp
glEnable(GL_DEPTH_TEST);
```

如果一个片段通过了深度测试, 接下来会将这个片段的z值更新深度缓冲区, 用来进行后面的判断. 如果没有通过测试, 就会直接丢弃该片段. 如果开启了深度缓冲, 你还需要在每一次渲染循环中**清空**深度缓冲, 否则上一帧的深度缓冲就会对当前帧的深度探测产生负面影响:
```cpp
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
```
如果你希望再有的时候只进行探测而不进行更新深度缓冲区的操作, 可以通过设置深度掩码`DepthMask`为`false`即可
```cpp
glDepthMask(false);
```
## 深度测试函数
我们可以通过不同的深度测试函数来进行深度探测, 默认的比较方法是`GL_LESS`, 他会**丢弃**当深度值大于等于当前深度缓冲值的所有片段.
```cpp
glEnable(GL_DEPTH_TEST);
glDepthFunc(GL_LESS);
```
OpenGL还提供了`GL_ALWAYS`, `GL_NEVER`, `GL_EQUAL`, `GL_GEQUAL`等内置的探测函数,
加入我们启用了`GL_ALWAYS`深度测试将永远通过, 我们能看到的永远是我们最后进行渲染的片段.

## 精度
深度缓冲中包含了一个[0.0, 1.0]的深度值, 它可以代表平截头体从近平面到远平面的所有z坐标. 这个变换通常是一个这样的变换函数: 

$$
F_{depth}=\frac{1/z-1/near}{1/far-1/near}
$$
使用这样的非线性变换函数而不是一个线性变换可以使我们在**近处**的探测精度**更高**, 而远处的精度更低, 增强了近处的视觉体验.

## 深度冲突
一个常见的视觉错误就是当两个片段的深度值非常相近以至于深度测试无法明确判断谁在前谁在后的时候就会产生**深度冲突**. 看起来就是两个片段在竞争谁处于顶端, 具体表现就是一个区域可以看到两个片段高频交替显示或者是两个片段的条纹. 深度冲突在远处格外明显, 因为非线性变换导致远处的精度较低.

我们可以通过如下方法来规避深度冲突:

- 不要将两个物体摆放的太近, 很有效.
- 尽可能将近平面设置的更远, 如果近平面更远就意味着我们可以在更远的距离拥有更高的精度, 但是设置过大可能导致物体直接被裁剪掉.
- 使用更高精度的缓冲, 大部分缓冲都是24bit的, 但是大部分显卡都支持32bit的缓冲, 这可以极大的提升精度.
# 模板测试
与深度缓冲相似, **模板测试**(Stencil Test)也有一个缓冲区, 叫做模板缓冲区, 这个缓冲区的每一个单位是一个8位整数来保存模板值.

模板缓冲操作允许我们在渲染片段时将模板缓冲设定为一个特定的值。通过在渲染时修改模板缓冲的内容，我们**写入**了模板缓冲。在同一个（或者接下来的）帧中，我们可以**读取**这些值，来决定丢弃还是保留某个片段。使用模板缓冲的时候你可以尽情发挥，但大体的步骤如下：

- 启用模板缓冲的写入。
- 渲染物体，更新模板缓冲的内容。
- 禁用模板缓冲的写入。
- 渲染（其它）物体，这次根据模板缓冲的内容丢弃特定的片段。

模板测试同样也是使用`glEnable`来启用
```cpp
glEnable(GL_STENCIL_TEST);
```
跟深度测试一样, 每次迭代也需要清空缓冲区
```cpp
glClear(GL_STENCIL_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
```

与深度测试不同, 模板测试的掩码更复杂, 设置的掩码值会与要写入缓冲区的值进行逻辑与操作. 这里设置`0xFF`表示不对写入值进行修改, 如果是`0x00`表示不进行写入, 效果与`glDepthMask(false)`相同, 会禁用掩码.
```cpp
glStencilMask(0xFF);
```
同样的, 我们也可以使用`glStencilFunc`和`glStencilOp`来分别设置模板测试的比较函数和在不同情况下如何更新缓冲.

## 物体轮廓
一个常见的关于模板测试的例子就是显示物体轮廓, 对物体进行描边, 以下是如何通过模板测试实现这个功能:
1. 启用模板写入。
2. 在绘制（需要添加轮廓的）物体之前，将模板函数设置为GL_ALWAYS，每当物体的片段被渲染时，将模板缓冲更新为1。
3. 渲染物体。
4. 禁用模板写入以及深度测试。
5. 将每个物体缩放一点点。
6. 使用一个不同的片段着色器，输出一个单独的（边框）颜色。
7. 再次绘制物体，但只在它们片段的模板值不等于1时才绘制。
8. 再次启用模板写入和深度测试。

# 混合


如果我们的纹理中有**alpha通道**, 就可以通过这个通道来实现半透明的效果, 这个过程叫做**alpha混合**. OpenGL的混合是通过这个分量实现的:

$$
 C_{result}=C_{source}*F_{source}+C_{destination}*F_{destination}
$$
其中源颜色向量和目标颜色向量是OpenGL自动为我们设置的, 其中源颜色分量通常为正在处理的片段的颜色, 目标颜色分量为颜色缓冲区中现有的颜色. 但源因子和目标因子的值可以由我们来决定.


OpenGL允许我们使用`glEnable`来启用混合.
```cpp
glEnable(GL_BLEND);
```
同时我们可以通过`glBlendFunc`设置用来混合的函数, `glBlendFunc(sfactor, dfactor)`可以接受两个参数, 可以用来设置源和目标因子. OpenGL为我们定义了很多选项, 以下是一些常用的选项:


| 选项                       | 效果       |
| ------------------------ | -------- |
| `GL_ZERO`                | 因子为0     |
| `GL_ONE`                 | 因子为1     |
| `GL_SRC_COLOR`           | 源颜色向量    |
| `GL_DST_COLOR`           | 目标颜色向量   |
| `GL_SRC_ALPHA`           | 源alpha   |
| `GL_DST_ALPHA`           | 目标alpha  |
| `GL_ONE_MINUS_SRC_ALPHA` | 1-源alpha |
| `GL_CONSTANT_ALPHA`      | 常数alpha  |

如果我们需要上面的不透明物体能够看到下面的物体, 常见的作法是使用:
```cpp
glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
```
上面的代码将会在处理一个半透明或者透明的物体时将这个物体在alpha混合的地方将自己的颜色与后面已经通过深度测试的物体的颜色进行混合. 如果说后面的物体同样是一个有非不透明的物体, 那么这个这个处理是正常的, 但是如果先渲染的前面的物体, 后面的物体就无法通过深度测试, 导致后面的物体颜色没有进行混合.

所以说通常的渲染顺序是: 
1. 渲染所有不透明物体
2. 对所有透明物体按照距离视口的距离进行排序
3. 按照顺序渲染透明物体

在场景中排序物体是一个很困难的技术，很大程度上由你场景的类型所决定，更别说它额外需要消耗的处理能力了。完整渲染一个包含不透明和透明物体的场景并不是那么容易。更高级的技术还有**次序无关透明度**(Order Independent Transparency, OIT), 如果有时间我会再去研究.

# 面剔除


当我们绘制一个**闭合**的形状的时候, 每一个面都有两侧, 而于此同时我们只能观察到一个面, 那我们看不到的那个面依然会占用计算资源, 导致速度变慢. OpenGL提供的**面剔除**(Face Culling)可以解决这个问题.

如果说我们绘制的闭合形状是由多个三角形组成的, 当我们在定义这些三角形的顶点的时候, 一共会有两种点的环绕方式, 顺时针和逆时针.

OpenGL默认从这个立方体的外面观察为**逆时针**的时候这是**正面**, 而顺时针是反面, 并且在开启面剔除后OpenGL默认剔除反面. 通过如下代码可以开启面剔除功能.
```cpp
glEnable(GL_CULL_FACE);
```
同时我们还可以使用
```cpp
glCullFace(GL_FRONT);
```
来告诉OpenGL我们要剔除正面.

当然我们也可以设置到底顺时针还是逆时针是正面:
```cpp
glFrontFace(GL_CW);
```
上面的代码定义顺时针(Clock-wise)是正面.
面剔除是一个很棒的工具, 但你需要记住哪些物体能够从面剔除中获益, 而哪些物体不应该被剔除.

## 与深度测试的关系?
我在学习到这里的时候发现这个功能好像与之前的深度测试有些类似, 于是仔细对比了一下.

**深度测试**发生在**片段处理**之后, 也就是当片段着色器运行结束之后, 操作发生在像素级别, 仅仅影响到渲染. 

**面剔除**发生在**图元组装**和**光栅化**之间, 它通过判断三角形的朝向来选择性的剔除一些图元(三角形), 它的输出是光栅化也就是片段着色器的输入. 面剔除可以提前丢弃我们想要剔除的面, 减少了片段着色器的计算量, 也就减小了开销.