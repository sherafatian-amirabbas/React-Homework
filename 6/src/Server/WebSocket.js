const websocketConf = {
    port: 8081,
    host: 'localhost',
};

const objectToQueryString = (obj) => {
    const params = new URLSearchParams();
    Object.getOwnPropertyNames(obj).forEach((propName) => {
        params.append(propName, obj[propName]);
    });
    return params.toString();
};

export const connect = ({onOpen, onClose, onMessage, parameters = {}}) => {
    const websocketConnection = new WebSocket(
        `ws://${websocketConf.host}:${websocketConf.port}/?${objectToQueryString(parameters)}`
    );

    websocketConnection.onopen = () => onOpen();

    websocketConnection.onclose = (arg) => onClose(arg);

    websocketConnection.onmessage = (messageEvent) => {
        const payload = messageEvent.data;

        let parsedMessage;
        try {
            parsedMessage = JSON.parse(payload);
        } catch (error) {
            console.error('error parsing websocket message', error, payload); // eslint-disable-line no-console
            return;
        }

        onMessage(parsedMessage);
    };

    const close = () => websocketConnection.close();

    return {close: close};
};
