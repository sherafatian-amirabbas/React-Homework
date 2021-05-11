export default class Library {
    constructor() {
        this.expressionCounter = null;
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

    generateDigit() {
        return Math.floor(Math.random() * 10);
    }

    generateExpression() {
        this.expressionCounter = this.expressionCounter ? this.expressionCounter + 1 : 1;
        return {
            lhs: this.generateDigit(),
            operator: this.expressionCounter % 2 == 0 ? '+' : '*',
            rhs: this.generateDigit()
        };
    }
}
