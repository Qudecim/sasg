function drawWorker() {
    postMessage(1);
}
setInterval(drawWorker, 10);