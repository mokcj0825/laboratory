function totalNQueens(n: number): number {
  let count = 0;
  const cols = new Set<number>();
  const mainDiag = new Set<number>();
  const antiDiag = new Set<number>();

  function backtrack(row: number): void {
    if (row === n) {
      count++;
      return;
    }

    for(let col = 0; col < n; col++) {
      if (cols.has(col) || mainDiag.has(row - col) || antiDiag.has(row +col)) {
        continue;
      }
      cols.add(col);
      mainDiag.add(row - col);
      antiDiag.add(row + col);

      backtrack(row + 1);

      cols.delete(col);
      mainDiag.delete(row - col);
      antiDiag.delete(row + col);
    }
  }

  backtrack(0);
  return count;
}