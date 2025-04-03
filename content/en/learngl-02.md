---
title: Advanced OpenGL
date: 2025-03-11
tags: ['graphics', 'opengl']
authors: ['Maya']
ai: True
draft: False
---
# Depth Testing
Now we know that each fragment in OpenGL has its own coordinates, where the z-coordinate represents the distance from the screen. For example, when we need nearby objects to occlude distant ones, we need to perform **depth testing**. Depth testing refers to determining whether a fragment should be displayed based on its depth (z-coordinate). Depth testing runs in **screen space** after the **fragment shader** (and after the stencil test, if applicable) without optimization.

> [!NOTE]
> Most GPUs now provide a hardware feature called **Early Depth Testing**. Early depth testing allows depth tests to run before the fragment shader. As long as we know a fragment will never be visible (it is behind other objects), we can discard that fragment early. Fragment shaders are usually expensive, so we should avoid running them whenever possible. When using early depth testing, one limitation of the fragment shader is that you cannot write to the fragment's depth value. If a fragment shader writes to its depth value, early depth testing is not possible. OpenGL cannot know the depth value in advance.

Depth testing is disabled by default and can be enabled using the `GL_DEPTH_TEST` option.
```cpp
glEnable(GL_DEPTH_TEST);
```

If a fragment passes the depth test, its z-value will be used to update the depth buffer for subsequent checks. If it does not pass the test, the fragment will be discarded. If depth buffering is enabled, you also need to **clear** the depth buffer in each rendering loop; otherwise, the depth buffer from the previous frame will negatively affect the depth detection of the current frame:
```cpp
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
```
If you want to perform depth testing without updating the depth buffer at times, you can set the depth mask `DepthMask` to `false`.
```cpp
glDepthMask(false);
```
## Depth Test Functions
We can perform depth detection using different depth test functions. The default comparison method is `GL_LESS`, which will **discard** all fragments with depth values greater than or equal to the current depth buffer value.
```cpp
glEnable(GL_DEPTH_TEST);
glDepthFunc(GL_LESS);
```
OpenGL also provides built-in test functions like `GL_ALWAYS`, `GL_NEVER`, `GL_EQUAL`, `GL_GEQUAL`, etc. If we enable `GL_ALWAYS`, the depth test will always pass, and we will always see the last fragment rendered.

## Precision
The depth buffer contains a depth value in the range of [0.0, 1.0], which represents all z-coordinates from the near plane to the far plane of the frustum. This transformation is typically a function like:

$$
F_{depth}=\frac{1/z-1/near}{1/far-1/near}
$$
Using such a nonlinear transformation function instead of a linear one allows us to have **higher precision** in depth detection **nearby**, while the precision decreases further away, enhancing the visual experience close to the viewer.

## Depth Conflicts
A common visual artifact occurs when two fragments have depth values so close that the depth test cannot clearly determine which is in front, resulting in **depth conflicts**. It appears as if two fragments are competing for the top position, manifesting as areas where two fragments are displayed in high-frequency alternation or as stripes. Depth conflicts are particularly noticeable at greater distances due to the lower precision caused by the nonlinear transformation.

We can avoid depth conflicts using the following methods:

- Do not place two objects too close together; this is very effective.
- Set the near plane as far away as possible. A farther near plane means we can achieve higher precision at greater distances, but setting it too far may cause objects to be clipped.
- Use higher precision buffers. Most buffers are 24-bit, but many graphics cards support 32-bit buffers, which can greatly enhance precision.
# Stencil Testing
Similar to the depth buffer, **stencil testing** also has a buffer called the stencil buffer, where each unit is an 8-bit integer to store stencil values.

Stencil buffer operations allow us to set the stencil buffer to a specific value when rendering fragments. By modifying the contents of the stencil buffer during rendering, we **write** to the stencil buffer. In the same (or subsequent) frame, we can **read** these values to decide whether to discard or keep a fragment. You can be creative when using the stencil buffer, but the general steps are as follows:

- Enable writing to the stencil buffer.
- Render the object, updating the contents of the stencil buffer.
- Disable writing to the stencil buffer.
- Render (other) objects, discarding specific fragments based on the contents of the stencil buffer.

Stencil testing is also enabled using `glEnable`.
```cpp
glEnable(GL_STENCIL_TEST);
```
Like depth testing, you need to clear the buffer in each iteration.
```cpp
glClear(GL_STENCIL_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
```

