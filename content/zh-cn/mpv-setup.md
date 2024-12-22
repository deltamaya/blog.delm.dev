---
title: MPV 播放器设置
date: 2024-11-18
tags: ['media-processing', 'anime', 'setup']
authors: ['Maya']
ai: true
---

## 为什么选择 MPV？

MPV 不是一个简单的视频播放器，而是一个播放器库，就像 **libvlc** 和 **VLC Player**。  
但 MPV 更轻量化且可配置，能够提供更好的观影体验。

## 下载与安装

您可以通过以下链接下载 Windows 最新版本的 MPV 播放器：[mpv.net](https://github.com/mpvnet-player/mpv.net/releases)

或者使用跨平台版本：[mpv.io](https://mpv.io/installation/)

安装完成后，您几乎可以播放任何类型的视频，因为 libmpv 基于 FFmpeg，支持广泛的视频编解码器和容器格式。

## 快捷键

记住一些快捷键非常实用，比 GUI 界面操作更快捷。

- `s` 保存截图
- `t` 或 `i` 显示统计信息
- `[` 和 `]` 调整播放速度

您可以参考 MPV 快捷键的完整列表：[链接](https://mpv.io/manual/master/#interactive-control)

## 配置文件

这是最重要的部分，您可以通过配置文件完全控制 MPV 播放器的行为。  
前往 MPV 的安装目录，创建一个名为 `portable_config` 的文件夹，然后在其中创建一个名为 `mpv.conf` 的文件。

> [!TIP]
> 如果您未指定安装路径，默认位置可能在：
> `C:/Users/{username}/AppData/Roaming/mpv/` 或 `C:/Program Files/mpv.net`。
>
> 如果您的安装路径在系统文件夹（如后者），请确保您已启用对特定用户和软件的访问权限：
> 右键单击文件夹 → 属性 → 安全 → 编辑 → 应用

以下是一些基本的配置：

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
# 尝试所有带硬件加速的解码器
hwdec-codecs=all
gpu-shader-cache-dir="~~/shaders_cache"

keep-open=yes
save-position-on-quit=yes
screenshot-format=png
sub-auto=fuzzy
```

您可以复制粘贴以上内容，或者根据您的计算机配置在网上查找并自定义 `mpv.conf`。

另外，您还可以在同一路径下通过 `input.conf` 文件自定义快捷键。

## 着色器

MPV 支持第三方着色器，可以美化视频观影体验。

在我的环境中，我使用 [Anime4K](https://github.com/bloc97/Anime4K)。下载最新版本并将 `*.glsl` 或 `*.hook` 文件移动到配置文件夹中。

如果使用 Anime4K，可以在 `input.conf` 文件中添加以下内容以启用快捷键控制着色器：

```
# 为高端 GPU 优化的着色器
CTRL+1 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: Mode A (HQ)"
CTRL+2 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_Soft_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: Mode B (HQ)"
CTRL+3 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Deblur_DoG.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl.glsl;"; show-text "Anime4K: Mode C (HQ)"

CTRL+0 no-osd change-list glsl-shaders clr ""; show-text "GLSL shaders cleared"
```

如果这些设置不适合您的文件名，请检查配置文件夹中的着色器文件名是否匹配。

之后，您就可以在播放视频时切换着色器！

## VapourSynth

VapourSynth 是一个开源的非线性视频帧处理插件，使用 Python 作为脚本语言。  
MPV 支持以滤镜形式插入 VapourSynth 来处理视频播放。

### 安装步骤

1. 下载最新版本的压缩文件：[VapourSynth](https://github.com/vapoursynth/vapoursynth/releases) 并解压到 MPV 的安装目录。
2. 下载 Python，因为插件需要 Python 执行脚本：[Python](https://www.python.org/downloads/)

> [!TIP]
> 根据您的 VapourSynth 版本，可能需要 `Python 3.12.x` 或 `Python 3.8.x`。请选择适合您的版本。
>
> 如果您的电脑已经安装了 Python，但不想再安装其他版本，可以使用嵌入版本：下载并解压到 MPV 安装目录。

### 安装 pip

如果您使用嵌入式 Python 版本和最新的 VapourSynth，请执行以下操作：

1. 前往嵌入式 Python 安装目录。
2. 编辑 `python312.__pth` 文件，取消注释 `import site`。
3. 下载 `get-pip.py`：[链接](https://bootstrap.pypa.io/get-pip.py) 并保存到此目录。
4. 运行 `python get-pip.py`。

完成后，您可以通过 `./Scripts/pip install VapourSynth` 安装 VapourSynth。

### 安装 mvtools

安装 VapourSynth 后，您可以使用 mvtools 对视频进行帧处理。  
通过以下链接获取 mvtools：[mvtools](https://github.com/dubhater/vapoursynth-mvtools/releases)，将 `libmvtools.dll` 解压到 `{installation path}/vs-plugins` 文件夹中。

最后，获取调用 mvtools 的 Python 脚本：[下载链接](https://gist.github.com/KCCat/1b3a7b7f085a066af3719859f88ded02)，并放到配置路径（`portable_config`）中。

## 调用滤镜

插件安装完成后，只需在 `input.conf` 中添加以下内容：

```
CTRL+v vf toggle vapoursynth="~~/{filename}.vpy"
```

按下 `Ctrl+v`，即可享受 60 FPS 和超高分辨率的动漫观影体验！

## 参考文献

[mpv 播放器的使用【入门】](https://hooke007.github.io/mpv-lazy/mpv.html)

[跨平台播放器 mpv 配置入门](https://vcb-s.com/archives/7594)

[mpv 播放器的使用引导](https://hooke007.github.io/unofficial/mpv_start.html)
