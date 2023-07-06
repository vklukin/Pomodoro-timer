const startButton = document.getElementById("start_button")!;
const stopButton = document.getElementById("end_button")!;
const timer = document.getElementById("timer__counter")!;
const emptyEndTimer = document.querySelector("#timer__end-time")!;
const timerLaps = document.querySelector("#timer__laps")!;

let workBgColor: string = "#dd3c3c";
let restBgColor: string = "#008000";
let processLoops: number = 4;
let workMinutes: number = 25;
let workSeconds: number = 0;
let restTimeMinutes: number = 5;
let restTimeSeconds: number = 0;

timer.textContent = `${workMinutes < 10 ? "0" + workMinutes : workMinutes}:${
    workSeconds < 10 ? "0" + workSeconds : workSeconds
}`;
emptyEndTimer.textContent = "Start the timer to display the end time";

function setStopTimerTime(m: number, s: number): void {
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
    static _intervalId: number;

    static start(
        workMinutes: number,
        workSeconds: number,
        rMinutes: number,
        rSeconds: number,
        loops: number
    ) {
        const initialMinutes = workMinutes;
        const initialSeconds = workSeconds;
        const initialRMinutes = rMinutes;
        const initialRSeconds = rSeconds;
        let isRest = false;
        let counter = 0;

        timerLaps.innerHTML = `Laps: <span>${counter}/${loops}</span>`;

        Timer._intervalId = setInterval(() => {
            if (
                workMinutes === 0 &&
                workSeconds === 0 &&
                isRest &&
                counter === loops
            ) {
                return Timer.stop(initialMinutes, initialSeconds);
            }
            if (workMinutes === 0 && workSeconds === 0 && !isRest) {
                document.body.style.backgroundColor = restBgColor;
                workMinutes = initialRMinutes;
                workSeconds = initialRSeconds;
                setStopTimerTime(workMinutes, workSeconds);
                isRest = true;
            }
            if (workMinutes === 0 && workSeconds === 0 && isRest) {
                document.body.style.backgroundColor = workBgColor;
                workMinutes = initialMinutes;
                workSeconds = initialSeconds;
                setStopTimerTime(workMinutes, workSeconds);
                isRest = false;
                counter += 1;
                timerLaps.innerHTML = `Laps: <span>${counter}/${loops}</span>`;
            }

            if (workSeconds === 0) {
                workMinutes -= 1;
                workSeconds = 59;
            } else {
                workSeconds -= 1;
            }

            timer.textContent = `${
                workMinutes < 10 ? "0" + workMinutes : workMinutes
            }:${workSeconds < 10 ? "0" + workSeconds : workSeconds}`;
        }, 1000);
    }

    static stop(m: number, s: number) {
        clearInterval(Timer._intervalId);
        startButton.removeAttribute("disabled");
        stopButton.setAttribute("disabled", "true");
        document.body.style.backgroundColor = workBgColor;
        emptyEndTimer.textContent = "Start the timer to display the end time";
        timer.textContent = `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
        timerLaps.textContent = "";
    }
}

const onStartTimer = () => {
    startButton.setAttribute("disabled", "true");
    stopButton.removeAttribute("disabled");
    setStopTimerTime(workMinutes, workSeconds);
    Timer.start(
        workMinutes,
        workSeconds,
        restTimeMinutes,
        restTimeSeconds,
        processLoops
    );
};
const onStopTimer = () => Timer.stop(workMinutes, workSeconds);

startButton.addEventListener("click", onStartTimer);
stopButton.addEventListener("click", onStopTimer);
