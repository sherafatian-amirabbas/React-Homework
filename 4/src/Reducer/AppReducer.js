import Library from '../logic/Library';
import Mathemagician from '../logic/Mathemagician';

const lib = new Library();
export const gameMode = {Starting: 'Starting', InProgress: 'InProgress', Finished: 'Finished'};
const actionType = {
    StartGame: 'StartGame',
    EvaluateGame: 'EvaluateGame',
    SkipGame: 'SkipGame',
    NewGame: 'NewGame'
};
let mathemagician = null;

// ----------------------------------------------------- actions

export const getStartGameAction = (rounds) => {
    mathemagician = new Mathemagician(lib.generateExpression, rounds);
    return ({
        type: actionType.StartGame,
        payload: {},
    });
};

export const getEvaluateGameAction = (answer) => ({
    type: actionType.EvaluateGame,
    payload: {answer: answer},
});

export const getSkipGameAction = () => ({
    type: actionType.SkipGame,
    payload: {},
});

export const getNewGameAction = () => ({
    type: actionType.NewGame,
    payload: {},
});

// ----------------------------------------------------- initializer

const initState = ({
    mode: gameMode.Starting,
    expression: null,
    gameDuration: 0,
    histories: [],
    skipVisibility: false,
    round: 0,
    currentHistories: []
});

export const initializer = () => initState;

// ----------------------------------------------------- private methods

const getHistory = (value, round) => {
    const history = {
        operand1: mathemagician.expression.lhs,
        operator: mathemagician.expression.operator,
        operand2: mathemagician.expression.rhs,
        result: value,
        duration: 0,
        round: round,
        timestamp: (new Date()).getTime()
    };

    const result = mathemagician.checkAnswer(value);
    history.isAnswered = result.correct;

    history.timeTaken = 'Long';
    if (result.duration <= 3000) {
        history.timeTaken = 'Fast';
    }

    history.duration = result.duration;
    return history;
};

const startGame = (state, payload) => ({
    ...state,
    mode: gameMode.InProgress,
    expression: mathemagician.expression,
    skipVisibility: mathemagician.isSkipAvailable(),
    round: 1,
    currentHistories: []
});

const evaluateGame = (state, payload) => {
    let result = state;

    if (!lib.hasEqualLength(mathemagician.getCorrectAnswer(), payload.answer)) {
        return result;
    }

    const histories = lib.cloneArray(state.histories);
    histories.push(getHistory(payload.answer, state.round));

    if (mathemagician.gameOver) {
        result = ({
            ...state,
            mode: gameMode.Finished,
            gameDuration: mathemagician.timeSpent,
            histories: histories
        });
    } else {
        result = ({
            ...state,
            expression: mathemagician.expression,
            histories: histories,
            currentHistories: histories.filter((history) => {
                return history.round == state.round;
            })
        });
    }

    return result;
};

const skipGame = (state, payload) => {
    mathemagician.skip();
    return ({
        ...state,
        mode: mathemagician.gameOver ? gameMode.Finished : state.mode,
        expression: mathemagician.expression,
        gameDuration: mathemagician.gameOver ? mathemagician.timeSpent : state.gameDuration,
        skipVisibility: mathemagician.isSkipAvailable(),
    });
};

const newGame = (state, payload) => {
    mathemagician = new Mathemagician(lib.generateExpression, mathemagician.rounds);

    const histories = lib.cloneArray(state.histories);

    return ({
        ...initState,
        mode: gameMode.InProgress,
        expression: mathemagician.expression,
        histories: histories,
        round: state.round + 1,
        skipVisibility: mathemagician.isSkipAvailable(),
    });
};

// ----------------------------------------------------- reducer

export const appReducer = (state, action) => {
    switch (action.type) {
        case actionType.StartGame:
            return startGame(state, action.payload);
        case actionType.EvaluateGame:
            return evaluateGame(state, action.payload);
        case actionType.SkipGame:
            return skipGame(state, action.payload);
        case actionType.NewGame:
            return newGame(state, action.payload);
        default:
            throw new Error('Invalid reducer usage');
    }
};
