$.select("#err-tooltip", "errorTooltip");
$.errorTooltip.select("span", "errorMsg");

class Validate {
    ok;
    inputs = {};
    emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    samePassword;

    checkEmpty = input => input.value;

    simple = input => ({
        status: new RegExp(`^.{${input.minLength? 5: null},${input.maxLength? 30: null}}$`).test(input.value)
    });

    email = input => ({
        status: this.emailRegex.test(input.value)
    });

    username = input => ({
        status: new RegExp(`^(?=.{${input.minLength? 5: null},${input.maxLength? 30: null}}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`)
            .test(input.value)
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
            };

        return {
            status: true
        };
    }

    password (input, username) {
        const passwordRegex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${input.minLength? 8: null},${input.maxLength? 30: null}}$`);

        if (!passwordRegex.test(input.value))
            return {
                status: false,
                message: this.datails? "password is not strong": "password didn't match"
            };

        if (!this.samePassword)
            return {
                status: true
            }

        for (let item of input.value.toLowerCase().match(/.{1,3}/g)?? [])
            if (username.value.toLowerCase().includes(item))
                return {
                    status: false,
                    message: this.details? "password is same with username": "password didn't match"
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
            case "old-password":
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
     
    static error (element, message) {
        const dimension = element.getBoundingClientRect();

        $.errorMsg.innerText = message;
        $.errorTooltip.style.left = `${(dimension.x + element.offsetWidth / 2 + scrollX) - ($.errorTooltip.offsetWidth / 2)}px`;
        $.errorTooltip.style.top = `${dimension.y + element.offsetHeight + scrollY}px`;

        $.errorTooltip.classList.add("active");

        setTimeout(() => {
            $.errorTooltip.classList.remove("active");
        }, 3000);

        scrollTo(0, $.errorTooltip.getBoundingClientRect().y + scrollY / 2);
    }

    validate (form) {
        for (let input in this.inputs) {
            const empty = this.checkEmpty(this.inputs[input]),
                validate = this.checkData(this.inputs[input]);

            if (this.inputs[input].required && !empty)
                return Validate.error(this.inputs[input], "input is empty");

            if (empty && validate.status) continue;
                
            let message = validate.message?? `${input} ${this.details? "isn't valid": "didn't match"}`;

            return Validate.error(this.inputs[input], message.replaceAll("-", " "));
        }

        return new FormData(form);
    }

    constructor (form, samePassword = true, details = false) {
        this.samePassword = samePassword;
        this.details = details;

        form.querySelectorAll("input").forEach(
            input => this.inputs[input.name] = input
        );

        this.data = this.validate(form);
    }
}
