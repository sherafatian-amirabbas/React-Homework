import Library from '../Library';

export const createFakeServer = () => {
    const lib = new Library();
    let id = 0;
    let errorOnActions = null;
    const games = {};

    const startGame = (rounds) => {
        ++id;
        const exp = lib.generateExpression();
        const answer = lib.getExpressionAnswer(exp);
        const skipRemainings = Math.floor(rounds / 3);

        games[id] = {
            meta: {
                startTime: (new Date()).getTime(),
                rounds: rounds,
                asnwer: answer,
                skipRemainings: skipRemainings
            },
            value: {
                id: id,
                type: 'mathemagician',
                status: 'waiting_for_move',
                nextExpression: {
                    lhs: exp.lhs,
                    rhs: exp.rhs,
                    operator: exp.operator,
                    correctAnswerLength: answer.toString().length
                },
                skipsRemaining: skipRemainings,
            }
        };

        return getReturnValue(games[id].value);
    };

    const skipAnswer = (id) => {
        const game = games[id];
        const meta = game.meta;
        const value = game.value;

        if (meta.skipRemainings == 0) {
            return getReturnValue({
                move: null,
                game: value
            });
        }

        const duration = (new Date()).getTime() - meta.startTime;
        const exp = lib.generateExpression();
        const answer = lib.getExpressionAnswer(exp);
        const skipRemainings = Math.max(0, value.skipsRemaining - 1);

        meta.startTime = (new Date()).getTime();
        meta.rounds = Math.max(0, meta.rounds - 1);
        meta.asnwer = answer;
        meta.skipRemainings = skipRemainings;

        const returnValue = {
            move: {
                timeSpentMillis: duration,
                correct: false,
                skipped: true
            },
            game: {
                ...game.value,
                status: meta.rounds != 0 ? 'waiting_for_move' : 'finished',
                nextExpression: {
                    lhs: exp.lhs,
                    rhs: exp.rhs,
                    operator: exp.operator,
                    correctAnswerLength: answer.toString().length
                },
                skipsRemaining: skipRemainings
            }
        };

        return getReturnValue(returnValue);
    };

    const checkAnswer = (id, answer) => {
        const game = games[id];
        const meta = game.meta;
        const value = game.value;

        const duration = (new Date()).getTime() - meta.startTime;
        const exp = lib.generateExpression();
        const asn = lib.getExpressionAnswer(exp);
        const isCorrect = answer == meta.asnwer;

        meta.startTime = (new Date()).getTime();
        meta.rounds = Math.max(0, meta.rounds - 1);
        meta.asnwer = asn;

        const isFinished = meta.rounds == 0;

        return getReturnValue({
            move: {
                // since in testing we cannot set some delay, for some rounds we will set delay more than 3000
                timeSpentMillis: (meta.rounds % 2 == 0) ? 3400 : duration,
                correct: isCorrect,
                skipped: false
            },
            game: {
                ...game.value,
                status: isFinished ? 'finished' : 'waiting_for_move',
                nextExpression: isFinished ? null : {
                    lhs: exp.lhs,
                    rhs: exp.rhs,
                    operator: exp.operator,
                    correctAnswerLength: asn.toString().length
                },
                skipsRemaining: isFinished ? 0 : value.skipsRemaining
            }
        });
    };

    const getReturnValue = (successReturnValue) =>
        errorOnActions != null ? Promise.reject(errorOnActions) : Promise.resolve(successReturnValue);

    const respondWithSuccess = () => {
        errorOnActions = null;
    };

    const respondWithFailure = () => {
        errorOnActions = new Error('Service currently unavailable');
    };

    return {
        startGame,
        skipAnswer,
        checkAnswer,
        respondWithSuccess,
        respondWithFailure,
    };
};
