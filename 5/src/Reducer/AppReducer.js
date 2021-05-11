import Library from '../Library';

const lib = new Library();
export const gameMode = {Starting: 'Starting', InProgress: 'InProgress', Finished: 'Finished'};
const actionType = {
    StartGame: 'StartGame',
    EvaluateGame: 'EvaluateGame',
    SkipGame: 'SkipGame',
    NewGame: 'NewGame'
};

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
    const action = getBaseAction(actionType.StartGame, payload);
    action.payload = {
        ...action.payload,
        id: payload.id,
        expression: payload.nextExpression,
        skipsRemaining: payload.skipsRemaining,
        rounds: payload.rounds
    };
    return action;
};

export const getEvaluateGameAction = (payload) => {
    const action = getBaseAction(actionType.EvaluateGame, payload);
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

export const getSkipGameAction = (payload) => {
    const action = getBaseAction(actionType.SkipGame, payload);
    action.payload = {
        ...action.payload,
        status: payload.game ? payload.game.status : null,
        expression: payload.game ? payload.game.nextExpression : null,
        skipsRemaining: payload.game ? payload.game.skipsRemaining : null,
    };
    return action;
};

export const getNewGameAction = (payload) => {
    const action = getBaseAction(actionType.NewGame, payload);
    action.payload = {
        ...action.payload,
        id: payload.id,
        expression: payload.nextExpression,
        skipsRemaining: payload.skipsRemaining,
    };
    return action;
};

// ----------------------------------------------------- initializer

const initState = ({
    id: null,
    mode: gameMode.Starting,
    expression: null,
    gameDuration: 0,
    histories: [],
    skipVisibility: false,
    round: 0,
    currentHistories: [],
    errorMessage: null,
    rounds: 0,
});

export const initializer = () => initState;

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
        mode: gameMode.InProgress,
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
            mode: gameMode.Finished,
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
        mode: isFinished ? gameMode.Finished : state.mode,
        expression: payload.expression,
        gameDuration: isFinished ? gameDuration : state.gameDuration,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
    });
};

const newGame = (state, payload) => {
    return ({
        ...initState,
        id: payload.id,
        mode: gameMode.InProgress,
        expression: payload.expression,
        histories: lib.cloneArray(state.histories),
        round: state.round + 1,
        skipVisibility: getSkipVisibility(payload.skipsRemaining),
        rounds: state.rounds,
    });
};

// ----------------------------------------------------- reducer

export const appReducer = (state, action) => {
    if (action.payload && action.payload.errorMessage) {
        state.errorMessage = action.payload.errorMessage;
        return state;
    }

    let newState = null;
    switch (action.type) {
        case actionType.StartGame:
            newState = startGame(state, action.payload);
            break;
        case actionType.EvaluateGame:
            newState = evaluateGame(state, action.payload);
            break;
        case actionType.SkipGame:
            newState = skipGame(state, action.payload);
            break;
        case actionType.NewGame:
            newState = newGame(state, action.payload);
            break;
        default:
            throw new Error('Invalid reducer usage');
    }

    newState.errorMessage = null;
    return newState;
};
