import * as Styles from '../styles/styles';
import pSBC from 'shade-blend-color';
import moment from 'moment';

export const getDarkerColor = (color=Styles.colors.grey, colorMultiplier=0.4) => {
    return pSBC(-colorMultiplier, color);
}

export const getLighterColor = (color=Styles.colors.grey, colorMultiplier=0.8) => {
    return pSBC(colorMultiplier, color);
}

export const getNextHour = () => {
    return moment().add(1, 'hour').startOf('hour').toDate();
}

export const getTimeString = (startDate: Date, endDate?: Date) => {
    const getString = (date) => moment.duration(moment(date).diff(moment())).asMinutes() <= 1 ? 'Now' : moment(date).format('LT');
    return getString(startDate) + (endDate ? (' to ' + getString(endDate)) : '');
}

export const getTimeColor = (date, hoursUntilTimeWarning = 2) => {
    const amount = moment.duration(moment(date).diff(moment())).asHours();
    return amount < hoursUntilTimeWarning ? Styles.colors.red : Styles.colors.green;
}