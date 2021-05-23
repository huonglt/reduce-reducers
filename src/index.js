export default (...args) => {
  const initialState = typeof args[0] !== 'function' && args.shift();
  const reducers = args;

  if (typeof initialState === 'undefined') {
    throw new TypeError(
      'The initial state may not be undefined. If you do not want to set a value for this reducer, you can use null instead of undefined.'
    );
  }

  return (prevState, value, ...args) => {
    const prevStateIsUndefined = typeof prevState === 'undefined';
    const valueIsUndefined = typeof value === 'undefined';

    if (prevStateIsUndefined && valueIsUndefined && initialState) {
      return initialState;
    }

    return reducers.reduce((newState, reducer, index) => {
      if (typeof reducer === 'undefined') {
        throw new TypeError(
          `An undefined reducer was passed in at index ${index}`
        );
      }

      const routerReducer = reducer['router'];
      if (typeof routerReducer === 'function') {
        const router = routerReducer.apply(undefined, [newState.router, value].concat(args));
        return { ...newState, router };
      } else {
        return reducer.apply(undefined, [newState, value].concat(args));
      }
    }, prevStateIsUndefined && !valueIsUndefined && initialState ? initialState : prevState);
  };
};
