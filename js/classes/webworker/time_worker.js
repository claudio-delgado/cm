// timerWorker.js
let interval = 1000;
let timerId = null;
self.onmessage = (e) => {
  const { cmd, ms } = e.data || {};
  if (cmd === "start") {
    interval = ms || interval;
    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => self.postMessage({ type: "tick" }), interval);
  } else if (cmd === "stop") {
    if (timerId) { clearInterval(timerId); timerId = null; }
  } else if (cmd === "setInterval") {
    interval = ms;
    if (timerId) {
      clearInterval(timerId);
      timerId = setInterval(() => self.postMessage({ type: "tick" }), interval);
    }
  }
};