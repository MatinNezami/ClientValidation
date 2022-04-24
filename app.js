document.getElementById("send").addEventListener("click", submit);

function submit () {
    const result = new Validate(document.getElementById("data"));
    result.add = document.querySelector("body > input");
    result.add = document.getElementById("username");
    result.add = document.getElementById("passwd");

    if (!result.ok) return;

    console.log("AJAX OR USE INFORMATIONS");

    for (const data of result.data.entries())
        console.log(data[0], data[1]);
}