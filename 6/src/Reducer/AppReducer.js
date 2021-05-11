import {
    startGameAction,
    evaluateGameAction,
    skipGameAction,
    newGameAction,
    gameReducer
} from './GameReducer';
import {
    startGameWSAction,
    updatePlayersWSAction,
    webSocketReducer
} from './WebSocketReducer';

import Library from '../Library';

const lib = new Library();

// ----------------------------------------------------- actions

const getBaseAction = (type, payload) => {
    return {
        type: type,
        payload: {
            errorMessage: payload.errorMessage,
            executionTime: payload.executionTime
        }
    };
};

export const getStartGameAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.StartGame, payload);
    baseAction = startGameAction(baseAction, payload);
    baseAction = startGameWSAction(baseAction, payload);
    return baseAction;
};

export const getEvaluateGameAction = (payload) => {
    return evaluateGameAction(getBaseAction, payload);
};

export const getSkipGameAction = (payload) => {
    return skipGameAction(getBaseAction, payload);
};

export const getNewGameAction = (payload) => {
    return newGameAction(getBaseAction, payload);
};

export const getInFlightAction = (payload) => {
    const action = getBaseAction(lib.ActionType.InFlight, payload);
    action.payload = {
        ...action.payload,
        inFlight: payload.inFlight,
    };
    return action;
};

export const getUpdatePlayersWSAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.UpdatePlayers, payload);
    baseAction = updatePlayersWSAction(baseAction, payload);
    return baseAction;
};

export const getRestartAction = (payload) => {
    return getBaseAction(lib.ActionType.Restart, {
        errorMessage: payload.code == 4000 ? 'The name is already taken' : ''
    });
};

// ----------------------------------------------------- initializer

const initState = ({
    id: null,
    wsPlayerId: null,
    wsPlayerName: null,
    wsPlayerList: [],
    mode: lib.GameMode.Starting,
    expression: null,
    gameDuration: 0,
    histories: [],
    skipVisibility: false,
    round: 0,
    currentHistories: [],
    errorMessage: null,
    rounds: 0,
    inFlight: false,
});

export const initializer = () => initState;

// ----------------------------------------------------- private methods

const setInflight = (state, payload) => {
    return ({
        ...state,
        inFlight: payload.inFlight,
    });
};

const restart = (state, payload) => initState;

// ----------------------------------------------------- reducer

export const appReducer = (state, action) => {
    if (action.payload && action.payload.errorMessage) {
        state.errorMessage = action.payload.errorMessage;
        state = setInflight(state, {inFlight: false});
        return state;
    }

    if (action.payload) {
        action.payload.initState = initState;
        action.payload.currentWSPlayerList = state.wsPlayerList;
        action.payload.currentWSPlayerId = state.wsPlayerId;
        action.payload.currentWSPlayerName = state.wsPlayerName;
    }
    let newState = null;

    switch (action.type) {
        case lib.ActionType.InFlight:
            newState = setInflight(state, action.payload);
            break;
        case lib.ActionType.Restart:
            newState = restart(state, action.payload);
            break;
        default:
            newState = gameReducer(state, action);
            newState = webSocketReducer(newState, action);
            newState = setInflight(newState, {inFlight: false});
    }

    newState.errorMessage = null;
    return newState;
};
