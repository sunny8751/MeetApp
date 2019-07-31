import * as Constants from '../constants/Constants';

export const increment = () => {
    return { type: Constants.INCREMENT }
};

export const decrement = () => {
    return { type: Constants.DECREMENT }
};
