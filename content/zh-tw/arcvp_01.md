---
title: ArcVP DevLog#1
date: 2024-09-22
tags: ['graphics','devlog','opengl','ffmpeg','media-processing','arcvp']
authors: ['Maya']
ai: true
---
# 什麼是 OpenGL？

首先，OpenGL **不是** 一個庫或框架。它是一個圖形 API 規範，意味著它不包含像 C++ 這樣的實際代碼。每個 GPU 廠商提供自己的 OpenGL 實現，這解釋了為什麼在 NVIDIA GPU 上的遊戲看起來可能與在 AMD GPU 上稍有不同。儘管其名稱中包含“開放”，但事實上它並不是真正的“開放”，因為 GPU 廠商並未將其驅動程式的代碼開源。

## 我該如何“下載” OpenGL？

正如我之前提到的，GPU 廠商已經將 OpenGL 包含在其驅動程式中。因此，如果您為 GPU 安裝了正確的驅動程式，您已經擁有 OpenGL。

## OpenGL 變體
您可能會遇到幾個與 OpenGL 相關的術語，如 `OpenGL ES`、`WebGL` 等等。讓我們來詳細說明：

### OpenGL ES
**OpenGL ES (嵌入式系統)** 是完整 OpenGL API 的一個子集，專為嵌入式系統而設計。它針對資源有限的平台進行了效率和性能的優化。

### WebGL

**WebGL** 是基於 OpenGL ES 2.0 的 Javascript API，為瀏覽器提供硬體加速的 3D 圖形。


### Vulkan
OpenGL 本身被認為是一個“高級” API，意味著它更加抽象且易於使用。然而，這種抽象引入了一些開銷，可能會降低性能。**Vulkan** 則是一個低級的圖形 API，它使開發者對硬體有更多的控制權，從而實現更快的代碼執行，但實施起來也更複雜。

## 其他圖形 API
OpenGL 是一個跨平台的圖形 API，還有許多平台專屬的 API，如 Metal 和 DirectX。
### Metal
**Metal** 是 **Apple** 的專有圖形 API，對 Apple 硅進行了高度優化，提供低級別的控制和在 Mac 上更好的性能。Metal 已取代 OpenGL 在 macOS 和 iOS 上的用途，因為 Apple 已經不再支持 OpenGL。
### DirectX
與 Metal 類似，**DirectX**（包括 Direct3D、Direct2D 等）是專屬於 **Windows** 的圖形 API。DirectX 是一套處理各種多媒體任務的庫，如使用 Direct3D 的 3D 圖形和使用 Direct2D 的 2D 圖形。
### CUDA
**CUDA** 不是一個圖形 API，而是 NVIDIA 創建的一個通用並行計算平台。利用 CUDA，您可以在圖形渲染之外利用 GPU 的計算能力進行並行計算。

## 圖形 API 管理庫
正如前面提到的，OpenGL 只是一個圖形 API，它告訴 GPU 如何渲染數據。然而，對於像 ArcVP 這樣的應用程序，您需要的不僅僅是渲染。您需要一個窗口系統和其他管理工具。這就是圖形 API 管理庫發揮作用的地方。

## GLFW
**GLFW** 是一個輕量級的跨平台 OpenGL 實用庫。它提供了簡單的 API 用於創建窗口、處理輸入和管理 OpenGL 上下文。

## GLUT
您可以將 **GLUT** 視為 GLFW 的一個舊版和簡單版本，為 OpenGL 提供基本的窗口管理。
## SDL
**SDL (Simple DirectMedia Layer)** 是另一個用於管理 OpenGL 上下文的跨平台庫。與 GLFW 不同，SDL 提供許多額外功能，如視頻、音頻、輸入設備處理、線程和網絡支持。SDL 支援多個圖形 API，包括 OpenGL、Metal 和 Direct3D。

# 什麼是 FFmpeg？
**FFmpeg** 是一個開源庫，包含處理視頻、音訊、多媒體檔案和流的程序。

# OpenGL 的使用與說明
## 示例代碼

```cpp
// use glfw to create a window
GLFWwindow *window =
    glfwCreateWindow(1280, 720, "Hello world", nullptr, nullptr);
if (window == nullptr)
  return 1;
// make sure to create the OpenGL context before anything
glfwMakeContextCurrent(window);
// create OpenGl Texture with given data
GLuint texHandle = createTexture(data, frameWidth, frameHeight);
while (!glfwWindowShouldClose(window)) {
  // clear OpenGL background buffer
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  // if the app is in background
  if (glfwGetWindowAttrib(window, GLFW_ICONIFIED) != 0) {
    ImGui_ImplGlfw_Sleep(10);
    continue;
  }

  // start the Dear ImGui frame
  ImGui_ImplOpenGL3_NewFrame();
  ImGui_ImplGlfw_NewFrame();
  ImGui::NewFrame();

  if (show_demo_window)
    ImGui::ShowDemoWindow(&show_demo_window);
  // set OpenGL background color when buffer was cleared
  glClearColor(clear_color.x * clear_color.w, clear_color.y * clear_color.w,
                clear_color.z * clear_color.w, clear_color.w);
  // render the ImGui stuff
  ImGui::Render();
  // draw the texture
  drawQuad(window, frameWidth, frameHeight, texHandle);
  ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
  // swap background buffer and the display buffer
  glfwSwapBuffers(window);
  // use glfw to process window events
  glfwPollEvents();
}
// remember to clean up
ImGui_ImplOpenGL3_Shutdown();
ImGui_ImplGlfw_Shutdown();
ImGui::DestroyContext();
glfwDestroyWindow(window);
glfwTerminate();
```

