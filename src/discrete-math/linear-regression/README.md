# Linear Regression
Accept a set of (x, y), assuming this set is linear. Attempts to find the y=mX+C.
## Input
A set of (x, y), in form of array. For example:

```
[[1, 2], [2, 4], [3, 6]]
```

## Output
A set of value, represent gradient ($m$), and interception point ($C$). For example:

```
(2, 3)
```
This stands for the relationship of $x$ and $y$ is $y = 2x + 3$

## How to achieve
1. At beginning, this function will in default state $(m = 0, C = 0)$. Theoretically, it doesn't matter. But this is encouraged, due to 0 has no bias toward any direction or value.
2. For each iteration, the `linearRegression` will perform a prediction for each sample value. If using default state, all the first prediction will be $0 (mx + b)$. In this step, a prediction value $\hat{y_i}$ will be generated.
3. In this example, we are using MSE (Mean Squared Error). In short, is

   $MSE = \frac{1}{n}\sum_{i=1}^{N} (y_i - \hat{y_i})^2$
   
    This MSE is used to measure the "distance" of prediction and actual value. The first $n$ predictions are definitely inaccurate. We need to find some way, to "adjust" it. In this example, we use Gradient Descent (Move with small steps) to make the next prediction closer to actual value.

4. To adjust next prediction, we need to know:
   1. Which direction should we move.
   2. How much we should move.
   
    So we use Partial Derivative with respect to (w.r.t) m/b to get this value.
   For Partial Directive w.r.t m, we need to know 
     $\frac{\delta MSE}{\delta m}$
   
    Back to the MSE, this is the step of obtain Partial Derivative w.r.t $m$.
   
    $MSE = \frac{1}{n}\sum_{i=1}^{N} (y_i - \hat{y_i})^2$

    Substitute $\hat{y_i} = m*x_i + b$ into MSE:

    $MSE = \frac{1}{N} \sum_{i=1}^{N}(y_i - (m*x_i+b))^2$ 

    Define $(m*x_i+b) = a$, so $MSE = \frac{1}{N} \sum_{i=1}^{N}(y_i - a)^2$ 

    Now, take the derivative of $MSE$ with respect to $m$:

    $\frac{\delta MSE}{\delta m} = \frac{1}{N} \sum_{i=1}^{N}\frac{\delta}{\delta m}(y_i - a)^2$
   
    The single unit can be denoted to $f(g(m))^2$
 
    For outer function, $f(y_1 - a) = (y_i - a)^2$, so $f'(y_1 - a) = 2(y_1 - a)$

      For inner function, $g(m) = y_i - a, a = (m*x_i+b)$, so $g(m) = y_1 - m*x_1 -b$. Then $g(m) = -x_1$

    By applying chain rule, $\frac{\delta}{\delta m}(y_i - a)^2 = 2(y_1 - a)(-x_1)$ 
    
    Thus,
   $\frac{\delta MSE}{\delta m} = \frac{1}{N}\sum_{i=1}^{N}2(y_1 - (m*x_i+b))(-x_1)$

   $\frac{\delta MSE}{\delta m} = -\frac{2}{N}\sum_{i=1}^{N}x_1(y_1 - (m*x_i+b))$
5. Now we know $(m*x_i+b)$ is prediction. So, the Partial Derivative w.r.t m can be further simplify to sum of -2 * current x * (expected y - prediction).
6. After we get the Partial derivative w.r.t m/b in sum form, we need to decide "next iteration initial value". So, we get the average adjustment. And the "final strength of adjustment", is depended on learningRate. The result decide next "starting point".
7. After all iterations finished, the `linearRegression` will predict the $m$ and $b$ as output.
