---
title: Fundamentals of Game Theory
date: 2024-09-11
tags: ['DSA', 'NCM', 'game-theory']
authors: ['Maya']
ai: true
---

# Introduction

Game Theory is the theory that studies the choices made by multiple rational individuals when they cannot negotiate with each other.

A rational individual is one who chooses the option that maximizes their own payoff. The absence of negotiation means that participants cannot communicate or make agreements with each other.

## Introduction

Let’s introduce Game Theory through a well-known and simple example:

|                          | B Silent (Cooperate)                         | B Confesses (Betray)                         |
| ------------------------ | -------------------------------------------- | -------------------------------------------- |
| **A Silent (Cooperate)** | Both serve 6 months                          | A serves 10 years; B is released immediately |
| **A Confesses (Betray)** | A is released immediately; B serves 10 years | Both serve 5 years                           |

The police have arrested two suspects, A and B, but lack sufficient evidence to convict them. Therefore, they separate the suspects, meeting with each individually, offering both the same options:

- If one confesses and testifies against the other (this action is referred to as "betraying" the other) while the other remains silent, the confessor will be released immediately, and the silent one will serve 10 years.
- If both remain silent (referred to as cooperating), both will serve 6 months.
- If both betray each other, they will each serve 5 years.

If you were A or B, how would you choose?
To analyze this problem rigorously, let’s enumerate the different choices and then create a **Payoff Matrix** based on the outcomes:

|                          | B Silent (Cooperate) | B Confesses (Betray) |
| ------------------------ | -------------------- | -------------------- |
| **A Silent (Cooperate)** | (-0.5, -0.5)         | (-10, 0)             |
| **A Confesses (Betray)** | (0, -10)             | (-5, -5)             |

This is the payoff matrix, which provides an intuitive representation of the game's outcomes. It is an important tool for analyzing the gaming process.

By examining the matrix, we find that for A, when he chooses to confess, he consistently incurs a smaller cost than if he chose to remain silent, regardless of B's choice (-0.5 < 0, -10 < -5).
This kind of choice is known as a **strictly dominant strategy**.

To be precise, if a strategy $S$ for A maximizes A's payoff under strategy $T$ of B, then $S$ is the **Best Response** to $T$. If $S$ is the best response for every strategy of B, we refer to it as a **strictly dominant strategy**. If a participant has a strictly dominant strategy, rational individuals will choose it, leading other participants to choose their best response to that strategy.

_Strictly dominant strategies must yield strictly greater payoffs than other strategies, while dominant strategies can equal or exceed other strategies—similar for Best Response and Strict Best Response._

Thus, we can conclude that in the scenario outlined, both A and B will ultimately choose to confess, reaching a suboptimal result.

So what can we do to change this situation? The best method would be to directly **alter the payoff matrix**. For example, if A and B are part of the same criminal organization, and the organization retaliates against members who confess, setting their payoff at -10, this change would lead both A and B to choose silence.

# Nash Equilibrium

Suppose A's strategy is $S$, and B's strategy is $T$. If $S$ is the best response to $T$, and $T$ is the best response to $S$, then the strategy pair ($S$, $T$) is referred to as a **Nash Equilibrium**. In equilibrium, no participant has sufficient incentive to change their current strategy.

Strictly dominant strategies do not always exist; what should we do if they don't?
Now we need to introduce **dominated strategies**, which are essentially the opposite of dominant strategies. Participants will not choose dominated strategies in decision-making. After eliminating dominated strategies, new dominated strategies may emerge, and iteratively removing them until one remains yields the result of the game. This outcome can be considered a representation of Nash equilibrium.

In a game, there can be multiple Nash Equilibrium points, and the payoffs at different equilibrium points can vary. A game that can reach a Nash Equilibrium point when everyone chooses the same strategy is called a coordination game, where individuals can reach a better Nash equilibrium through negotiation.

When multiple Nash Equilibria exist, further predictions based on the game model become impossible, and judgments must be made based on other external factors.

## Zero-Sum Games

What if there’s a game in which no Nash Equilibrium, as mentioned earlier, exists? For instance, if we play a game where each person shows a coin each time, and if the faces are the same, I gain your coin, and if not, you gain mine.

Based on the rules, let’s create a payoff matrix:

|             | B Heads  | B Tails  |
| ----------- | -------- | -------- |
| **A Heads** | (-1, +1) | (+1, -1) |
| **A Tails** | (+1, -1) | (-1, +1) |

We find that in this game, there is no pair of strategies where $S$ and $T$ are mutual best responses, meaning no Nash Equilibrium exists.
At this point, we need to introduce a bit of luck, which is where **mixed strategies** come into play. This involves predicting the probability of the opponent choosing different strategies to formulate your own strategy.

For example, if you predict I (B) have a 70% chance of showing heads, you would obviously choose to show tails to maximize expected payoff. However, you aren't certain if I will definitely show heads—what if I show tails 100% of the time? Hence, the probabilities associated with my choice are also uncertain for you. Intuitively, the best way would be to adopt equal probability strategies, showing either side with a 50%-50% likelihood.

More rigorously, let A show strategy $H$ with a probability of $p$, and $T$ with a probability of $1-p$, while B shows strategy $H$ with a probability of $q$, and $T$ with a probability of $1-q$. The payoff for the strategy pair ($S, T$) is denoted as $P(S, T)$. When B chooses $H$, the expected payoff is $p*P_B(H, H)+(1-p)*P_B(T, H)$, and when choosing $T$, the expected payoff is $p*P_B(H, T)+(1-p)*P_B(T, T)$. A pair of mixed strategies constitutes best responses if they yield equal expected payoffs for the opponent in pure strategy. An effective probability strategy makes it so that the opponent cannot ascertain which probability strategy is optimal; this occurs when the above two expected payoffs are **equal**, resulting in the **solution of the equation as the equilibrium strategy**.

Introducing mixed strategies leads to the concept of Nash Equilibrium in mixed strategies, termed **Mixed Nash Equilibrium**. Thus, for any **finite** number of participants and **finite** strategies, a Nash Equilibrium **must exist**.

# Conclusion

Having learned about simple games, when encountering game-related problems in reality, one should first analyze the scenario, create a payoff matrix based on the rules, and then seek strictly dominant strategies, eliminate dominated strategies, and identify Nash Equilibrium.
