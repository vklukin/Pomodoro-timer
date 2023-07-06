"use strict";
const startButton = document.getElementById("start_button");
const stopButton = document.getElementById("end_button");
const timer = document.getElementById("timer__counter");
const emptyEndTimer = document.querySelector("#timer__end-time");
const timerLaps = document.querySelector("#timer__laps");
let bgColor = "rgb(221, 60, 60)";
let restBgColor = "green";
let processLoops = 4;
let minutes = 25;
let seconds = 0;
let restTimeMinutes = 5;
let restTimeSeconds = 0;
window.addEventListener("load", () => {
    if (localStorage.getItem("bg-color"))
        bgColor = JSON.parse(localStorage.getItem("bg-color"));
    if (localStorage.getItem("timer counter")) {
        const { processLoops: loops, minutes: min, seconds: sec, restTimeMinutes: restMin, restTimeSeconds: restSec } = JSON.parse(localStorage.getItem("timer counter"));
        processLoops = loops || 4;
        minutes = min || 25;
        seconds = sec || 0;
        restTimeMinutes = restMin || 5;
        restTimeSeconds = restSec || 0;
    }
    document.body.style.backgroundColor = bgColor;
});
timer.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
emptyEndTimer.textContent = "Start the timer to display the end time";
function setStopTimerTime(m, s) {
    let initialEndTime = "";
    let now = new Date();
    const milliseconds = m * 60 * 1000 + s * 1000;
    const endTime = now.getTime() + milliseconds;
    now.setTime(endTime);
    let convertedTime = now.toTimeString().split(" ")[0];
    initialEndTime = convertedTime.slice(0, convertedTime.lastIndexOf(":"));
    emptyEndTimer.innerHTML = `End time: <span>${initialEndTime}</span>`;
}
class Timer {
    static start(minutes, seconds, rMinutes, rSeconds, loops) {
        const initialMinutes = minutes;
        const initialSeconds = seconds;
        const initialRMinutes = rMinutes;
        const initialRSeconds = rSeconds;
        let isRest = false;
        let counter = 0;
        timerLaps.innerHTML = `Laps: <span>${counter}/${loops}</span>`;
        Timer._intervalId = setInterval(() => {
            if (minutes === 0 && seconds === 0 && isRest && counter === loops) {
                return Timer.stop(initialMinutes, initialSeconds);
            }
            if (minutes === 0 && seconds === 0 && !isRest) {
                document.body.style.backgroundColor = restBgColor;
                minutes = initialRMinutes;
                seconds = initialRSeconds;
                setStopTimerTime(minutes, seconds);
                isRest = true;
            }
            if (minutes === 0 && seconds === 0 && isRest) {
                document.body.style.backgroundColor = bgColor;
                minutes = initialMinutes;
                seconds = initialSeconds;
                setStopTimerTime(minutes, seconds);
                isRest = false;
                counter += 1;
                timerLaps.innerHTML = `Laps: <span>${counter}/${loops}</span>`;
            }
            if (seconds === 0) {
                minutes -= 1;
                seconds = 59;
            }
            else {
                seconds -= 1;
            }
            timer.textContent = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        }, 1000);
    }
    static stop(m, s) {
        clearInterval(Timer._intervalId);
        startButton.removeAttribute("disabled");
        stopButton.setAttribute("disabled", "true");
        document.body.style.backgroundColor = bgColor;
        emptyEndTimer.textContent = "Start the timer to display the end time";
        timer.textContent = `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
        timerLaps.textContent = "";
    }
}
const onStartTimer = () => {
    startButton.setAttribute("disabled", "true");
    stopButton.removeAttribute("disabled");
    setStopTimerTime(minutes, seconds);
    Timer.start(minutes, seconds, restTimeMinutes, restTimeSeconds, processLoops);
};
const onStopTimer = () => Timer.stop(minutes, seconds);
startButton.addEventListener("click", onStartTimer);
stopButton.addEventListener("click", onStopTimer);
