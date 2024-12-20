---
title: ArcVP 開發日誌#1
date: 2024-09-22
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 什麼是 OpenGL？

首先，OpenGL **不是**一個庫或框架。它是一個圖形 API 規範，這意味著它不像 C++ 那樣包含實際代碼。每個 GPU 製造商都會提供自己的 OpenGL 實現，這也解釋了為什麼同一款遊戲在 NVIDIA 和 AMD 的 GPU 上看起來會稍有不同。儘管名字中有“開放”二字，但它並非真正的開源，因為 GPU 製造商並不會公開其驅動的代碼。

## 我如何“下載” OpenGL？

正如我之前提到的，GPU 製造商已經將 OpenGL 包含在他們的驅動程序中。所以，如果你的 GPU 安裝了正確的驅動程序，那麼你已經擁有了 OpenGL。

## OpenGL 的變體

你可能會遇到一些與 OpenGL 相關的術語，比如 `OpenGL ES`、`WebGL` 等。讓我們逐一了解：

### OpenGL ES

**OpenGL ES (嵌入式系統)** 是 OpenGL API 的子集，專為嵌入式系統設計。它針對資源有限的平台進行了性能優化。

### WebGL

**WebGL** 是基於 OpenGL ES 2.0 的 JavaScript API，它為網頁瀏覽器提供硬件加速的 3D 圖形支持。

### Vulkan

OpenGL 被認為是一個“高級”API，也就是說它更抽象，使用起來更簡單。然而，這種抽象帶來了一定的開銷，可能會降低性能。而 **Vulkan** 是一個更底層的圖形 API，它為開發者提供了更多硬件控制能力，從而實現更快的代碼執行，但實現起來更為複雜。

## 其他圖形 API

OpenGL 是一個跨平台的圖形 API，但也有一些專屬於特定平台的 API，比如 Metal 和 DirectX。

### Metal

**Metal** 是 **蘋果公司** 專屬的圖形 API，為 Apple Silicon 提供高度優化的低級控制和更高性能。在 macOS 和 iOS 上，Metal 已經取代了 OpenGL，因為蘋果公司已停止對 OpenGL 的支持。

### DirectX

與 Metal 類似，**DirectX**（包括 Direct3D、Direct2D 等）是 **Windows** 的專屬 API。DirectX 是一個多媒體任務庫套件，用於處理 3D 圖形（通過 Direct3D）、2D 圖形（通過 Direct2D）等。

### CUDA

**CUDA** 不是一個圖形 API，而是 NVIDIA 創建的通用並行計算平台。通過 CUDA，你可以利用 GPU 的強大並行計算能力來執行圖形渲染以外的計算任務。

## 圖形 API 管理庫

正如前文所述，OpenGL 只是個圖形 API，它告訴 GPU 如何渲染數據。然而，對於像 ArcVP 這樣的應用，僅僅渲染是不夠的。你還需要一個窗口系統以及其他管理工具。這就是圖形 API 管理庫的用武之地。

### GLFW

**GLFW** 是一個輕量級、跨平台的 OpenGL 工具庫。它提供簡單的 API，用於創建窗口、處理輸入以及管理 OpenGL 上下文。

### GLUT

你可以將 **GLUT** 看作 GLFW 的更老、更簡單的版本，用於提供 OpenGL 的基礎窗口管理功能。

### SDL

**SDL（簡單直接媒體層）** 是另一個用於管理 OpenGL 上下文的跨平台庫。與 GLFW 不同，SDL 提供了許多附加功能，比如視頻、音頻、輸入設備處理、線程和網絡支持。SDL 支持多種圖形 API，包括 OpenGL、Metal 和 Direct3D。

# 什麼是 FFmpeg？

**FFmpeg** 是一個開源庫，由處理視頻、音頻、多媒體文件和流的多個程序組成。

# OpenGL 的使用與說明

## 示例代碼

