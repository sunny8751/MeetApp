import { combineReducers } from 'redux';
import _ from 'lodash';
import { MyStore } from '../../App';
import * as Constants from '../constants/Constants';

const avatarReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return Constants.DEFAULT_AVATAR;
    }

    switch (action.type) {
        case Constants.SET_AVATAR:
            return action.avatar;
        default:
            return state;
    }
};

const myIdReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return '';
    }

    switch (action.type) {
        case Constants.SET_MY_ID:
            return action.myId;
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
        case Constants.UPDATE_EVENT:
            console.log('reducer', {...state, [action.eventId]: {...state[action.eventId], ...action.event}});
            return {...state, [action.eventId]: {...state[action.eventId], ...action.event}}
        default:
            return state;
    }
};

const friendsReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return {};
    }

    switch (action.type) {
        case Constants.ADD_FRIENDS:
            return {...state, ...action.friends};
        case Constants.REMOVE_FRIENDS:
            return _.omit(state, action.friendIds);
        case Constants.SET_FRIENDS:
            return {...action.friends};
        default:
            return state;
    }
};

const firstNameReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return '';
    }

    switch (action.type) {
        case Constants.SET_FIRST_NAME:
            return action.firstName;
        default:
            return state;
    }
};

const lastNameReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return '';
    }

    switch (action.type) {
        case Constants.SET_LAST_NAME:
            return action.lastName;
        default:
            return state;
    }
};

const Reducers = {
    avatar: avatarReducer,
    myId: myIdReducer,
    events: eventsReducer,
    friends: friendsReducer,
    firstName: firstNameReducer,
    lastName: lastNameReducer
};

export default combineReducers<MyStore>(Reducers);
