import Sinon from 'sinon';

export const createMockWebSocketInterface = (name) => {
    const connectWebSocket = Sinon.stub().named('connect');

    const close = Sinon.stub().named('close').callsFake(() => {
        connectWebSocket.yieldTo('onClose', {reason: null});
    });

    connectWebSocket.callsFake(() => {
        setTimeout(() => {
            if (name == 'CCCC') {
                connectWebSocket.yieldTo('onClose', {code: 4000});
            } else {
                connectWebSocket.yieldTo('onMessage', {
                    eventName: 'connection:accepted',
                    payload: {playerId: 1}
                });

                connectWebSocket.yieldTo('onMessage', {
                    eventName: 'online-players',
                    payload: [{id: 1, name: name}]
                });
            }
        });

        return ({close});
    });

    return connectWebSocket;
};
