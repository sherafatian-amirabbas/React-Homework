import {useState} from 'react';
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
import useReducerWithMiddleware from '../CustomHook/UseReducerWithMiddleware';
import loggingMiddleware from '../Middleware/LoggingMiddleware';
import useAppServerAPI from '../CustomHook/UseAppServerAPI';

const App = (props) => {
    const appServer = useAppServerAPI();
    const [state, dispatch] = useReducerWithMiddleware([loggingMiddleware], appReducer, undefined, initializer);
    const [requestState, setRequestState] = useState({inFlight: false});

    const onStart = async (rounds) => {
        return await appServer.start(rounds, setRequestState,
            (result) => dispatch(getStartGameAction(result)));
    };
    const onEvaluate = async (value) => {
        if (state.expression.correctAnswerLength == value.toString().length) {
            return await appServer.evaluate(state.id, value, setRequestState,
                (result) => dispatch(getEvaluateGameAction(result)));
        }
    };
    const onSkip = async () => {
        return await appServer.skip(state.id, setRequestState,
            (result) => dispatch(getSkipGameAction(result)));
    };
    const onNewGame = async () => {
        return await appServer.newGame(state.rounds, setRequestState,
            (result) => dispatch(getNewGameAction(result)));
    };
    const render = () => {
        if (requestState.inFlight) {
            return <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{'Processing...'}</div>;
        }
        let markup = '';
        let errorMessage = '';
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
        if (state.errorMessage) {
            errorMessage = <div>
                <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{state.errorMessage}</div>
                <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{'(please try again)'}</div>
            </div>;
        }
        return (<div>{markup}<br></br>{errorMessage}</div>);
    };
    return render();
};
App.propTypes = {
    PlayerName: PropTypes.string.isRequired,
};
export default App;
