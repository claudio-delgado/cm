const lightIncrease = 1
const opacity = 0
setInterval(() => {
    document.querySelector("#daylight img").style.opacity += lightIncrease * 0.1
    lightIncrease = (opacity == 1) ? -lightIncrease : lightIncrease
    lightIncrease = (opacity == 0) ? -lightIncrease : lightIncrease
}, 1000);