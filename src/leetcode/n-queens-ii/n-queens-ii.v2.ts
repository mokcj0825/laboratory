function totalNQueens2(n: number): number {
  let count = 0;

  function backtrack(row: number, cols: number, mainDiag: number, antiDiag: number): void {
    if (row === n) {
      count++;
      return;
    }

    let availablePositions = (~(cols | mainDiag | antiDiag)) & ((1 << n) - 1);

    while (availablePositions) {
      let position = availablePositions & -availablePositions;
      availablePositions ^= position;

      backtrack(
        row + 1,
        cols | position,
        (mainDiag | position) << 1,
        (antiDiag | position) >> 1
      );
    }
  }

  let half = n >> 1;
  let halfPositions = (1 << half) - 1;

  let availablePositions = (~(0)) & ((1 << n) - 1) & halfPositions;

  while (availablePositions) {
    let position = availablePositions & -availablePositions;
    availablePositions ^= position;

    backtrack(1, position, position << 1, position >> 1);
  }

  count *= 2;

  if (n % 2 === 1) {
    let middle = 1 << (n >> 1);
    backtrack(1, middle, middle << 1, middle >> 1);
  }

  return count;
}