## 上下文
OpenGL 上下文表示許多內容。上下文存儲與此 OpenGL 實例相關的所有狀態。它表示當不繪製到幀緩衝區物件時，渲染命令將繪製的（潛在可見的）默認幀緩衝區。可以將上下文視為一個對象，它持有所有的 OpenGL；當上下文被銷毀時，OpenGL 也將被銷毀。

上下文局限於操作系統上特定的執行過程（應用程序或多或少）。一個進程可以創建多個 OpenGL 上下文。每個上下文可以表示一個獨立的可視表面，就像應用程序中的窗口一樣。

## 紋理
紋理是一種用於為物體添加細節的 2D 圖像（甚至存在 1D 和 3D 紋理）。因為我們可以在單一圖像中插入大量詳情，我們可以創造出物體極為細緻的假象，而無需指定額外的頂點。紋理坐標在 x 和 y 軸上的範圍是從 0 到 1（記住我們使用的是 2D 紋理圖像）。使用紋理坐標檢索紋理顏色的過程稱為取樣。紋理坐標 **從 (0,0)** 開始，表示紋理圖像的左下角，至 **(1,1)**，表示紋理圖像的右上角。

欲獲取更詳細版本，請查看: [LearnOpenGL](https://learnopengl.com/Getting-started/Textures)

# FFmpeg 的使用與說明

## 示例代碼
```cpp
bool loadFrame(const char *filename, int *width, int *height,
               std::vector<std::uint8_t> *data) {
  // Allocate memory for avformat
  AVFormatContext *avFormatContext = avformat_alloc_context();
  if (!avFormatContext) {
    defaultLogger.Debug("Unable to create format context");
    return false;
  }
  if (avformat_open_input(&avFormatContext, filename, nullptr, nullptr)) {
    defaultLogger.Debug("Unable to open video file");
    return false;
  }
  int videoStreamIndex = -1;
  const AVCodec *avCodec;
  AVCodecParameters *avCodecParams;
  // Find the first video stream
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
    defaultLogger.Debug("Unable to find valid video stream");
  }
  // Set up the codec context for decoder
  AVCodecContext *avCodecContext = avcodec_alloc_context3(avCodec);
  if (!avCodecContext) {
    defaultLogger.Debug("Unable to allocate codec context");
    return false;
  }
  if (avcodec_parameters_to_context(avCodecContext, avCodecParams) < 0) {
    defaultLogger.Debug("Unable to initialize avCodecContext");
    return false;
  }
  if (avcodec_open2(avCodecContext, avCodec, nullptr) < 0) {
    defaultLogger.Debug("Unable to open codec");
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
      defaultLogger.Debug("Unable to decode packet: ", av_err2str(response));
      continue;
    }
    response = avcodec_receive_frame(avCodecContext, avFrame);
    if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
      continue;
    } else if (response < 0) {
      defaultLogger.Debug("Unable to decode packet: ", av_err2str(response));
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
`AVFormatContext` 對象包含處理媒體文件所需的所有數據，如其持續時間、音軌等。獲取文件的上下文，類似於對媒體進行 `解復用`。

## AVCodec
`AVCodec` 代表一個流所使用的 `編碼器/解碼器`。
### AVCodecContext
`AVCodecContext` 包含編碼器/解碼器在處理流時應該知道的數據，如數據包 ID 和其他相關數據。
### AVCodecParams
`AVCodecParams` 提供有關相關 `AVCodec` 的詳細信息，例如編解碼器 ID 和編解碼器類型。
## AVPacket
流由多個 **數據包** 組成，編解碼器使用這些數據包來處理幀。重要的是要注意，數據包到幀的映射是不同的，一個數據包 **不一定** 代表單個幀。通常在 `FFmpeg` 中，一個視頻數據包恰好包含 **單個** 幀，而一個音頻數據包則包含 **多個** 音頻幀的數據。這就是為什麼我們使用以下代碼來確保從數據包中正確解碼了一幀。
```cpp
if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
  continue;
} 
```
### 引用計數
FFmpeg 使用引用計數來管理 `AVPacket` 對象。因此，當您完成時一定要調用 `av_packet_unref` 以釋放數據包。
## AVFrame
從 `AVPacket` 解碼的 `AVFrame` 對象包含渲染單個視頻幀所需的所有數據，同樣也由引用計數管理。