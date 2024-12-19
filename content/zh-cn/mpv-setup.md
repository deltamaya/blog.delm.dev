---
title: MPV播放器设置
date: 2024-11-18
tags: ['媒体处理', '动漫', '设置']
authors: ['Maya']
ai: true
---

## 为什么选择MPV?

MPV并不是一个播放器，而是一个视频播放器的库，就像**libvlc**和**VLC Player**一样。
但MPV更加轻量和可配置，可以实现更好的观看体验。

## 下载和安装

您可以通过以下链接在Windows上获取最新版本的MPV播放器：[mpv.net](https://github.com/mpvnet-player/mpv.net/releases)

或者您可以使用跨平台版本：[mpv.io](https://mpv.io/installation/)

安装完成后，您几乎可以播放任何类型的视频，因为libmpv基于FFmpeg，提供了广泛的视频编码和容器格式支持。

## 快捷键

记住一些快捷键是非常有用的，这比图形用户界面提供了更快速的访问。

- `s` 截取屏幕
- `t` 或 `i` 显示统计信息
- `[`和`]` 调整播放速度

这里是MPV快捷键的快速参考：[链接](https://mpv.io/manual/master/#interactive-control)

## 配置

这是最重要的部分，您可以通过配置文件完全控制MPV播放器的行为。
前往MPV的安装文件夹，创建一个名为`portable_config`的文件夹，然后在其中创建一个`mpv.conf`文件。

> [!TIP]
> 如果您没有指定安装路径，它应该位于`C:/Users/{username}/AppData/Roaming/mpv/`或`C:/Program Files/mpv.net`。
>
> 如果您的安装路径位于系统文件夹（如后者），您需要确保启用了特定用户和软件的访问权限：
> 右键点击文件夹 -> 属性 -> 安全 -> 编辑 -> 应用

以下是一些基本的配置设置：

```ini
# 使用高质量渲染设置
profile=gpu-hq
cscale=catmull_rom
deband=yes
blend-subtitles=video
video-sync=display-resample

# 减少下拉抖动
video-sync=display-resample
# interpolation=yes
tscale=oversample
icc-cache-dir="~~/icc_cache"
# 启用硬件解码
hwdec=d3d11va
# 尝试所有解码器与hwaccel
hwdec-codecs=all
gpu-shader-cache-dir="~~/shaders_cache"

keep-open=yes
save-position-on-quit=yes
screenshot-format=png
sub-auto=fuzzy
```

您可以直接复制粘贴，也可以搜索互联网根据自己的计算机设置自定义您的`mpv.conf`。

顺便说一下，您可以在同一路径下使用`input.conf`自定义快捷键。

## 着色器

MPV支持第三方着色器，可以美化您的视频体验。

在我的情况下，我将使用[Anime4K](https://github.com/bloc97/Anime4K)，只需下载最新版本并将`something.glsl`或`something.hook`文件移入您的配置文件夹。

如果您使用Anime4K，请将以下内容添加到`input.conf`中，以启用对着色器的键盘控制：

```
# 针对高端GPU的优化着色器
CTRL+1 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: 模式A (HQ)"
CTRL+2 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_Soft_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: 模式B (HQ)"
CTRL+3 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Deblur_DoG.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl.glsl;"; show-text "Anime4K: 模式C (HQ)"

CTRL+0 no-osd change-list glsl-shaders clr ""; show-text "已清除GLSL着色器"
```

如果这不适合您，请检查这些文件名是否与配置文件夹中的着色器文件匹配。

之后，您可以在播放视频时切换着色器！

## VapourSynth

VS是一个开源的非线性视频帧处理服务插件，使用Python作为脚本语言。
MPV支持以过滤器的形式将VS插入到视频播放过程中。

要使用VapourSynth，您需要先安装它：

从以下链接下载最新的zip文件：[VapourSynth](https://github.com/vapoursynth/vapoursynth/releases)，
然后将其解压到MPV安装文件夹中。

接着，您需要下载Python，因为插件使用Python执行：[Python](https://www.python.org/downloads/)

> [!TIP]
> 根据您的VapourSynth版本，您可能需要`Python 3.12.x`或`Python 3.8.x`，选择一个符合您需求的版本。
>
> 如果您的计算机上已经安装了Python，而您不想安装另一个版本，可以使用嵌入式版本，只需下载并将其解压到MPV安装文件夹中。

### pip

如果您使用的是嵌入式版本的Python和最新版本的VapourSynth，请按照以下步骤操作。

最新版的VapourSynth需要您从`pip`下载包，但嵌入式版本的Python不包含`pip`，这意味着您无法使用`pip install`。

您可以通过以下步骤获取`pip`：

1. 前往嵌入式Python安装文件夹。
2. 编辑`python312.__pth`文件，取消注释`import site`这一行。
3. 从此链接下载`get-pip.py`：[get-pip](https://bootstrap.pypa.io/get-pip.py)，并将其放入该文件夹。
4. 运行`python get-pip.py`。

完成这些步骤后，您可以使用`./Scripts/pip install VapourSynth`来安装该包。

### mvtools

安装VapourSynth后，您可以使用mvtools来处理视频。
通过以下链接获取mvtools：[mvtools](https://github.com/dubhater/vapoursynth-mvtools/releases)，
然后将`libmvtools.dll`提取到`{installation path}/vs-plugins`中。

最后一步是获取调用mvtools的Python脚本：
[链接](https://gist.github.com/KCCat/1b3a7b7f085a066af3719859f88ded02)

下载该文件并将其放入配置路径（`portable_config`）中。

## 修改输入

您已经设置了所有插件，您需要做的就是调用它。
将以下行添加到您的`input.conf`中：

```
CTRL+v vf toggle vapoursynth="~~/{filename}.vpy"
```

然后只需按`Ctrl+v`即可享受60帧和超高分辨率的动漫体验！

## 参考文献

[mpv 播放器的使用【入门】](https://hooke007.github.io/mpv-lazy/mpv.html)

[跨平台播放器mpv 配置入门](https://vcb-s.com/archives/7594)

[mpv播放器的使用引导](https://hooke007.github.io/unofficial/mpv_start.html)
