document.getElementById("send").addEventListener("click", submit);

function submit () {
    const result = new Validate(document.getElementById("data"));

    if (result.ok) {
        // AJAX OR USE INFORMATIONS
        console.log("AJAX OR USE INFORMATIONS");
    }
}