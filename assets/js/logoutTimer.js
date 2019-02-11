var logoutTime;
var sessionTimeLimit = (10*60*1000); //600000ms || 600sec || 10 min;

function resetLogoutTimer() {
    var popup = document.getElementById("logoutWarning");
    popup.style.visibility = "hidden";
    clearTimeout(logoutTime);
    setTimeout("logoutWarning();", sessionTimeLimit);
}

function logout() {
    window.location = "./logout";
}

function logoutWarning() {
    var popup = document.getElementById("logoutWarning");
    popup.style.visibility = "visible";
    logoutTime = setTimeout("logout();", (2*60*1000)); //120000ms || 120sec || 2 min;
}