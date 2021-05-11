import {useReducer} from 'react';
import PropTypes from 'prop-types';
import Starter from '../component/Starter';
import Game from '../component/Game';
import GameResult from '../component/GameResult';
import {
    gameMode,
    initializer,
    getStartGameAction,
    getEvaluateGameAction,
    getSkipGameAction,
    getNewGameAction,
    appReducer,
} from '../Reducer/AppReducer';

const App = (props) => {
    const [state, dispatch] = useReducer(appReducer, undefined, initializer);

    const onStart = (value) => dispatch(getStartGameAction(value));
    const onEvaluate = (value) => dispatch(getEvaluateGameAction(value));
    const onSkip = () => dispatch(getSkipGameAction());
    const onNewGame = () => dispatch(getNewGameAction());


    const render = () => {
        let markup = '';
        if (state.mode == gameMode.Starting) {
            markup = <Starter PlayerName={props.PlayerName} onSubmit={onStart}
                AlertMessageOnWrongUserInput={true}></Starter>;
        } else if (state.mode == gameMode.InProgress) {
            markup = <Game Operand1={state.expression.lhs}
                Operand2={state.expression.rhs} Operator={state.expression.operator}
                onEvaluate={onEvaluate} AlertMessageOnWrongUserInput={false}
                Histories={state.currentHistories} onSkip={onSkip}
                SkipVisibility={state.skipVisibility} OrderHistoryColumnName={'timestamp'}>
            </Game>;
        } else if (state.mode == gameMode.Finished) {
            markup = <GameResult Duration={state.gameDuration} Histories={state.histories}
                onNew={onNewGame} OrderHistoryColumnName={'timestamp'}></GameResult>;
        }
        return (markup);
    };
    return render();
};

App.propTypes = {
    PlayerName: PropTypes.string.isRequired,
};

export default App;
