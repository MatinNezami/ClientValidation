"use strict";

const errorTooltip = document.getElementById("err-tooltip"),
    errorMsg = errorTooltip.querySelector("span");

function status (status, message) {
    window.status.prototype.status = status;
    window.status.prototype.message = message;
}

class Validate {
    emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    status (status, message) {
        this.ok = status;
        this.message = message;
    }

    text = input => this.status(
        new RegExp(`^.{${input.minlen},${input.maxlen}}$`).test(input.val)
    );

    email = input => this.status(this.emailRegex.test(input.val));

    username = input => this.status(
        new RegExp(`^(?=.{${input.minlen},${input.maxlen}}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$`)
            .test(input.val)
    );

    // use factory function
    retype = (input, reference = input.getAttribute("retype")) => (this.status(
        input.val == this.inputs.find(input => input.name == reference).val,
        "conferm password"
    ));

    number (input) {
        if (!(+input.val >= input.minnum && +input.val <= input.maxnum))
            this.status(false, "number out of range");
    }

    same (password, username) {
        for (let item of password.toLowerCase().match(/.{1,3}/g)?? [])
            if (username.toLowerCase().includes(item)) return true;
    }

    password (input) {
        const passwordRegex = new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{${input.minlen},${input.maxlen}}$`);

        if (!passwordRegex.test(input.val))
            this.status(false,
                this.details && !input.hasAttribute("not-details")? "password isn't strong": "value didn't match"
            );
    }

    *fileSize (...sizes) {
        const bytes = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

        for (let size of sizes) {
            let i = -1;

            while (i < bytes.length && (++i, true))
                if (size.includes && size.includes(bytes[i]))
                    size = size.replace(bytes[i], "") * 10 ** (i + 1 * 3);

            yield size;
        }
    }

    // clean this method
    file (input) {
        for (const file of input.files) {
            const types = input.getAttribute("mime"),
                size = this.fileSize(input.getAttribute("min")?? "1KB", input.getAttribute("max")?? "10GB");

            for (const type of types.split(','))
                if (file.type.includes(type.replaceAll(',', "").replaceAll(' ', "")))
                    var has = true;

            if (!has) return this.status(false, "upload file type invalid");

            if (file.size < size.next().value)
                return this.status(false, "upload file is small");
                
            if (file.size > size.next().value)
                return this.status(false, "upload file is big");
        }
    }

    url = input => this.status(
        /^[a-zA-Z0-9.-]{1,50}:\/\/[\w@:%.\+~#=-]{1,253}\.[a-zA-Z]{1,20}.*$/.test(input.val)
    );

    tel = input => this.status(/^\+\d{12}$/.test(input.val));

    // clean this method
    check (input) {
        const check = input.getAttribute("check"),
            retype = input.getAttribute("retype"),
            same = input.getAttribute("same-password"),
            sameTarget = this.form.querySelector(`[name=${same}]`);

        if (sameTarget) this.setLen(sameTarget)

        if (retype) return this.retype(input, retype);

        this[check](input);

        if (same && this.same(input.val, sameTarget.val) && this.ok)
            this.status(false, "password and username is same");
    }

    setMessage (input) {
        const message = "value " + (this.details && !input.hasAttribute("not-details")? "invalid": "didn't match");

        return (this.message?? message).replaceAll('-', ' ');
    }

    set add (input) {
        if (!this.ok) return;
        this.validate([input]);

        if (this.ok) this.data.append(input.name, input.value);
    }
     
    static error (element, message) {
        if (element.hasAttribute("label"))
            element = document.querySelector(`[for=${element.id}]`);

        const dimension = element.getBoundingClientRect();

        errorMsg.innerText = message;
        errorTooltip.style.left = `${(dimension.x + element.offsetWidth / 2 + scrollX) - (errorTooltip.offsetWidth / 2)}px`;
        errorTooltip.style.top = `${dimension.y + element.offsetHeight + scrollY}px`;

        errorTooltip.classList.add("active");

        clearTimeout(window._errorTime_);
        window._errorTime_ = setTimeout(_ => errorTooltip.classList.remove("active"), 3000);

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

    // clean this function
    validate (inputs) {
        for (let input of inputs) {
            this.setLen(input);

            if (input.required && !input.val) {
                this.ok = false;
                return Validate.error(input, "input is empty");
            }

            if (!input.required && !input.val) continue;

            this.check(input);

            if (input.val && this.ok) continue;

            this.ok = false;
            return Validate.error(input, this.setMessage(input));
        }

        this.ok = true;

        if (!this.data)
            return new FormData(this.form);
    }

    constructor (form) {
        this.form = form;
        this.details = form.hasAttribute("details");

        this.inputs = [...form.querySelectorAll("input[check], input[retype]")];

        this.data = this.validate(this.inputs)?? new FormData;
    }
}
