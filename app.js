document.getElementById("send").addEventListener("click", submit);

function submit () {
    const result = new Validate(document.getElementById("data"), true, true);

    if (result.data) {
        // AJAX OR USE INFORMATIONS
        console.log("AJAX OR USE INFORMATIONS");

        result.data.forEach(value => console.log(value));
    }
}