Unlike depth testing, the stencil test mask is more complex. The set mask value will perform a logical AND operation with the value to be written to the buffer. Setting `0xFF` means not modifying the written value, while `0x00` means no writing occurs, which has the same effect as `glDepthMask(false)`, disabling the mask.
```cpp
glStencilMask(0xFF);
```
Similarly, we can use `glStencilFunc` and `glStencilOp` to set the comparison function for the stencil test and how to update the buffer under different conditions.

## Object Outlines
A common example of stencil testing is displaying object outlines or stroking objects. Here’s how to achieve this effect using stencil testing:
1. Enable stencil writing.
2. Before drawing the object (which needs an outline), set the stencil function to GL_ALWAYS, updating the stencil buffer to 1 whenever the object's fragments are rendered.
3. Render the object.
4. Disable stencil writing and depth testing.
5. Scale each object slightly.
6. Use a different fragment shader to output a separate (border) color.
7. Draw the object again, but only render where the stencil value of its fragments is not equal to 1.
8. Re-enable stencil writing and depth testing.

# Blending

If our texture has an **alpha channel**, we can achieve a translucent effect through this channel, a process called **alpha blending**. OpenGL's blending is achieved through this component:

$$
 C_{result}=C_{source}*F_{source}+C_{destination}*F_{destination}
$$
where the source color vector and destination color vector are automatically set by OpenGL. The source color component is typically the color of the fragment being processed, while the destination color component is the existing color in the color buffer. However, we can decide the values for the source and destination factors.

OpenGL allows us to enable blending using `glEnable`.
```cpp
glEnable(GL_BLEND);
```
We can also set the blending function using `glBlendFunc`. `glBlendFunc(sfactor, dfactor)` accepts two parameters to set the source and destination factors. OpenGL defines many options for us; here are some commonly used options:

| Option                       | Effect       |
| ------------------------ | -------- |
| `GL_ZERO`                | Factor is 0     |
| `GL_ONE`                 | Factor is 1     |
| `GL_SRC_COLOR`           | Source color vector    |
| `GL_DST_COLOR`           | Destination color vector   |
| `GL_SRC_ALPHA`           | Source alpha   |
| `GL_DST_ALPHA`           | Destination alpha  |
| `GL_ONE_MINUS_SRC_ALPHA` | 1 - Source alpha |
| `GL_CONSTANT_ALPHA`      | Constant alpha  |

If we need the opaque objects above to see the objects below, a common practice is to use:
```cpp
glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
```
The above code will blend the color of a semi-transparent or transparent object with the color of the object that has already passed the depth test in the alpha blending area. If the object behind is also opaque, this processing is normal. However, if the object in front is rendered first, the object behind cannot pass the depth test, resulting in the color of the object behind not being blended.

Thus, the usual rendering order is:
1. Render all opaque objects.
2. Sort all transparent objects based on their distance from the viewport.
3. Render transparent objects in order.

Sorting objects in a scene is a challenging technique, largely determined by the type of your scene, not to mention the additional processing power it requires. Fully rendering a scene containing both opaque and transparent objects is not easy. More advanced techniques include **Order Independent Transparency (OIT)**, which I will study further if I have time.

# Face Culling

When we draw a **closed** shape, each face has two sides, and we can only observe one side. The side we cannot see still occupies computational resources, slowing down performance. OpenGL provides **face culling** to solve this problem.

If the closed shape we are drawing consists of multiple triangles, there are two ways to define the winding order of these triangle vertices: clockwise and counterclockwise.

OpenGL defaults to viewing the cube from the outside as **counterclockwise** for the **front face**, while clockwise is the back face, and when face culling is enabled, OpenGL defaults to culling the back face. You can enable face culling with the following code.
```cpp
glEnable(GL_CULL_FACE);
```
We can also use
```cpp
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
```
to tell OpenGL to cull the front face.

Of course, we can also set which winding order is considered the front:
```cpp
glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
```
The above code defines clockwise as the front face. Face culling is a great tool, but you need to remember which objects can benefit from face culling and which should not be culled.

## Relationship with Depth Testing
When I learned this, I found that this feature seems somewhat similar to the previous depth testing, so I compared them closely.

**Depth testing** occurs after **fragment processing**, meaning after the fragment shader has finished running, and the operations occur at the pixel level, affecting only rendering.

**Face culling** occurs between **primitive assembly** and **rasterization**. It selectively culls some primitives (triangles) by determining the orientation of the triangles, and its output is the rasterization, which is the input to the fragment shader. Face culling can discard the faces we want to cull in advance, reducing the computational load on the fragment shader and thus decreasing overhead.