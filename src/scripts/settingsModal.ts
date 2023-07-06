const modalWindow = document.getElementById("modal_settings")!;
const modalShroud = modalWindow.querySelector(".close_shroud")!;
const settingsButton = document.getElementById("settings_button")!;
const workMinutesInput = document.getElementById(
    "work_time__minutes"
) as HTMLInputElement;
const workSecondsInput = document.getElementById(
    "work_time__seconds"
) as HTMLInputElement;
const restMinutesInput = document.getElementById(
    "rest_time__minutes"
) as HTMLInputElement;
const restSecondsInput = document.getElementById(
    "rest_time__seconds"
) as HTMLInputElement;
const workColorInput = document.getElementById(
    "work__color"
) as HTMLInputElement;
const restColorInput = document.getElementById(
    "rest__color"
) as HTMLInputElement;
const lapsInput = document.getElementById("laps_counter") as HTMLInputElement;

type TtimerLocalStorage = {
    processLoops: number;
    workMinutes: number;
    workSeconds: number;
    restTimeMinutes: number;
    restTimeSeconds: number;
};

type TbgColorsLS = {
    wBgColor: string;
    rBgColor: string;
};

window.addEventListener("load", () => {
    if (localStorage.getItem("bg-color")) {
        const { wBgColor, rBgColor } = JSON.parse(
            localStorage.getItem("bg-color")!
        ) as TbgColorsLS;
        workBgColor = wBgColor;
        restBgColor = rBgColor;
    }
    if (localStorage.getItem("timer settings")) {
        const {
            processLoops: loops,
            workMinutes: min,
            workSeconds: sec,
            restTimeMinutes: restMin,
            restTimeSeconds: restSec
        } = JSON.parse(
            localStorage.getItem("timer settings")!
        ) as TtimerLocalStorage;

        processLoops = loops;
        workMinutes = min;
        workSeconds = sec;
        restTimeMinutes = restMin;
        restTimeSeconds = restSec;
    }

    workColorInput.value = workBgColor;
    restColorInput.value = restBgColor;
    lapsInput.value = processLoops.toString();
    workMinutesInput.value = workMinutes.toString();
    workSecondsInput.value = workSeconds.toString();
    restMinutesInput.value = restTimeMinutes.toString();
    restSecondsInput.value = restTimeSeconds.toString();

    document.body.style.backgroundColor = workBgColor;
    timer.textContent = `${
        workMinutes < 10 ? "0" + workMinutes : workMinutes
    }:${workSeconds < 10 ? "0" + workSeconds : workSeconds}`;
});

const openSettings = () => {
    modalWindow.classList.add("show_modal");
};
const closeSettings = () => {
    modalWindow.classList.remove("show_modal");

    const bgColorLS = {
        wBgColor: workColorInput.value,
        rBgColor: restColorInput.value
    };
    localStorage.setItem("bg-color", JSON.stringify(bgColorLS));

    const timerSettingsLS = {
        processLoops: lapsInput.value,
        workMinutes: workMinutesInput.value,
        workSeconds: workSecondsInput.value,
        restTimeMinutes: restMinutesInput.value,
        restTimeSeconds: restSecondsInput.value
    };
    localStorage.setItem("timer settings", JSON.stringify(timerSettingsLS));

    workBgColor = workColorInput.value;
    restBgColor = restColorInput.value;
    processLoops = +lapsInput.value;
    workMinutes = +workMinutesInput.value;
    workSeconds = +workSecondsInput.value;
    restTimeMinutes = +restMinutesInput.value;
    restTimeSeconds = +restSecondsInput.value;

    document.body.style.backgroundColor = workBgColor;
    timer.textContent = `${
        workMinutes < 10 ? "0" + workMinutes : workMinutes
    }:${workSeconds < 10 ? "0" + workSeconds : workSeconds}`;
};

settingsButton.addEventListener("click", openSettings);
modalShroud.addEventListener("click", closeSettings);

const onChangeRules = (e: Event, isSeconds: boolean = false) => {
    let inputValue = e.target as HTMLInputElement;

    if (+inputValue.value <= -1) {
        inputValue.value = (+inputValue.value * -1).toString();
    }
    if (isSeconds && +inputValue.value > 59) {
        inputValue.value = "59";
    }
};

workMinutesInput.addEventListener("blur", (e) => onChangeRules(e));
workSecondsInput.addEventListener("blur", (e) => onChangeRules(e, true));
restMinutesInput.addEventListener("blur", (e) => onChangeRules(e));
restSecondsInput.addEventListener("blur", (e) => onChangeRules(e, true));
lapsInput.addEventListener("blur", (e) => onChangeRules(e));
