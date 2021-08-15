function toggleCustomCheckbox(url, rowNum) { // eslint-disable-line no-unused-vars
    let discontinued = document.querySelector(`#name${rowNum}`).classList.toggle("discontinued") ? "Yes" : "No";
    document.querySelector(`#toggle${rowNum} i`).classList.toggle("fa-check-square-o");
    document.querySelector(`#toggle${rowNum} i`).classList.toggle("fa-square-o");

    let formData = new FormData();
    formData.append("discontinued", discontinued);
    fetch(url, {
        method: "POST",
        body: new URLSearchParams([...formData])
    });
}
