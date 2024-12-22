---
title: ArcVP DevLog#1
date: 2024-09-22
tags:
  - graphics
  - devlog
  - opengl
  - ffmpeg
  - media-processing
  - arcvp
authors:
  - Maya
ai: false
---

# What is OpenGL?

First, OpenGL is **not** a library or framework. It's a graphics API specification, meaning it doesn't contain actual code like C++. Each GPU manufacturer provides its own implementation of OpenGL, which explains why a game may look slightly different on an NVIDIA GPU compared to an AMD GPU. Despite its name, it's not truly "open," as GPU manufacturers do not open-source the code for their drivers.
## How Do I 'Download' OpenGL?

As I mentioned earlier, GPU manufacturers already include OpenGL in their drivers. So, if you have the correct driver installed for your GPU, you already have OpenGL.

## OpenGL varients

You might come across several terms related to OpenGL, such as `OpenGL ES`, `WebGL`, and more. Let’s break them down:

### OpenGL ES

**OpenGL ES (Embedded Systems)** is a subset of the full OpenGL API, designed specifically for embedded systems. It is optimized for efficiency and performance on platforms with limited resources.

### WebGL

**WebGL** is JavaScript API based on the OpenGL ES 2.0. Which provides hardware-acceleration
3D graphics to web browsers.

### Vulkan

OpenGL itself is considered a "high-level" API, meaning it's more abstract and easier to use.
However, this abstraction introduces some overhead, which can reduce performance. **Vulkan**,
on the other hand, is a lower-level graphics API that gives developers more control over the hardware
enabling faster code execution, but it's also more complex to implement.

## Other Graphics API

OpenGL is a cross-platform graphics API, and there are also a lot of
platform-exclusive APIs like Metal and DirectX.

### Metal

**Metal** is an **Apple**'s exclusive graphics API, highly optimized for Apple Silicon, which
provides low-level control and better performance on Mac. Metal has replaced OpenGL
on macOS and iOS, as Apple has deprecated support for OpenGL.

### DirectX

Similar to Metal, **DirectX**(which includes Direct3D, Direct2D, etc.) is exclusive to **Windows**.
DirectX is a suite of libraries that handles various multimedia tasks, such as 3D graphics with Direct3D
and 2D graphics with Direct2D.

### CUDA

**CUDA** is not a graphics API but a general-purpose parallel computing platform created by NVIDIA.
With CUDA, you can harness the power of the GPU for parallel computations beyond graphics rendering.

## Graphic API Management Libraries

As mentioned, OpenGL is just a graphics API, it tells the GPU how to render data.
However, for an app like ArcVP, you need more than just rendering. You need a windowing system and
other management tools. This is where graphics API management libraries come into play.

## GLFW

**GLFW** is a lightweight, cross-platform utility library for OpenGL.
It provides simple APIs to create windows, handle input, and manage OpenGL contexts.

## GLUT

You can regard **GLUT** as an older and simpler version of GLFW, providing basic window management for OpenGL.

## SDL

**SDL(Simple DirectMedia Layer)** is another cross-platform library for managing OpenGL contexts.
Unlike GLFW, SDL offers many additional features, such as
video, audio, input devices handling, threads and networking.
SDL supports multiple graphics APIs, including OpenGL, Metal, and Direct3D.

# What is FFmpeg?

**FFmpeg** is an open-source library consisting of programs to process videos, audios,
multimedia files and streams.

# OpenGL Usage & Explanation

## Sample Code

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

## Context

An OpenGL context represents many things.
A context stores all the states associated with this instance of OpenGL.
It represents the (potentially visible) default framebuffer that rendering
commands will draw to when not drawing to a framebuffer object.
Think of a context as an object that holds all of OpenGL;
when a context is destroyed, OpenGL is destroyed.

Contexts are localized within a particular process of execution
(an application, more or less) on an operating system.
A process can create multiple OpenGL contexts.
Each context can represent a separate viewable surface,
like a window in an application.

## Texture

A texture is a 2D image (even 1D and 3D textures exist) used to add detail to an object.
Because we can insert a lot of details in a single image,
we can give the illusion the object is extremely detailed without having
to specify extra vertices.
Texture coordinates range from 0 to 1 in the x and y-axis
(remember that we use 2D texture images).
Retrieving the texture color using texture coordinates is called sampling.
Texture coordinates **start at (0,0)** for the lower left corner of a texture
image to **(1,1)** for the upper right corner of a texture image.

For more detailed version, check: [LearnOpenGL](https://learnopengl.com/Getting-started/Textures)

# FFmpeg Usage & Explaination

## Sample Code

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

The `AVFormatContext` object contains all the necessary data to process
a media file, such as its duration, tracks, and more. Getting the context of a file
is similar to `demuxing` the media.

## AVCodec

The `AVCodec` represents the `encoder/decoder` used by a stream.

### AVCodecContext

`AVCodecContext` contains data that the `encoder/decoder` should know to processing
streams, such as the packet ID and other relevant data.

### AVCodecParams

`AVCodecParams` provides details about the associated `AVCodec`. Like codec ID and codec type.

## AVPacket

A stream is made up of multiple **packets**, which the codec uses to process frames.
It's important to note that the mapping from packets to frames is different, a packet **does not**
always represent a single frame. Typically, in `FFmpeg`,
a video packet contains exactly **single** frame and an audio packet contains
**multiple** audio frame's data. This is why we use the following code to ensure that a frame has been
decoded from the packets correctly.

```cpp
if (response == AVERROR(EAGAIN) || response == AVERROR_EOF) {
  continue;
}
```

### Reference Counting

FFmpeg uses reference counting to manage `AVPacket` objects. Therefore, be sure to
call `av_packet_unref` to release the packet when you're done with it.

## AVFrame

The `AVFrame` object, which is decoded from `AVPacket`, contains all the data you should know to render
a single video frame, also managed by reference counting.
