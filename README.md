JavaScript Validation Form Library
==================================

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
    <input type="text" name="username" check="username" required>
    <input type="email" name="email" check="email" required>
    <input type="password" name="password" check="password" required>
    <input type="password" name="password" retype="password" required>
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

`check` attribute for validation type, for example:

```html
<form action="">
    <input type="text" name="client-username" required check="username">

    <input type="password" name="password" required check="password">
    <input type="password" name="re-enter-password" required retype="password">
    <input type="number" name="age" required check="number">
</form>
```


#### Validation File

```html
<input type="file" check="file" mime="wepb" max-size="10M">
```

`mime` attribute for upload file type: `image`, `video`, `mpeg` and more types
`max-size` attribute for maximum upload file size: `100K`, `10G` and more sizes

You can insert multiple type `mime="svg, video"`


## Tips


#### Add Other Inputs

If your input is out of form, you can use `add` method:

```js
const form = document.getElementById("form"),
    password = document.getElementById("passwrod"),
    conferm = document.getElementById("re-enter"),
    validate = new Validate(form);

validate.add(password);
validate.add(conferm, "retype");

if (validate.ok) {
    const response = await fetch("server.php", {
        body: validate.data,
        method: "POST"
    });
}
```

If undefined type in add method: `validate.add(input)` type is input `check` attribute


#### Types

* username
* retype
* password
* file
* url
* tel
* text
* email
* number

Warning you can use `retype`, type in `add` method,
so use on input set `retype` attribute


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

If you need validation same password with inputs value (username), you can use `same-password`
attribute and assign input name for check,
validation input has `same-password` attribute with this attribute value (target input name), for example:

```html
<form action="" error-details>
    <input type="text" name="id" check="username" required same-password="password">

    <input type="password" name="password" required check="password">
    <input type="password" name="re-enter" required check="retype-password">
</form>
```

* You can only check one input with one input for same 


#### Conferm Password

If you need check input value equal with outer inputs value (conferm) use `retype` attribute,
for example:

```html
<form action="" error-details>
    <input type="password" check="password" required name="passwd">
    <input type="password" retype="passwd" required name="conferm">
</form>
```

Use in `add` method:

```js
const validate = new Validate(form),
    conferm = document.getElementById("re-enter");

validate.add(conferm, "retype")
```

Warning: exists `retype` attribute in the `retype` validation



#### Trim

validation inputs value trim: remove start and end white space, except
password validation (`password`, `retype-password`)


For better understand run and read `test.html`