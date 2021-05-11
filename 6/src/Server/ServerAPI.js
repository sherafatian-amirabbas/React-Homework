const SERVER_ADDRESS = 'http://localhost:8081';

const parse = async (fetchPromise) => {
    const response = await fetchPromise;
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error((await response.json()).error);
    }
};

const startGame = async (rounds) => {
    const params = {rounds: rounds, type: 'mathemagician'};
    return await parse(
        fetch(SERVER_ADDRESS + '/games', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(params),
        })
    );
};

const checkAnswer = async (gameId, answer) => {
    return await move(gameId, answer);
};

const skipAnswer = async (gameId) => {
    return await move(gameId, 'skip');
};

const move = async (gameId, answer) => {
    const params = {guess: answer};
    return await parse(
        fetch(SERVER_ADDRESS + '/games/' + gameId + '/moves', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(params),
        })
    );
};

export const createServer = () => {
    return {
        startGame,
        checkAnswer,
        skipAnswer,
    };
};
