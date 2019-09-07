import * as Styles from '../styles/styles';
// import pSBC from 'shade-blend-color';
import Color from 'color';
import moment from 'moment';

export const getDarkerColor = (color=Styles.colors.grey, colorMultiplier=0.2) => {
    // return pSBC(-colorMultiplier, color);
    // return Color(color).darken(colorMultiplier).hex();
    return Color(color).darken(colorMultiplier).hex();
}

export const getLighterColor = (color=Styles.colors.grey, colorMultiplier=0.2) => {
    // return Color(color).lighten(.2).hex();
    // return pSBC(colorMultiplier, color);
    return Color(color).lighten(colorMultiplier).hex();
}

export const getNextHour = () => {
    return moment().add(1, 'hour').startOf('hour').toDate();
}

export const getTimeString = (startDate: Date, endDate?: Date) => {
    const getString = (date) => Math.abs(moment.duration(moment(date).diff(moment())).asMinutes()) <= 1 ? 'Now' : moment(date).format('LT');
    const startString = getString(startDate);
    const endString = getString(endDate);
    return startString + (endDate && startString !== endString ? (' to ' + endString) : '');
}

export const getTimeColor = (date, hoursUntilTimeWarning = 2) => {
    const amount = moment.duration(moment(date).diff(moment())).asHours();
    return amount < hoursUntilTimeWarning ? Styles.colors.red : Styles.colors.green;
}

export const getFormattedTimeString = (date: Date) => {
    return moment(date).format("LT, MMM D");
}

export const getTimeElapsed = (start: Date, end: Date) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
    let str = "";
    if(duration.asDays() >= 1) {str = str + Math.floor(duration.asDays()) + "d ";}
    if(duration.hours() >= 1) {str = str + Math.floor(duration.hours()) + "h ";}
    if(duration.minutes() >= 1) {str = str + Math.floor(duration.minutes()) + "m ";}
    return str;
}

