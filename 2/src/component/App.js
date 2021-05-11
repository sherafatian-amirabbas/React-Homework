import {Component} from 'react';
import PropTypes from 'prop-types';
import Mathemagician from '../logic/Mathemagician';
import Starter from '../component/Starter';
import Game from '../component/Game';
import GameResult from '../component/GameResult';
import Library from '../logic/Library';

const lib = new Library();

export default class App extends Component {
    constructor(props) {
        super(props);
        this.gameMode = {Starting: 0, InProgress: 1, Finished: 2};
        this.state = {
            mode: this.gameMode.Starting,
            numberOfRound: 0,
            expression: null,
            gameDuration: 0,
        };
        this.onStart = this.onStart.bind(this);
        this.OnEvaluate = this.OnEvaluate.bind(this);
    }
    onStart(value) {
        this.mathemagician = new Mathemagician(lib.generateExpression, value);
        this.setState({
            mode: this.gameMode.InProgress,
            numberOfRound: value,
            expression: this.mathemagician.expression,
        });
    }
    OnEvaluate(value) {
        const result = this.mathemagician.checkAnswer(value);
        if (result.correct) {
            if (this.mathemagician.gameOver) {
                this.setState({mode: this.gameMode.Finished, gameDuration: this.mathemagician.timeSpent});
            } else {
                this.setState({expression: this.mathemagician.expression});
            }
        }
    }
    render() {
        let markup = '';
        if (this.state.mode == this.gameMode.Starting) {
            markup =
                <Starter PlayerName={this.props.PlayerName} onSubmit={this.onStart} AlertMessageOnWrongUserInput={true}>
                </Starter>;
        } else if (this.state.mode == this.gameMode.InProgress) {
            markup =
                <Game NumberOfRound={this.state.numberOfRound} Operand1={this.state.expression.lhs}
                    Operand2={this.state.expression.rhs} Operator={this.state.expression.operator}
                    onEvaluate={this.OnEvaluate} AlertMessageOnWrongUserInput={false}>
                </Game>;
        } else if (this.state.mode == this.gameMode.Finished) {
            markup = <GameResult Duration={this.state.gameDuration}></GameResult>;
        }
        return (markup);
    }
}

App.propTypes = {
    PlayerName: PropTypes.string.isRequired,
};
