type _Node = {
  x: number;
  y: number;
  g: number;
  h: number;
  f: number;
  parent: _Node | null;
};

type Grid = number[][];

type Point = {
  x: number;
  y: number;
};

const heuristic = (a: Point, b: Point): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

const getNeighbors = (node: _Node, grid: Grid): _Node[] => {
  const neighbors: _Node[] = [];
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 },
  ];

  directions.forEach((dir) => {
    const newX = node.x + dir.x;
    const newY = node.y + dir.y;

    if (
      newX >= 0 &&
      newX < grid[0].length &&
      newY >= 0 &&
      newY < grid.length &&
      grid[newY][newX] === 0
    ) {
      neighbors.push({ x: newX, y: newY, g: 0, h: 0, f: 0, parent: null });
    }
  });

  return neighbors;
};

const reconstructPath = (node: _Node): Point[] => {
  const path: Point[] = [];
  let currentNode: _Node | null = node;

  while (currentNode) {
    path.push({ x: currentNode.x, y: currentNode.y });
    currentNode = currentNode.parent;
  }

  return path.reverse();
};

const AStar = (grid: Grid, start: Point, goal: Point): Point[] => {
  const openList: _Node[] = [];
  const closedList: Set<string> = new Set();

  const startNode: _Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
    parent: null,
  };

  openList.push(startNode);

  while (openList.length > 0) {
    openList.sort((a, b) => a.f - b.f);
    const currentNode = openList.shift()!;

    if (currentNode.x === goal.x && currentNode.y === goal.y) {
      return reconstructPath(currentNode);
    }

    closedList.add(`${currentNode.x},${currentNode.y}`);

    const neighbors = getNeighbors(currentNode, grid);

    neighbors.forEach((neighbor) => {
      if (closedList.has(`${neighbor.x},${neighbor.y}`)) {
        return;
      }

      const tentativeG = currentNode.g + 1;

      const existingNode = openList.find(
        (node) => node.x === neighbor.x && node.y === neighbor.y
      );

      if (!existingNode || tentativeG < neighbor.g) {
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, goal);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = currentNode;

        if (!existingNode) {
          openList.push(neighbor);
        }
      }
    });
  }

  return [];
};

const grid = [
  [0, 0, 0, 1, 0],
  [1, 0, 0, 1, 0],
  [0, 0, 0, 0, 0],
  [0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0],
];

const start = { x: 0, y: 0 };
const goal = { x: 4, y: 4 };

const result = AStar(grid, start, goal);
console.log("Path:", result);