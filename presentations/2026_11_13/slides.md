---
theme: frankfurt
infoLine: True # on by default, can be turned off
topNavigation: true # on by default, can be turned off
author: 'Jiatai Song' # shows in infoLine
title: 'Lyapunov spectrum of random neural networks' # shows in infoLine
date: '2026/11/13' # shows in infoLine, defaults to the current date
---

# JC：Lyapunov spectrum of random neural networks

JiataiSong · 2026-11-13

---
section: 'Introduction'
---



# Intuition of Lyapunov exponents

<Item title="A one-dimensional example">

$$
x(n+1)=G(x(n))=2x(n),\qquad \widetilde{x}(0)=x(0)+v(0).
$$

</Item>

<div class="intuition-layout">
<div class="intuition-figure"><LyapunovIntuition /></div>
<div class="intuition-equations">
<Item title="Growth of the perturbation">

$$
v(n+1)=M(n)v(n)=2v(n),
\qquad v(n)=2^n v(0).
$$

</Item>
<Item title="Lyapunov exponent">

$$
\sigma_1(m)=2^m,\qquad
\lambda_1=\lim_{m\to\infty}\frac{1}{m\delta}\log\sigma_1(m)
=\log 2>0.
$$

</Item>
</div>
</div>

<style>
.intuition-layout { display: grid; grid-template-columns: 58% 40%; gap: 2%; align-items: center; margin-top: .25rem; }
.intuition-equations { display: grid; gap: 1rem; }
.intuition-equations .item { margin: 0; }
.intuition-equations .katex-display { font-size: .82em; }
</style>

---

# Definition of Lyapunov exponents

<div class="lyapunov-definition">
<Item title="(1) Linearized dynamics of a perturbation">

For $x(n+1)=G(x(n))$, displace the state by $v(n)$ and expand $G$ at $x(n)$:

$$
\begin{aligned}
M_{ij}(n)&=\left.\frac{\partial G_i(x)}{\partial x_j}\right|_{x=x(n)},\\
v(n+1)&=G(x(n)+v(n))-G(x(n))\\
&=M(n)v(n)+O(\|v(n)\|^2)
\;\longrightarrow\; \boxed{v(n+1)=M(n)v(n)}.
\end{aligned}\tag{1}
$$

</Item>
<Item title="(2) Long-time growth rates">

Iterating (1) gives the derivative cocycle $P_m$; its singular values measure stretching along orthogonal directions:

$$
P_m=M(m)\cdots M(1),\qquad v(m+1)=P_m v(1),
\qquad \|P_m u_i\|=\sigma_i(m),
$$

Here $u_i$ is the $i$th right singular vector and $\sigma_1(m)\ge\cdots\ge\sigma_N(m)$. Divide log-stretch by elapsed time $m\delta$:

$$
\boxed{\lambda_i=\lim_{m\to\infty}\frac{1}{m\delta}\log\sigma_i(m)},
\qquad i=1,\ldots,N.\tag{2}
$$

</Item>
</div>

<style>
.lyapunov-definition { display: grid; gap: .35rem; margin-top: .35rem; }
.lyapunov-definition .item { margin: 0; }
.lyapunov-definition .item main { font-size: .82em; line-height: 1.15; }
.lyapunov-definition .item main p { margin: .25em 0; }
.lyapunov-definition .katex-display { margin: .25em 0; font-size: .84em; }
</style>

---

# Stable and unstable directions along a trajectory

<div class="subspace-layout">
<MovingSubspaces />
<div class="subspace-formulas">
<Item title="A curved reference trajectory">

Consider a two-dimensional map with the reference orbit starting at $\bigl(x(0),y(0)\bigr)=(\pi/2,1)$:

$$
\begin{aligned}
x(n+1)&=\tfrac12 x(n),\\
y(n+1)&=\sin\!\bigl(\tfrac12 x(n)\bigr)
+2\bigl(y(n)-\sin x(n)\bigr).
\end{aligned}
$$

The signed vertical offset from the curve doubles, while horizontal displacement halves:

$$
z(n)=y(n)-\sin x(n),\qquad
x(n+1)=\tfrac12x(n),\quad z(n+1)=2z(n).
$$

</Item>
<Item title="The stable and unstable subspaces">

$$
\begin{aligned}
E^{\mathrm{st}}(n)&=\operatorname{span}\{(1,\cos x(n))\},
&\lambda_{\mathrm{st}}&=-\log 2,\\
E^{\mathrm{un}}(n)&=\operatorname{span}\{(0,1)\},
&\lambda_{\mathrm{un}}&=+\log 2.
\end{aligned}
$$

Any small perturbation splits along these directions:

$$
w=(a,b)=\underbrace{(a,a\cos x(n))}_{\text{stable}}
+\underbrace{(0,b-a\cos x(n))}_{\text{unstable}}.
$$

</Item>
</div>
</div>

<style>
.subspace-layout { display: grid; grid-template-columns: 55% 43%; gap: 2%; align-items: center; margin-top: .6rem; }
.subspace-formulas { display: grid; gap: .55rem; }
.subspace-formulas .item { margin: 0; }
.subspace-formulas .item :deep(main) { font-size: .76em; line-height: 1.16; }
.subspace-formulas .item :deep(main p) { margin: .26em 0; }
.subspace-formulas .item :deep(.katex-display) { margin: .24em 0; font-size: .78em; }
</style>

---

# Random neural network and its tangent map

<div class="network-model">
<Item title="Network dynamics in this paper">

The Euler time step is $0<\delta\le 1$. Each neuron has a leaky state and receives a nonlinear recurrent input, with $\phi(x)=\tanh(x)$:

$$
x_i(n+1)=(1-\delta)x_i(n)
+\delta\sum_{j=1}^{N}J_{ij}\phi(x_j(n)),\qquad i=1,\ldots,N.\tag{5}
$$

The asymmetric couplings are independent Gaussian variables; $g$ sets their strength:

$$
J_{ij}\overset{\mathrm{i.i.d.}}{\sim}
\mathcal{N}\!\left(0,\frac{g^2}{N}\right).\tag{6}
$$

