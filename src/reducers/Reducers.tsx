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
    friends: friendsReducer,
    firstName: firstNameReducer,
    lastName: lastNameReducer,
    messages: messagesReducer
};

export default combineReducers<MyStore>(Reducers);
