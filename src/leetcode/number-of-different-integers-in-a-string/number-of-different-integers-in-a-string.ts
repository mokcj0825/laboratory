function numDifferentIntegers(word: string): number {
  let m = word.replace(/[a-z]/g, ' ');
  let n = m.split(' ').filter(num => num !== '');
  let u = new Set<string>();
  for(let _n of n) {
    let cn = _n.replace(/^0+/, '');
    if (cn === '') cn = '0';
    u.add(cn);
  }
  return u.size;
}

const value = "abc1123a23ff23"
console.log(numDifferentIntegers(value));