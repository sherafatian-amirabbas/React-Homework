import {useRef} from 'react';
import PropTypes from 'prop-types';
import {Route, useHistory} from 'react-router-dom';
import Menu from './Menu';
import Welcome from './Welcome';
import CreateGame from './CreateGame';
import OnlinePlayers from './OnlinePlayers';
import GameList from './GameList';
import CurrentGame from './CurrentGame';
import {
    initializer,
    getConnectAction,
    getStartGameAction,
    getLoadGameAction,
    getEvaluateGameAction,
    getSkipGameAction,
    getNewGameAction,
    getInFlightAction,
    getUpdatePlayersWSAction,
    getCloseAction,
    appReducer,
} from '../Reducer/AppReducer';
import useReducerWithMiddleware from '../CustomHook/UseReducerWithMiddleware';
import loggingMiddleware from '../Middleware/LoggingMiddleware';
import useAppServerAPI from '../CustomHook/UseAppServerAPI';
import {connect as defaultConnectWebSocket} from '../Server/WebSocket';
import useWebSocket from '../CustomHook/UseWebSocket';

const App = (props) => {
    const history = useHistory();
    const [state, dispatch] = useReducerWithMiddleware([loggingMiddleware], appReducer, undefined, initializer);
    const appServer = useAppServerAPI();
    const socketConnection = useRef(useWebSocket(props.connectWebSocket || defaultConnectWebSocket, null,
        (arg) => { // onClose
            dispatch(getCloseAction(arg));
            history.push("/");
        },
        (arg) => dispatch(getUpdatePlayersWSAction(arg)), // onPlayedJoined
        (arg) => { // onConnectionAccepted
            dispatch(getConnectAction({
                wsPlayerId: arg.playerId,
                wsPlayerName: arg.name,
            }));
            history.push("/createGame");
        }
    )).current;
    const onConnect = (playerName) => {
        dispatch(getInFlightAction({inFlight: true}));
        socketConnection.connect(playerName);
    };
    const onStart = async (rounds) => {
        return await appServer.start(rounds,
            () => dispatch(getInFlightAction({inFlight: true})),
            (result) => {
                dispatch(getStartGameAction(result));
                if(!result.error) {
                    history.push(`/games/${result.id}`);
                }
            });
    };
    const onGameClick = (id) => {
        if (state.id != id) {
            const currentGame = state.gamesDic[id] || {};
            dispatch(getLoadGameAction(currentGame));
        }
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
            (result) => {
                dispatch(getNewGameAction(result));
                history.push("/createGame");
            });
    };
    const onClose = () => {
        dispatch(getInFlightAction({inFlight: true}));
        try {
            socketConnection.close();
        } catch (error) {
            dispatch(getCloseAction({errorMessage: error.message}));
        }
    };
    const render = () => {
        if (state.inFlight) {
            return <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{'Connecting...'}</div>;
        }
        
        let errorMessage = '';
        if (state.errorMessage) {
            errorMessage = <div>
                <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{state.errorMessage}</div>
                <div style={{color: 'red', textAlign: 'center', fontSize: '21px'}}>{'(please try again)'}</div>
            </div>;
        }

        return (
            <div>
                <Menu></Menu>
                <Route exact path='/'
                    render={() => <Welcome playerName={props.playerName} onConnect={onConnect}></Welcome>}/>

                <Route path='/createGame'
                    render={() => <CreateGame onNewGame={onStart} enableAlertMessage={true}></CreateGame>}/>

                <Route path='/games/:gameId'
                    render={() => <CurrentGame gamesDic={state.gamesDic}
                        onEvaluate={onEvaluate} onSkip={onSkip} onNewGame={onNewGame}
                        histories={state.histories} onClose={onClose} wsPlayerList={state.wsPlayerList}
                        wsPlayerId={state.wsPlayerId} wsPlayerName={state.wsPlayerName}></CurrentGame>}/>
                    
                <Route path='/players'
                    render={() => <OnlinePlayers players={state.wsPlayerList} 
                        currentPlayer={{id: state.wsPlayerId, name: state.wsPlayerName}}></OnlinePlayers>}/>

                <Route path='/ongoingGames'
                    render={() => <GameList onGameClick={onGameClick} inProgressMode={true} 
                        gamesDic={state.gamesDic}></GameList>}/>

                <Route path='/finishedGames'
                    render={() => <GameList onGameClick={onGameClick} inProgressMode={false} 
                        gamesDic={state.gamesDic}></GameList>}/>

                <br></br>
                {errorMessage}
            </div>
        );
    };
    return render();
};

App.propTypes = {
    playerName: PropTypes.string.isRequired,
    connectWebSocket: PropTypes.func,
};

export default App;
