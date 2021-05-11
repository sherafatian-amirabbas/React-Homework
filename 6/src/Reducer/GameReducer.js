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

export const evaluateGameAction = (getBaseAction, payload) => {
    const action = getBaseAction(lib.ActionType.EvaluateGame, payload);
    action.payload = {
        ...action.payload,
        answer: payload.answer,
        isAnswered: payload.move ? payload.move.correct : null,
        duration: payload.move ? payload.move.timeSpentMillis : null,
        status: payload.game ? payload.game.status : null,
        expression: payload.game ? payload.game.nextExpression : null,
    };
    return action;
};

export const skipGameAction = (getBaseAction, payload) => {
    const action = getBaseAction(lib.ActionType.SkipGame, payload);
    action.payload = {
        ...action.payload,
        status: payload.game ? payload.game.status : null,
        expression: payload.game ? payload.game.nextExpression : null,
        skipsRemaining: payload.game ? payload.game.skipsRemaining : null,
    };
    return action;
};

export const newGameAction = (getBaseAction, payload) => {
    const action = getBaseAction(lib.ActionType.NewGame, payload);
    action.payload = {
        ...action.payload,
        id: payload.id,
        expression: payload.nextExpression,
        skipsRemaining: payload.skipsRemaining,
    };
    return action;
};

// ----------------------------------------------------- private methods

const getNewHistory = (state, answer, isAnswered, duration) => {
    const history = {
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

// -------------------------

const startGame = (state, payload) => {
    return ({
        ...state,
        id: payload.id,
        mode: lib.GameMode.InProgress,
        expression: payload.expression,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
        round: 1,
        rounds: payload.rounds,
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
        });
    } else {
        result = ({
            ...state,
            expression: payload.expression,
            histories: histories,
            currentHistories: histories.filter((history) => {
                return history.round == state.round;
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
    });
};

const newGame = (state, payload) => {
    return ({
        ...payload.initState,
        id: payload.id,
        mode: lib.GameMode.InProgress,
        expression: payload.expression,
        histories: lib.cloneArray(state.histories),
        round: state.round + 1,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
        rounds: state.rounds,
    });
};

// ----------------------------------------------------- reducer

export const gameReducer = (state, action) => {
    let newState = null;
    switch (action.type) {
        case lib.ActionType.StartGame:
            newState = startGame(state, action.payload);
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
    return newState;
};
