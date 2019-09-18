import * as Constants from '../constants/Constants';

export const setMyId = (myId: string) => {
    return { type: Constants.SET_MY_ID, myId }
};

export const setAvatar = (avatar: string) => {
    return { type: Constants.SET_AVATAR, avatar }
};

export const addEvent = (event: any) => {
    return { type: Constants.ADD_EVENT, event }
};

export const removeEvents = (eventIds: string[]) => {
    return { type: Constants.REMOVE_EVENTS, eventIds }
};

export const setEvents = (events: any) => {
    return { type: Constants.SET_EVENTS, events }
};

export const updateEvent = (event: any) => {
    return { type: Constants.UPDATE_EVENT, event }
};

export const addUsers = (users: any) => {
    return { type: Constants.ADD_USERS, users }
};

export const removeUsers = (userIds: string[]) => {
    return { type: Constants.REMOVE_USERS, userIds }
};

export const setUsers = (users: any) => {
    return { type: Constants.SET_USERS, users }
};

export const updateUser = (user: any) => {
    return { type: Constants.UPDATE_USER, user }
};

export const setFirstName = (firstName: any) => {
    return { type: Constants.SET_FIRST_NAME, firstName }
};

export const setLastName = (lastName: any) => {
    return { type: Constants.SET_LAST_NAME, lastName }
};

export const addMessages = (eventId: string, messages: any[], prepend=false) => {
    return { type: Constants.ADD_MESSAGES, eventId, messages, prepend }
};

export const removeMessageEvents = (eventIds: string[]) => {
    return { type: Constants.REMOVE_MESSAGE_EVENTS, eventIds }
};

export const setMessages = (eventId: string, messages: any[], numMessages: number) => {
    return { type: Constants.SET_MESSAGES, eventId, messages, numMessages }
};
