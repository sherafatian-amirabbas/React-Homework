export default class Library {
    constructor() {
        this.isBetween = this.isBetween.bind(this);
        this.generateDigit = this.generateDigit.bind(this);
        this.generateExpression = this.generateExpression.bind(this);
    }

    isBetween(value, minValue, MaxValue, suppressAlert = true) {
        let isValid = true;

        let msg = '';
        if (minValue && MaxValue) {
            msg = 'the input should be between ' + minValue + ' and ' + MaxValue;
        } else if (minValue && !MaxValue) {
            msg = 'the input should be bigger than ' + minValue;
        } else if (!minValue && MaxValue) {
            msg = 'the input should be less than ' + MaxValue;
        }

        const inputValue = parseInt(value);
        if (isNaN(inputValue)) {
            msg = 'input value is not valid!';
            isValid = false;
        } else {
            if (minValue && inputValue < minValue) {
                isValid = false;
            }

            if (MaxValue && inputValue > MaxValue) {
                isValid = false;
            }
        }

        if (!isValid && !suppressAlert) {
            alert(msg);
        }

        return isValid;
    }

    hasEqualLength(val1, val2) {
        return val1.toString().length == val2.toString().length;
    }

    generateDigit(max) {
        return Math.floor(Math.random() * max);
    }

    generateExpression() {
        const max = 20;
        return {
            lhs: this.generateDigit(max),
            operator: ['+', '*', '/', '-'][this.generateDigit(4)],
            rhs: this.generateDigit(max)
        };
    }

    cloneArray(arr) {
        return JSON.parse(JSON.stringify(arr));
    }

    getArrayMax(array, selector) {
        return Math.max(...(array.map((element) => selector(element))));
    }

    getRange(num) {
        return [...Array(num).keys()];
    }

    orderArrayBy(arr, numericalColumn) {
        return arr.sort(function(el1, el2) {
            return parseFloat(el1[numericalColumn]) - parseFloat(el2[numericalColumn]);
        });
    }

    sleep(sleepDuration) {
        const now = new Date().getTime();
        while (new Date().getTime() < now + sleepDuration) {} // eslint-disable-line
    }
}
