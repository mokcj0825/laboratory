# A* Algorithm
Accept a grid, in an 2-D array, starting point, end point, and attempt to find the shortest path. 

## Input
1. A grid converted into an 2-D array, unlike Cartesian plane, the coordinates for this 2-D array would be:
   - The most top-left unit is origin.
   - Moving to right increasing the x value.
   - Moving down increasing y value. 
   
   In the array, this example, 0 denotes to passable unit, 1 denotes to unpassable unit. 

A starting point, with x, y.

An endpoint point, with x, y.

## Output
The path from starting point $(x_{start}, y_{start})$ to end point $(x_{end}, y_{end})$

## Why it is, and how it works.
1. Prepare two list: openList and closedList. Open list will start with the starting point, and changes during search.
2. Closed list is the list that explored, or searched. To prevent revisit the searched nodes.
3. At starting point, the $g$ is the cost the path, $h$ is the estimate distance / cost, or estimated how many steps needed for $(x_{start}, y_{start})$ to $(x_{end}, y_{end})$. At the starting point, The priority function, $f(n)$ will equal to $h$. This is because. At starting point, it doesn't move to any way. The algorithm only have the estimated distance needed for the movement. 
4. The priority function, $f(n)$, is the sum of "How many steps I moved to destination", and "How may steps should I moved to destination"
5. For each step, this algorithm will calculate all $f(n)$ for all available neighbour. In 4-directions at $(x_i, y_i)$, it will generate this:
   - up: $(x_i, y_{i-1}), g=g_i+1, h=heuristic(x_i, y_{i-1})$
   - down: $(x_i, y_{i+1}), g=g_i+1, h=heuristic(x_i, y_{i+1})$
   - left: $(x_{i-1}, y_{i}), g=g_i+1, h=heuristic(x_{i-1}, y_i)$
   - right: $(x_{i+1}, y_{i}), g=g_i+1, h=heuristic(x_{i+1}, y_i)$

   Please take note, only the valid path will be calculated. For example, if the left unit is not passable, this algorithm will not calculate the $f(n)$ for that unit. Then, the lowest $f(n)$ value will be selected for next step.
6. Step 5 will repeat until: 
   - Reach goal. So the path will be the shortest path.
   - No path found. When the available path becomes not passable.
7. When no path found, it will attempt to retract one step. The "wrong" path will be marked as not passable (move to closed list).
8. For example: This is the slice of the grid:
   ```
   [
   ...,
      [...,1, 1, 1, 1, 1,...],
      [...,0, 0, 0, 0, 1,...],
      [...,1, 0, 1, 1, 1,...],
   ...
   ]
   ```
   Assuming the dead-end grid is $(x_{dead}, y_{dead})$, and it starts from $(x_{dead-3}, y_{dead})$. So, the algorithm will attempt to retract to $(x_{dead-1}, y_{dead})$, but no "alternatives", and retract again to $(x_{dead-2}, y_{dead})$. At this point, it found the alternatives (second lowest $f(n)$), then the next grid for calculation will be $(x_{dead-2}, y_{dead+1})$. However, at $(x_{dead-2}, y_{dead+1})$, if this grid was moved to closed list, it will retract again to $(x_{dead-3}, y_{dead})$.
9. If the algorithm attempt to retract to the starting point, and all neighbour points are moved to closed list, it will be considered as no path.
10. The purpose of closed list is prevent such scenario:
   ```
   [
   ...,
      [1, 1, 1, 1, 1,...],
      [1, 0, 0, 0, 1,...],
      [1, (starting point), 1, 0, 1,...],
      [1, 0, 0, 0, 1,...],
      [1, 1, 1, 1, 1,...],
   ...
   ]
   ```
   The closed list will mark the up/down grid as "passed", when it reached again, the "back step" (it's down/up grid) will stop the calculation, and mark as no path.