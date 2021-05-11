import {
    startGameAction,
    loadGameAction,
    evaluateGameAction,
    skipGameAction,
    newGameAction,
    gameReducer
} from './GameReducer';
import {
    connectWSAction,
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

export const getConnectAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.Connect, payload);
    baseAction = connectWSAction(baseAction, payload);
    return baseAction;
};

export const getStartGameAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.StartGame, payload);
    baseAction = startGameAction(baseAction, payload);
    return baseAction;
};

export const getLoadGameAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.LoadGame, payload);
    baseAction = loadGameAction(baseAction, payload);
    return baseAction;
};

export const getEvaluateGameAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.EvaluateGame, payload);
    baseAction = evaluateGameAction(baseAction, payload);
    return baseAction;
};

export const getSkipGameAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.SkipGame, payload);
    baseAction = skipGameAction(baseAction, payload);
    return baseAction;
};

export const getNewGameAction = (payload) => {
    let baseAction = getBaseAction(lib.ActionType.NewGame, payload);
    baseAction = newGameAction(baseAction, payload);
    return baseAction;
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

export const getCloseAction = (payload) => {
    return getBaseAction(lib.ActionType.Close, {
        errorMessage: payload.code == 4000 ? 'The name is already taken' : (payload.errorMessage || '')
    });
};

// ----------------------------------------------------- initializer

const initState = ({
    id: null,
    mode: null,
    expression: null,
    gameDuration: 0,
    skipVisibility: false,
    round: 0,
    currentHistories: [],
    rounds: 0,
    gamesDic: {},
    WSConnect: false,
    wsPlayerId: null,
    wsPlayerName: null,
    wsPlayerList: [],
    histories: [],
    errorMessage: null,
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

const close = (state, payload) => initState;

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
        case lib.ActionType.Close:
            newState = close(state, action.payload);
            break;
        default:
            newState = gameReducer(state, action);
            newState = webSocketReducer(newState, action);
            newState = setInflight(newState, {inFlight: false});
    }

    newState.errorMessage = null;
    return newState;
};
