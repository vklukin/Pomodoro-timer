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
const soundVolumeInput = document.getElementById(
    "volume_sound"
) as HTMLInputElement;
const selectedItemButton = document.getElementById(
    "selected_item__wrapper"
) as HTMLDivElement;
const soundSelectList = document.querySelectorAll("div.option");
const soundOptionsList = document.getElementById(
    "option_list"
) as HTMLDivElement;
const selectedOption = document.getElementById(
    "selected_item"
) as HTMLSpanElement;

let soundVolume: number = 50;
let sound: HTMLAudioElement;

interface TtimerLocalStorage {
    processLoops: number;
    workMinutes: number;
    workSeconds: number;
    restTimeMinutes: number;
    restTimeSeconds: number;
}

interface TbgColorsLS {
    wBgColor: string;
    rBgColor: string;
}

interface TsoundLS {
    selectedIndex: number;
    soundURL: string;
    optionValue: string;
    volume: number;
}

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

    if (localStorage.getItem("sound settings")) {
        const { selectedIndex, volume, soundURL, optionValue } = JSON.parse(
            localStorage.getItem("sound settings")!
        ) as TsoundLS;

        soundVolumeInput.value = volume.toString();
        soundVolume = volume / 100;
        selectedOption.textContent = optionValue;
        selectedOption.dataset.selectIndex = selectedIndex.toString();
        selectedOption.dataset.value = soundURL;
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

    const soundSettings = {
        selectedIndex: selectedOption.dataset.selectIndex,
        optionValue: selectedOption.textContent,
        soundURL: selectedOption.dataset.value,
        volume: soundVolumeInput.value
    };
    localStorage.setItem("sound settings", JSON.stringify(soundSettings));

    workBgColor = workColorInput.value;
    restBgColor = restColorInput.value;
    processLoops = +lapsInput.value;
    workMinutes = +workMinutesInput.value;
    workSeconds = +workSecondsInput.value;
    restTimeMinutes = +restMinutesInput.value;
    restTimeSeconds = +restSecondsInput.value;
    soundVolume = +soundVolumeInput.value / 100;

    document.body.style.backgroundColor = workBgColor;
    timer.textContent = `${
        workMinutes < 10 ? "0" + workMinutes : workMinutes
    }:${workSeconds < 10 ? "0" + workSeconds : workSeconds}`;

    Timer.stop(workMinutes, workSeconds);
};

settingsButton.addEventListener("click", openSettings);
modalShroud.addEventListener("click", closeSettings);

const onChangeRules = (e: Event, isSeconds: boolean = false) => {
    let inputValue = e.target as HTMLInputElement;

    if (inputValue.value === "") inputValue.value = "0";

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

// ---------------sound-----------------
function playSound(url: string | undefined, volume: number | string) {
    sound = new Audio(url);
    sound.volume = +volume / 100;
    sound.play();
}

soundVolumeInput.addEventListener("change", (e) => {
    const value = (e.target as HTMLInputElement).value;
    soundVolume = +value;

    if (localStorage.getItem("sound settings")) {
        const { selectedIndex, soundURL, optionValue } = JSON.parse(
            localStorage.getItem("sound settings")!
        ) as TsoundLS;

        localStorage.setItem(
            "sound settings",
            JSON.stringify({
                selectedIndex,
                soundURL,
                optionValue,
                volume: value
            })
        );
    } else {
        localStorage.setItem(
            "sound settings",
            JSON.stringify({
                selectedIndex: selectedOption.dataset.selectIndex,
                soundURL: selectedOption.dataset.value,
                optionValue: selectedOption.textContent,
                volume: value
            })
        );
    }

    playSound(selectedOption.dataset.value, value);
});

const toogleOptionsEvent = () => {
    soundOptionsList.classList.toggle("show_options");
};
selectedItemButton.addEventListener("click", toogleOptionsEvent);

const selectOptionHandler = (e: Event) => {
    const target = (e.target as HTMLDivElement).querySelector(
        "span"
    ) as HTMLSpanElement;
    toogleOptionsEvent();

    selectedOption.textContent = target.textContent;
    selectedOption.dataset.value = target.dataset.value;
    selectedOption.dataset.selectIndex = target.dataset.selectIndex;

    const soundSettings = {
        selectedIndex: selectedOption.dataset.selectIndex,
        optionValue: selectedOption.textContent,
        soundURL: selectedOption.dataset.value,
        volume: soundVolumeInput.value
    };
    localStorage.setItem("sound settings", JSON.stringify(soundSettings));

    playSound(soundSettings.soundURL, soundSettings.volume);
};

for (let option of soundSelectList) {
    option.addEventListener("click", (e) => selectOptionHandler(e));
}
