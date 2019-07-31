import { combineReducers } from 'redux';
import { MyStore } from '../../App';
import * as Constants from '../constants/Constants';

const counter = (state, action) => {
    if (typeof state === 'undefined') {
        return 0;
    }

    switch (action.type) {
        case Constants.INCREMENT:
        return state + 1;
        case Constants.DECREMENT:
        return state - 1;
        default:
        return state;
    }
};

const Reducers = {
    count: counter
};

export default combineReducers<MyStore>(Reducers);
