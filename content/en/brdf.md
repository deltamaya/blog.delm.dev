---
title: Bidirectional Reflectance Distribution Function Basics
date: 2025-02-24
tags: ['graphics', 'lighting', 'mathematics']
authors: ['Maya']
ai: True
draft: False
---
## Definition
**BRDF** (Bidirectional Reflectance Distribution Function) is a core concept in computer graphics used to describe how a surface reflects light. It plays a key role in realistic rendering, helping us simulate the complex interactions between light and surfaces to generate lifelike images.

It can be used in global illumination algorithms in computer graphics, such as ray tracing, which requires calculating the reflection of objects. It can also be used for material modeling, employing different BRDFs to simulate various materials. Additionally, it is utilized in real-time rendering, such as calculating lighting in games, although the overhead of BRDF is generally significant, often requiring approximations and pre-computation.

It is a mathematical function that describes the intensity of light reflected at a certain angle after being incident from any point and direction. BRDF can be described by the following function:

$$
f_r(\omega_i,\omega_r)=\frac{dL_r(\omega_r)}{dE_i(\omega_i)}=\frac{dL_r(\omega_r)}{L_i(\omega_i)cos\theta_id\omega_i}
$$

Where $\omega_i$ denotes the incident direction, and $\omega_r$ represents the reflected direction.

$L_r(\omega_r)$ indicates the radiance in the outgoing direction, which is the radiance of light leaving in the outgoing direction. **Radiance** refers to the power of light per unit area per unit solid angle, measured in $W/(m^2\cdot sr)$. 
$E_i(\omega_i)$ represents the irradiance in the incident direction, which is the power density of light incident on the surface from that direction. **Irradiance** is the power of light per unit area, measured in $W/m^2$.

$\theta_i$ refers to the angle between the incident direction and the surface normal. $d\omega_i$ is the differential solid angle.

> [!NOTE]
> Since BRDF only concerns these two light directions, and the total light intensity in one direction can be influenced by multiple incident light rays, we use their differential ratio rather than direct numerical comparison. This is because differentiation can accurately describe how incident light rays in the current direction affect outgoing light rays. Direct numerical comparison would introduce contributions from light rays in other directions, leading to errors.

Each direction can be represented by the polar angle $\theta$ and the azimuthal angle $\phi$.

The range of the azimuthal angle is $[0,2\pi]$, representing the degrees of rotation from north (a certain axis) centered on the observer.

The range of the polar angle is $[0,\pi]$, indicating the degree of elevation in that direction.

If we use Euler angles for analogy, the azimuthal angle is approximately equal to Yaw, and the polar angle is approximately equal to Pitch.

Thus, BRDF can also be represented by the following four-dimensional function:

$$
f_r(\theta_i,\phi_i,\theta_r,\phi_r)
$$

The unit of BRDF is $sr^{-1}$, representing the ratio of the radiance of the reflected light in the outgoing direction to the radiance of the incident light in the incident direction.

## Physical Significance
Since BRDF represents the reflection of light in reality, it must adhere to physical laws such as energy conservation. Therefore, BRDF has the following constraints:
- Non-negativity: The intensity of reflected light cannot be negative.
- Reversibility: The result of reversing the incident and reflected angles should be the same; light is reversible.
- Energy conservation: For a given incident direction, the integral of the light intensity in all outgoing directions must be less than or equal to 1.

Through BRDF, we can calculate how an object reflects light. Depending on the object's different BRDFs, it can exhibit various appearances:
- Specular: BRDF has a peak in the outgoing direction.
- Diffuse: BRDF is nearly equal in all directions.
- Glossy surface: BRDF has a broad peak over a certain range.

## Limitations
The computational overhead of BRDF is significant, often requiring pre-computation or approximation models, such as the [Phong model](https://en.wikipedia.org/wiki/Phong_reflection_model): Phong illumination can simulate BRDF through ambient light, diffuse reflection, and specular reflection.