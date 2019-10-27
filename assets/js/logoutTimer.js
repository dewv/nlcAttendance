const ONE_MINUTE =  1000;
var logoutTime;

function setLogoutTimer() { // eslint-disable-line no-unused-vars
    var popup = document.getElementById("logoutWarning");

    var logoutWarning = function () {
        if (popup) popup.style.visibility = "visible";
        logoutTime = setTimeout("console.log('times up'); window.location = '/logout';", ONE_MINUTE);
    };

    if (popup) popup.style.visibility = "hidden";
    clearTimeout(logoutTime);
    setTimeout(logoutWarning, 5 * ONE_MINUTE);
}
