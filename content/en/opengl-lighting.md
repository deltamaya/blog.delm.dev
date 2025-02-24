---
title: Lighting in OpenGL
date: 2025-02-23
tags: ['opengl', 'graphics', 'lighting']
authors: ['Maya']
ai: True
draft: False
---
## Color

We all know that the human eye can see things under two conditions:
1. We see the light **emitted** by the object.
2. The object **reflects** the light emitted by a luminous object.

Every object has a different color because they have different reflective abilities for light. For example, under sunlight, leaves reflect the green light from the white light emitted by the sun, and the human eye receives this light and perceives the leaves as green. If the leaves are placed under red light, they will absorb all light except for green light, appearing black.

The ability of an object to reflect a certain color is called **reflectance**.

If we use a three-dimensional vector to describe the color of light, then after reflection, one component of the object's color equals the corresponding component of the light source multiplied by the object's reflectance for that color component.

## Basic Lighting

Lighting in displays is extremely complex and is influenced by many factors, which our limited computational power cannot simulate.

Therefore, OpenGL uses a simplified model for lighting, approximating real-world situations, making it easier to handle while still looking quite similar. These lighting models are based on our understanding of the physical properties of light. One such model is called the **Phong Lighting Model**.

The Phong lighting model mainly consists of three parts:
- **Ambient**
- **Diffuse**
- **Specular**

## Material

In the real world, each object reacts differently to light. For example, a steel object typically appears shinier than a clay vase, and a wooden box does not reflect light to the same extent as a steel box. Some objects reflect light with little scattering, resulting in smaller highlights, while others scatter a lot, producing larger highlights. If we want to simulate various types of objects in OpenGL, we must define different **material** properties for each surface.

In the following code, we define a material by setting diffuse and specular maps.
```glsl
struct Material {
    sampler2D diffuse;
    sampler2D specular;    
    float shininess;
}; 
```

By using diffuse and specular maps, we can add a lot of detail to relatively simple objects. We can even use **normal/bump maps** or **reflection maps** to add even more detail to the objects.

## Light Sources

### Directional Light
When a light source is very far away, the rays from the light source will be approximately parallel to each other. Regardless of the position of the object and/or observer, it seems that all light comes from the same direction. When we use a model that assumes the light source is **infinitely** far away, it is referred to as **directional light**, because all its rays have the same direction, and its position is irrelevant.

A great example of directional light is the sun. The sun is not infinitely far away from us, but it is far enough that we can treat it as infinitely distant in lighting calculations. Thus, all rays from the sun will be simulated as parallel rays.

### Point Light
Directional light is excellent for illuminating the entire scene as a global light source, but in addition to directional light, we also need some **point lights** scattered throughout the scene. A point light is a light source located at a specific position in the world, emitting light in all directions, but the light intensity diminishes with distance. Imagine a light bulb or a torch; both are point lights.

#### Light Attenuation
The gradual reduction of light intensity as the distance of light propagation increases is usually called **attenuation**. One way to decrease light intensity with distance is to use a linear equation. Such an equation can linearly reduce light intensity as distance increases, making distant objects appear darker. However, this linear equation often looks unrealistic. In the real world, lights are usually very bright at close range, but as distance increases, the brightness of the light source initially decreases quickly, and then the remaining light intensity decreases very slowly at greater distances. Therefore, we need a different formula to reduce light intensity.

$$
F_{att}=\frac{1.0}{K_c+K_l*d+K_q*d^2}
$$
where the constant term $K_c$, the linear term $K_l$, and the quadratic term $K_q$ are customizable.
- The constant term is usually kept at 1.0, mainly to ensure that the denominator never goes below 1; otherwise, it could increase intensity at certain distances, which is definitely not the desired effect.
- The linear term will multiply with the distance value to reduce intensity linearly.
- The quadratic term will multiply with the square of the distance, causing the light source to decrease intensity quadratically. The quadratic term has much less effect when the distance is small, but it becomes more significant than the linear term when the distance is large.

### Spotlight

A **spotlight** is a light source located at a specific position in the environment that shines light in a specific direction rather than in all directions. As a result, only objects within a specific radius in the direction of the spotlight will be illuminated, while others remain dark. Good examples of spotlights are streetlights or flashlights.

In OpenGL, a spotlight is represented by a world space position, a direction, and a **cutoff angle**. The cutoff angle specifies the radius of the spotlight (note: it is the radius of the cone, not the distance from the light source). For each fragment, we will calculate whether the fragment is within the cutoff direction of the spotlight (i.e., inside the cone), and if so, we will illuminate the fragment accordingly.

![spotlight demo](https://learnopengl-cn.github.io/img/02/05/light_casters_spotlight_angles.png)
- `LightDir`: The vector from the fragment to the light source.
- `SpotDir`: The direction of the spotlight.
- $\phi$: The cutoff angle that specifies the radius of the spotlight. Objects outside this angle will not be illuminated by the spotlight.
- $\theta$: The angle between the LightDir vector and the SpotDir vector. The $\theta$ value inside the spotlight should be less than the $\phi$ value.

#### Soft Edges
We can achieve a soft edge effect by defining two cutoff angles, an inner and an outer angle, and applying a gradient between these two angles. We can use this formula to calculate this value:

$$
I=\frac{\theta-\gamma}{\epsilon}
$$

Here, $\epsilon$ (Epsilon) is the difference in cosine values between the inner ($\phi$) and outer cone ($\gamma$) (i.e., $\epsilon=\phi-\gamma$). The final $I$ value represents the intensity of the spotlight at the current fragment.

Let’s explain how this function works. Since the inner and outer angles need to be between $(0,\frac{\pi}{2})$, the cosine function is monotonically decreasing in this range. Because the inner angle $\phi$ and outer angle $\gamma$ are fixed, as the incident angle $\theta$ moves from vertical to horizontal, which is from 0 to $\frac{\pi}{2}$, $cos(\theta)$ is monotonically decreasing. This value is maximum when $\theta=0$, starts to be less than 1 when $\theta>\phi$, equals 0 when $\theta=\gamma$, and becomes negative when greater than $\gamma$. If we use a clamping function to restrict the function value within the range $[0,1]$, it can represent full brightness within the inner angle, complete darkness outside the outer angle, and a smooth decrease in light intensity between the two cutoff angles.