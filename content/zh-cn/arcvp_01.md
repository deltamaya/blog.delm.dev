---
title: ArcVP 开发日志#1
date: 2024-09-22
tags: ['graphics', 'devlog', 'opengl', 'ffmpeg', 'media-processing', 'arcvp']
authors: ['Maya']
ai: true
---

# 什么是 OpenGL？

首先，OpenGL **不是**一个库或框架。它是一个图形 API 规范，这意味着它不像 C++ 那样包含实际代码。每个 GPU 制造商都会提供自己的 OpenGL 实现，这也解释了为什么同一个游戏在 NVIDIA 和 AMD 的 GPU 上看起来会稍有不同。尽管名字中有“开放”二字，但它并非真正的开源，因为 GPU 制造商并不会公开其驱动的代码。

## 我如何“下载” OpenGL？

正如我之前提到的，GPU 制造商已经将 OpenGL 包含在他们的驱动程序中。所以，如果你的 GPU 安装了正确的驱动程序，那么你已经拥有了 OpenGL。

## OpenGL 的变体

你可能会遇到一些与 OpenGL 相关的术语，比如 `OpenGL ES`、`WebGL` 等。让我们逐一了解：

### OpenGL ES

**OpenGL ES (Embedded Systems)** 是 OpenGL API 的子集，专为嵌入式系统设计。它针对资源有限的平台进行了性能优化。

### WebGL

**WebGL** 是基于 OpenGL ES 2.0 的 JavaScript API，它为网页浏览器提供硬件加速的 3D 图形支持。

### Vulkan

OpenGL 被认为是一个“高级”API，也就是说它更抽象，使用起来更简单。然而，这种抽象带来了一定的开销，可能会降低性能。而 **Vulkan** 是一个更底层的图形 API，它为开发者提供了更多硬件控制能力，从而实现更快的代码执行，但实现起来更为复杂。

## 其他图形 API

OpenGL 是一个跨平台的图形 API，但也有一些专属于特定平台的 API，比如 Metal 和 DirectX。

### Metal

**Metal** 是 **苹果公司** 专属的图形 API，为 Apple Silicon 提供高度优化的低级控制和更高性能。在 macOS 和 iOS 上，Metal 已经取代了 OpenGL，因为苹果公司已停止对 OpenGL 的支持。

### DirectX

与 Metal 类似，**DirectX**（包括 Direct3D、Direct2D 等）是 **Windows** 的专属 API。DirectX 是一个多媒体任务库套件，用于处理 3D 图形（通过 Direct3D）、2D 图形（通过 Direct2D）等。

### CUDA

**CUDA** 不是一个图形 API，而是 NVIDIA 创建的通用并行计算平台。通过 CUDA，你可以利用 GPU 的强大并行计算能力来执行图形渲染以外的计算任务。

## 图形 API 管理库

正如前文所述，OpenGL 只是一个图形 API，它告诉 GPU 如何渲染数据。然而，对于像 ArcVP 这样的应用，仅仅渲染是不够的。你还需要一个窗口系统以及其他管理工具。这就是图形 API 管理库的用武之地。

### GLFW

**GLFW** 是一个轻量级、跨平台的 OpenGL 工具库。它提供简单的 API，用于创建窗口、处理输入以及管理 OpenGL 上下文。

### GLUT

你可以将 **GLUT** 看作 GLFW 的更老、更简单的版本，用于提供 OpenGL 的基础窗口管理功能。

### SDL

**SDL(Simple DirectMedia Layer)** 是另一个用于管理 OpenGL 上下文的跨平台库。与 GLFW 不同，SDL 提供了许多附加功能，比如视频、音频、输入设备处理、线程和网络支持。SDL 支持多种图形 API，包括 OpenGL、Metal 和 Direct3D。

# 什么是 FFmpeg？

**FFmpeg** 是一个开源库，由处理视频、音频、多媒体文件和流的多个程序组成。

# OpenGL 的使用与说明

## 示例代码

