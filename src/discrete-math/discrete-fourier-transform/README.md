# Discrete Fourier Transform
Accept an array of numbers, represents the discrete signal in the time domain, and finding each interval's frequency component.
## Input
A set of signal in a discrete time domain, in form of array.
Collection time, in milliseconds.

```
[x1, x2, ..., xn], t
```

## Output
A frequency component, represent in form $(a + bi), m, p, f$. Where $m$ represent magnitude, $p$ represent phase, and $f$ represent frequency.

## Some concepts before we start.
The observable signals in a particular time domain $t$, $S(t)$, is the sum of all contributions of waves.

$S(t) = AMP_{dominant} \cdot W_{dominant}(t) + \sum_{i=1}^m AMP_{minor, i} \cdot W_{minor, i}(t)$

- $W_{dominant}(t)$: The dominant wave (major signal) at time $t$.
- $AMP_{dominant}$: The amplitude scaling of the dominant wave.
- $W_{minor, i}(t)$: The $i$-th minor wave.
- $AMP_{minor, i}$: The amplitude scaling of the $i$-th minor wave.

The observable signals collected from a discrete time $t_0$ to $t_n$, will denote to $S(t_0), S(t_1), S(t_2),...,S(t_n)$, in form of number array. This number array will serve as input of the Discrete Fourier Transform (DFT).

In the frequency component: 
$(a + bi)$ is the computation result, for cosine contribution and sine contribution respectively. 

$a + bi, f$ means, the sample collected at time $S(T_t)$ has $a$ cosine contribution, and $b$ sine contribution, at frequency $f$, across the whole signal.

$m$, magnitude, represents the strength/amplitude for that frequency component in the whole signal. It indicates how significant of that part.

$p$, Is the computation result should start earlier or later in the signal.

## How to achieve
1. We need to calculate result for every input. This explains the outer for-loop.
2. For every input, we need to calculate its frequency component:

$X[k] = \sum_{n=0}^{N-1} x[n] \cdot e^{-i \cdot \frac{2\pi kn}{N}}$
-
Where:
- $X[k]$ is the $k$-th frequency component, the $(a + bi)$.
- $x[n]$ is the $n$-th sample of the input signal.
- $e^{-i \cdot \frac{2\pi kn}{N}}$ is the complex exponential representing the contribution of the $n$-th sample to frequency $f_k$, In the representation, $e^{-i \cdot \theta}$ can be translated to $cos(\theta)$ - $i \cdot sin(\theta)$. Of course, the phase angle, $\theta = \frac{2 \pi kn}{N}$
  - Signals can be represented as sum of sine and cosine waves. complex numbers is just a way to make it in one term. If you wish, it can be $x + y$, where $x$ is the sine wave contribution, and $y$ is the cosine wave contribution or vice versa.
  - For the phase angle, DFT assume input signal is periodic over $N$ samples. For example, it would be $(S_{0, r1}, S_{1, r1}, S_{2, r1}, ...S_{n, r1}, S_{0, r2}, S_{1, r2}, S_{2, r2}, ...S_{n, r2},...S_{n, r_{finish}})$. 
  - To compute the $k$-th frequency, the $N$ samples divided into $n$ parts evenly around a circle. Since this is periodic signal, each cycle of signals can be treated as circle. Thus, for each sample, it "moves" $\frac {2 \pi}{N}$ radians. $k$-th frequency can be assumed as "this is $k$-th repeat of the whole signal." 
  - Why sine and cosine? cosine wave is the in-phase alignment of signal in the cosine wave. Somewhat like how related of this wave with a normal cosine wave. Sine wave is the out-of phase alignment of signal in sine wave. Same concepts for cosine wave, but sine wave.
  - In-phase alignment is two waves have peaks, troughs, and zero-crossing occurring at same time. In phase with cosine wave, means its maximum amplitude at time = 0. Using cosine wave as reference wave because $cos(0) = 1$, reached maximum value. 
  - Out-of-phase signal is two waves that peaks, troughs, and zero-crossing not occur at same time. $sin(0) = 0$, $sin(\frac{\pi}{2}) = 1 (Amplitude_{max})$, it is said to be completely out-of-phase. That's means, sine wave can retain information that cosine wave unable to retain ($\pi / 2 rad$).
  - Cosine wave marks the alignment on 0-degree axis (x-axis), Sine wave marks the alignment of 90-degree axis (y-axis). 
  - Imagine in Cartesian representation, the actual wave should be (x, y). Then, magnitude should be the "length from origin". Just simple Pythagorean theorem.
  - Phase is the angle relatively from positive x-axis, in terms of anti-clockwise. Just simple trigonometry question.