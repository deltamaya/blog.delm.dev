---
title: ArcVP DevLog#1
date: 2024-09-22
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 什么是 OpenGL？

首先，OpenGL **不是** 一个库或框架。它是一个图形 API 规范，这意味着它不包含像 C++ 这样的实际代码。每个 GPU 制造商都提供自己实现的 OpenGL，这解释了为什么同一款游戏在 NVIDIA GPU 上的表现与在 AMD GPU 上可能有些不同。尽管它的名字中有“开放”二字，但它实际上并不是真正“开放”的，因为 GPU 制造商不公开其驱动程序的源代码。

## 如何“下载” OpenGL？

正如我之前提到的，GPU 制造商已经在其驱动程序中包含了 OpenGL。因此，如果你安装了适合你的 GPU 的正确驱动程序，那么你已经拥有 OpenGL。

## OpenGL 变种

你可能会遇到与 OpenGL 相关的几个术语，如 `OpenGL ES`、`WebGL` 等。让我们逐一解析：

### OpenGL ES

**OpenGL ES (嵌入式系统)** 是完整 OpenGL API 的一个子集，专为嵌入式系统设计。它针对资源有限的平台进行了效率和性能的优化。

### WebGL

**WebGL** 是基于 OpenGL ES 2.0 的 JavaScript API，提供硬件加速的 3D 图形给网页浏览器。

### Vulkan

OpenGL 本身被视为一个“高级” API，这意味着它更抽象且更易于使用。然而，这种抽象引入了一些开销，可能会降低性能。相对而言，**Vulkan** 是一个低级图形 API，给开发者提供了对硬件的更多控制，从而实现更快的代码执行，但它的实现也更为复杂。

## 其他图形 API

OpenGL 是一个跨平台的图形 API，此外还有许多平台专属的 API，如 Metal 和 DirectX。

### Metal

**Metal** 是 **Apple** 的专属图形 API，针对 Apple Silicon 进行了高度优化，提供低级控制和更好的性能。Metal 已取代 macOS 和 iOS 上的 OpenGL，因为 Apple 已停止对 OpenGL 的支持。

### DirectX

与 Metal 类似，**DirectX**（包括 Direct3D、Direct2D 等）是专属于 **Windows** 的。DirectX 是一组库，可以处理各种多媒体任务，如使用 Direct3D 的 3D 图形和使用 Direct2D 的 2D 图形。

### CUDA

**CUDA** 并不是图形 API，而是 NVIDIA 创建的通用并行计算平台。通过 CUDA，你可以利用 GPU 的强大计算能力进行图形渲染以外的并行计算。

## 图形 API 管理库

正如前面提到的，OpenGL 只是一个图形 API，它告诉 GPU 如何渲染数据。然而，对于像 ArcVP 这样的应用程序，你需要的不仅仅是渲染。你需要一个窗口系统和其他管理工具。这就是图形 API 管理库发挥作用的地方。

## GLFW

**GLFW** 是一个轻量级的跨平台 OpenGL 实用程序库。它提供简单的 API 来创建窗口、处理输入并管理 OpenGL 上下文。

## GLUT

你可以将 **GLUT** 看作是 GLFW 的一个较旧和更简单的版本，为 OpenGL 提供基本的窗口管理。

## SDL

**SDL（简单直接媒体层）** 是另一个跨平台的库，用于管理 OpenGL 上下文。与 GLFW 不同，SDL 提供许多额外功能，如视频、音频、输入设备处理、线程和网络。SDL 支持多种图形 API，包括 OpenGL、Metal 和 Direct3D。

# 什么是 FFmpeg？

**FFmpeg** 是一个开源库，包含处理视频、音频、多媒体文件和流的程序。

# OpenGL 使用与解释

## 示例代码

```cpp
// 使用 glfw 创建一个窗口
GLFWwindow *window =
    glfwCreateWindow(1280, 720, "Hello world", nullptr, nullptr);
if (window == nullptr)
  return 1;
// 确保在任何操作之前创建 OpenGL 上下文
glfwMakeContextCurrent(window);
// 用给定数据创建 OpenGL 纹理
GLuint texHandle = createTexture(data, frameWidth, frameHeight);
while (!glfwWindowShouldClose(window)) {
  // 清除 OpenGL 背景缓冲区
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  // 如果应用程序在后台
  if (glfwGetWindowAttrib(window, GLFW_ICONIFIED) != 0) {
    ImGui_ImplGlfw_Sleep(10);
    continue;
  }

  // 开始 Dear ImGui 帧
  ImGui_ImplOpenGL3_NewFrame();
  ImGui_ImplGlfw_NewFrame();
  ImGui::NewFrame();

  if (show_demo_window)
    ImGui::ShowDemoWindow(&show_demo_window);
  // 当缓冲区被清除时设置 OpenGL 背景颜色
  glClearColor(clear_color.x * clear_color.w, clear_color.y * clear_color.w,
                clear_color.z * clear_color.w, clear_color.w);
  // 渲染 ImGui 内容
  ImGui::Render();
  // 绘制纹理
  drawQuad(window, frameWidth, frameHeight, texHandle);
  ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
  // 交换背景缓冲区和显示缓冲区
  glfwSwapBuffers(window);
  // 使用 glfw 处理窗口事件
  glfwPollEvents();
}
// 记得清理
ImGui_ImplOpenGL3_Shutdown();
ImGui_ImplGlfw_Shutdown();
ImGui::DestroyContext();
glfwDestroyWindow(window);
glfwTerminate();
```

