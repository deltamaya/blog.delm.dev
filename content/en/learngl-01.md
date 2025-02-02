---
title: "First Encounter with OpenGL-01"
authors: ['Maya']
ai: True
draft: False
date: 2025-02-02
tags: ['opengl', 'graphics']
---
> [!NOTE]
> This blog leans more towards my learning insights rather than teaching OpenGL. If you want to learn OpenGL, please visit [LearnOpenGL](https://learnopengl.com/).

# What is OpenGL?
As mentioned in the [ArcVP development log](https://blog.delm.dev/blog/arcvp-01), OpenGL is essentially a standard for a graphics API. Different graphics card manufacturers implement their own versions of OpenGL, similar to the relationship between the C++ standard and various compilers.

## GLAD
Since **OpenGL** is merely a standard/specification, its actual implementation is handled by driver developers for specific graphics cards. Due to the numerous versions of **OpenGL** drivers, the positions of most of its functions cannot be determined at compile time and need to be queried at runtime. This places the responsibility on developers to obtain function addresses during runtime and store them in function pointers for later use. **GLAD** is a library designed to simplify this process.

# Shaders
**Shaders** are programs that run on the GPU, divided into several types. Each shader focuses on a small portion of the rendering or computing task, allowing multiple instances of shaders to run simultaneously on the GPU, and some shaders are programmable. Generally speaking, the input of one type of shader is typically the output of another type.

![Shader](https://learnopengl.com/img/getting-started/pipeline.png)
## Vertex Shader
The Vertex Shader is one of several programmable shaders. If we plan to do rendering, modern OpenGL requires us to set at least one vertex shader and one fragment shader. It processes data for each vertex (such as position, normal, texture coordinates, etc.), transforming vertices from model coordinates to screen coordinates, and performing other vertex-related transformations. Generally, the vertex shader transforms points in space to a 2D plane.

> [!TIP]
> Points on the plane are **not** pixels on the screen!

## Fragment Shader
The **Fragment Shader** is commonly used to combine textures, perform lighting calculations, apply shadow effects, and generate the final color of each pixel based on other information.

## Shader Program
A shader program can include a series of the shaders mentioned above. We can attach multiple shaders to a program and then execute a link operation to create a program pipeline.

# Vertex Array
![Vertex](https://learnopengl-cn.github.io/img/01/04/vertex_array_objects_ebo.png)
The above image illustrates the relationship between Vertex Array, Vertex Buffer, and Element Buffer. A Vertex Array is an abstraction of all vertex attributes we use, which can include multiple Attribute Pointers pointing to the specific data in the Vertex Buffer. This data describes the attributes of a vertex. The Element Buffer is a buffer, similar to the Vertex Buffer, which stores indices that OpenGL uses to determine which vertices to draw. This so-called indexed drawing is the solution to our problem.