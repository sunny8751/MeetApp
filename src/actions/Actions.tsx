import * as Constants from '../constants/Constants';

export const setMyId = (myId: string) => {
    return { type: Constants.SET_MY_ID, myId }
};

export const setAvatar = (avatar: string) => {
    return { type: Constants.SET_AVATAR, avatar }
};

export const addEvents = (events: any) => {
    return { type: Constants.ADD_EVENTS, events }
};

export const removeEvents = (eventIds: string[]) => {
    return { type: Constants.REMOVE_EVENTS, eventIds }
};

export const setEvents = (events: any) => {
    return { type: Constants.SET_EVENTS, events }
};

export const updateEvent = (eventId: string, event: any) => {
    return { type: Constants.UPDATE_EVENT, eventId, event }
};

export const addFriends = (friends: any) => {
    return { type: Constants.ADD_FRIENDS, friends }
};

export const removeFriends = (friendIds: string[]) => {
    return { type: Constants.REMOVE_FRIENDS, friendIds }
};

export const setFriends = (friends: any) => {
    return { type: Constants.SET_FRIENDS, friends }
};

export const setFirstName = (firstName: any) => {
    return { type: Constants.SET_FIRST_NAME, firstName }
};

export const setLastName = (lastName: any) => {
    return { type: Constants.SET_LAST_NAME, lastName }
};

