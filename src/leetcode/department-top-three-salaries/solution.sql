WITH RankedSalaries AS (
    SELECT e.id, e.name AS Employee, e.salary, e.departmentId,
           DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS salary_rank
    FROM Employee e
)
SELECT d.name AS Department, rs.Employee, rs.salary
FROM RankedSalaries rs
         JOIN Department d ON rs.departmentId = d.id
WHERE rs.salary_rank <= 3;

