---
title: The YUV Color Model
date: 2024-09-21
tags: ['graphics', 'media-processing']
authors: ['Maya']
ai: true
---

The **YCbCr color space**, often referred to as the **YUV color space**, is a color space used for digital television. It is explicitly defined in the ITU-R BT.601, BT.709, and BT.2020 standards, which cater to standard definition, high definition, and ultra-high definition digital television, respectively.

**Y represents brightness, while Cb (U) and Cr (V) signify chrominance, describing the hue and saturation of colors.**
Here, **Cr reflects the difference between the red component of RGB and the Y brightness value**, while **Cb reflects the difference between the blue component and the brightness value**. In broadcast television, using YCbCr helps address the signal compatibility issue between black-and-white and color television.

Since the human eye is **less sensitive to variations in chrominance compared to variations in brightness**, the sampling rate of the Cb and Cr channels can be reduced without significantly affecting image quality. This effectively compresses the data for Cb and Cr channels, allowing the image data to occupy less space. Common YCbCr sampling frequency formats include:

- 4:4:0, averaging 3 bytes per pixel
- 4:2:2, averaging 2 bytes per pixel
- 4:2:0, averaging 1.5 bytes per pixel
  ![yuv-intro](/media-processing/yuv-intro.png)

### YUV444

YUV 4:4:4 maintains the same storage format as RGB images, with the Y, U, and V components stored sequentially, as shown in the image below.
![yuv-layout](/media-processing/yuv-layout.png)

---

There are three main types of YUV formats:

1. **Planar**: In this format, all Y pixel data is stored continuously, followed by all U pixel data, and then all V pixel data.
2. **Semi-Planar**: In this YUV format, the Y component is stored separately, while the U and V components are stored in an interleaved manner.
3. **Packed**: Here, the Y, U, and V values for each pixel are stored interleaved.

Note: The term "continuous storage" here refers to the entire image's continuous storage rather than continuous storage within a single row of pixels. For example, in the out444.yuv image described in this article, which is 16875 KB in size, the first 5625 bytes correspond to Y data, the next 5625 bytes to U data, and so on.

The following `FFmpeg` command converts `jpeg` images to `yuv` format using the `yuv444p` specification, where the `p` indicates `planar`. We focus specifically on the **planar format**.
In a YUV image, the pixel storage order is from the top-left corner to the bottom-right. Therefore, to change the upper-left three pixels to white, you only need to modify the first three bytes from 0 to 255. Y indicates brightness, with the brightest value being white. As illustrated:
![](/media-processing/yuv-edit.png)
After opening the image, you'll notice the upper-left three pixels have turned white.
![](/media-processing/yuv-edit-demo.png)

---

When converting YUV to RGB, it is essential to know the values of Y, U, and V. Given that the U and V values are halved, how do we differentiate them?

In this case, the first pixel shares a UV with the second pixel. It's worth noting that in the 422 format, the U value is an average derived from the U values of the first and second pixels added together and divided by 2. Therefore, the UV values in the 422 format are actually average values.

Thus, in the 422 format, the first and second pixels share one set of UV values, the third and fourth pixels share another set of UV values, and so on, as illustrated below:

![](https://ffmpeg.xianwaizhiyin.net/base-knowledge/raw-yuv-data/raw-yuv-data-1-8.png)

![](https://ffmpeg.xianwaizhiyin.net/base-knowledge/raw-yuv-data/raw-yuv-data-1-9.png)

The blank squares in the above graphics denote non-occupying space; they are merely there for clarity. Also, the storage order depicted is not planar format but included for understanding.

Counting the squares in the aforementioned images (excluding the blank ones), you'll find that YUV422 indeed has one-third fewer squares than YUV444.

### YUV420

The YUV420 format requires the least amount of data, making it the most widely used format for applications like video conferencing, digital television, and DVDs. See the image below:

![](https://ffmpeg.xianwaizhiyin.net/base-knowledge/raw-yuv-data/raw-yuv-data-1-10.png)

From the image, it can be seen that the first two pixels in the first row and the first two pixels in the second row share a UV value, and so forth. The reason why the first four pixels in the first row do not share a UV set is that the spatial distance would be too far apart, leading to a poor experience. Sharing UV across rows ensures the spatial distance is shorter, resulting in a more natural image transition.

These UV values are new averages calculated by summing the U values of the previous four pixels and dividing by four.

There are actually several algorithms for obtaining UV values:

1. Average: The U values of four pixels are summed and divided by four.
2. Weighted: For example, assign more weight to the U values of the first two pixels while decreasing the weight for the last two.
3. Simply discard the U values of the second, third, and fourth pixels, taking only the first pixel's U value. The same applies to V values.

Among them, **taking the average** is more reliable, and FFmpeg's code also utilizes this algorithm to determine whether to average or weight.

## Conversion Between RGB and YUV

The conversion between the RGB Color Model and the YUV Color Model is feasible, governed by the formulas found in the
**BT.2020 Standard—Ultra High Definition Television (UHDTV)** standard:

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

## Hands-on Practice

I will first use the following commands to convert the same image into YUV444, YUV422, and YUV420 formats:

```bash
ffmpeg -i .\275386.jpg -s 3200*1800 -pix_fmt yuv444p out444.yuv
ffmpeg -i .\275386.jpg -s 3200*1800 -pix_fmt yuv422p out422.yuv
ffmpeg -i .\275386.jpg -s 3200*1800 -pix_fmt yuv420p out420.yuv
```

This converts a 3200\*1800 JPG image into three YUV images, and let's compare them.
First, let's look at their sizes:

### YUV422 File Information

![yuv422-info](/media-processing/yuv422-info.png)

### YUV444 File Information

![yuv444-info](/media-processing/yuv444-info.png)

Evidently, the size of YUV420 is half that of YUV444.
Next, let's compare the clarity:

### YUV422 Image

![yuv422-demo](/media-processing/yuv422-demo.png)

### YUV444 Image

![yuv444-demo](/media-processing/yuv444-demo.png)

Upon observation, we can conclude that these two images do not show significant differences. In other words, YUV420 uses half the data of YUV444, yet the visual experience remains nearly unchanged.

Since most video encoding utilizes YUV420, when we refer to video resolution, we typically mean its **luminance resolution** because only the luminance is fully populated, while UV is not.

Files in YUV format can be more accurately described as raw data files compared to BMP files because they do not even store the image's width and height, faithfully recording only the pixel information. Therefore, if you do not know a YUV image's width, height, and sampling format, you cannot properly open the image.

Thus, aside from the raw pixel data, a YUV image file contains no additional information. Since 4:4:4 uses the same structure as RGB24, with each pixel occupying 3 bytes, for an image with dimensions $3200*1800$, the size of this YUV image is calculated as follows:

$$
size=height*width*3
$$

Therefore, the `out444.yuv` image has a total size of $3200*1800*3=16875Kb~=16.47Mb$.
