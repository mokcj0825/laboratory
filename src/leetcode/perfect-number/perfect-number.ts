function checkPerfectNumber(num: number): boolean {
  if (num <=1) return false;

  let sum = 1;
  const sqrt = Math.sqrt(num);

  for(let i = 2; i <=sqrt; i++) {
    if (num % i === 0) {
      sum += i;
      if(i !== num / i) {
        sum += num / i;
      }
    }
  }

  return sum === num;
}