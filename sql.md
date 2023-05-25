##### SQL

1
(Wikipedia, 2021), https://en.wikipedia.org/wiki/SQL ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/SQL_injection ↩︎

1
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Database ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Relational_database ↩︎

3
(Wikipedia, 2021), https://en.wikipedia.org/wiki/SQL ↩︎

4
(Wikipedia, 2021), https://en.wikipedia.org/wiki/SQL_injection ↩︎

5
(Wikipedia, 2021), https://en.wikipedia.org/wiki/SQL_syntax#Queries ↩︎

1
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Table_(database) ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Column_(database) ↩︎

3
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Row_(database) ↩︎

4
(Wikipedia, 2021), https://en.wikipedia.org/wiki/SQL ↩︎

5
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Database_schema ↩︎

Sol:

```
SELECT * FROM flags; -> MySQL, PostgresSQL

select * from sys.flags -> Oracle -> no semicolon

SELECT * FROM app.dbo.flags; -> SQL Server

```


###### MySQL Specific Functions and Tables

```
select version();

select current_user();

SHow databases; - >  If we are able to execute arbitrary SQL, we can retrieve the names of the databases

select table_schema from information_schema.tables group by table_schema; -> For cases in which we need to extract information with a SELECT statement,

select table_name from information_schema.tables where table_schema = 'app';

select table_name from information_schema.tables; = show tables;

select column_name, data_type from information_schema.columns where table_schema = 'app' and table_name = 'menu';

```

Solution:
```
select table_schema from information_schema.tables group by table_schema;

select table_name from information_schema.tables where table_schema = 'app';

select * from hiddenTable;

select table_name from information_schema.tables where table_schema='exercise';

select column_name from information_schema.columns where table_schema='exercise' and table_name='secrets';

SELECT flag FROM hiddenTable;

	select * from exercise.secrets ; -> OS{secretUNION-basedFlag}

```

###### Microsoft SQL Server Specific Functions and Tables

```
select @@version;
GO

SELECT name FROM sys.databases;
GO

select * from app.information_schema.tables;
GO

```

In current versions of SQL Server, we can also query app.sys.tables for the same information.


```
select COLUMN_NAME, DATA_TYPE from app.information_schema.columns where TABLE_NAME = 'menu';

GO
```

"sa" is the default name for an administrator-level account in SQL Server.

Solutions:

```
select * from app.information_schema.tables;
select * from app.dbo.secretTable;
```

###### PostgreSQL

```
select version();

select current_user;

```

We can query the pg_database table for the names of the logical databases on the server.

```
select datname from pg_database;
```

PostgreSQL databases also contain an information_schema that can be queried for information about the database server. The tables table includes a row for every table in the database, including the "pg_" tables. We can query for only user-created tables by including a WHERE clause with table_schema = 'public'.

```
select table_name from app.information_schema.tables where table_schema = 'public';
```

The columns table in the information_schema contains information about the columns of all tables in the database. We can query this table to learn more about an unknown database.

```
select column_name, data_type from app.information_schema.columns where table_name = 'menu';
```
Solutions:

```
select table_name from app.information_schema.tables where table_schema = 'public';
select * from topsecret;
```

###### Oracle

```
select * from v$version;

select user from dual;

```

Since the database creates a schema for each user, we can obtain a list of schemas by querying for the users in the all_tables table.

```
select owner from all_tables group by owner;

```

We can query the table_name column on this table with a WHERE clause to retrieve the tables in a particular schema.

```
select table_name from all_tables where owner = 'SYS' order by table_name;
```

The all_tab_columns table contains information about the columns of all tables in the database. 

```
select column_name, data_type from all_tab_columns where table_name = 'MENU';
```
Solutions:

```
select table_name from all_tables where owner = 'SYS' order by table_name
select * from sys.HIDDENSECRETTABLE
```
