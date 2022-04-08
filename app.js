document.getElementById("send").addEventListener("click", submit);

function submit () {
    const result = new Validate(document.getElementById("data"), true, true);
    result.add(document.querySelector("body > input"));
    result.add(document.getElementById("username"), "username");

    if (!result.ok) return;

    console.log("AJAX OR USE INFORMATIONS");
    result.data.forEach(value => console.log(value));
}