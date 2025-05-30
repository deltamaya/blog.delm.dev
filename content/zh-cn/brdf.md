---
title: 双向反射分布函数基础
date: 2025-02-24
tags:
  - graphics
  - lighting
  - mathematics
authors:
  - Maya
ai: false
draft: false
---

## 定义
**BRDF**(Bidirectional Reflectance Distribution Function, 双向反射分布函数)是计算机图形学中一个核心概念，用于描述物体表面如何反射光线。它在真实渲染中扮演着关键角色，帮助我们模拟光线与物体表面的复杂交互，从而生成逼真的图像。

它可以在计算机图形学中可以用在全局光照算法中, 比如光线追踪需要计算物体的反射. 可以用于材质建模, 使用不同的BRDF来模拟不同的材质. 还有实时渲染, 比如游戏中计算光照, 但是BRDF的开销一般较大, 通常使用近似和预计算.

它是一个数学函数, 描述了从任意一点和方向入射后, 在某一个角度出射的光照强度. BRDF可以通过如下函数来描述:

$$
f_r(\omega_i,\omega_r)=\frac{dL_r(\omega_r)}{dE_i(\omega_i)}=\frac{dL_r(\omega_r)}{L_i(\omega_i)cos\theta_id\omega_i}
$$

其中$\omega_i$表述入射方向, $\omega_r$表示出射方向.

$L_r(\omega_r)$表示在出射辐射亮度, 即从出射方向离开的光的辐射亮度, **辐射亮度**(radiance)指的是单位面积, 单位立体角内的光功率, 单位为$W/(m^2\cdot sr)$. 
$E_i(\omega_i)$表示在入射辐照度, 即从入射方向照射到表面上的光功率密度. **辐照度**(irradiance)是单位面积上的光功率, 单位是$W/m^2$.

$\theta_i$指的是入射方向与表面法线的夹角. $d\omega_i$是微分立体角.

> [!NOTE]
> 由于BRDF只关心这两个光线方向, 而一个方向上的总光线强度可以有多个入射光线影响, 因此我们使用它们微分的比值而非直接进行数值比对, 因为微分可以准确的描述当前方向入射光线如何影响出射光线.如果使用数值直接进行比对就会引入其他方向光线的贡献, 导致错误.

每个方向可以由极角$\theta$和方位角$\phi$表示.

方位角的取值范围是$[0,2\pi]$, 它表示以观察者为中心从北方(某个轴), 旋转角的度数.

极角的取值范围是$[0,\pi]$, 表示在这个方向上的俯仰程度.

如果使用欧拉角来进行类比, 方位角约等于Yaw, 极角约等于Pitch.

因此BRDF也可以通过如下四元函数表示:

$$
f_r(\theta_i,\phi_i,\theta_r,\phi_r)
$$

BRDF的单位是$sr^{-1}$, 表示反射光线在出射方向上的辐射强度与入射光线在入射方向辐射强度的比值.

## 物理意义
由于BRDF表示的是现实中的光照反射情况, 因此必须遵循能量守恒等物理规律, 因此BRDF有如下约束:
- 非负: 反射光线的强度不能为负数
- 可逆: 将入射角和反射角颠倒产生的结果应该相同, 光线可逆
- 能量守恒: 对于一个入射方向, 所有出射方向的光照强度的积分需要小于1

通过BRDF我们可以计算出一个物体对光线的反射情况, 根据物体的不同BRDF, 可以表现出不同的外观:
- 镜面: BRDF在出射方向上有一个尖峰
- 漫反射: BRDF在各个方向上近乎相等
- 光泽表面: BRDF在某一段区间上有较宽的峰值


## 限制
BRDF的计算开销较大, 通常使用预计算或者近似模型, 比如[Phong模型](https://en.wikipedia.org/wiki/Phong_reflection_model): 风氏光照可以通过环境光, 漫反射和镜面反射模拟BRDF.