```cpp
// 使用 GLFW 創建一個窗口
GLFWwindow *window =
    glfwCreateWindow(1280, 720, "Hello world", nullptr, nullptr);
if (window == nullptr)
  return 1;
// 確保在任何操作之前創建 OpenGL 上下文
glfwMakeContextCurrent(window);
// 使用給定數據創建 OpenGL 纹理
GLuint texHandle = createTexture(data, frameWidth, frameHeight);
while (!glfwWindowShouldClose(window)) {
  // 清除 OpenGL 背景緩衝區
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  // 如果應用程序在後台
  if (glfwGetWindowAttrib(window, GLFW_ICONIFIED) != 0) {
    ImGui_ImplGlfw_Sleep(10);
    continue;
  }

  // 啟動 Dear ImGui 框架
  ImGui_ImplOpenGL3_NewFrame();
  ImGui_ImplGlfw_NewFrame();
  ImGui::NewFrame();

  if (show_demo_window)
    ImGui::ShowDemoWindow(&show_demo_window);
  // 設置清除緩衝區時的背景顏色
  glClearColor(clear_color.x * clear_color.w, clear_color.y * clear_color.w,
                clear_color.z * clear_color.w, clear_color.w);
  // 渲染 ImGui 內容
  ImGui::Render();
  // 繪製纹理
  drawQuad(window, frameWidth, frameHeight, texHandle);
  ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
  // 交換背景緩衝區和顯示緩衝區
  glfwSwapBuffers(window);
  // 使用 GLFW 處理窗口事件
  glfwPollEvents();
}
// 記得清理資源
ImGui_ImplOpenGL3_Shutdown();
ImGui_ImplGlfw_Shutdown();
ImGui::DestroyContext();
glfwDestroyWindow(window);
glfwTerminate();
```

## 上下文

OpenGL 上下文（Context）代表許多內容。上下文存儲了與 OpenGL 實例相關的所有狀態。它還表示默認的（可能可見的）幀緩衝區，渲染命令會繪製到這個幀緩衝區中，除非繪製到一個幀緩衝區對象中。可以將上下文看作一個包含 OpenGL 的對象；當上下文被銷毀時，OpenGL 也會被銷毀。

上下文是操作系統中某個特定執行進程（大致是一個應用程序）內的本地化對象。一個進程可以創建多個 OpenGL 上下文。每個上下文可以表示一個單獨的可見表面，比如應用程序中的一個窗口。

## 纹理

纹理是一個二維圖像（實際上還有 1D 和 3D 纹理），用於為對象添加細節。通過在單個圖像中插入大量細節，我們可以製造出對象非常詳細的假象，而無需指定額外的頂點。

纹理坐標在 x 和 y 軸上從 0 到 1（我們使用的是二維圖像）。通過纹理坐標獲取纹理顏色被稱為採樣。纹理坐標從纹理圖像左下角的 **(0,0)** 開始，到右上角的 **(1,1)**。

