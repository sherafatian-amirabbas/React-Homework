export default class Mathemagician {
    constructor(expressionGenerator, rounds) {
        this.rounds = rounds;
        this.expressions = Array.from({length: this.rounds})
            .map(() => expressionGenerator());
        this.checkAnswer = this.checkAnswer.bind(this);
        this.startTime = Date.now();
        this.expressionStartTime = Date.now();
        this.expression = this.expressions[0];
        this.PossibleNumberOfSkips = Math.floor(this.rounds / 3);
    }

    getCorrectAnswer() {
        const expression = this.expression;
        if (expression.operator === '+') {
            return expression.lhs + expression.rhs;
        } else if (expression.operator === '*') {
            return expression.lhs * expression.rhs;
        } else if (expression.operator === '/') {
            return parseFloat((expression.lhs / expression.rhs).toFixed(2));
        } else if (expression.operator === '-') {
            return expression.lhs - expression.rhs;
        }
    }

    checkAnswer(value) {
        const answer = this.getCorrectAnswer();

        let result = {correct: false};
        if (answer === value) {
            result = {correct: true};
        }

        const now = Date.now();
        result.duration = now - this.expressionStartTime;

        this.moveToNextExpression();

        return result;
    }

    skip() {
        if (this.isSkipAvailable()) {
            this.PossibleNumberOfSkips--;
            this.moveToNextExpression();
        }
    }

    isSkipAvailable() {
        return this.PossibleNumberOfSkips != 0;
    }

    moveToNextExpression() {
        const index = this.expressions.findIndex((el) => el === this.expression);
        const nextIndex = index + 1;
        if (this.expressions[nextIndex]) {
            this.expressionStartTime = Date.now();
            this.expression = this.expressions[nextIndex];
        } else {
            this.gameOver = true;
            this.timeSpent = Date.now() - this.startTime;
        }
    }
}
