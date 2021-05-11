import {useMemo, useReducer, useRef} from 'react';

const useReducerWithMiddleware = (
    middlewares,
    reducer,
    initOrInitialValue,
    init
) => {
    const lastStateRef = useRef();

    const refUpdatingReducer = useMemo(
        () => (prevState, action) => {
            const newState = reducer(prevState, action);
            lastStateRef.current = newState;
            return newState;
        },
        [lastStateRef]
    );

    const [state, dispatch] = useReducer(
        refUpdatingReducer,
        initOrInitialValue,
        init
    );

    const dispatchWithMiddlewares = useMemo(() => {
        const middlewareInit = {
            getStateBefore: () => lastStateRef.current,
        };

        return middlewares
            .concat(dispatch)
            .reverse()
            .reduce((acc, middleware) => {
                return middleware(middlewareInit)(acc);
            });
    }, [middlewares, dispatch, lastStateRef]);
    return [state, dispatchWithMiddlewares];
};

export default useReducerWithMiddleware;
