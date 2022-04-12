JavaScript Validation Form Library
======================================================

You can validation forms with create instance from `Validate` class

## Usage


#### JavaScript

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


#### HTML Form

```html
<form action="" details-error>
    <input type="text" name="first-name" minlength="4">
    <input type="text" name="username" required>
    <input type="email" name="email" required>
    <input type="password" name="password" required>
    <input type="password" name="retype-password" required>
</form>
```

What is`details-error` attribute?

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


#### Inputs Check

If you need validation `username`, `password` and `retype-password` only validation with check attribute
but validation `file`, `url`, `tel` and more, check with input type for example:

```html
<form action="">
    <input type="text" name="client-username" check="username">

    <input type="password" name="password" check="password">
    <input type="password" name="re-enter-password" check="retype-password">
</form>
```


#### Validation File

```html
<input type="file" mime="wepb" max-size="10M">
```

`mime` attribute for upload file type: `image`, `video`, `mpeg` and more types
`max-size` attribute for maximum upload file size: `100K`, `10G` and more sizes


## Tips


#### Add Other Inputs

If your input is out of form, you can use add method:

```js
const form = document.getElementById("form"),
    password = document.getElementById("passwrod"),
    reEnter = document.getElementById("re-enter"),
    validate = new Validate(form);

validate.add(password);
validate.add(reEnter, "retype-password");

if (validate.ok) {
    const response = await fetch("server.php", {
        body: validate.data,
        method: "POST"
    });
}
```

If undefined type in add method: `validate.add(input)` type is input type


#### Types

* username
* retype-password
* password
* file
* url
* tel
* text
* email
* number


#### Show Error

You need a tooltip box for show error message, this element `id` is `err-tooltip`
and exists `span` element for insert message

You can use `test.html` tooltip box and add style from `style.css`


#### Error To Label Elements

If you need show error message to lable, use label attribute on input element, for example:

```html
<input type="color" label id="background" name="background" required>
<label for="background">Pleas Select Color</label>
```


#### Error Details Self Inputs

If you needn't show error details for one input use `not-details` attribute, for example:

```html
<input type="range" min="0" step="0.1" not-details>
```


#### Control Error Tooltip

You can use `Validate.error` method for custom error to elements
use: `Validate.error(element, message)`


#### Same Password With Username

If you need validation same password with inputs value, you can use `same-password`
attribute and assign input name for check, for example:

```html
<form action="" error-details>
    <input type="text" name="id" check="username" same-password="password">

    <input type="password" name="password" check="password">
    <input type="password" name="re-enter" check="retype-password">
</form>
```


For better understand run and read `test.html`