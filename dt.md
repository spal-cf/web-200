##### Directory Traversal

The command above enabled us to traverse outside of /home/kali and read the file contents of /etc/passwd by prefixing the location with two Traversal Strings ("../../").

Traversal strings are, in their simplest format, two dots followed by a slash.

When working with a Windows machine, we can specify both the "../" and "..\\" traversal strings. Windows considers these statements as equal and one in the same.

The most likely target file we'll encounter is C:\Windows\win.ini, which is similarly common as /etc/passwd on Linux.

By definition, any ASCII character can be URL encoded. However, we should familiarize ourselves more specifically with the %2f (forward slash "/"), %20 (single space " "), and %3D (equal sign "=").

A programmatic endpoint is an endpoint that, when visited, redirects you to a separate URI using the backend web technology's programmatic logic.

```
curl -v http://www.megacorpone.com/about.html/../index.html -o megacorp.txt

GET /files/..%2F..%2F..%2F..%2F..%2Fetc%2Fpasswd HTTP/1.1
```
1
(Portswigger, 2021), https://portswigger.net/web-security/file-path-traversal ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/URI_normalization ↩︎

3
(Curl.se, 2021), https://curl.se/docs/ ↩︎

4
(Megacorpone.com Offensive Security, 2021), https://www.Megacorpone.com ↩︎

5
(Tutorials Point, 2021), https://www.tutorialspoint.com/security_testing/encoding_and_decoding.htm ↩︎

6
(Oracle, 2021) https://docs.oracle.com/javaee/7/tutorial/websocket003.htm ↩︎


##### Suggestive parameters and programmming endpoints

```
GET /search/Hello%20World! HTTP/1.1

GET /admin/dashboard/manage/handler.aspx?file=ourFile.jpeg HTTP/1.1

```

###### Sample suggestive parameters

```
?file=
?f=
/file/someFile

?location=
?l=
/location/someLocation

search=
s=
/search/someSearch

?data=
?d=
/data/someData

?download=
?d=
/download/someFileData
```

https://www.Megacorpone.com/files, in which files is a programmatic endpoint of a web stack.

##### Absolute Path

```
/etc/group
```

###### Relative Path

```
From /home/kali directory
cat ../../etc/group
```
We can use ../../../etc/group to read a particular file, but we might also need to use ../../../../../../../../../../../../etc/group, depending on the distance of the file from rootfs

Suppose we encounter the following URL.

http://dirTravSandbox/image.php?image=logo.png

Using absolute pathing, the sample endpoint would appear much differently, as shown.

https://www.Megacorpone.com/index.php?image=/var/www/html/pub/images/someImage.jpg



###### Directory listing

It allows to browse directory

###### Directory Traversal

data exfiltration is one of the core differences between directory traversal and directory listing. Directory traversal exploits directory listing vulnerability.


###### Directory Traversal - Exploitation

http://dirTravSandbox/ is a Unix-based system, and inside of the web root there is a file called data.txt. To access this file, we'll provide the value /var/www/html/data.txt to the path parameter.

relativePathingVerbose.php will serve our purposes because the input for the path parameter has been intentionally poorly sanitized in an attempt to limit any exfiltrated data from the web-root. We can attempt to bypass this by providing traversal strings and moving backwards until we reach the /etc/passwd file.

Our automated attempts will only be as effective as our wordlist. We will be using /usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt from the SecLists1 project during this Learning Module.


```
wfuzz -c -z file,/usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt http://dirTravSandbox:80/relativePathing.php?path=../../../../../../../../../../FUZZ

wfuzz -c -z file,/usr/share/seclists/Fuzzing/LFI/LFI-Jhaddix.txt --hc 404 --hh 81,125 http://dirTravSandbox/relativePathing.php?path=../../../../../../../../../../../../FUZZ

```
