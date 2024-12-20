---
title: MPV 播放器設定
date: 2024-11-18
tags: ['媒體處理', '動漫', '設置']
authors: ['Maya']
ai: true
---

## 為什麼選擇 MPV？

MPV 不僅僅是一個普通的視頻播放器，它是一個播放器庫，就像 **libvlc** 和 **VLC 播放器**。  
不過，MPV 更輕量化且高度可配置，能夠提供更好的觀影體驗。

## 下載與安裝

您可以通過以下鏈接下載適用於 Windows 的最新 MPV 播放器：[mpv.net](https://github.com/mpvnet-player/mpv.net/releases)

或者選擇跨平台版本：[mpv.io](https://mpv.io/installation/)

完成安裝後，幾乎可以播放所有視頻類型，因為 MPV 基於 FFmpeg，支持廣泛的視頻編解碼器與容器格式。

## 快捷鍵

熟悉一些快捷鍵會讓您的操作比使用圖形界面更加高效。

- `s` 保存截圖
- `t` 或 `i` 顯示統計信息
- `[` 和 `]` 調整播放速度

更多快捷鍵請參考 MPV 手冊：[完整快捷鍵列表](https://mpv.io/manual/master/#interactive-control)

## 配置檔案

這是最關鍵的部分，通過配置檔案可以完全掌控 MPV 播放器的行為。  
前往 MPV 的安裝目錄，創建名為 `portable_config` 的文件夾，然後在其中創建一個 `mpv.conf` 文件。

> ![TIP]
> 如果您未指定安裝路徑，默認位置可能為：
> `C:/Users/{username}/AppData/Roaming/mpv/` 或 `C:/Program Files/mpv.net`。
>
> 如果 MPV 安裝在系統文件夾（如後者），請確保啟用對特定用戶和應用程式的訪問權限：
> 右鍵單擊文件夾 → 屬性 → 安全 → 編輯 → 應用

以下是一些基本的配置：

```ini
# 使用高品質渲染設置
profile=gpu-hq
cscale=catmull_rom
deband=yes
blend-subtitles=video
video-sync=display-resample

# 減少畫面撕裂
video-sync=display-resample
# interpolation=yes
tscale=oversample
icc-cache-dir="~~/icc_cache"
# 啟用硬件解碼
hwdec=d3d11va
# 嘗試所有支持硬件加速的解碼器
hwdec-codecs=all
gpu-shader-cache-dir="~~/shaders_cache"

keep-open=yes
save-position-on-quit=yes
screenshot-format=png
sub-auto=fuzzy
```

您可以直接複製以上內容，或根據您的電腦配置在網絡上查找並自定義 `mpv.conf`。

此外，也可以在同一路徑下通過 `input.conf` 自定義快捷鍵。

## 著色器

MPV 支持第三方著色器，可優化視頻的觀看體驗。

在我的環境中，我使用 [Anime4K](https://github.com/bloc97/Anime4K)。下載最新版本後，將 `*.glsl` 或 `*.hook` 文件放到配置文件夾中。

若使用 Anime4K，可在 `input.conf` 中加入以下快捷鍵設定：

```
# 高端 GPU 模式著色器
CTRL+1 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: 模式 A (高品質)"
CTRL+2 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Clamp_Highlights.glsl;~~/shaders/Anime4K_Restore_CNN_Soft_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_VL.glsl;~~/shaders/Anime4K_AutoDownscalePre_x2.glsl;~~/shaders/Anime4K_AutoDownscalePre_x4.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl"; show-text "Anime4K: 模式 B (高品質)"
CTRL+3 no-osd change-list glsl-shaders set "~~/shaders/Anime4K_Deblur_DoG.glsl;~~/shaders/Anime4K_Restore_CNN_VL.glsl;~~/shaders/Anime4K_Upscale_CNN_x2_M.glsl.glsl;"; show-text "Anime4K: 模式 C (高品質)"

CTRL+0 no-osd change-list glsl-shaders clr ""; show-text "GLSL shaders 清除"
```

如果文件名無法匹配，請檢查著色器文件的名稱是否一致。

## VapourSynth

VapourSynth 是一個開源的非線性視頻處理插件，使用 Python 作為腳本語言。  
MPV 支持通過 VapourSynth 作為濾鏡插入來處理視頻播放。

### 安裝步驟

1. 下載 VapourSynth 的最新壓縮包：[VapourSynth](https://github.com/vapoursynth/vapoursynth/releases) 並解壓到 MPV 的安裝目錄。
2. 安裝 Python：[Python](https://www.python.org/downloads/)

> ![TIP]
> 根據 VapourSynth 版本可能需要 `Python 3.12.x` 或 `Python 3.8.x`。請選擇對應版本。
>
> 若已有 Python，可選擇嵌入版本，直接解壓到 MPV 安裝目錄。

### 安裝 pip

如果使用嵌入式 Python 版本，請執行以下步驟：

1. 打開嵌入式 Python 安裝目錄。
2. 編輯 `python312.__pth` 文件，取消註釋 `import site`。
3. 下載 `get-pip.py`：[鏈接]() 並保存至目錄。
4. 執行 `python get-pip.py`。

完成後執行 `./Scripts/pip install VapourSynth` 安裝 VapourSynth。

### 安裝 mvtools

安裝 VapourSynth 後，您可以通過以下鏈接獲取 mvtools：[mvtools](https://github.com/dubhater/vapoursynth-mvtools/releases)，並將 `libmvtools.dll` 解壓至 `{installation path}/vs-plugins`。

最後，下載支持 mvtools 的 Python 腳本：[下載鏈接](https://gist.github.com/KCCat/1b3a7b7f085a066af3719859f88ded02)，放入配置目錄（`portable_config`）。

## 調用濾鏡

完成插件安裝後，只需在 `input.conf` 添加以下內容：

```
CTRL+v vf toggle vapoursynth="~~/{filename}.vpy"
```

播放視頻時按下 `Ctrl+v`，即可享受 60 FPS 和高畫質的動漫播放體驗！

## 參考文獻

[mpv 播放器的使用【入门】](https://hooke007.github.io/mpv-lazy/mpv.html)

[跨平台播放器 mpv 配置入门](https://vcb-s.com/archives/7594)

[mpv 播放器的使用引导](https://hooke007.github.io/unofficial/mpv_start.html)