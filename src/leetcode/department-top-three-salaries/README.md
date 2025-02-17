# Department Top Three Salaries

Table: Employee

```
+--------------+---------+
| Column Name  | Type    |
+--------------+---------+
| id           | int     |
| name         | varchar |
| salary       | int     |
| departmentId | int     |
+--------------+---------+
id is the primary key (column with unique values) for this table.
departmentId is a foreign key (reference column) of the ID from the Department table.
Each row of this table indicates the ID, name, and salary of an employee. It also contains the ID of their department.
```

Table: Department

```
+-------------+---------+
| Column Name | Type    |
+-------------+---------+
| id          | int     |
| name        | varchar |
+-------------+---------+
id is the primary key (column with unique values) for this table.
Each row of this table indicates the ID of a department and its name.
```

A company's executives are interested in seeing who earns the most money in each of the company's departments. A high earner in a department is an employee who has a salary in the top three unique salaries for that department.

Write a solution to find the employees who are high earners in each of the departments.

## Solution approach
### solution.sql
1. Create a temporary table called RankedSalaries. 
2. The DENSE_RANK is a build-up function that give ranking within their group. 
   ```
   DENSE_RANK() OVER (PARTITION BY COL_A ORDER BY COL_B DESC/ASC)
   It assigns ranks within COL_A, sorted by COL_B, either DESC or ASC. 
   ```
3. Select id, name, salary, departmentId from table Employee, rename name to Employee, DENSE_RANK value as salary_rank, and put it into this temporary table RankedSalaries.
4. Then, we select Department name, Employee name, Salary from table RankedSalaries and table Department with the RankedSalaries.departmentId linked with Department.id, and only fetch those ranks less or equal than 3.

### solution2.sql
1. Instead of create a temporary table using WITH AS, it uses subquery.