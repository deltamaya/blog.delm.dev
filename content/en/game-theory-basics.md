---
title: Basics of Game Theory
date: 2024-09-11
tags: ['DSA', 'NCM', 'game-theory']
authors: ['Maya']
ai: true
---

# Introduction

Game Theory is the study of the decisions made by multiple rational individuals when they cannot coordinate or negotiate with each other.

A rational individual is one who always chooses the option that maximizes their own payoff. The lack of negotiation means that participants cannot communicate, make agreements, or coordinate their actions.

## Introduction Through an Example

Let’s begin with a well-known and simple example to introduce Game Theory:

|         | B remains silent (cooperates) | B confesses (betrays)  |
|---------|-------------------------------|-------------------------|
| A remains silent (cooperates) | Both serve six months | A serves 10 years; B is released immediately |
| A confesses (betrays)          | A is released immediately; B serves 10 years | Both serve five years |

The police arrest two suspects, A and B, but lack sufficient evidence to convict them. The suspects are interrogated separately and offered the same choices:

- If one confesses and testifies against the other (termed "betrayal"), the confessor is released immediately, while the silent suspect receives a 10-year sentence.
- If both remain silent (termed "cooperation"), each will serve six months.
- If both confess (mutual "betrayal"), each will serve five years.

If you were A or B, what would you choose? 

To analyze this systematically, we enumerate the choices for both players and their outcomes, then construct a **payoff matrix** based on these outcomes:

|         | B remains silent (cooperates) | B confesses (betrays) |
|---------|-------------------------------|-----------------------|
| A remains silent (cooperates) | (-0.5, -0.5)                 | (-10, 0)            |
| A confesses (betrays)          | (0, -10)                    | (-5, -5)           |

This payoff matrix clearly and succinctly represents the outcomes of the game. It is a key tool for analyzing strategic interactions.

By observing the matrix, we notice that for A, choosing to confess always results in a smaller cost, regardless of B's choice ($-0.5 > -10$, $-5 > -0.5$). This is called a **strictly dominant strategy**.

Formally, if a strategy $S$ for player A yields the highest payoff for A in response to any strategy $T$ of player B, then $S$ is the **best response** to $T$. If $S$ is the best response to all of B's strategies, it is called a **strictly dominant strategy**. If a player has a strictly dominant strategy, a rational individual will always choose it, and the other players will adapt accordingly by choosing the best response to this strategy.

_Strictly dominant strategies require strictly higher payoffs than other strategies, while dominant strategies allow for payoffs that are merely greater or equal. The same distinction applies to best responses versus strictly best responses._

Thus, we conclude that both A and B will eventually choose to confess, leading to an outcome that is not optimal for either player.

### Changing the Outcome

How can we change this outcome? The best approach is to **alter the payoff matrix**. For example, suppose A and B belong to the same criminal gang, and the gang imposes retribution on members who confess, reducing their payoff by an additional -10. In this modified matrix, both A and B would then choose to remain silent.

# Nash Equilibrium

If A chooses strategy $S$ and B chooses strategy $T$, and $S$ is the best response to $T$ while $T$ is the best response to $S$, the strategy pair $(S, T)$ is called a **Nash equilibrium**. In this state, no participant has enough incentive to unilaterally change their strategy.

Strictly dominant strategies do not always exist. What happens when they don’t? 

In such cases, we introduce **dominated strategies**, which are the opposite of dominant strategies. Participants never choose dominated strategies. By iteratively eliminating dominated strategies, we may arrive at the outcome of the game. This outcome can be considered as representing the Nash equilibrium.

A game may have more than one Nash equilibrium, with differing payoffs at each equilibrium. Games where all participants achieve Nash equilibrium by choosing the same strategy are called coordination games. In coordination games, participants can negotiate to achieve a better Nash equilibrium.

However, when there are multiple Nash equilibria, the game model can no longer predict the outcome, and external factors must be considered.

## Zero-Sum Games

What if a game does not have a Nash equilibrium as described above? For instance, consider the following game: You and I each play by flipping a coin. If both coins show the same face, I win your coin. Otherwise, you win mine.

The payoff matrix for this game is:

|         | B heads  | B tails  |
|---------|----------|----------|
| **A heads** | (-1, +1) | (+1, -1) |
| **A tails** | (+1, -1) | (-1, +1) |

In this game, no strategy pair $(S, T)$ makes $S$ and $T$ mutual best responses, meaning there is no Nash equilibrium. 

To address this, we introduce **mixed strategies**, where players predict the probabilities of their opponent’s choices and adjust their strategies accordingly.

For example, if you predict that I (B) will choose heads 70% of the time, your best response is to choose tails, as this maximizes your expected payoff. However, you cannot be certain of my actual probabilities. To avoid being exploited, the best approach is to choose each action with equal probability, 50%-50%.

Formally, suppose A chooses strategy $H$ with probability $p$ and strategy $T$ with probability $1-p$, while B chooses strategy $H$ with probability $q$ and strategy $T$ with probability $1-q$. Define the payoff of strategy pair $(S, T)$ as $P(S, T)$. The expected payoff for B when choosing $H$ is:

$$p \cdot P_B(H, H) + (1-p) \cdot P_B(T, H)$$

The expected payoff for B when choosing $T$ is:

$$p \cdot P_B(H, T) + (1-p) \cdot P_B(T, T)$$

A pair of mixed strategies is mutually best responding when they make the opponent’s payoff for pure strategies equal. The **solution to this equation represents the equilibrium strategy**.

When mixed strategies are included, the resulting Nash equilibrium is called a **mixed Nash equilibrium**, and any game with a **finite** number of participants and **finite** strategies is guaranteed to have a Nash equilibrium.

# Summary

Having learned the basics of game theory, when faced with a real-world strategic problem, begin by analyzing the scenario. Use the rules to construct a payoff matrix, then look for strictly dominant strategies, eliminate dominated strategies, and identify Nash equilibria.