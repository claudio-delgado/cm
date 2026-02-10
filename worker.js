let valor = 0
self.onmessage = function(event) {
    if(event.data === "Start time"){
        setInterval(() => {
            valor++
            self.postMessage(valor);
        }, 1000);
    }
}