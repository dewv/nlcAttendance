const ONE_MINUTE =  60 * 1000;
var logoutTime;

function setLogoutTimer() { // eslint-disable-line no-unused-vars
    var popup = document.getElementById("logoutWarning");

    var logoutWarning = function () {
        if (popup) popup.style.display = "block";
        logoutTime = setTimeout("window.location = '/logout';", ONE_MINUTE);
    };

    if (popup) popup.style.display = "none";
    clearTimeout(logoutTime);
    setTimeout(logoutWarning, 5 * ONE_MINUTE);
}