```cpp
// 使用 GLFW 创建一个窗口
GLFWwindow *window =
    glfwCreateWindow(1280, 720, "Hello world", nullptr, nullptr);
if (window == nullptr)
  return 1;
// 确保在任何操作之前创建 OpenGL 上下文
glfwMakeContextCurrent(window);
// 使用给定数据创建 OpenGL 纹理
GLuint texHandle = createTexture(data, frameWidth, frameHeight);
while (!glfwWindowShouldClose(window)) {
  // 清除 OpenGL 背景缓冲区
  glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
  // 如果应用程序在后台
  if (glfwGetWindowAttrib(window, GLFW_ICONIFIED) != 0) {
    ImGui_ImplGlfw_Sleep(10);
    continue;
  }

  // 启动 Dear ImGui 框架
  ImGui_ImplOpenGL3_NewFrame();
  ImGui_ImplGlfw_NewFrame();
  ImGui::NewFrame();

  if (show_demo_window)
    ImGui::ShowDemoWindow(&show_demo_window);
  // 设置清除缓冲区时的背景颜色
  glClearColor(clear_color.x * clear_color.w, clear_color.y * clear_color.w,
                clear_color.z * clear_color.w, clear_color.w);
  // 渲染 ImGui 内容
  ImGui::Render();
  // 绘制纹理
  drawQuad(window, frameWidth, frameHeight, texHandle);
  ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());
  // 交换背景缓冲区和显示缓冲区
  glfwSwapBuffers(window);
  // 使用 GLFW 处理窗口事件
  glfwPollEvents();
}
// 记得清理资源
ImGui_ImplOpenGL3_Shutdown();
ImGui_ImplGlfw_Shutdown();
ImGui::DestroyContext();
glfwDestroyWindow(window);
glfwTerminate();
```

## 上下文

OpenGL 上下文（Context）代表许多内容。上下文存储了与 OpenGL 实例相关的所有状态。它还表示默认的（可能可见的）帧缓冲区，渲染命令会绘制到这个帧缓冲区中，除非绘制到一个帧缓冲区对象中。可以将上下文看作一个包含 OpenGL 的对象；当上下文被销毁时，OpenGL 也会被销毁。

上下文是操作系统中某个特定执行进程（大致是一个应用程序）内的本地化对象。一个进程可以创建多个 OpenGL 上下文。每个上下文可以表示一个单独的可见表面，比如应用程序中的一个窗口。

## 纹理

纹理是一个二维图像（实际上还有 1D 和 3D 纹理），用于为对象添加细节。通过在单个图像中插入大量细节，我们可以制造出对象非常详细的假象，而无需指定额外的顶点。

纹理坐标在 x 和 y 轴上从 0 到 1（我们使用的是二维纹理图像）。通过纹理坐标获取纹理颜色被称为采样。纹理坐标从纹理图像左下角的 **(0,0)** 开始，到右上角的 **(1,1)**。

详情请查看: [LearnOpenGL](https://learnopengl.com/Getting-started/Textures)

# FFmpeg 的使用与说明

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
  // 找到第一个视频流
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
  // 为解码器设置编解码上下文
  AVCodecContext *avCodecContext = avcodec_alloc_context3(avCodec);
  if (!avCodecContext) {
    defaultLogger.Debug("无法分配编解码上下文");
    return false;
  }
  if (avcodec_parameters_to_context(avCodecContext, avCodecParams) < 0) {
    defaultLogger.Debug("无法初始化 avCodecContext");
    return false;
  }
  if (avcodec_open2(avCodecContext, avCodec, nullptr) < 0) {
    defaultLogger.Debug("无法打开解码器");
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

`AVFormatContext` 对象包含处理媒体文件所需的所有数据，例如文件的时长、轨道等。获取文件的上下文类似于对媒体的“解复用”。

## AVCodec

`AVCodec` 表示流所使用的 `编码器/解码器`。

### AVCodecContext

`AVCodecContext` 包含 `编码器/解码器` 在处理流时需要知道的数据，例如数据包 ID 以及其他相关数据。

### AVCodecParams

`AVCodecParams` 提供了与 `AVCodec` 相关的详细信息，例如编码器 ID 和编码器类型。

## AVPacket

流由多个 **数据包 (packet)** 组成，编解码器使用这些数据包处理帧。需要注意的是，数据包和帧的映射是不同的，数据包 **并不一定** 代表单个帧。在 FFmpeg 中，视频数据包通常包含 **单个** 帧，而音频数据包则包含 **多个** 音频帧的数据。这也是为什么我们使用以下代码来确保帧已正确解码的原因：

```cpp
if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
  continue;
}
```

### 引用计数

FFmpeg 使用引用计数来管理 `AVPacket` 对象。因此，当你完成对数据包的处理时，务必调用 `av_packet_unref` 来释放数据包。

## AVFrame

从 `AVPacket` 解码出来的 `AVFrame` 对象包含渲染单个视频帧所需的所有数据，同样由引用计数管理。
