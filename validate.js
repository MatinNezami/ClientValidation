class Validate {
    ok;
    inputs = {};
    emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    errorTooltip = document.getElementById("err-tooltip");

    checkEmpty = input => input.value;

    simple = input => ({
        status: new RegExp(`^.{${input.minLength? 5: null},${input.maxLength? 30: null}}$`).test(input.value)
    });

    email = input => ({
        status: this.emailRegex.test(input.value)
    });

    username = input => ({
        status: new RegExp(`^[a-zA-Z0-9_]{${input.minLength? 5: null},${input.maxLength? 30: null}}$`).test(input.value)
    });

    retryPassword = (input, password) => ({
        status: input.value == password.value,
        message: "conferm password"
    });

    number (input) {
        if (!(+input.value >= (input.min? +input.min: 5) && +input.value <= (input.max? +input.max: 30)))
            return {
                status: false,
                message: "number out of range"
            }

        return {
            status: true
        };
    }

    password (input, username) {
        if (!this.username(input).status)
            return {
                status: false
            };

        for (let item of input.value.match(/.{1,3}/g)?? [])
            if (username.value.includes(item))
                return {
                    status: false,
                    message: "password is same with username"
                };

        return {
            status: true
        }
    }

    checkData (input) {
        switch (input.name) {
            case "username":
                return this.username(input);

            case "password":
                return this.password(input, this.inputs.username);

            case "retry-password":
                return this.retryPassword(input, this.inputs.password);
        }

        switch (input.type) {
            case "number":
            case "range":
                return this.number(input);

            case "text":
                return this.simple(input);

            case "email":
                return this.email(input);

            default:
                return {status: true};
        }
    }

     
    error (input, message) {
        const dimension = input.getBoundingClientRect();

        this.errorTooltip.innerText = message;
        this.errorTooltip.style.left = `${(dimension.x + input.offsetWidth / 2 + window.scrollX) - (this.errorTooltip.offsetWidth / 2)}px`;
        this.errorTooltip.style.top = `${dimension.y + input.offsetHeight + window.scrollY}px`;

        this.errorTooltip.classList.add("active");

        setTimeout(() => {
            this.errorTooltip.classList.remove("active");
        }, 3000);
    }

    validate (form) {
        for (let input in this.inputs) {
            const empty = this.checkEmpty(this.inputs[input]),
                validate = this.checkData(this.inputs[input]);

            if (this.inputs[input].required && !empty) {
                this.error(this.inputs[input], "input is empty");
                return false;
            }

            if (empty && !validate.status) {
                this.error(this.inputs[input], validate.message?? "data is not valid");
                return false;
            }
        }

        return new FormData(form);
    }

    constructor (form) {
        form.querySelectorAll("input").forEach(
            input => this.inputs[input.name] = input
        );

        this.data = this.validate(form);
    }
}