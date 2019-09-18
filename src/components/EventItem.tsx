import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
// import { addEvent, setEvents } from '../actions/Actions';
import { View, Text, Button, Card } from './UI';
import { getTimeString, getTimeColor } from '../utils/Utils';

export interface EventItemProps {
    // name: string,
    // publicInvite: boolean,
    // startDate?: Date,
    // endDate?: Date,
    // location?: string,
    // description?: string,
    // invited?: string[]
    eventId: string
}

class EventItem extends React.Component<EventItemProps | any> {
    colorScheme: any;

    constructor(props) {
        super(props);
        this.getColorScheme = this.getColorScheme.bind(this);
        this.handleOnPress = this.handleOnPress.bind(this);

        this.colorScheme = this.getColorScheme();
    }

    getColorScheme() {
        const { events, eventId } = this.props;
        const colorSchemes = Styles.colorSchemes;
        return colorSchemes[moment(events[eventId].startDate).date() % colorSchemes.length];
    }

    handleOnPress() {
        this.props.navigation.navigate('EventOverview', {eventId: this.props.eventId, colorScheme: this.colorScheme});
    }

    render() {
        const { events, eventId } = this.props;
        const {name, publicInvite, startDate, endDate, location, description, invited} = events[eventId];
        return (
            <Button onPress={this.handleOnPress}>
                <Card backgroundColor={this.colorScheme.lightColor} style={Styles.horizontalLayout}>
                    <View style={Styles.flex}>
                        <Text style={[Styles.cardHeaderText, {color: this.colorScheme.darkColor}]}>{name}</Text>
                        {/* {subheader && <Text style={[Styles.cardSubheaderText, {color: this.mediumColor}]}>{subheader}</Text>} */}
                        {location ? <Text style={[Styles.cardLocationText, {color: this.colorScheme.mediumColor}]}>{location}</Text> : <View/>}
                        <Text style={[Styles.cardLocationText, {color: getTimeColor(startDate)}]}>{getTimeString(startDate, endDate)}</Text>
                    </View>
                    <Feather name="chevron-right" size={40} color={this.colorScheme.darkColor} style={Styles.centerRight} />
                </Card>
            </Button>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      events: state.events
    };
};

const mapDispatchToProps = {
    // addEvents,
    // setEvents
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(EventItem));