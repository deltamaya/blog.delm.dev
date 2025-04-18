---
title: 博弈论基础
date: 2024-09-11
tags: ['DSA', 'NCM', 'game-theory']
authors: ['Maya']
ai: false
---

# 介绍

博弈论(Game Theory)是研究多个理性(rational)个体，在相互不进行协商的情况下所做出的选择的理论。

所谓理性个体，就是指在选择中参与者只会选择对自己利益(payoff)最大化的选择。而不进行协商指的是参与者之间不能进行沟通，达成协议等行为。

## 引入

接下来通过一个知名且简单的例子来引入博弈论：

|               | B沉默（合作）        | B认罪（背叛）        |
| ------------- | -------------------- | -------------------- |
| A沉默（合作） | 二人同服刑半年       | A服刑10年；B即时获释 |
| A认罪（背叛） | A即时获释；B服刑10年 | 二人同服刑5年        |

警方逮捕A、B两名嫌疑犯，但没有足够证据指控二人有罪。于是警方分开囚禁嫌疑犯，分别和二人见面，并向双方提供以下相同的选择：

- 若一人认罪并作证检控对方（相关术语称“背叛”对方），而对方保持沉默，此人将即时获释，沉默者将判监10年。
- 若二人都保持沉默（相关术语称互相“合作”），则二人同样判监半年。
- 若二人都互相检举（互相“背叛”），则二人同样判监5年。

如果你是A或B，你会怎么进行抉择呢？
为了更严谨的研究这个问题，我们先对自己和对方的不同选择进行枚举，然后根据选择的后果画出**收益矩阵**：

|               | B沉默（合作） | B认罪（背叛） |
| ------------- | ------------- | ------------- |
| A沉默（合作） | (-0.5, -0.5)  | (-10, 0)      |
| A认罪（背叛） | (0, -10)      | (-5, -5)      |

这就是收益矩阵，是不是能十分直观的表达博弈的结果呢？这是分析博弈过程中的重要工具。

通过观察我们发现，对A来说，当他选择认罪的时候，不管B怎么选，自己总是能够承受比选择沉默更小的代价（-0.5 < 0, -10 < -5）。
这种选择就是**严格占优策略(strictly dominant strategy)**。

严谨的来讲，当A的某种策略$S$能够在B的某种策略$T$下让A获得最大的收益，那么$S$就是$T$的**严格最佳应对(Best Response)**。当对于B的每种策略，$S$都是最佳应对时，我们称之为**严格占优策略**。如果某个参与者存在严格占优策略，那么正常人都会选择它，然后其他的参与者一定会选择这个策略的最佳应对。

_严格占优策略要求该策略的收益严格大于其他策略，而占优策略则是大于等于即可，最佳应对和严格最佳应对同理。_

所以我们可以得到一个结论：在上面的情况下，A和B最终都会选择认罪，然后达成一个并不是最好的结果。

那如果我们想要改变这种情况怎么办呢？最好用的方法就是直接**改变收益矩阵**。比如A和B同属一个犯罪团伙，犯罪团伙会对认罪的成员进行报复，让收益-10，这样改变了收益矩阵后，此时A和B就都会选择沉默。

# 纳什均衡

假如A的策略是$S$，B的策略是$T$，如果此时$S$是$T$的最佳应对，并且$T$也是$S$的最佳应对，那么称策略组($S$, $T$)构成**纳什均衡(Nash equilibrium)**。
在均衡状态下，每个参与者都没有足够的动力改变当前的策略。

严格占优策略并不总是存在的，当它不存在的时候怎么办呢？
现在我们需要再引入**劣势策略**，其实就是相反的占优策略，参与者在决策中不会选择劣势策略。在剔除掉劣势策略之后剩下的情况中有可能存在新的劣势策略，迭代剔除到最后一个就是博弈的结果。这个博弈的结果就可以是认为纳什均衡的表现。

在一次博弈当中，可以存在一个以上的纳什均衡点，并且不同均衡点的收益可以不同。当所有人都选择同一种策略时可以达到纳什均衡点的博弈可以叫做协调博弈，在协调博弈中，人们可以通过协商来达成一个更好的纳什均衡。

当存在有多个纳什均衡的时候，博弈模型就无法进一步进行预测了，此时就只能通过其他外部因素进行判断。

## 零和博弈

如果有一种博弈中没有我们上面提到的纳什均衡应该怎么办？比如你跟我玩一个游戏，每人每次出示一枚硬币，如果硬币的朝向相同，那么我获得你的硬币，相反的话你就获得我的硬币。

根据规则画出收益矩阵：

|           | B正面    | B反面    |
| --------- | -------- | -------- |
| **A正面** | (-1, +1) | (+1, -1) |
| **A反面** | (+1, -1) | (-1, +1) |

我们发现这个博弈中没有一对策略组使得$S$和$T$互为最佳应对，也就不存在纳什均衡。
这个时候我们就需要加入一点点运气了，也就是**混合策略**，通过预测对方做出不同策略的概率来做出自己的策略。

比如你猜我（B）有70%的概率选择出示正面，那么你此时当然要选择出示反面，因为这样的收益期望最大，但是你不确定我是不是有70%的概率出正面，如果我100%出反面呢？我出哪一种朝向的概率对你来说也是不确定的。直观来说，最好的方法就是使用期望概率，都以50%50%的概率出就完了。

严谨的来讲，A有$p$的概率出策略$H$，有$1-p$的概率出$T$，B有$q$的概率出策略$H$，$1-q$的概率出$T$。定义策略组（$S, T$）的收益为$P(S, T)$，B选择$H$时候的期望收益是$p*P_B(H, H)+(1-p) *P_B(T, H)$，B在选择T的时候期望收益是$p *P_B(H, T)+(1-p) *P_B(T, T)$，一对混合策略互为最佳应对是指他们使得对方在纯策略上获得的收益相同，而一个好的概率策略就是让对方不知道用哪个概率策略最优，也就是当上面两个期望收益**相等**的时候，**方程的解就是均衡策略**。

如果引入了混合策略的纳什均衡，即**混合纳什均衡**，那么任何一个**有限**个参与者，**有限**个策略的博弈**一定存在纳什均衡**。

# 总结

学完了简单博弈，在现实中遇到博弈问题的时候首先需要对情景进行分析，根据规则绘制收益矩阵，然后去找严格占优策略、剔除劣势策略和纳什均衡即可。
