const errorTooltip = document.getElementById("err-tooltip"),
    errorMsg = errorTooltip.querySelector("span");

function status (status, message) {
    window.status.prototype.status = status;
    window.status.prototype.message = message;
}

class Validate {

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

    ["retype-password"] = input => ({
        status: input.value == (this.retypeReference?? this.inputs.find(input => input.getAttribute("check") == "password"))
            .value,

        message: "conferm password"
    });

    number (input) {
        if (!(+input.value >= (input.minnum?? 5) && +input.value <= (input.maxnum?? 30)))
            return new self.status(false, "number out of range");

        return new self.status(true);
    }

    same (password, username) {
        for (let item of password.toLowerCase().match(/.{1,3}/g)?? [])
            if (username.toLowerCase().includes(item)) return true;
    }

    password (input) {
        const passwordRegex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${input.minlen?? 8},${input.maxlen?? 30}}$`);

        if (!passwordRegex.test(input.value))
            return new self.status(false,
                this.details && !input.hasAttribute("not-details")? "password isn't strong": "value didn't match"
            );

        return new self.status(true);
    }

    file (input) {
        for (const file of input.files) {
            const type = input.getAttribute("mime"),
                size = input.getAttribute("max-size").replace("K", "000").replace("M", "000000").replace("G", "000000000");

            if (!file.type.includes(type))
                return new self.status(false, "upload file ins't" + type);

            if (file.size > size)
                return new self.status(false, "upload file is big");
        }

        return new self.status(true);
    }

    url = input => ({
        status: /^[a-zA-Z0-9.-]{1,50}:\/\/[\w@:%.\+~#=-]{1,253}\.[a-zA-Z]{1,20}(:\d{1,5})?.*/.test(input.value),
    });

    tel = input => ({ status: /^\+\d{12}$/.test(input.value) });

    checkData (input) {
        const check = input.getAttribute("check"),
            same = input.getAttribute("same-password"),
            sameTarget = this.form.querySelector(`[name=${same}]`);

        if (check && this[check]?.constructor)
            var validate = this[check](input);
                
        if (same && this.same(input.value, sameTarget.value))
            return validate.status? {
                status: false,
                message: "password and username is same"
            }: validate;

        return this[input.type]?.constructor? this[input.type](input): {status: true};
    }

    message = (input, message) => (message?? `value ${this.details && !input.hasAttribute("not-details")? "invalid": "didn't match"}`)
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
        Validate.error(input, this.message(input, validate.message), this.form);
    }
     
    static error (element, message, form = null) {
        if (element.hasAttribute("label"))
            element = document.querySelector(`[for=${element.id}]`);

        if (message.includes("same"))
            element = form?.querySelector("[same-reference]")?? element;

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

    validate () {
        for (let input of this.inputs) {
            this.setLen(input);

            if (input.required && !input.value) {
                this.ok = false;
                return Validate.error(input, "input is empty");
            }

            if (!input.required && !input.value) continue;

            const validate = this.checkData(input);

            if (input.value && validate.status) continue;

            this.ok = false;
            return Validate.error(input, this.message(input, validate.message), this.form);
        }

        this.ok = true;
        return new FormData(this.form);
    }

    constructor (form) {
        this.form = form;
        this.details = form.hasAttribute("details-error");
        this.retypeReference = form.querySelector("[retype-reference]");

        this.inputs = [...form.querySelectorAll("input")];

        this.data = this.validate();
    }
}
