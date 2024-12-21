---
title: YUV色彩模型
date: 2024-09-21
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: false
---

**YCbCr颜色空间**，又常被称作**YUV颜色空间**，是用于数字电视的颜色空间
在ITU-R BT.601、BT.709、BT.2020标准中被明确定义，这三种标准分别针对标清、高清、超高清数字电视。

**Y是亮度，Cb（U）、Cr（V）表示色度，描述颜色的色调与饱和度。**
其中**Cr反映RGB中红色部分与Y亮度值之间的差异**
**Cb则反映蓝色部分与亮度值之间的差异**。
在广播电视中，使用YCbCr可解决黑白电视和彩色电视之间的信号兼容问题。

由于人眼对**色度变化没有对亮度变化敏感**，在图像质量损失忽略不计的前提下，可以降低Cb、Cr通道的采样率，从而有效压缩Cb、Cr通道的数据量，使图像数据占用较少的空间。
常见的YCbCr采样频率格式包括

- 4: 4: 0，平均每像素3字节
- 4: 2: 2，平均每像素2字节
- 4: 2: 0，平均每像素1.5字节
![yuv-intro](/media-processing/yuv-intro.png)

### YUV444

YUV4:4:4在存储格式上和RGB图像的存储方法一致，Y、U、V三个分量连续存放，如下图所示。
![yuv-layout](/media-processing/yuv-layout.png)

---

YUV 格式有3大类 ：

1. Planar：平面格式， 先连续存储所有像素点的Y，紧接着存储所有像素点的U，随后是所有像素点的V.
2. Semi-Planar：半平面的YUV格式，Y分量单独存储，但是UV分量交叉存储。
3. Packed：每个像素点的Y,U,V是连续交错存储的。

注意：这里的连续存储，不是一行像素里面连续存储，是整张图片的连续存储，例如 本文的 out444.yuv 图片是 16875Kb 大小，那第 1~ 5625 都是 Y 的数据， 5626 ~ 11250 都是 像素点的 U 数据，以此类推。

下面 `FFmpeg` 命令把 `jpeg` 转 `yuv` 的时候，使用的格式是 `yuv444p`，后面的 `p` 就代表 `planar`，我们只关注 **planar格式**
yuv 图片的像素存储顺序 是从 左上角 到 右下角的。所以如果我们想把 图像的左上角3个像素改成 白色，只需要 把前面 3 字节 从 0 改成 255 即可。Y 是亮度，最亮的值就是白色。如下：
![](/media-processing/yuv-edit.png)
打开图片，就会发现左上角的3个像素变成白色了
![](/media-processing/yuv-edit-demo.png)

---

YUV 转 RGB 的时候，肯定需要 知道 Y ，U 跟 V 的值，现在 UV 少了一半，怎么分？

是这样分的，第一个像素跟第二个像素 共享一个UV。这里要提及一下 422 格式里面的 U 值是新值，是由第一个像素跟第二个像素的 U 值加起来除以 2 得到的，所以 422 格式的 UV 值 其实是平均值。

所以，422 格式，是第一第二个像素共享 一组UV，第三第四像素共享 一组 UV，以此类推，如下图：

![](https://ffmpeg.xianwaizhiyin.net/base-knowledge/raw-yuv-data/raw-yuv-data-1-8.png)

![](https://ffmpeg.xianwaizhiyin.net/base-knowledge/raw-yuv-data/raw-yuv-data-1-9.png)

上图中的空白格代表不占空间，画出来只是为了方便理解，图中的存储顺序不是 planar 格式，也是为了方便理解。

大家可以数一下 上面 两张图片的格子（不包含空格子），会发现 YUV422 确实 比 YUV444 少了 三分之一 的格子。

### YUV420

数据量最少的 YUV420 格式，这个格式也是应用最广泛的的，视频会议，数字电视，DVD，都用的 YUV420 格式。请看下图：

![](https://ffmpeg.xianwaizhiyin.net/base-knowledge/raw-yuv-data/raw-yuv-data-1-10.png)

从上图可以看出，第一行的第1，第2 像素，第二行的 第1，第2 像素共用一组 UV，以此类推。为什么不是 第一行的 第 1~ 4 个像素共享 一组 UV，这是因为如果这样搞，空间距离太远，容易造成体验不太好。换行共享 UV 的空间距离短，画面过渡会自然一些。

这些 UV 值都是新值，是以前的 4 个像素的 U 值加起来 除以4 的平均值。

其实有好几种求 UV 值算法。

1，平均值，4 个像素的 U 值加起来 除以4。

2，加权，例如第一第二个像素的U权重大点，第三第四个像素的U权重小一点。

3，直接丢弃 第二，第三，第四个像素的 U值，取 第一个 像素的 U 值。V值同理。

其中**取平均值**比较靠谱，FFmpeg 的代码也有这个算法，具体是求平均还是加权

## RGB与YUV的转化

RGB Color Model 和 YUV Color Model之间是可以相互转化的，在**BT.2020标准——超高清数字电视（UHDTV）标准**下，转化公式如下：

$$
\begin{bmatrix}
R \\
G \\
B
\end{bmatrix}
=
\begin{bmatrix}
1&0&1.4746\\
1&-0.16455312684366&-0.57135312684366\\
1&1.8814&0
\end{bmatrix}
\begin{bmatrix}
Y' \\
C_B \\
C_R
\end{bmatrix}
$$

## 动手操作

首先我先通过如下的命令来将同一张照片分别转码为YUV444,YUV422和YUV420格式

```
ffmpeg -i .\275386.jpg -s 3200*1800 -pix_fmt yuv444p out444.yuv
ffmpeg -i .\275386.jpg -s 3200*1800 -pix_fmt yuv422p out422.yuv
ffmpeg -i .\275386.jpg -s 3200*1800 -pix_fmt yuv420p out420.yuv
```

将一张3200\*1800的jpg图片转为了以下的三张yuv图片，让我们来对比一下
首先是大小：

### YUV422 文件信息

![yuv422-info](/media-processing/yuv422-info.png)

### YUV444 文件信息

![yuv444-info](/media-processing/yuv444-info.png)

显然，420比444编码小了一半
然后比较一下清晰度：

### YUV422 图片

![yuv422-demo](/media-processing/yuv422-demo.png)

### YUV444 图片

![yuv444-demo](/media-processing/yuv444-demo.png)

通过观察，我们发现这两张照片并没有明显的差距，换句话说，就是YUV420 比 YUV444 少了一半数据，视觉体验几乎没有变化。

由于大多数视频编码使用的是 YUV420，所以我们经常说的视频分辨率，是指他的**亮度分辨率**，因为只有亮度才是铺满的，UV 不是。

YUV格式的文件比BMP格式更有理由被称为文件裸数据，毕竟它连文件的宽高都不会记录，只会忠实地记载图片的信息，也就是说，如果你不知道一张YUV图片的宽高和采样格式，你就没有办法正常打开这张图片.

所以，YUV图片文件除了 原始的像素数据，其他什么都没有。由于 4:4:4 跟 RGB24 一样，每个像素占 3 字节，图片宽高是 $3200*1800$ ，所以这个 yuv 图片的大小如下：

$$
size=height∗width∗3
$$

所以这个 `out444.yuv` 图片一共是 $3200*1800*3=16875Kb~=16.47Mb$ 大小。
