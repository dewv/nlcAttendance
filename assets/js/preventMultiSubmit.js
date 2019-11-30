function preventMultiSubmit() {
    var buttons = document.getElementsByTagName("BUTTON");
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].type === "submit") {
            buttons[i].disabled = true;
        }
    }
    return true;
}

(function () {
    for (var i = 0; i < document.forms.length; i++) {
        document.forms[i].onsubmit = preventMultiSubmit;
    }
})();
