const LoggingMiddleware = ({getStateBefore}) => {
    return (next) => {
        return (action) => {
            const stateBefore = getStateBefore();

            // eslint-disable-next-line no-console
            console.log('Dispatching action', action, 'while state is', stateBefore);

            // eslint-disable-next-line no-console
            console.log('delay', (new Date()) - action.payload.executionTime, 'ms');

            next(action);
        };
    };
};

export default LoggingMiddleware;
