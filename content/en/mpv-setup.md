---
title: MPV Player Setup
date: 2024-11-18
tags: ['media-processing', 'anime', 'setup']
authors: ['Maya']
ai: false
---

## Why Use MPV?

MPV is not a player, it's video player's library, just like **libvlc** and **VLC Player**.
But MPV is more light-weight and configurable, which could achieve a better watching experience.

## Download And Install

You could get the newest version of MPV player on Windows via this link: [mpv.net](https://github.com/mpvnet-player/mpv.net/releases)

Or you can use the cross-platform version: [mpv.io](https://mpv.io/installation/)

When your installation is done, you could play almost any kind of video, as libmpv is based on
FFmpeg, which provides a wide support for video codec and container format.

## Shortcuts

It's useful to remember a few shortcuts, which provides a faster access than GUI.

- `s` to save screenshot
- `t` or `i` to show stats
- `[`and`]` to adjust playback speed

Here is a quick reference to MPV shortcuts: [link](https://mpv.io/manual/master/#interactive-control)

## Configuration

Here is the most important part, you could fully control MPV player's behavior using a config file.
Go to the installation folder of MPV and create a folder called `portable_config`, and then create a `mpv.conf` inside.

> [!TIP]
> If you didn't specify the installation path, it should locate at `C:/Users/{username}/AppData/Roaming/mpv/` or `C:/Program Files/mpv.net`.
>
> If your install path is in the system folder(like the latter one), you'll need to make sure that you enabled access from
> certain user and software:
> Right Click Folder -> Properties -> Security -> Edit -> Apply

Here is some basic configuration settings:

```ini
# use high quality render settings
profile=gpu-hq
cscale=catmull_rom
deband=yes
blend-subtitles=video
video-sync=display-resample

# reduce pull down judder
video-sync=display-resample
# interpolation=yes
tscale=oversample
icc-cache-dir="~~/icc_cache"
# enable hardware decoding
hwdec=d3d11va
# try all codecs with hwaccel
hwdec-codecs=all
gpu-shader-cache-dir="~~/shaders_cache"

keep-open=yes
save-position-on-quit=yes
screenshot-format=png
sub-auto=fuzzy
```

You could just copy-and-paste, or search the Internet and customize your own `mpv.conf` based your own computer setup.

Oh, by the way you could customize shortcuts using the `input.conf` in the same path.

## Shaders

MPV supports third party shaders, which your prettify your video experience.

In my circumstance, I'm going to use [Anime4K](https://github.com/bloc97/Anime4K), just download it the latest release
and move those `something.glsl` or `something.hook` into your config folder.

And if you are using Anime4K, add those into `input.conf` will enable the keyboard control of shaders:

```
# Optimized shaders for higher-end GPU
CTRL+1 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: Mode A (HQ)"
CTRL+2 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_Soft_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: Mode B (HQ)"
CTRL+3 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Deblur_DoG.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl.glsl;"; show-text "Anime4K: Mode C (HQ)"

CTRL+0 no-osd change-list glsl-shaders clr ""; show-text "GLSL shaders cleared"
```

If this doesn't fit for you, go check whether those filenames match your shader files in the config folder.

After that, you could toggle shader while playing video!

## VapourSynth

VS is an open source non-linear processing video frame service plug-in that uses Python as the scripting language.
MPV supports VS being inserted into the video playback process in the form of filters.

To use VapourSynth, you need to install it first:

After you download the latest zip file from this link: [VapourSynth](https://github.com/vapoursynth/vapoursynth/releases),
you should extract it to the MPV installation folder.

Then you should download python as the plugin uses python to execute: [Python](https://www.python.org/downloads/)

> [!TIP]
> Based on your VapourSynth version, you may need `Python 3.12.x` or `Python 3.8.x`, pick a version that matches your need.
>
> If your computer already has Python and you don't want to install another version of it, you could use the embedded version,
> just download and decompress it into the MPV installation folder.

### pip

If you're using embedded version of python and the latest version of VapourSynth, please follow these operation.

The latest version of VapourSynth needs you to download the package from `pip`, but the
embedded version of Python does not contain `pip`, which means you can not use `pip install`.

You could get `pip` with the following operations:

1. Go to the embedded python installation folder
2. Edit the `python312.__pth` file, uncomment the line `import site`.
3. Download `get-pip.py` via this link: [get-pip](https://bootstrap.pypa.io/get-pip.py) to this folder.
4. Run `python get-pip.py`

When you finish these steps, you could use `./Scripts/pip install VapourSynth` to install the package.

### mvtools

After you installed VapourSynth, you could framing video with mvtools.
Acquire mvtools via this link: [mvtools](https://github.com/dubhater/vapoursynth-mvtools/releases),
then extract the `libmvtools.dll` into the `{installation path}/vs-plugins`.

The last step is to get the python script which calls the mvtools:
[link](https://gist.github.com/KCCat/1b3a7b7f085a066af3719859f88ded02)

Download the file and put it to the config path(`portable_config`).

## Modify Input

You have already setup all plugins, all you need to do is to call it.
Add this line to your `input.conf`:

```
CTRL+v vf toggle vapoursynth="~~/{filename}.vpy"
```

Then just press `Ctrl+v` to enjoy a 60-fps and hyper-resolution anime experience!

## References

[mpv 播放器的使用【入门】](https://hooke007.github.io/mpv-lazy/mpv.html)

[跨平台播放器mpv 配置入门](https://vcb-s.com/archives/7594)

[mpv播放器的使用引导](https://hooke007.github.io/unofficial/mpv_start.html)
