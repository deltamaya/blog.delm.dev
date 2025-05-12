

alising走样
## artifacts
当信号采样的速度跟不上信号变化的速度, 那么就会产生artifacts

- jaggies
- moire 
- wagon wheel effects

> 走样: 即当两个信号的采样结果完全相同, 我们无法将其区分.

为了减少锯齿或者是进行反走样, 我们通常需要先对图像进行模糊然后再进行采样.
 但是这里先进行采样再进行模糊是行不通的.
## 傅立叶极数展开
通过傅立叶极数展开我们可以将任何一个函数转化成多个正弦或者余弦函数和一个常数项的和.

## 傅立叶变换

傅立叶变换是将数据从时域(spatial domain)变换到频域(frequency domain)的一种办法. 

## filtering 滤波
filtering 可以将在频域上的一个频段中的信息进行抹除

high-pass filtering 高通滤波 与上面的定义相反
得到的结果就会是一张像是边缘检测的图, 你可以这么想, 物体的边缘处变化会比物体里面变化更明显, 所以这里的信号变化强度最大, 频率最高, 所以高通滤波会只保留这些边缘的高频率信号.

low-pass filtering 低通滤波 指的是将频谱中的高频抹除, 将低频保留

你会得到一张模糊的图片, 因为高通是保留边缘, 那低通就是消除边缘嘛, 物体的边缘被消除了那图片自然就模糊了.

> 数字信号处理: 信号在时域上的卷积=频域上的乘积, 反之亦然.

为了反走样, 我们可以通过直接在时域上进行卷积进行模糊,
或者可以先通过傅立叶变换到频域, 在频域上进行乘积, 最后在进行逆变换.


![](fourier_transform_result_high_pass.png)
![](fourier_transform_result_low_pass.png)
我们可以通过将原图和一个小的卷积核在频域相乘, 就可以得到一张模糊的图片, 就像是低通滤波的效果.



## 抗锯齿

经过上面的铺垫,  我们可以知道为什么先进行模糊是对的. 先进行模糊相当于将信息的高频信息抹除, 然后展开之后傅立叶空间的信息就不会重叠了, 从而消除了走样.

两个方法:
- 提高屏幕分辨率, 这样确实可以减弱走样效果, 但是显然不切实际, 因为我们想要的抗锯齿效果是在同一块屏幕上进行的.
- 先消除高频信息, 再进行采样

如果你还是不太理解, 只需要知道:

抗锯齿 = 模糊原图 = 低通滤波 = 在时域进行卷积 = 对周围像素求平均


### MSAA
根据上面的理论, 具体的实现方法就是多采样抗锯齿. 它的原理就是在一个像素中采样多个采样点, 根据多个采样的的平均对最终颜色进行一个插值即可.


There are still many useful anti aliasing techniques, but I'll just do a quick introduction here
### FXAA

here is a brief introduction of how does FXAA(Fast Approximation Anti-Aliasing) works:

> FXAA works by analyzing the rendered image in a post-processing step. It detects edges by comparing pixel luminance or color contrast, then selectively blurs those edges to reduce jaggedness. The algorithm uses a single-pass shader to smooth pixels, prioritizing high-contrast areas while preserving non-edge details. This process is fast and doesn't require geometry or depth data, making it efficient for real-time applications, though it may slightly soften textures.
### TAA
 
> Temporal Anti-Aliasing (TAA) is a post-processing anti-aliasing technique that reduces jagged edges and flickering in real-time graphics by leveraging data from multiple frames. It works by blending the current frame with previous frames, using motion vectors to track pixel movement and smooth edges over time. TAA samples sub-pixel details, accumulating them across frames to improve edge quality. While effective for dynamic scenes, it can introduce blur or ghosting artifacts, especially with fast-moving objects, and requires careful tuning for optimal results.






