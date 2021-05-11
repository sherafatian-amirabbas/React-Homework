import {useRef} from 'react';
import PropTypes from 'prop-types';
import Starter from '../component/Starter';
import Game from '../component/Game';
import GameResult from '../component/GameResult';
import Monitor from '../component/Monitor';
import {
    initializer,
    getStartGameAction,
    getEvaluateGameAction,
    getSkipGameAction,
    getNewGameAction,
    getInFlightAction,
    getUpdatePlayersWSAction,
    getRestartAction,
    appReducer,
} from '../Reducer/AppReducer';
import useReducerWithMiddleware from '../CustomHook/UseReducerWithMiddleware';
import loggingMiddleware from '../Middleware/LoggingMiddleware';
import useAppServerAPI from '../CustomHook/UseAppServerAPI';
import {connect as defaultConnectWebSocket} from '../Server/WebSocket';
import Library from '../Library';
import useWebSocket from '../CustomHook/UseWebSocket';

const lib = new Library();

const App = (props) => {
    const [state, dispatch] = useReducerWithMiddleware([loggingMiddleware], appReducer, undefined, initializer);
    const appServer = useAppServerAPI();
    const socketConnection = useRef(useWebSocket(props.connectWebSocket || defaultConnectWebSocket, null,
        (arg) => dispatch(getRestartAction(arg)), // onClose
        (arg) => dispatch(getUpdatePlayersWSAction(arg)), // onPlayedJoined
        (arg) => { // onConnectionAccepted
            arg.data.wsPlayerId = arg.playerId;
            arg.data.wsPlayerName = arg.name;
            dispatch(getStartGameAction(arg.data));
        }
    )).current;
    const onStart = async (rounds, name) => {
        return await appServer.start(rounds,
            () => dispatch(getInFlightAction({inFlight: true})),
            (result) => {
                if (result.error) {
                    dispatch(getStartGameAction(result));
                } else {
                    socketConnection.connect(name, result);
                }
            });
    };
    const onEvaluate = async (value) => {
        if (state.expression.correctAnswerLength == value.toString().length) {
            return await appServer.evaluate(state.id, value,
                () => dispatch(getInFlightAction({inFlight: true})),
                (result) => dispatch(getEvaluateGameAction(result)));
        }
    };
    const onSkip = async () => {
        return await appServer.skip(state.id,
            () => dispatch(getInFlightAction({inFlight: true})),
            (result) => dispatch(getSkipGameAction(result)));
    };
    const onNewGame = async () => {
        return await appServer.newGame(state.rounds,
            () => dispatch(getInFlightAction({inFlight: true})),
            (result) => dispatch(getNewGameAction(result)));
    };
    const render = () => {
        if (state.inFlight) {
            return <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{'Connecting...'}</div>;
        }
        let monitorMarkup = '';
        let markup = '';
        let errorMessage = '';
        if (state.mode == lib.GameMode.Starting) {
            markup = <Starter PlayerName={props.PlayerName} onSubmit={onStart}
                AlertMessageOnWrongUserInput={true}></Starter>;
        } else {
            monitorMarkup = <Monitor disconnectHandler={socketConnection.close} players={state.wsPlayerList}
                currentPlayer={{id: state.wsPlayerId, name: state.wsPlayerName}}></Monitor>;
            if (state.mode == lib.GameMode.InProgress) {
                markup = <Game Operand1={state.expression.lhs}
                    Operand2={state.expression.rhs} Operator={state.expression.operator}
                    onEvaluate={onEvaluate} AlertMessageOnWrongUserInput={false}
                    Histories={state.currentHistories} OrderHistoryColumnName={'timestamp'}
                    SkipVisibility={state.skipVisibility} onSkip={onSkip}></Game>;
            } else if (state.mode == lib.GameMode.Finished) {
                markup = <GameResult Duration={state.gameDuration} Histories={state.histories}
                    onNew={onNewGame} OrderHistoryColumnName={'timestamp'}></GameResult>;
            }
        }
        if (state.errorMessage) {
            errorMessage = <div>
                <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{state.errorMessage}</div>
                <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{'(please try again)'}</div>
            </div>;
        }
        return (<div>{monitorMarkup}{markup}<br></br>{errorMessage}</div>);
    };
    return render();
};

App.propTypes = {
    PlayerName: PropTypes.string.isRequired,
    connectWebSocket: PropTypes.func,
};

export default App;
