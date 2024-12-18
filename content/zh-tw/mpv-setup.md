---
title: MPV 播放器安裝
date: 2024-11-18
tags: ['media-processing','anime','setup']
authors: ['Maya']
ai: true
---

## 為什麼使用 MPV？

MPV 不是一個播放器，而是一個視頻播放器的庫，就像 **libvlc** 和 **VLC Player** 一樣。
但是 MPV 更加輕量和可配置，能夠提供更好的觀看體驗。

## 下載與安裝

您可以通過這個鏈接獲取 Windows 上的最新版本 MPV 播放器：[mpv.net](https://github.com/mpvnet-player/mpv.net/releases)

或者您可以使用跨平台版本：[mpv.io](https://mpv.io/installation/)

安裝完成後，您幾乎可以播放任何類型的視頻，因為 libmpv 基於 FFmpeg，提供了廣泛的視頻編碼器和容器格式支持。

## 快捷鍵

記住幾個快捷鍵是非常有用的，這能比圖形用戶界面提供更快的訪問。

- `s` 截圖保存
- `t` 或 `i` 顯示統計信息
- `[` 和 `]` 調整播放速度

這裡有一個 MPV 快捷鍵的快速參考：[link](https://mpv.io/manual/master/#interactive-control)

## 配置
這是最重要的部分，您可以通過配置文件完全控制 MPV 播放器的行為。
前往 MPV 的安裝文件夾，創建一個名為 `portable_config` 的文件夾，然後在裡面創建一個 `mpv.conf` 文件。
> [!TIP]
> 如果您沒有指定安裝路徑，它應該位於 `C:/Users/{username}/AppData/Roaming/mpv/` 或 `C:/Program Files/mpv.net`。
>
> 如果您的安裝路徑位於系統文件夾中（如後者），您需要確保啟用了來自某些用戶和軟件的訪問權限：
> 右鍵點擊文件夾 -> 屬性 -> 安全 -> 編輯 -> 應用

以下是一些基本的配置設置：
```ini
# 使用高質量渲染設置
profile=gpu-hq
cscale=catmull_rom
deband=yes
blend-subtitles=video
video-sync=display-resample

# 降低顫動
video-sync=display-resample
# interpolation=yes
tscale=oversample
icc-cache-dir="~~/icc_cache"
# 啟用硬體解碼
hwdec=d3d11va
# 嘗試所有編碼器與 hwaccel
hwdec-codecs=all
gpu-shader-cache-dir="~~/shaders_cache"

keep-open=yes
save-position-on-quit=yes
screenshot-format=png
sub-auto=fuzzy
```
您可以直接複製粘貼，或在互聯網上搜索並根據自己的計算機設置自定義您的 `mpv.conf`。

哦，順便提一下，您可以使用 `input.conf` 在同一路徑中自定義快捷鍵。

## 着色器

MPV 支持第三方着色器，可以美化您的視頻體驗。

在我的情況下，我將使用 [Anime4K](https://github.com/bloc97/Anime4K)，只需下載最新的發行版本，然後將那些 `something.glsl` 或 `something.hook` 移動到您的配置文件夾中。

如果您正在使用 Anime4K，將这些内容添加到 `input.conf` 中將啟用着色器的鍵盤控制：
```
# 為高端 GPU 優化的着色器
CTRL+1 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: 模式 A (HQ)"
CTRL+2 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_Soft_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: 模式 B (HQ)"
CTRL+3 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Deblur_DoG.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl.glsl;"; show-text "Anime4K: 模式 C (HQ)"

CTRL+0 no-osd change-list glsl-shaders clr ""; show-text "GLSL 着色器已清除"
```
如果這不適合您，可以檢查那些文件名是否與配置文件夾中的着色器文件匹配。

之後，您可以在播放視頻時切換着色器！

## VapourSynth
VapourSynth（VS）是一個開源的非線性處理視頻幀服務插件，使用 Python 作為腳本語言。
MPV 支持將 VS 插入到視頻播放過程中，形成過濾器。

要使用 VapourSynth，您需要先安裝它：

在這個鏈接下載最新的壓縮檔： [VapourSynth](https://github.com/vapoursynth/vapoursynth/releases)，
您應當將其解壓到 MPV 的安裝文件夾中。

然後您應該下載 Python，因為插件使用 Python 執行: [Python](https://www.python.org/downloads/)

> [!TIP]
> 根據您的 VapourSynth 版本，您可能需要 `Python 3.12.x` 或 `Python 3.8.x`，選擇一個符合您需求的版本。
>
> 如果您的計算機已經安裝了 Python 而您不想再安裝另一個版本，可以使用內嵌版本，
> 只需下載並解壓到 MPV 的安裝文件夾中。

### pip

如果您正在使用內嵌版本的 Python 和最新版本的 VapourSynth，請按照以下操作進行。

最新版本的 VapourSynth 需要您從 `pip` 下載包，但內嵌版本的 Python 不包含 `pip`，這意味著您無法使用 `pip install`。

您可以使用以下操作獲取 `pip`：
1. 前往內嵌 Python 的安裝文件夾
2. 編輯 `python312.__pth` 文件，取消註解 `import site` 這一行。
3. 通過這個鏈接下載 `get-pip.py`：[get-pip](https://bootstrap.pypa.io/get-pip.py)，然後放入該文件夾中。
4. 執行 `python get-pip.py`

完成這些步驟後，您可以使用 `./Scripts/pip install VapourSynth` 來安裝該包。

### mvtools
安裝 VapourSynth 後，您可以使用 mvtools 進行視頻框架處理。
通過這個鏈接獲取 mvtools：[mvtools](https://github.com/dubhater/vapoursynth-mvtools/releases)，
然後將 `libmvtools.dll` 解壓到 `{installation path}/vs-plugins` 文件夾中。

最後一步是獲取調用 mvtools 的 Python 腳本：
[link](https://gist.github.com/KCCat/1b3a7b7f085a066af3719859f88ded02)

下載該文件並放入配置路徑（`portable_config`）。

## 修改輸入
您已經安裝了所有插件，現在只需要調用它們。
在您的 `input.conf` 中添加這一行：
```
CTRL+v vf toggle vapoursynth="~~/{filename}.vpy"
```
然後只需按下 `Ctrl+v` 以享受 60 幀每秒的高解析度動畫體驗！

## 參考資料
[mpv 播放器的使用【入門】](https://hooke007.github.io/mpv-lazy/mpv.html)

[跨平台播放器mpv 配置入門](https://vcb-s.com/archives/7594)

[mpv 播放器的使用指引](https://hooke007.github.io/unofficial/mpv_start.html)