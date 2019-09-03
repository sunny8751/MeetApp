import * as Constants from '../constants/Constants';

export const increment = () => {
    return { type: Constants.INCREMENT }
};

export const decrement = () => {
    return { type: Constants.DECREMENT }
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

