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
        case Constants.ADD_EVENT:
            return {...state, ...action.event};
        case Constants.REMOVE_EVENTS:
            return _.omit(state, action.eventIds);
        case Constants.SET_EVENTS:
            return {...action.events};
        case Constants.UPDATE_EVENT:
            const eventId = Object.keys(action.event)[0];
            return {...state, [eventId]: {...state[eventId], ...action.event[eventId]}};
        default:
            return state;
    }
};

const usersReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return {};
    }

    switch (action.type) {
        case Constants.ADD_USERS:
            return {...state, ...action.users};
        case Constants.REMOVE_USERS:
            return _.omit(state, action.userIds);
        case Constants.SET_USERS:
            return {...action.users};
        case Constants.UPDATE_USER:
            const userId = Object.keys(action.user)[0];
            console.log('userId', userId);
            console.log(state[userId], {[userId]: {...state[userId], ...action.user[userId]}})
            return {...state, [userId]: {...state[userId], ...action.user[userId]}};
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

const messagesReducer = (state, action) => {
    /**
     *  {
     *      eventId: {
     *          numMessages: number,
     *          messages: [{
     *              _id: 1,
     *              text: 'I heard this place is really good!!',
     *              createdAt: new Date(),
     *              user: {
     *                  _id: 2,
     *                  name: 'Bob',
     *                  avatar: 'https://placeimg.com/140/140/any',
     *              },
     *          }]
     *      }
     *  }
     */
    if (typeof state === 'undefined') {
        return {};
    }

    switch (action.type) {
        case Constants.ADD_MESSAGES:
            if (action.prepend) {
                return {...state, [action.eventId]: {
                    numMessages: state[action.eventId].numMessages,
                    messages: [...state[action.eventId].messages, ...action.messages]
                }};
            } else {
                return {...state, [action.eventId]: {
                    numMessages: state[action.eventId].numMessages + action.messages.length,
                    messages: [...action.messages, ...state[action.eventId].messages]
                }};
            }
        case Constants.REMOVE_MESSAGE_EVENTS:
            return _.omit(state, action.eventIds);
        case Constants.SET_MESSAGES:
            return {...state, [action.eventId]: {
                numMessages: action.numMessages, messages: action.messages
            }};
        default:
            return state;
    }
};

const Reducers = {
    avatar: avatarReducer,
    myId: myIdReducer,
    events: eventsReducer,
    users: usersReducer,
    firstName: firstNameReducer,
    lastName: lastNameReducer,
    messages: messagesReducer,
};

export default combineReducers<MyStore>(Reducers);
