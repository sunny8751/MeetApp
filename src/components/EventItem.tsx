import * as React from 'react';
import * as Styles from '../styles/styles';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import { View, Button, Card } from './UI';

const HOURS_UNTIL_TIME_WARNING = 2;

export interface EventItemProps {
    name: string,
    publicInvite: boolean,
    startDate: Date,
    endDate?: Date,
    location?: string,
    description?: string,
    invited?: string[]
}

class EventItem extends React.Component<EventItemProps | any> {
    constructor(props) {
        super(props);
        this.getColorScheme = this.getColorScheme.bind(this);
        this.getTime = this.getTime.bind(this);
        this.getTimeColor = this.getTimeColor.bind(this);
        this.handleOnPress = this.handleOnPress.bind(this);
    }

    getColorScheme() {
        const colorSchemes = Styles.colorSchemes;
        return colorSchemes[moment(this.props.startDate).date() % colorSchemes.length];
    }

    getTime(date: Date) {
        return moment.duration(moment(date).diff(moment())).asMinutes() <= 1 ? 'Now' : moment(date).format('LT');;
    }

    getTimeColor() {
        const date = this.props.startDate;
        const amount = moment.duration(moment(date).diff(moment())).asHours();
        return amount < HOURS_UNTIL_TIME_WARNING ? Styles.colors.red : Styles.colors.green;
    }

    handleOnPress() {
        this.props.navigation.navigate('EventOverview');
    }

    render() {
        const {name, publicInvite, startDate, endDate, location, description, invited} = this.props;
        const time = this.getTime(startDate) + (endDate ? ' to ' + this.getTime(endDate) : '');
        return (
            <Button onPress={this.handleOnPress}>
                <Card
                    header={name}
                    time={time}
                    timeColor={this.getTimeColor()}
                    location={location}
                    colorTheme={this.getColorScheme()}
                    icon={<Feather name="chevron-right"/>}
                />
            </Button>
        );
    }
}

export default withNavigation(EventItem);