</Item>
<Item title="Jacobian of the network">

Writing $G_i(x)=(1-\delta)x_i+\delta\sum_j J_{ij}\phi(x_j)$, differentiate each output with respect to $x_k$:

$$
\begin{aligned}
M_{ik}(n)
&=\left.\frac{\partial G_i(x)}{\partial x_k}\right|_{x=x(n)}
=(1-\delta)\delta_{ik}+\delta J_{ik}\phi'(x_k(n)),\\
d_k(n)&=\phi'(x_k(n)),\qquad
D(n)=\operatorname{diag}(d_1(n),\ldots,d_N(n)),\\
\boxed{M(n)}&=\boxed{(1-\delta)I_N+\delta JD(n)}.
\end{aligned}\tag{7}
$$

</Item>
</div>

<style>
.network-model { display: grid; gap: .45rem; margin-top: .4rem; }
.network-model .item { margin: 0; }
.network-model .item main { font-size: .83em; line-height: 1.18; }
.network-model .item main p { margin: .3em 0; }
.network-model .katex-display { margin: .28em 0; font-size: .88em; }
</style>

---

# Related work: the leading exponent

<Item class="related-work-card" title="Sompolinsky, Crisanti & Sommers (1988)">

For the continuous-time network ($\delta\to 0$), dynamical mean-field theory relates the **maximum** Lyapunov exponent to the ground-state energy $E_0$ of a Schrödinger-type operator. A generic infinitesimal perturbation grows at this rate:

$$
\lambda_1=-1+\sqrt{1-E_0},
\qquad \|v(t)\|\asymp e^{\lambda_1 t}\|v(0)\|.
$$

The result identifies the onset of chaos and the leading rate of separation. It does **not** determine the remaining exponents $\lambda_2,\ldots,\lambda_N$ or the full Lyapunov spectrum.

</Item>

<LeadingExponent />

<div class="related-work-source">S. Sompolinsky, A. Crisanti & H.-J. Sommers, <em>Phys. Rev. Lett.</em> 61, 259 (1988).</div>