詳情請查看: [LearnOpenGL](https://learnopengl.com/Getting-started/Textures)

# FFmpeg 的使用與說明

## 示例代碼

```cpp
bool loadFrame(const char *filename, int *width, int *height,
               std::vector<std::uint8_t> *data) {
  // 為 avformat 分配內存
  AVFormatContext *avFormatContext = avformat_alloc_context();
  if (!avFormatContext) {
    defaultLogger.Debug("無法創建格式上下文");
    return false;
  }
  if (avformat_open_input(&avFormatContext, filename, nullptr, nullptr)) {
    defaultLogger.Debug("無法打開視頻文件");
    return false;
  }
  int videoStreamIndex = -1;
  const AVCodec *avCodec;
  AVCodecParameters *avCodecParams;
  // 找到第一個視頻流
  for (int i = 0; i < avFormatContext->nb_streams; i++) {
    auto stream = avFormatContext->streams[i];
    avCodecParams = stream->codecpar;
    avCodec = avcodec_find_decoder(avCodecParams->codec_id);
    if (!avCodec) {
      continue;
    }
    if (avCodecParams->codec_type == AVMEDIA_TYPE_VIDEO) {
      videoStreamIndex = i;
      break;
    }
  }
  if (videoStreamIndex == -1) {
    defaultLogger.Debug("無法找到有效的視頻流");
  }
  // 為解碼器設置編解碼上下文
  AVCodecContext *avCodecContext = avcodec_alloc_context3(avCodec);
  if (!avCodecContext) {
    defaultLogger.Debug("無法分配編解碼上下文");
    return false;
  }
  if (avcodec_parameters_to_context(avCodecContext, avCodecParams) < 0) {
    defaultLogger.Debug("無法初始化 avCodecContext");
    return false;
  }
  if (avcodec_open2(avCodecContext, avCodec, nullptr) < 0) {
    defaultLogger.Debug("無法打開解碼器");
    return false;
  }

  AVFrame *avFrame = av_frame_alloc();
  AVPacket *avPacket = av_packet_alloc();
  while (av_read_frame(avFormatContext, avPacket) >= 0) {
    if (avPacket->stream_index != videoStreamIndex) {
      continue;
    }
    int response = avcodec_send_packet(avCodecContext, avPacket);
    if (response < 0) {
      defaultLogger.Debug("無法解碼數據包: ", av_err2str(response));
      continue;
    }
    response = avcodec_receive_frame(avCodecContext, avFrame);
    if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
      continue;
    } else if (response < 0) {
      defaultLogger.Debug("無法解碼數據包: ", av_err2str(response));
      return false;
    }
    av_packet_unref(avPacket);
    break;
  }
  *width = avFrame->width;
  *height = avFrame->height;
  *data = std::vector<std::uint8_t>(avFrame->width * avFrame->height * 3);
  int lineSize = avFrame->linesize[0];
  for (int x = 0; x < avFrame->width; x++) {
    for (int y = 0; y < avFrame->height; y++) {
      (*data)[y * avFrame->width * 3 + x * 3] = avFrame->data[0][y * lineSize + x];
      (*data)[y * avFrame->width * 3 + x * 3 + 1] = avFrame->data[0][y * lineSize + x];
      (*data)[y * avFrame->width * 3 + x * 3 + 2] = avFrame->data[0][y * lineSize + x];
    }
  }
  avformat_close_input(&avFormatContext);
  avformat_free_context(avFormatContext);
  avcodec_free_context(&avCodecContext);
  av_frame_free(&avFrame);
  return true;
}
```

## AVFormatContext

`AVFormatContext` 對象包含處理媒體文件所需的所有數據，例如文件的時長、軌道等。獲取文件的上下文類似於對媒體的“解復用”。

## AVCodec

`AVCodec` 表示流所使用的 `編碼器/解碼器`。

### AVCodecContext

`AVCodecContext` 包含 `編碼器/解碼器` 在處理流時需要知道的數據，例如數據包 ID 以及其他相關數據。

### AVCodecParams

`AVCodecParams` 提供了與 `AVCodec` 相關的詳細信息，例如編碼器 ID 和編碼器類型。

## AVPacket

流由多個 **數據包 (packet)** 組成，編解碼器使用這些數據包處理幀。需要注意的是，數據包和幀的映射是不同的，數據包 **並不一定** 代表單個幀。在 FFmpeg 中，視頻數據包通常包含 **單個** 幀，而音頻數據包則包含 **多個** 音頻幀的數據。這也是為什麼我們使用以下代碼來確保幀已正確解碼的原因：

```cpp
if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
  continue;
}
```

### 引用計數

FFmpeg 使用引用計數來管理 `AVPacket` 對象。因此，當你完成對數據包的處理時，務必調用 `av_packet_unref` 來釋放數據包。

## AVFrame

從 `AVPacket` 解碼出來的 `AVFrame` 對象包含渲染單個視頻幀所需的所有數據，同樣由引用計數管理。