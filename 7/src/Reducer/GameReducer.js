import Library from '../Library';

const lib = new Library();

// ----------------------------------------------------- actions

export const startGameAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        id: payload.id,
        expression: payload.nextExpression,
        skipsRemaining: payload.skipsRemaining,
        rounds: payload.rounds
    };
    return baseAction;
};

export const loadGameAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        id: payload.id || null,
        mode: payload.mode || null,
        expression: payload.expression || null,
        gameDuration: payload.gameDuration || 0,
        skipVisibility: payload.skipVisibility || false,
        round: payload.round || 0,
        currentHistories: payload.currentHistories || [],
        rounds: payload.rounds || 0,
        finishedDate: payload.finishedDate
    };
    return baseAction;
};

export const evaluateGameAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        answer: payload.answer,
        isAnswered: payload.move ? payload.move.correct : null,
        duration: payload.move ? payload.move.timeSpentMillis : null,
        status: payload.game ? payload.game.status : null,
        expression: payload.game ? payload.game.nextExpression : null,
    };
    return baseAction;
};

export const skipGameAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        status: payload.game ? payload.game.status : null,
        expression: payload.game ? payload.game.nextExpression : null,
        skipsRemaining: payload.game ? payload.game.skipsRemaining : null,
    };
    return baseAction;
};

export const newGameAction = (baseAction, payload) => {
    baseAction.payload = {
        ...baseAction.payload,
        id: payload.id,
        expression: payload.nextExpression,
        skipsRemaining: payload.skipsRemaining,
    };
    return baseAction;
};

// ----------------------------------------------------- private methods

const getNewHistory = (state, answer, isAnswered, duration) => {
    const history = {
        id: state.id,
        operand1: state.expression.lhs,
        operator: state.expression.operator,
        operand2: state.expression.rhs,
        result: answer,
        round: state.round,
        timestamp: (new Date()).getTime(),
        isAnswered: isAnswered,
        duration: duration,
    };

    history.timeTaken = 'Long';
    if (history.duration <= 3000) {
        history.timeTaken = 'Fast';
    }

    return history;
};

const getGameDuration = (histories) => {
    return histories.reduce((acc, his) => acc + his.duration, 0);
};

const getSkipVisibility = (skipsRemaining) => {
    return skipsRemaining != 0;
};

const isGameFinished = (paylodStatus) => {
    return paylodStatus == 'finished';
};

const updateCurrentGame = (state) => {
    if (state.id) {
        state.gamesDic[state.id] = {
            id: state.id,
            mode: state.mode,
            expression: state.expression,
            gameDuration: state.gameDuration,
            skipVisibility: state.skipVisibility,
            round: state.round,
            currentHistories: state.currentHistories,
            rounds: state.rounds,
            finishedDate: state.finishedDate,
        };
    }
};

// -------------------------

const startGame = (state, payload) => {
    return ({
        ...state,
        id: payload.id,
        mode: lib.GameMode.InProgress,
        expression: payload.expression,
        gameDuration: 0,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
        round: state.round + 1,
        currentHistories: [],
        rounds: payload.rounds,
        finishedDate: null,
    });
};

const loadGame = (state, payload) => {
    return ({
        ...state,
        id: payload.id,
        mode: payload.mode,
        expression: payload.expression,
        gameDuration: payload.gameDuration,
        skipVisibility: payload.skipVisibility,
        round: payload.round,
        currentHistories: payload.currentHistories,
        rounds: payload.rounds,
        finishedDate: payload.finishedDate,
    });
};

const evaluateGame = (state, payload) => {
    let result = state;

    const histories = lib.cloneArray(state.histories);
    histories.push(getNewHistory(state, payload.answer, payload.isAnswered, payload.duration));

    if (isGameFinished(payload.status)) {
        const gameDuration = getGameDuration(histories);
        result = ({
            ...state,
            mode: lib.GameMode.Finished,
            gameDuration: gameDuration,
            histories: histories,
            finishedDate: (new Date()).getTime()
        });
    } else {
        result = ({
            ...state,
            expression: payload.expression,
            histories: histories,
            currentHistories: histories.filter((history) => {
                return history.id == state.id;
            }),
        });
    }

    return result;
};

const skipGame = (state, payload) => {
    const isFinished = isGameFinished(payload.status);
    const gameDuration = getGameDuration(state.histories);
    return ({
        ...state,
        mode: isFinished ? lib.GameMode.Finished : state.mode,
        expression: payload.expression,
        gameDuration: isFinished ? gameDuration : state.gameDuration,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
        finishedDate: isFinished ? (new Date()).getTime() : state.finishedDate,
    });
};

const newGame = (state, payload) => {
    return ({
        ...payload.initState,
        id: payload.id,
        mode: lib.GameMode.InProgress,
        expression: payload.expression,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
        round: state.round + 1,
        rounds: state.rounds,
        gamesDic: state.gamesDic,
        histories: lib.cloneArray(state.histories),
    });
};

// ----------------------------------------------------- reducer

export const gameReducer = (state, action) => {
    let newState = null;
    switch (action.type) {
        case lib.ActionType.StartGame:
            newState = startGame(state, action.payload);
            break;
        case lib.ActionType.LoadGame:
            newState = loadGame(state, action.payload);
            break;
        case lib.ActionType.EvaluateGame:
            newState = evaluateGame(state, action.payload);
            break;
        case lib.ActionType.SkipGame:
            newState = skipGame(state, action.payload);
            break;
        case lib.ActionType.NewGame:
            newState = newGame(state, action.payload);
            break;
        default:
            newState = state;
    }
    updateCurrentGame(newState);
    return newState;
};
