
document.addEventListener("DOMContentLoaded", function () {

    let timerInterval;
    let seconds = 0;
    let minutes = 0; // Set the initial countdown minutes
    let hours = 55;

    function startTimer() {
        timerInterval = setInterval(decrementTimer, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function decrementTimer() {
        if (seconds > 0 || minutes > 0 || hours > 0) {
            if (seconds === 0 && (minutes > 0 || hours > 0)) {
                seconds = 59;
                if (minutes > 0) {
                    minutes--;
                    if (minutes === 0 && hours > 0) {
                        hours--;
                        minutes = 59;
                    }

                }
                else if (hours > 0) {
                    minutes = 59;
                    hours--;
                }
            } else {
                seconds--;
            }
            const formattedTime = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
            document.getElementById("timer").innerHTML = formattedTime;
        } else {
            clearInterval(timerInterval);
            alert("Time's up!");
        }
    }

    function formatTime(time) {
        return time < 10 ? "0" + time : time;
    }
    startTimer();
});

