const useWebSocket = (connectWebSocket, onOpen, onClose, onPlayerJoined, onConnectionAccepted) => {
    let connection = null;

    const connect = (playerName, data) => {
        connection = connectWebSocket({
            onOpen: () => {
                if (onOpen && typeof onOpen == 'function') {
                    onOpen();
                }
            },
            onClose: (arg) => {
                if (onClose && typeof onClose == 'function') {
                    onClose({code: arg.code, reason: arg.reason});
                }
            },
            onMessage: (arg) => {
                switch (arg.eventName) {
                    case 'online-players':
                        onPlayerJoined({playerList: arg.payload});
                        break;
                    case 'connection:accepted':
                        onConnectionAccepted({
                            playerId: arg.payload.playerId,
                            name: playerName,
                            data: data
                        });
                        break;
                }
            },
            parameters: {playerName: playerName},
        });
    };

    const close = () => {
        if (connection) {
            connection.close();
        } else {
            throw new Error('Connection is not established!');
        }
    };

    return {
        connect,
        close,
    };
};

export default useWebSocket;
