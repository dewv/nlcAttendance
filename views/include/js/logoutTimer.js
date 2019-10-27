var logoutTime;

function setLogoutTimer() { // eslint-disable-line no-unused-vars
    var popup = document.getElementById("logoutWarning");

    var logoutWarning = function () {
        popup.style.visibility = "visible";
        logoutTime = setTimeout("window.location = '/logout';", 1 * 10 * 1000);
    };

    popup.style.visibility = "hidden";
    clearTimeout(logoutTime);
    setTimeout(logoutWarning, 1 * 10 * 1000);
}
