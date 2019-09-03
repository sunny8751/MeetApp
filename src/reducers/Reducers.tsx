import { combineReducers } from 'redux';
import _ from 'lodash';
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

const eventsReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return {};
    }

    switch (action.type) {
        case Constants.ADD_EVENTS:
        return {...state, ...action.events};
        case Constants.REMOVE_EVENTS:
        return _.omit(state, action.eventIds);
        case Constants.SET_EVENTS:
        return {...action.events};
        default:
        return state;
    }
};

const Reducers = {
    count: counter,
    events: eventsReducer
};

export default combineReducers<MyStore>(Reducers);
