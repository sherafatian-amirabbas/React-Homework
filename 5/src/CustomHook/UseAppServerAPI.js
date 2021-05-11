import {useContext} from 'react';
import {ServerContext} from '../Server/ServerContext';

const useAppServerAPI = () => {
    const server = useContext(ServerContext);

    const execute = async (action, onResult, requestDispatch) => {
        requestDispatch({inFlight: true});

        let result = null;
        let executionTime = null;
        try {
            executionTime = new Date();
            result = await action();
        } catch (error) {
            result = {errorMessage: error.message};
        } finally {
            result.executionTime = executionTime;
            const returnValue = onResult(result);
            requestDispatch({inFlight: false});
            // eslint-disable-next-line no-unsafe-finally
            return returnValue;
        }
    };

    const start = async (rounds, requestDispatch, onResult) => {
        return await execute(() => server.startGame(rounds),
            (result) => {
                result.rounds = rounds;
                onResult(result);
            },
            requestDispatch);
    };

    const evaluate = async (gameId, answer, requestDispatch, onResult) => {
        return await execute(() => server.checkAnswer(gameId, answer),
            (result) => {
                result.answer = answer;
                onResult(result);
            },
            requestDispatch);
    };

    const skip = async (gameId, requestDispatch, onResult) => {
        return await execute(() => server.skipAnswer(gameId),
            (result) => onResult(result),
            requestDispatch);
    };

    const newGame = async (rounds, requestDispatch, onResult) => {
        return await execute(() => server.startGame(rounds),
            (result) => onResult(result),
            requestDispatch);
    };

    return {
        start,
        evaluate,
        skip,
        newGame
    };
};

export default useAppServerAPI;
