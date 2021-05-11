export default class Mathemagician {
    constructor(expressionGenerator, rounds) {
        this.expressions = Array.from({length: rounds})
            .map(() => expressionGenerator());
        this.checkAnswer = this.checkAnswer.bind(this);
        this.startTime = Date.now();
        this.expression = this.expressions[0];
    }

    getTheCorrectAnswer() {
        const expression = this.expression;
        if (expression.operator === '+') {
            return expression.lhs + expression.rhs;
        } else if (expression.operator === '*') {
            return expression.lhs * expression.rhs;
        }
    }

    checkAnswer(value) {
        const expression = this.expression;
        if (expression.operator === '+') {
            if (expression.lhs + expression.rhs === value) {
                this.moveToNextExpression();
                return {correct: true};
            }
        } else if (expression.operator === '*') {
            if (expression.lhs * expression.rhs === value) {
                this.moveToNextExpression();
                return {correct: true};
            }
        }

        return {correct: false};
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
