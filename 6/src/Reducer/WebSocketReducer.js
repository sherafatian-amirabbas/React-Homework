import Library from '../Library';

const lib = new Library();

// ----------------------------------------------------- actions

export const startGameWSAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        wsPlayerId: payload.wsPlayerId,
        wsPlayerName: payload.wsPlayerName
    };
    return baseAction;
};

export const updatePlayersWSAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        playerList: payload.playerList
    };
    return baseAction;
};

// ----------------------------------------------------- private methods

const startGame = (state, payload) => {
    return ({
        ...state,
        wsPlayerId: payload.wsPlayerId,
        wsPlayerName: payload.wsPlayerName,
    });
};

const updatePlayers = (state, payload) => {
    return ({
        ...state,
        wsPlayerList: payload.playerList
    });
};

const newGame = (state, payload) => {
    return ({
        ...state,
        wsPlayerList: payload.currentWSPlayerList,
        wsPlayerId: payload.currentWSPlayerId,
        wsPlayerName: payload.currentWSPlayerName
    });
};

// ----------------------------------------------------- reducer

export const webSocketReducer = (state, action) => {
    let newState = null;
    switch (action.type) {
        case lib.ActionType.StartGame:
            newState = startGame(state, action.payload);
            break;
        case lib.ActionType.UpdatePlayers:
            newState = updatePlayers(state, action.payload);
            break;
        case lib.ActionType.NewGame:
            newState = newGame(state, action.payload);
            break;
        default:
            newState = state;
    }
    return newState;
};