## 上下文

OpenGL 上下文表示许多内容。上下文存储与此 OpenGL 实例相关联的所有状态。它表示在不绘制到帧缓冲对象时渲染命令将绘制到的（可能可见的）默认帧缓冲区。把上下文想象成一个持有所有 OpenGL 的对象；当一个上下文被销毁时，OpenGL 就被销毁了。

上下文局限于操作系统上的特定执行过程（一个应用程序或多或少）。一个进程可以创建多个 OpenGL 上下文。每个上下文可以表示一个单独的可视表面，如应用程序中的窗口。

## 纹理

纹理是一个 2D 图像（即使 1D 和 3D 纹理也存在），用于为对象添加细节。因为我们可以在一个图像中插入很多细节，所以我们可以给对象提供极其精细的外观，而无需指定额外的顶点。纹理坐标在 x 和 y 轴上的范围是从 0 到 1（记住我们使用的是 2D 纹理图像）。使用纹理坐标检索纹理颜色称为采样。纹理坐标**从 (0,0)** 开始表示纹理图像的左下角，至**(1,1)** 表示纹理图像的右上角。

欲了解更详细的内容，请查阅：[LearnOpenGL](https://learnopengl.com/Getting-started/Textures)

# FFmpeg 使用与解释

## 示例代码

```cpp
bool loadFrame(const char *filename, int *width, int *height,
               std::vector<std::uint8_t> *data) {
  // 为 avformat 分配内存
  AVFormatContext *avFormatContext = avformat_alloc_context();
  if (!avFormatContext) {
    defaultLogger.Debug("无法创建格式上下文");
    return false;
  }
  if (avformat_open_input(&avFormatContext, filename, nullptr, nullptr)) {
    defaultLogger.Debug("无法打开视频文件");
    return false;
  }
  int videoStreamIndex = -1;
  const AVCodec *avCodec;
  AVCodecParameters *avCodecParams;
  // 查找第一个视频流
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
    defaultLogger.Debug("无法找到有效的视频流");
  }
  // 设置解码器的 codec 上下文
  AVCodecContext *avCodecContext = avcodec_alloc_context3(avCodec);
  if (!avCodecContext) {
    defaultLogger.Debug("无法分配 codec 上下文");
    return false;
  }
  if (avcodec_parameters_to_context(avCodecContext, avCodecParams) < 0) {
    defaultLogger.Debug("无法初始化 avCodecContext");
    return false;
  }
  if (avcodec_open2(avCodecContext, avCodec, nullptr) < 0) {
    defaultLogger.Debug("无法打开 codec");
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
      defaultLogger.Debug("无法解码数据包: ", av_err2str(response));
      continue;
    }
    response = avcodec_receive_frame(avCodecContext, avFrame);
    if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
      continue;
    } else if (response < 0) {
      defaultLogger.Debug("无法解码数据包: ", av_err2str(response));
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

`AVFormatContext` 对象包含处理媒体文件所需的所有数据，例如其持续时间、轨道等。获取文件的上下文，类似于对媒体进行 `demuxing`。

## AVCodec

`AVCodec` 表示流使用的 `编码器/解码器`。

### AVCodecContext

`AVCodecContext` 包含编码器/解码器在处理流时需要知道的数据，例如数据包 ID 和其他相关数据。

### AVCodecParams

`AVCodecParams` 提供关于关联的 `AVCodec` 的详细信息，如编解码器 ID 和编解码器类型。

## AVPacket

一个流由多个 **数据包** 组成，编码器使用这些数据包来处理帧。重要的是要注意，数据包到帧的映射是不同的，一个数据包 **并不总是** 表示单个帧。通常，在 `FFmpeg` 中，一个视频数据包恰好包含 **一个** 帧，而一个音频数据包包含 **多个** 音频帧的数据。这就是我们使用以下代码确保从数据包中正确解码出一个帧的原因。

```cpp
if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
  continue;
}
```

### 引用计数

FFmpeg 使用引用计数来管理 `AVPacket` 对象。因此，在你完成后，确保调用 `av_packet_unref` 来释放数据包。

## AVFrame

从 `AVPacket` 解码的 `AVFrame` 对象包含了你需要知道以渲染单个视频帧的所有数据，也由引用计数管理。
