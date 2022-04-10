JavaScript Validation Form Library
======================================================

You can validation forms with create instance from `Validate` class

##Usage

####JavaScript

```js
    const form = document.getElementById("form"),
        validate = new Validate(form);

    if (validate.ok) {
        const response = await fetch("server.php", {
            body: validate.data,
            method: "POST"
        });
    }
```

`validate.ok` porperty is form validation status and `validate.data` propery is instance of `FormData` interface

You can use form data for AJAX to server

####HTML Form

```html
    <form action="" same-password details-error>
        <input type="text" name="first-name" minlength="4">
        <input type="text" name="username" required>
        <input type="email" name="email" required>
        <input type="password" name="password" required>
        <input type="password" name="retype-password" required>
    </form>
```

What is `same-password` and `details-error` attributes?

`same-password` attribute for check same password with username and
`details-error` attribute for show details error, for exaple:

```
    with details
    Passwd94: password isn't strong
    email@: email invalid
```

```
    without details
    Passwd94: password didn't match
    email@: email didn't match
```

You can not use `details-error` in login and more pages

##Inputs Name

If you validation `username`, `password` and `retype-password` only check with name
but validation `file`, `url`, `tel` and more check with type

##Validation File

```html
    <input type="file" mime="wepb" max-size="10M">
```

`mime` attribute for upload file type: `image`, `video`, `mpeg` and more types
`max-size` attribute for maximum upload file size: `100K`, `10G` and more sizes

####Tips


##Add Other Inputs

If your input is out of form, you can use add method:

```js
    const form = document.getElementById("form"),
        file = document.getElementById("profile-upload"),
        validate = new Validate(form);

    validate.add(file, "file");

    if (validate.ok) {
        const response = await fetch("server.php", {
            body: validate.data,
            method: "POST"
        });
    }
```

##Show Error

You need a tooltip box for show error message, this element `id` is `err-tooltip`
and exists `span` element for insert message

You can use `test.html` tooltip box and add style from `style.css`


For better understand run and read `test.html`