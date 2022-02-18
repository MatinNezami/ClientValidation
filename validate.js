class Validate {
    ok = false;
    inputs = {};
    emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    errorTooltip = document.getElementById("err-tooltip");

    checkEmpty = input => input.value;

    simple = input => ({
        status: new RegExp(`^.{${input.minLength},${input.maxLength}}$`).test(input.value)
    });

    email = input => ({
        status: this.emailRegex.test(input.value)
    });

    username = input => ({
        status: new RegExp(`^[a-zA-Z0-9_]{${input.minLength},${input.maxLength}}$`).test(input.value)
    });

    retryPassword = (input, password) => ({
        status: input.value == password.value,
        message: "conferm password"
    });

    number (input) {
        if (!(input.value >= +input.min && input.value <= +input.max))
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
                return this.number(input);

            case "text":
                return this.simple(input);

            case "email":
                return this.email(input);
        }
    }

    position (input) {
        let left = 0,
            top = 0,
            box = input;

        while (box.offsetParent) {
            if (!box.getBoundingClientRect)
                break;

            let dimension = box.getBoundingClientRect();
            top += dimension.y;
            left += dimension.x;

            box = box.offsetParent;
        }

        return {
            x: left,
            y: top
        };
    }
     
    error (input, message) {
        const dimension = this.position(input);

        this.errorTooltip.innerText = message;
        this.errorTooltip.style.left = `${(dimension.x + input.offsetWidth / 2) - (this.errorTooltip.offsetWidth / 2)}px`;
        this.errorTooltip.style.top = `${dimension.y + input.offsetHeight}px`;

        this.errorTooltip.classList.add("active");

        setTimeout(() => {
            this.errorTooltip.classList.remove("active");
        }, 3000);
    }

    validate () {
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

        return true;
    }

    constructor (form) {
        form.querySelectorAll("input").forEach(
            input => this.inputs[input.name] = input
        );

        this.ok = this.validate();
    }
}