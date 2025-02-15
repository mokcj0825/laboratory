function fullJustify(words: string[], maxWidth: number): string[] {
  const result: string[] = [];
  let line: string[] = [];
  let lineLength = 0;

  for (const word of words) {
    if (lineLength + line.length + word.length > maxWidth) {
      result.push(justifyLine(line, lineLength, maxWidth));
      line = [];
      lineLength = 0;
    }
    line.push(word);
    lineLength += word.length;
  }

  result.push(line.join(" ").padEnd(maxWidth, " "));

  return result;
}

function justifyLine(line: string[], lineLength: number, maxWidth: number): string {
  if (line.length === 1) {
    return line[0].padEnd(maxWidth, " ");
  }

  const spaces = maxWidth - lineLength;
  const gaps = line.length - 1;
  const minSpace = Math.floor(spaces / gaps);
  let extraSpaces = spaces % gaps;

  return line.reduce((acc, word, index) => {
    if (index === line.length - 1) return acc + word;
    const spaceToAdd = minSpace + (extraSpaces > 0 ? 1 : 0);
    extraSpaces--;
    return acc + word + " ".repeat(spaceToAdd);
  }, "");
}