const errorTooltip = document.getElementById("err-tooltip"),
    errorMsg = errorTooltip.querySelector("span");

class Validate {
    inputs = {};
    emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    text = input => ({
        status: new RegExp(`^.{${input.minlen?? 5},${input.maxlen?? 30}}$`).test(input.value)
    });

    email = input => ({
        status: this.emailRegex.test(input.value)
    });

    username = input => ({
        status: new RegExp(`^(?=.{${input.minlen?? 5},${input.maxlen?? 30}}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`)
            .test(input.value)
    });

    retryPassword = (input) => ({
        status: input.value == this.inputs.password.value,
        message: "conferm password"
    });

    number (input) {
        if (!(+input.value >= (input.minnum?? 5) && +input.value <= (input.maxnum?? 30)))
            return {
                status: false,
                message: "number out of range"
            };

        return {status: true};
    }

    same (password, username) {
        for (let item of password.toLowerCase().match(/.{1,3}/g)?? [])
            if (username.toLowerCase().includes(item)) return true;
    }

    password (input) {
        const passwordRegex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${input.minlen?? 8},${input.maxlen?? 30}}$`);

        if (!passwordRegex.test(input.value))
            return {
                status: false,
                message: this.details? "password isn't strong": "password didn't match"
            };

        if (this.samePassword && this.same(input.value, this.inputs.username.value))
            return {
                status: false,
                message: this.details? "password is same with username": "password didn't match"
            };

        return {status: true};
    }

    file (element) {
        const input = element.tagName == "LABLE"? document.getElementById(element.for): element;

        for (const file of input.files) {
            const type = input.getAttribute("file"),
                size = input.getAttribute("size").replace("K", "000").replace("M", "000000").replace("G", "000000000");

            if (!file.type.includes(type))
                return {
                    status: false,
                    message: `upload file ins't ${type}`
                };

            if (file.size > size)
                return {
                    status: false,
                    message: "upload file is big"
                };
        }

        return {status: true};
    }

    url = input => ({
        status: /^[a-zA-Z0-9.-]{1,50}:\/\/[\w@:%.\+~#=-]{1,253}\.[a-zA-Z]{1,20}(:\d{1,5})?((#|\?).*)?$/.test(input.value),
    });

    tel = input => ({
        status: /^\+\d{12}$/.test(input.value)
    });

    checkData (input) {
        console.log(input)
        switch (input.name) {
            case "username":
                return this.username(input);

            case "password":
            case "old-password":
                return this.password(input);

            case "retry-password":
                return this.retryPassword(input);
        }

        switch (input.type) {
            case "range":
                return this.number(input);

            default:
                return this[input.type]? this[input.type](input): {status: true};
        }
    }

    message = (input, message) => (message?? `${input.name? input.name: input.type} ${this.details? "invalid": "didn't match"}`)
        .replaceAll("-", " ");

    add (input, type = input.type) {
        if (!this.ok || !this[type]) return;

        if (input.required && !input.value) {
            this.ok = false;
            return Validate.error(input, "input is empty");
        }

        if (!input.required && !input.value) return;

        this.setLen(input);
        const validate = this[type](input);

        if (validate.status)
            return this.data.append(input.name, input.value);

        this.ok = false;
        Validate.error(input, this.message(input, validate.message));
    }
     
    static error (element, message) {
        const dimension = element.getBoundingClientRect();

        errorMsg.innerText = message;
        errorTooltip.style.left = `${(dimension.x + element.offsetWidth / 2 + scrollX) - (errorTooltip.offsetWidth / 2)}px`;
        errorTooltip.style.top = `${dimension.y + element.offsetHeight + scrollY}px`;

        errorTooltip.classList.add("active");

        setTimeout(_ => errorTooltip.classList.remove("active"), 3000);

        scrollTo(0, errorTooltip.getBoundingClientRect().y + scrollY / 2);
    }

    setLen (input) {
        const len = {
            maxnum: input.max,
            minnum: input.min,
            maxlen: input.maxLength,
            minlen: input.minLength
        };

        for (const attr in len)
            input[attr] = len[attr] < 0 || !len[attr]? null: len[attr];
    }

    validate (form) {
        for (let input in this.inputs) {
            input = this.inputs[input];
            this.setLen(input);

            if (input.required && !input.value) {
                this.ok = false;
                return Validate.error(input, "input is empty");
            }

            if (!input.required && !input.value) continue;

            const validate = this.checkData(input);

            if (input.value && validate.status) continue;

            this.ok = false;
            return Validate.error(input, this.message(input, validate.message));
        }

        this.ok = true;
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