<style>
.related-work-card { margin: .4rem 0 .15rem !important; }
.related-work-card main { font-size: .83em; line-height: 1.16; }
.related-work-card main p { margin: .25em 0; }
.related-work-card .katex-display { margin: .3em 0; font-size: .9em; }
.related-work-source { font-size: .7rem; color: #57667d; text-align: right; margin-top: -.65rem; }
</style>

---
section: 'Derivation'
---

# Converting Lyapunov into a distribution

<div class="cdf-layout">
<div class="cdf-figure"><LyapunovDistribution /></div>
<div class="cdf-formula">
<Item title="Cumulative distribution">

For a threshold $s$, count the exponents strictly below it and divide by the network size:

$$
\boxed{F(s)=\frac{1}{N}\#\{i:\lambda_i<s\}}.\tag{8}
$$

As the dashed line crosses an exponent, one more direction enters the count. The bars and count at left use $N=12$ **illustrative values**, not a computed spectrum of the network.

<CDFReadout />

</Item>
</div>
</div>

<style>
.cdf-layout { display: grid; grid-template-columns: 58% 40%; gap: 2%; align-items: center; margin-top: 1.5rem; }
.cdf-formula .item { margin: 0; }
.cdf-formula .item main { font-size: .86em; line-height: 1.26; }
.cdf-formula .katex-display { font-size: .97em; margin: .8em 0; }
</style>

---

# Construct tool dynamics

<div class="shifted-layout">
<Item title="Tool dynamics">

Multiply each tangent-map step by $e^{-\delta s}$:

$$
v(n+1)=M_s(n)v(n).\tag{9}
$$

$$
\begin{aligned}
M_s(n)&=e^{-\delta s}M(n)\\
&=\alpha_s I_N+\beta_s JD(n).
\end{aligned}\tag{10}
$$

Using (7), the two coefficients are

$$
\alpha_s=(1-\delta)e^{-\delta s},\tag{11}
$$

$$
\beta_s=\delta e^{-\delta s}.\tag{12}
$$

</Item>
<Item title="Why decaying directions give the original distribution">

Over $m$ steps, every Jacobian contributes the same scalar factor:

$$
P_m^{(s)}=M_s(m)\cdots M_s(1)
=e^{-m\delta s}P_m.
$$

Since $\sigma_i^{(s)}(m)=e^{-m\delta s}\sigma_i(m)$, dividing its logarithm by elapsed time gives

$$
\begin{aligned}
\frac{1}{m\delta}\log\!\left(e^{-m\delta s}\sigma_i(m)\right)
&=\frac{1}{m\delta}\log\sigma_i(m)-s\\
&\longrightarrow\lambda_i-s=\lambda_i^{(s)}\qquad(m\to\infty).
\end{aligned}
$$

In forward time, directions below $s$ have negative shifted exponents and decay:

$$
\lambda_i^{(s)}<0\quad\Longleftrightarrow\quad\lambda_i<s.
$$

$$
\boxed{F(s)=\frac{1}{N}\#\{i:\lambda_i^{(s)}<0\}}.
$$

</Item>
</div>

<style>
.shifted-layout { display: grid; grid-template-columns: 48% 50%; gap: 2%; align-items: start; margin-top: .55rem; }
.shifted-layout .item { margin: 0; min-height: 385px; display: flex; flex-direction: column; }
.shifted-layout .item :deep(main) { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; font-size: .9em; line-height: 1.3; }
.shifted-layout .item :deep(main p) { margin: .35em 0; }
.shifted-layout .item :deep(.katex-display) { margin: .45em 0; font-size: .93em; }
</style>

---

# Construct tool dynamics

<div class="shift-visual-layout">
<ShiftedSpectrum />
<Item title="Why decaying directions give the original distribution">

Over $m$ steps, every Jacobian contributes the same scalar factor:

$$
P_m^{(s)}=M_s(m)\cdots M_s(1)
=e^{-m\delta s}P_m.
$$

Since $\sigma_i^{(s)}(m)=e^{-m\delta s}\sigma_i(m)$, dividing its logarithm by elapsed time gives

$$
\begin{aligned}
\frac{1}{m\delta}\log\!\left(e^{-m\delta s}\sigma_i(m)\right)
&=\frac{1}{m\delta}\log\sigma_i(m)-s\\
&\longrightarrow\lambda_i-s=\lambda_i^{(s)}\qquad(m\to\infty).
\end{aligned}
$$

In forward time, directions below $s$ have negative shifted exponents and decay:

$$
\lambda_i^{(s)}<0\quad\Longleftrightarrow\quad\lambda_i<s.
$$

$$
\boxed{F(s)=\frac{1}{N}\#\{i:\lambda_i^{(s)}<0\}}.
$$

</Item>
</div>

<style>
.shift-visual-layout { display: grid; grid-template-columns: 48% 50%; gap: 2%; align-items: center; margin-top: .55rem; }
.shift-visual-layout .item { margin: 0; min-height: 385px; display: flex; flex-direction: column; }
.shift-visual-layout .item :deep(main) { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; font-size: .9em; line-height: 1.3; }
.shift-visual-layout .item :deep(main p) { margin: .35em 0; }
.shift-visual-layout .item :deep(.katex-display) { margin: .45em 0; font-size: .93em; }
</style>

---

# From a source to the cumulative distribution

<div class="source-summary">
<Item title="Introduce a source and collect all time steps">

Write the tangent vectors and source over the full time axis as sequences:

$$
V=(\ldots,v(1),v(2),\ldots)^\top,\qquad
I^v=(\ldots,I^v(1),I^v(2),\ldots)^\top.\tag{13}
$$

$$
v(n+1)=M_s(n)v(n)+I^v(n).\tag{14}
$$

The same recurrence becomes one linear equation; $K$ is block-bidiagonal, with one block row for each time step:

$$
KV=I^v,\tag{15}
$$

$$
K_{n,n}=-M_s(n),\qquad K_{n,n+1}=I_N.\tag{16}
$$

$$
(KV)(n)=v(n+1)-M_s(n)v(n).\tag{17}
$$

Set the source at one time only, $I^v(k)=w$. Without an initial condition, the equation has a family of solutions.

</Item>
<Item title="Finite-norm solution and response">

Let $P=P(k+1)$ project onto the stable subspace along the unstable one. The source splits into $Pw$ and $(I_N-P)w$. The finite-norm solution uses

$$
\begin{aligned}
v(k)&=-M_s(k)^{-1}(I_N-P)w,\\
v(k+1)&=Pw,\\
v(k+2)&=M_s(k+1)Pw.
\end{aligned}\tag{18}
$$

Away from the source, (19)–(20) verify the free dynamics:

$$
\begin{aligned}
M_s(k-1)v(k-1)&=v(k),\\
M_s(k+1)v(k+1)&=v(k+2).
\end{aligned}
$$

At the source,

$$
M_s(k)v(k)+w=-(I_N-P)w+w=Pw.\tag{21}
$$

Only the stable part remains after one step. The trace of this response counts the stable directions:

$$
\boxed{F(s)=\frac1N\operatorname{tr}
\frac{\partial v(k+1)}{\partial I^v(k)}}
=\frac1N\operatorname{tr}P.\tag{22}
$$

</Item>
</div>

<style>
.source-summary { display: grid; grid-template-columns: 49% 49%; gap: 2%; align-items: stretch; margin-top: .5rem; }
.source-summary .item { margin: 0; min-height: 384px; display: flex; flex-direction: column; }
.source-summary .item :deep(main) { flex: 1; display: flex; flex-direction: column; justify-content: space-evenly; font-size: .77em; line-height: 1.18; }
.source-summary .item :deep(main p) { margin: .2em 0; }
.source-summary .item :deep(.katex-display) { margin: .15em 0; font-size: .83em; }
</style>
---

# A localized source in the tangent dynamics

<div class="source-dynamics-layout">
<SourceDrivenOrbit />
<Item title="A source added at one time step">

For this example take $s=0$, so $M_s(n)=M(n)$. The paper collects the tangent vectors and source into time-indexed sequences:

$$
V=(\ldots,v(1),v(2),\ldots)^\top,\qquad
I^v=(\ldots,I^v(1),I^v(2),\ldots)^\top.\tag{13}
$$

The source changes the tangent recurrence:

$$
v(n+1)=M_s(n)v(n)+I^v(n).\tag{14}
$$

In the animation $I^v(k)=w$ and $I^v(n)=0$ for $n\ne k$. Thus the purple free image and orange source add at $k+1$:

$$
v(k+1)=\underbrace{M_s(k)v(k)}_{\text{purple}}
+\underbrace{w}_{\text{orange}}.
$$

Over all time steps, the same equations become

$$
KV=I^v,\tag{15}
$$

$$
K_{n,n}=-M_s(n),\qquad K_{n,n+1}=I_N,\tag{16}
$$

$$
(KV)(n)=v(n+1)-M_s(n)v(n).\tag{17}
$$

</Item>
</div>

<style>
.source-dynamics-layout { display: grid; grid-template-columns: 55% 43%; gap: 2%; align-items: center; margin-top: .55rem; }
.source-dynamics-layout .item { margin: 0; }
.source-dynamics-layout .item :deep(main) { font-size: .74em; line-height: 1.14; }
.source-dynamics-layout .item :deep(main p) { margin: .18em 0; }
.source-dynamics-layout .item :deep(.katex-display) { margin: .16em 0; font-size: .80em; }
</style>

---

# Why the finite-norm solution selects a projection

<div class="minimum-norm-layout">
<MinimumNormOrbit />
<Item title="Finite norm and the response at the source">

For a source $I^v(k)=w$ at one step, select the minimum-norm solution of $KV=I^v$:

$$
V_*=\underset{KV=I^v}{\operatorname{argmin}}\,\|V\|_2.
$$

Stable directions grow backward; unstable directions grow forward. Finite norm retains the unstable part before the source and the stable part after it. Let $P=P(k+1)$ project onto the stable subspace:

$$
\begin{aligned}
v(k)&=-M_s(k)^{-1}(I_N-P)w,\\
v(k+1)&=Pw.
\end{aligned}\tag{18}
$$

$$
M_s(k)v(k)+w=-(I_N-P)w+w=Pw.\tag{21}
$$

Step 5 chooses $w$ for a fixed incoming vector; (18) chooses $v(k)$ for a fixed $w$. Both cancel the post-source unstable part.

Since $\partial v(k+1)/\partial I^v(k)=P$ and $\operatorname{tr}P=NF(s)$,

$$
\boxed{F(s)=\frac1N\operatorname{tr}
\frac{\partial v(k+1)}{\partial I^v(k)}}.\tag{22}
$$

</Item>
</div>

<style>
.minimum-norm-layout { display: grid; grid-template-columns: 55% 43%; gap: 2%; align-items: center; margin-top: .55rem; }
.minimum-norm-layout .item { margin: 0; }
.minimum-norm-layout .item :deep(main) { font-size: .74em; line-height: 1.13; }
.minimum-norm-layout .item :deep(main p) { margin: .17em 0; }
.minimum-norm-layout .item :deep(.katex-display) { margin: .15em 0; font-size: .80em; }
</style>

---

# From regularization to forward–backward equations

<div class="regularization-layout">
<Item title="Regularized minimum-norm solution">

The minimum-norm solution is obtained as $\eta\to0^+$ from a strictly convex least-squares problem. The residual term enforces $K\mathcal V=\mathcal I^v$; the $\eta^2$ term selects the smallest norm:

$$
\mathcal V
=\underset{\mathcal V'}{\operatorname{argmin}}
\left(
\left\|K\mathcal V'-\mathcal I^v\right\|_2^2
+\eta^2\left\|\mathcal V'\right\|_2^2
\right).\tag{23}
$$

</Item>
<Item title="A rescaled residual yields two coupled equations">

Setting the gradient of the cost in (23) to zero gives

$$
K^T(K\mathcal V-\mathcal I^v)+\eta^2\mathcal V=0.\tag{26}
$$

Introduce the rescaled residual

$$
\mathcal U=
\begin{pmatrix}
\vdots\\ u(1)\\ u(2)\\ \vdots
\end{pmatrix}
=\frac{\mathcal I^v-K\mathcal V}{\eta}.\tag{27}
$$

Its definition gives (28). Substituting $K\mathcal V-\mathcal I^v=-\eta\mathcal U$ into (26) and dividing by $\eta>0$ gives (29):

$$
\eta\mathcal U+K\mathcal V=\mathcal I^v,\tag{28}
$$

$$
-K^T\mathcal U+\eta\mathcal V=0.\tag{29}
$$

For $\eta>0$, the forward field $\mathcal V$ and backward field $\mathcal U$ are coupled; as $\eta\to0^+$, $\mathcal V$ approaches the minimum-norm solution.

</Item>
</div>

<style>
.regularization-layout { display: grid; grid-template-rows: auto 1fr; gap: .55rem; margin-top: .4rem; }
.regularization-layout .item { margin: 0; }
.regularization-layout .item :deep(main) { font-size: .8em; line-height: 1.16; }
.regularization-layout .item :deep(main p) { margin: .18em 0; }
.regularization-layout .item :deep(.katex-display) { margin: .16em 0; font-size: .83em; }
.regularization-layout .item:last-child :deep(main) { font-size: .76em; }
.regularization-layout .item:last-child :deep(.katex-display) { margin: .10em 0; font-size: .82em; }
</style>

---

# Neuron-wise forward and backward dynamics

<div class="neuron-dynamics-layout">
<Item title="The network state drives the gain">

Start with the network update (5) and add a source $\mathcal I_i^x(n)$ to each neuron's input. Because the update is an Euler step, the entire input—including the source—is multiplied by $\delta$:

$$
x_i(n+1)=(1-\delta)x_i(n)
+\delta\left[
\sum_{j=1}^{N}J_{ij}\phi(x_j(n))+\mathcal I_i^x(n)
\right].\tag{32}
$$

The resulting trajectory fixes $d_i(n)=\phi'(x_i(n))$, which enters both tangent equations below.

</Item>
<Item title="Expand the two block equations component by component">

Using $K_{n,n}=-M_s(n)$ and $K_{n,n+1}=I_N$, equation (28) gives
$v(n+1)=M_s(n)v(n)-\eta u(n)+\mathcal I^v(n)$.
Insert $M_s(n)=\alpha_sI_N+\beta_sJD(n)$:

$$
v_i(n+1)=\alpha_s v_i(n)
+\beta_s\sum_{j=1}^{N}J_{ij}d_j(n)v_j(n)
-\eta u_i(n)+\mathcal I_i^v(n).\tag{33}
$$

For (29), the paper adds a source $\mathcal I^u$. The transpose of the block operator gives
$u(n-1)=M_s(n)^Tu(n)+\eta v(n)-\mathcal I^u(n)$.
Since $M_s(n)^T=\alpha_sI_N+\beta_sD(n)J^T$,

$$
u_i(n-1)=\alpha_s u_i(n)
+\beta_s d_i(n)\sum_{j=1}^{N}J_{ji}u_j(n)
+\eta v_i(n)-\mathcal I_i^u(n).\tag{34}
$$

The $J_{ij}d_j(n)$ term propagates $v$ forward; the transposed $d_i(n)J_{ji}$ term propagates $u$ backward.

</Item>
</div>

<style>
.neuron-dynamics-layout { display: grid; grid-template-rows: auto 1fr; gap: .55rem; margin-top: .45rem; }
.neuron-dynamics-layout .item { margin: 0; }
.neuron-dynamics-layout .item :deep(main) { font-size: .80em; line-height: 1.18; }
.neuron-dynamics-layout .item :deep(main p) { margin: .20em 0; }
.neuron-dynamics-layout .item :deep(.katex-display) { margin: .24em 0; font-size: .88em; }
.neuron-dynamics-layout .item:last-child :deep(main) { font-size: .78em; }
.neuron-dynamics-layout .item:last-child :deep(.katex-display) { margin: .24em 0; font-size: .88em; }
</style>

---

# Why the cavity method is needed

<div class="cavity-intro-layout">
<Item title="Why a direct calculation does not close">

For one specified $J$, (32)–(34) can be solved numerically. The paper instead seeks the large-$N$ distribution from the law of $J$ alone. Its readout is a response of the entire coupled system:

$$
\lim_{N\to\infty}F(s)
=\lim_{\eta\to0^+}\lim_{N\to\infty}
\frac1N\operatorname{tr}R^{vv}(k+1,k).\tag{36}
$$

The same fixed $J$ generates the trajectory, the time-dependent gains, and every shifted Jacobian:

$$
M_s(n)=\alpha_s I_N+\beta_sJD(n),\qquad
d_i(n)=\phi'(x_i(n)).
$$

Consequently $D(n)$ is correlated with $J$ and across time. Averaging each matrix factor separately loses the correlations needed for the response. Equation (36) also assumes that the limits $N\to\infty$ and $\eta\to0^+$ can be exchanged.

</Item>
<Item title="Cavity method: isolate one typical neuron">

Add neuron $0$ to an $N$-neuron reservoir. Its new couplings are independent of the reservoir states and responses:

$$
J_{0i},J_{i0}\overset{\mathrm{i.i.d.}}{\sim}
\mathcal N\!\left(0,\frac{g^2}{N}\right).
$$

Conditional on the reservoir, the input to neuron $0$ is Gaussian with computable covariance:

$$
\xi_0(n)=\sum_{i=1}^{N}J_{0i}\phi(x_i(n)),\qquad
\mathbb E\!\left[\xi_0(n)\xi_0(n')\,\middle|\,\{x_i\}\right]
=\frac{g^2}{N}\sum_{i=1}^{N}\phi(x_i(n))\phi(x_i(n')).
$$

Weak $O(N^{-1/2})$ feedback is linear, and large-$N$ sums self-average. Matching neuron $0$ to a typical site closes the response for $F(s)$.

</Item>
</div>

<style>
.cavity-intro-layout { display: grid; grid-template-rows: auto 1fr; gap: .4rem; margin-top: .4rem; }
.cavity-intro-layout .item { margin: 0; }
.cavity-intro-layout .item :deep(main) { font-size: .79em; line-height: 1.18; }
.cavity-intro-layout .item :deep(main p) { margin: .22em 0; }
.cavity-intro-layout .item :deep(.katex-display) { margin: .22em 0; font-size: .83em; }
.cavity-intro-layout .item:last-child :deep(main) { font-size: .77em; }
.cavity-intro-layout .item:last-child :deep(main p) { margin: .12em 0; }
.cavity-intro-layout .item:last-child :deep(.katex-display) { margin: .10em 0; font-size: .80em; }
</style>

---

# Cavity method in three steps

<div class="cavity-three-steps">
<Item title="1. Remove neuron 0">

<CavityStepDiagram mode="remove" :delay="0" />

The remaining $N$ neurons form an unperturbed reservoir. Its trajectory and response are computed with site $0$ absent.

**Eqs. (32)–(34):** reservoir dynamics.

</Item>
<Item title="2. Reconnect and compute feedback">

<CavityStepDiagram mode="feedback" :delay="3200" />

New $J_{i0}$ inputs perturb each reservoir neuron by $O(N^{-1/2})$. Linear response carries their collective effect back through $J_{0i}$.

**Eqs. (37)–(39):** reservoir response. **Eqs. (40)–(53):** cavity field and feedback kernels.

</Item>
<Item title="3. Close the single-site theory">

<CavityStepDiagram mode="closure" :delay="6400" />

At large $N$, the cavity input is Gaussian. Match neuron $0$ to a typical reservoir neuron to determine its input statistics and response self-consistently.

**Eqs. (54)–(57):** effective site. **Eqs. (62)–(66):** response closure.

</Item>
</div>

<style>
.cavity-three-steps { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: .6rem; margin-top: .5rem; align-items: stretch; }
.cavity-three-steps .item { margin: 0; min-width: 0; min-height: 400px; display: flex; flex-direction: column; }
.cavity-three-steps .item :deep(main) { flex: 1; font-size: .74em; line-height: 1.2; }
.cavity-three-steps .item :deep(main p) { margin: .22em 0; }
.cavity-three-steps .item :deep(main strong) { color: #244f88; }
</style>

---

# From reservoir response to cavity equations

<div class="cavity-response-layout">
<Item title="Reservoir response: Eqs. (37)–(39)">

With neuron $0$ absent, the reservoir has $v_i=u_i=0$. Reattaching it adds $O(N^{-1/2})$ inputs $J_{j0}\phi(x_0)$, $\beta_sJ_{j0}d_0v_0$, and $\beta_sd_jJ_{0j}u_0$ to (32)–(34). Apply the reservoir responses $R_{ij}^{ab}(n,n')$ to these inputs:

$$
\Delta x_i(n)=\sum_{j=1}^{N}\sum_{n'\in\mathbb Z}
R_{ij}^{xx}(n,n')J_{j0}\phi(x_0(n')).\tag{37}
$$

$$
\begin{aligned}
v_i(n)=\beta_s\sum_{j=1}^{N}\sum_{n'\in\mathbb Z}\bigl[
&R_{ij}^{vv}(n,n')J_{j0}d_0(n')v_0(n')\\
&-R_{ij}^{vu}(n,n')d_j(n')J_{0j}u_0(n')
\bigr].
\end{aligned}\tag{38}
$$

$$
\begin{aligned}
u_i(n)=\beta_s\sum_{j=1}^{N}\sum_{n'\in\mathbb Z}\bigl[
&R_{ij}^{uv}(n,n')J_{j0}d_0(n')v_0(n')\\
&-R_{ij}^{uu}(n,n')d_j(n')J_{0j}u_0(n')
\bigr].
\end{aligned}\tag{39}
$$

The first term in (38)–(39) is driven by $v_0$; the second is driven by $u_0$, with a minus sign from the $-\mathcal I^u$ convention in (34).

</Item>
<Item title="Return to neuron 0: Eqs. (40)–(42)">

Insert (37)–(39) into the neuron-$0$ versions of (32)–(34). Expand $\phi(x_i+\Delta x_i)$ to first order; collect the direct reservoir input into $\xi_0$ and the return paths into kernels $\Gamma^{ab}$:

$$
\begin{aligned}
x_0(n+1)=(1-\delta)x_0(n)+\delta\biggl[
\xi_0(n)+\sum_{n'\in\mathbb Z}
\Gamma^{xx}(n,n')\phi(x_0(n'))\biggr].
\end{aligned}\tag{40}
$$

$$
\begin{aligned}
v_0(n+1)=\alpha_s v_0(n)-\eta u_0(n)
&+\sum_{n'\in\mathbb Z}\bigl[
\Gamma^{vv}(n,n')d_0(n')v_0(n')\\
&\qquad-\Gamma^{vu}(n,n')u_0(n')\bigr]
+\mathcal I_0^v(n).
\end{aligned}\tag{41}
$$

$$
\begin{aligned}
u_0(n-1)=\alpha_s u_0(n)+\eta v_0(n)
&+d_0(n)\sum_{n'\in\mathbb Z}\bigl[
\Gamma^{uv}(n,n')d_0(n')v_0(n')\\
&\qquad-\Gamma^{uu}(n,n')u_0(n')\bigr]
-\mathcal I_0^u(n).
\end{aligned}\tag{42}
$$

Since $\Delta d_i=\phi''(x_i)\Delta x_i=O(N^{-1/2})$, its contribution to neuron $0$ has $N$ terms of order $N^{-3/2}$, hence is only $O(N^{-1/2})$ and is dropped. The kernels are defined in (44)–(48).

</Item>
</div>

<style>
.cavity-response-layout { display: grid; grid-template-columns: 49% 49%; gap: 2%; align-items: stretch; margin-top: .45rem; }
.cavity-response-layout .item { margin: 0; min-width: 0; min-height: 420px; display: flex; flex-direction: column; }
.cavity-response-layout .item :deep(main) { flex: 1; font-size: .83em; line-height: 1.22; }
.cavity-response-layout .item :deep(main p) { margin: .26em 0; }
.cavity-response-layout .item :deep(.katex-display) { margin: .32em 0; font-size: .94em; }
.cavity-response-layout .item:last-child :deep(main) { font-size: .81em; }
.cavity-response-layout .item:last-child :deep(.katex-display) { font-size: .92em; }
</style>

---

# From cavity dynamics to time operators

<div class="cavity-site-layout">
<Item title="Large-N single-site equations: (54)–(57)">

In (40)–(42), independent row and column couplings make $\Gamma^{xx}$, $\Gamma^{vv}$, and $\Gamma^{uu}$ vanish. The two surviving contractions give $\Gamma^{vu}\to A$ and $\Gamma^{uv}\to\gamma_s P$, where $\gamma_s=\beta_s^2g^2$ [Eqs. (49)–(53)]. Substitution yields

$$
x_0(n+1)=(1-\delta)x_0(n)+\delta\xi_0(n).\tag{54}
$$

$$
\begin{aligned}
v_0(n+1)={}&\alpha_s v_0(n)-\eta u_0(n)\\
&-\sum_{n'\in\mathbb Z}A(n,n')u_0(n')+\mathcal I^v_0(n).
\end{aligned}\tag{55}
$$

$$
\begin{aligned}
u_0(n-1)={}&\alpha_s u_0(n)+\eta v_0(n)\\
&+\gamma_s d_0(n)\sum_{n'\in\mathbb Z}P(n,n')d_0(n')v_0(n')
-\mathcal I^u_0(n).
\end{aligned}\tag{56}
$$

By (43), $\xi_0=\sum_iJ_{0i}\phi(x_i)$ is Gaussian conditional on the reservoir. Its covariance is $(g^2/N)\sum_i\phi(x_i(n))\phi(x_i(n'))$; a typical-site average closes it:

$$
\langle\xi_0(n)\xi_0(n')\rangle_{x_0}
=g^2\langle\phi(x_0(n))\phi(x_0(n'))\rangle_{x_0}.\tag{57}
$$

</Item>
<Item title="Gain process and time operator: (57)–(61)">

Solve the Gaussian self-consistency in (57) with (54) first. It fixes the gain trajectory $d_0(n)=\phi'(x_0(n))$ that drives (55)–(56). Now collect each field over **time**:

$$
\mathcal V_0=\begin{pmatrix}\vdots\\v_0(1)\\v_0(2)\\\vdots\end{pmatrix},\qquad
\mathcal U_0=\begin{pmatrix}\vdots\\u_0(1)\\u_0(2)\\\vdots\end{pmatrix}.\tag{58}
$$

The forward recurrence in (55) suggests a bidiagonal time-shift operator:

$$
L=\begin{pmatrix}
\ddots&\ddots&&\\
&-\alpha_s&1&\\
&&-\alpha_s&1\\
&&&\ddots&\ddots
\end{pmatrix}.\tag{59}
$$

Multiplication by $L$ takes a forward difference, while its transpose takes the matching backward difference in (56):

$$
(L\mathcal V_0)(n)=v_0(n+1)-\alpha_s v_0(n),\tag{60}
$$

$$
(L^\top\mathcal U_0)(n)=u_0(n-1)-\alpha_s u_0(n).\tag{61}
$$

</Item>
</div>

<style>
.cavity-site-layout { display: grid; grid-template-columns: 49% 49%; gap: 2%; align-items: stretch; margin-top: .45rem; }
.cavity-site-layout .item { margin: 0; min-width: 0; min-height: 430px; display: flex; flex-direction: column; }
.cavity-site-layout .item :deep(main) { flex: 1; font-size: .80em; line-height: 1.18; }
.cavity-site-layout .item :deep(main p) { margin: .20em 0; }
.cavity-site-layout .item :deep(.katex-display) { margin: .22em 0; font-size: .88em; }
.cavity-site-layout .item:last-child :deep(main) { font-size: .83em; }
.cavity-site-layout .item:last-child :deep(.katex-display) { font-size: .91em; }
</style>

---

# Closing the single-site response equations

<div class="cavity-closure-layout">
<Item title="Assemble the block system: Eq. (62)">

Let $D_0=\operatorname{diag}(d_0(n))$, and let $A$ and $P$ have entries $A(n,n')$ and $P(n,n')$. The identity $I$ acts on **time sequences**. By (60)–(61), Eqs. (55)–(56) become

$$
\begin{aligned}
(\eta I+A)\mathcal U_0+L\mathcal V_0&=\mathcal I_0^v,\\
-L^\top\mathcal U_0+(\eta I+\gamma_sD_0PD_0)\mathcal V_0&=\mathcal I_0^u.
\end{aligned}
$$

The first row rearranges (55); the second row rearranges (56). The gain factors $d_0(n)$ and $d_0(n')$ sit on opposite sides of $P$, hence $D_0PD_0$. Together they give the time-only analogue of the network block system (30):

$$
\begin{pmatrix}
\eta I+A&L\\
-L^\top&\eta I+\gamma_sD_0PD_0
\end{pmatrix}
\begin{pmatrix}\mathcal U_0\\\mathcal V_0\end{pmatrix}
=\begin{pmatrix}\mathcal I_0^v\\\mathcal I_0^u\end{pmatrix}.\tag{62}
$$

For a fixed gain trajectory $d_0(n)$, inverting this operator gives the single-site response $R_{00}^{ab}(n,n')$.

</Item>
<Item title="Block inversion and self-consistency: Eqs. (62)–(66)">

Write $B=\eta I+A$ and $C=\eta I+\gamma_sD_0PD_0$ for the diagonal blocks of (62). Eliminating $\mathcal U_0$ gives $(C+L^\top B^{-1}L)\mathcal V_0=\mathcal I_0^u+L^\top B^{-1}\mathcal I_0^v$. Thus

$$
\begin{aligned}
R_{00}^{vu}=\bigl[&\eta I+\gamma_sD_0PD_0\\
&+L^\top(\eta I+A)^{-1}L\bigr]^{-1}.
\end{aligned}\tag{63}
$$

Eliminating $\mathcal V_0$ instead gives $(B+LC^{-1}L^\top)\mathcal U_0=\mathcal I_0^v-LC^{-1}\mathcal I_0^u$:

$$
\begin{aligned}
R_{00}^{uv}=\bigl[&\eta I+A\\
&+L(\eta I+\gamma_sD_0PD_0)^{-1}L^\top\bigr]^{-1}.
\end{aligned}\tag{64}
$$

The cross term in the first elimination gives

$$
R_{00}^{vv}=R_{00}^{vu}L^\top(\eta I+A)^{-1}.\tag{65}
$$

Finally, substitute these responses into (52)–(53) and replace the reservoir site average by the $x_0$ process:

$$
A(n,n')=\gamma_s\langle d_0(n)R_{00}^{vu}(n,n')d_0(n')\rangle_{x_0},\tag{66a}
$$

$$
P(n,n')=\langle R_{00}^{uv}(n,n')\rangle_{x_0}.\tag{66b}
$$

</Item>
</div>

<style>
.cavity-closure-layout { display: grid; grid-template-columns: 49% 49%; gap: 2%; align-items: stretch; margin-top: .45rem; }
.cavity-closure-layout .item { margin: 0; min-width: 0; min-height: 430px; display: flex; flex-direction: column; }
.cavity-closure-layout .item :deep(main) { flex: 1; font-size: .95em; line-height: 1.20; }
.cavity-closure-layout .item :deep(main p) { margin: .24em 0; }
.cavity-closure-layout .item :deep(.katex-display) { margin: .32em 0; font-size: .98em; }
.cavity-closure-layout .item:last-child :deep(main) { font-size: .88em; }
.cavity-closure-layout .item:last-child :deep(.katex-display) { margin: .25em 0; font-size: .91em; }
</style>

---

# Computing the spectrum from coupling statistics

<div class="spectrum-recipe-grid">
<Item title="1. Solve the stationary single-neuron process">

For the paper's independent Gaussian couplings, specify $g$, $\delta$, and $\phi$:

$$
J_{ij}\overset{\mathrm{i.i.d.}}{\sim}\mathcal N\!\left(0,\frac{g^2}{N}\right).
$$

Iterate the Gaussian input covariance in (57): sample $\xi_0$, propagate (54) to stationarity, and update

$$
\langle\xi_0(n)\xi_0(n')\rangle_{x_0}
=g^2\langle\phi(x_0(n))\phi(x_0(n'))\rangle_{x_0}.\tag{57}
$$

This determines the gain histories $d_0(n)=\phi'(x_0(n))$.

</Item>
<Item title="2. Choose a threshold and regularization">

For each tested threshold $s$, shift the tangent dynamics. Keep $\eta>0$ while solving the response problem:

$$
\begin{aligned}
\alpha_s&=(1-\delta)e^{-\delta s},&
\beta_s&=\delta e^{-\delta s},\\
\gamma_s&=\beta_s^2g^2.
\end{aligned}
$$

Build the time-shift matrix $L$ from (59) and $D_0=\operatorname{diag}(d_0(n))$ for each sampled gain trajectory.

</Item>
<Item title="3. Close the response kernels">

Start at large $\eta$, where the kernels are small. For each gain history, invert (62) to obtain the responses (63)–(65). Average and update

$$
A(n,n')=\gamma_s\langle d_0(n)R_{00}^{vu}(n,n')d_0(n')\rangle_{x_0}.\tag{66a}
$$

$$
P(n,n')=\langle R_{00}^{uv}(n,n')\rangle_{x_0}.\tag{66b}
$$

Iterate $A$ and $P$ to convergence; decrease $\eta$ and continue.

</Item>
<Item title="4. Read out and scan the spectrum">

Take the regularization to zero only after solving the kernels. The one-step forward response gives the fraction of exponents below $s$:

$$
F(s)=\lim_{\eta\to0^+}\langle R_{00}^{vv}(k+1,k)\rangle_{x_0}.\tag{67}
$$

Repeat steps 2–4 across $s$. The resulting cumulative curve $F(s)$ gives the full Lyapunov spectrum; its rise marks where exponents are concentrated.

</Item>
</div>

<style>
.spectrum-recipe-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: 48% 52%; gap: .55rem .65rem; margin-top: .35rem; height: 402px; }
.spectrum-recipe-grid .item { margin: 0; min-width: 0; min-height: 0; display: flex; flex-direction: column; }
.spectrum-recipe-grid .item :deep(main) { flex: 1; font-size: .81em; line-height: 1.19; }
.spectrum-recipe-grid .item :deep(main p) { margin: .19em 0; }
.spectrum-recipe-grid .item :deep(.katex-display) { margin: .25em 0; font-size: .89em; }
.spectrum-recipe-grid .item:nth-child(2) :deep(.katex-display) { font-size: .84em; }
</style>

---
section: 'Results'
---

# Lyapunov spectra: theory and simulation

<div class="results-figure-layout">
<figure class="results-paper-figure">
  <img src="/figures/clark-fig1.png" alt="Paper Fig. 1: Lyapunov spectra for g = 3 and g = 5 at four time steps" />
  <figcaption><strong>Fig. 1.</strong> Full spectra (a, c) and enlarged positive exponents (b, d). Lines: theory; circles: simulation.</figcaption>
</figure>

<Item title="Network dynamics and spectral readout">

The same random rate network is used in every panel, with $\phi(x)=\tanh x$:

$$
x_i(n+1)=(1-\delta)x_i(n)+\delta\sum_{j=1}^{N}J_{ij}\phi(x_j(n)).\tag{5}
$$

$$
J_{ij}\overset{\mathrm{i.i.d.}}{\sim}\mathcal N\!\left(0,\frac{g^2}{N}\right).\tag{6}
$$

Its Jacobian drives tangent vectors and determines the exponents:

$$
M(n)=(1-\delta)I_N+\delta JD(n).\tag{7}
$$

For each $s$, the single-site theory computes $F(s)$ by (67). The plotted exponent at rank fraction $i/N$ is the $s$ where $1-F(s)=i/N$. Panels (a, b) use $g=3$; (c, d) use $g=5$. Each compares $\delta=0.05,0.1,0.25,0.5$ with a network of $N=4096$.

</Item>
</div>

<style>
.results-figure-layout { display: grid; grid-template-columns: 54% 44%; gap: 2%; align-items: stretch; margin-top: .45rem; }
.results-paper-figure { margin: 0; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.results-paper-figure img { width: 100%; height: auto; display: block; background: #fff; border: 1px solid #d2dcec; box-shadow: 0 2px 7px #1a376522; }
.results-paper-figure figcaption { color: #455a75; font-size: .72em; line-height: 1.2; margin-top: .35rem; }
.results-figure-layout .item { margin: 0; min-width: 0; min-height: 420px; display: flex; flex-direction: column; }
.results-figure-layout .item :deep(main) { flex: 1; font-size: .84em; line-height: 1.21; }
.results-figure-layout .item :deep(main p) { margin: .25em 0; }
.results-figure-layout .item :deep(.katex-display) { margin: .32em 0; font-size: .91em; }
</style>

---

# Dimensions and entropy rate from the same network

<div class="results-figure-layout results-figure-two">
<figure class="results-paper-figure">
  <img src="/figures/clark-fig2.png" alt="Paper Fig. 2: attractor and participation-ratio dimensions, and entropy rate versus coupling strength" />
  <figcaption><strong>Fig. 2.</strong> Attractor and participation-ratio dimensions (a); entropy rate (b). Lines: theory; circles: simulation.</figcaption>
</figure>

<Item title="Network dynamics and derived observables">

The same rate network, with $\phi(x)=\tanh x$, is scanned over coupling strength $g$:

$$
x_i(n+1)=(1-\delta)x_i(n)+\delta\sum_{j=1}^{N}J_{ij}\phi(x_j(n)).\tag{5}
$$

$$
J_{ij}\overset{\mathrm{i.i.d.}}{\sim}\mathcal N\!\left(0,\frac{g^2}{N}\right).\tag{6}
$$

From the resulting $F(s)$, the Kaplan–Yorke dimension and entropy rate are

$$
\frac{D_{\mathrm{KY}}}{N}=1-F(s_{\mathrm{KY}}).\tag{68}
$$

Here $s_{\mathrm{KY}}<0$ is fixed by $\int_{s_{\mathrm{KY}}}^{\infty}sF'(s)\,ds=0$.

$$
\frac{h_{\mathrm{KS}}}{N}=\int_0^{\infty}sF'(s)\,ds.\tag{69}
$$

For $a\in\{x,\phi\}$, the two-site cavity theory gives activity covariances $C_{ij}^{a}(0)$ and participation ratios:

$$
\mathrm{PR}^{a}=\frac{\left(\sum_{i=1}^{N}C_{ii}^{a}(0)\right)^2}
{\sum_{i,j=1}^{N}C_{ij}^{a}(0)^2}.\tag{71}
$$

</Item>
</div>

<style>
.results-figure-two { display: grid; grid-template-columns: 54% 44%; gap: 2%; align-items: stretch; margin-top: .45rem; }
.results-figure-two .results-paper-figure { margin: 0; min-width: 0; display: flex; flex-direction: column; justify-content: center; }
.results-figure-two .results-paper-figure img { width: 100%; height: auto; display: block; background: #fff; border: 1px solid #d2dcec; box-shadow: 0 2px 7px #1a376522; }
.results-figure-two .results-paper-figure figcaption { color: #455a75; font-size: .72em; line-height: 1.2; margin-top: .35rem; }
.results-figure-two .item { margin: 0; min-width: 0; min-height: 420px; display: flex; flex-direction: column; }
.results-figure-two .item :deep(main) { flex: 1; font-size: .81em; line-height: 1.18; }
.results-figure-two .item :deep(main p) { margin: .23em 0; }
.results-figure-two .item :deep(.katex-display) { margin: .27em 0; font-size: .88em; }
</style>
