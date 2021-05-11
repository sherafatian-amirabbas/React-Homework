export default class Mathemagician {
    constructor(expressionGenerator, rounds) {
        this.expressions = Array.from({length: rounds})
            .map(() => expressionGenerator());
        this.checkAnswer = this.checkAnswer.bind(this);
        this.startTime = Date.now();
        this.expressionStartTime = Date.now();
        this.expression = this.expressions[0];
    }

    getCorrectAnswer() {
        const expression = this.expression;
        if (expression.operator === '+') {
            return expression.lhs + expression.rhs;
        } else if (expression.operator === '*') {
            return expression.lhs * expression.rhs;
        } else if (expression.operator === '/') {
            return (expression.lhs / expression.rhs).toFixed(2);
        } else if (expression.operator === '-') {
            return expression.lhs - expression.rhs;
        }
    }

    checkAnswer(value) {
        const expression = this.expression;
        let result = null;
        if (expression.operator === '+') {
            if (expression.lhs + expression.rhs === value) {
                result = {correct: true};
            }
        } else if (expression.operator === '*') {
            if (expression.lhs * expression.rhs === value) {
                result = {correct: true};
            }
        } else if (expression.operator === '/') {
            if ((expression.lhs / expression.rhs).toFixed(2) === value) {
                result = {correct: true};
            }
        } else if (expression.operator === '-') {
            if (expression.lhs - expression.rhs === value) {
                result = {correct: true};
            }
        }

        if (result == null) {
            result = {correct: false};
        }

        const now = Date.now();
        const duration = now - this.expressionStartTime;
        this.expressionStartTime = now;

        this.moveToNextExpression();

        result.duration = duration;
        return result;
    }

    moveToNextExpression() {
        const index = this.expressions.findIndex((el) => el === this.expression);
        const nextIndex = index + 1;
        if (this.expressions[nextIndex]) {
            this.expression = this.expressions[nextIndex];
        } else {
            this.gameOver = true;
            this.timeSpent = Date.now() - this.startTime;
        }
    }
}
