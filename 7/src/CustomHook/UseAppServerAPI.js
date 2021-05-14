import {useContext} from 'react';
import {ServerContext} from '../Server/ServerContext';

const useAppServerAPI = () => {
    const server = useContext(ServerContext);

    const execute = async (action, onResult) => {
        let result = null;
        let executionTime = null;
        try {
            executionTime = new Date();
            result = await action();
            result.error = false;
        } catch (error) {
            result = {
                error: true,
                errorMessage: error.message
            };
        } finally {
            result.executionTime = executionTime;
            const returnValue = onResult(result);
            // eslint-disable-next-line no-unsafe-finally
            return returnValue;
        }
    };

    const start = async (rounds, onExecute, onResult) => {
        return await execute(() => {
            onExecute();
            return server.startGame(rounds);
        },
        (result) => {
            result.rounds = rounds;
            onResult(result);
        });
    };

    const newGame = async (rounds, onExecute, onResult) => {
        return await start(rounds, onExecute, onResult);
    };

    const evaluate = async (gameId, answer, onExecute, onResult) => {
        return await execute(() => {
            onExecute();
            return server.checkAnswer(gameId, answer);
        },
        (result) => {
            result.answer = answer;
            onResult(result);
        });
    };

    const skip = async (gameId, onExecute, onResult) => {
        return await execute(() => {
            onExecute();
            return server.skipAnswer(gameId);
        },
        (result) => onResult(result));
    };

    return {
        start,
        evaluate,
        skip,
        newGame
    };
};

export default useAppServerAPI;
