"use strict";

const errorTooltip = document.getElementById("err-tooltip"),
    errorMsg = errorTooltip.querySelector("span");

function status (status, message) {
    window.status.prototype.status = status;
    window.status.prototype.message = message;
}

class Validate {
    emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    text = input => ({
        status: new RegExp(`^.{${input.minlen},${input.maxlen}}$`).test(input.val)
    });

    email = input => ({
        status: this.emailRegex.test(input.val)
    });

    username = input => ({
        status: new RegExp(`^(?=.{${input.minlen},${input.maxlen}}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`)
            .test(input.val)
    });

    retype = (input, reference = input.getAttribute("retype")) => (new self.status(
        input.val == this.inputs.find(input => input.name == reference).val,
        "conferm password"
    ));

    number (input) {
        if (!(+input.val >= input.minnum && +input.val <= input.maxnum))
            return new self.status(false, "number out of range");
    }

    same (password, username) {
        for (let item of password.toLowerCase().match(/.{1,3}/g)?? [])
            if (username.toLowerCase().includes(item)) return true;
    }

    password (input) {
        const passwordRegex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${input.minlen},${input.maxlen}}$`);

        if (!passwordRegex.test(input.val))
            return new self.status(false,
                this.details && !input.hasAttribute("not-details")? "password isn't strong": "value didn't match"
            );
    }

    *fileSize (...sizes) {
        for (const size of sizes)
            yield size.replace("K", "000").replace("M", "000000").replace("G", "000000000");
    }

    file (input) {
        for (const file of input.files) {
            const types = input.getAttribute("mime"),
                size = this.fileSize(input.getAttribute("min")?? "1K", input.getAttribute("max")?? "10G");

            for (const type of types.split(","))
                if (file.type.includes(type.replaceAll(",", "").replaceAll(" ", "")))
                    var has = true;

            if (!has) return new self.status(false, "upload file type invalid");

            if (file.size < size.next().value)
                return new self.status(false, "upload file is small");
                
            if (file.size > size.next().value)
                return new self.status(false, "upload file is big");
        }
    }

    url = input => ({
        status: /^[a-zA-Z0-9.-]{1,50}:\/\/[\w@:%.\+~#=-]{1,253}\.[a-zA-Z]{1,20}.*$/.test(input.val)
    });

    tel = input => ({ status: /^\+\d{12}$/.test(input.val) });

    check (input) {
        const check = input.getAttribute("check"),
            retype = input.getAttribute("retype"),
            same = input.getAttribute("same-password"),
            sameTarget = this.form.querySelector(`[name=${same}]`);

        if (sameTarget) this.setLen(sameTarget)

        if (retype) return this.retype(input, retype);

        const validate = this[check](input)?? {status: true};

        if (same && this.same(input.val, sameTarget.val))
            return validate.status? new self.status(false, "password and username is same"): validate;

        return validate;
    }

    message = (input, message) => (message?? `value ${this.details && !input.hasAttribute("not-details")? "invalid": "didn't match"}`)
        .replaceAll("-", " ");

    add (input, type = input.getAttribute("check")) {
        this.setLen(input);
        
        if (!this.ok) return;

        if (input.required && !input.val) {
            this.ok = false;
            return Validate.error(input, "input is empty");
        }

        if (!input.required && !input.val) return;

        const validate = this[type](input);

        if (validate.status)
            return this.data.append(input.name, input.value);

        this.ok = false;
        Validate.error(input, this.message(input, validate.message), this.form);
    }
     
    static error (element, message, form = null) {
        if (element.hasAttribute("label"))
            element = document.querySelector(`[for=${element.id}]`);

        const dimension = element.getBoundingClientRect();

        errorMsg.innerText = message;
        errorTooltip.style.left = `${(dimension.x + element.offsetWidth / 2 + scrollX) - (errorTooltip.offsetWidth / 2)}px`;
        errorTooltip.style.top = `${dimension.y + element.offsetHeight + scrollY}px`;

        errorTooltip.classList.add("active");

        setTimeout(_ => errorTooltip.classList.remove("active"), 3000);

        scrollTo(0, errorTooltip.getBoundingClientRect().y + scrollY / 2);
    }

    setLen (input) {
        input.val = (input.getAttribute("check")?? "password").includes("password")? input.value: input.value.trim();

        const len = {
            maxnum: input.max,
            minnum: input.min,
            maxlen: input.maxLength,
            minlen: input.minLength
        };

        for (const attr in len) {
            const range = attr.includes("min")? 5: 30;
            input[attr] = len[attr] < 0 || !len[attr]? range: len[attr];
        }
    }

    validate () {
        for (let input of this.inputs) {
            this.setLen(input);

            if (input.required && !input.val) {
                this.ok = false;
                return Validate.error(input, "input is empty");
            }

            if (!input.required && !input.val) continue;

            const validate = this.check(input);

            if (input.val && validate.status) continue;

            this.ok = false;
            return Validate.error(input, this.message(input, validate.message), this.form);
        }

        this.ok = true;
        return new FormData(this.form);
    }

    constructor (form) {
        this.form = form;
        this.details = form.hasAttribute("details-error");

        this.inputs = [...form.querySelectorAll("input[check], input[retype]")];

        this.data = this.validate();
    }
}
