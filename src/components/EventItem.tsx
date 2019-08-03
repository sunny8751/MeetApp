import * as React from 'react';
import * as Styles from '../styles/styles';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import { View, Text, Button, Card } from './UI';
import { getDarkerColor, getLighterColor, getTimeString, getTimeColor } from '../utils/Utils';

export interface EventItemProps {
    name: string,
    publicInvite: boolean,
    startDate?: Date,
    endDate?: Date,
    location?: string,
    description?: string,
    invited?: string[]
}

class EventItem extends React.Component<EventItemProps | any> {
    lightColor: string;
    mediumColor: string;
    darkColor: string;

    constructor(props) {
        super(props);
        this.getColorScheme = this.getColorScheme.bind(this);
        this.handleOnPress = this.handleOnPress.bind(this);

        this.mediumColor = this.getColorScheme();
        this.lightColor = getLighterColor(this.mediumColor);
        this.darkColor = getDarkerColor(this.mediumColor);
    }

    getColorScheme() {
        const colorSchemes = Styles.colorSchemes;
        return colorSchemes[moment(this.props.startDate).date() % colorSchemes.length];
    }

    handleOnPress() {
        this.props.navigation.navigate('EventOverview', {...this.props, colorScheme: this.mediumColor});
    }

    render() {
        const {name, publicInvite, startDate, endDate, location, description, invited} = this.props;
        return (
            <Button onPress={this.handleOnPress}>
                <Card backgroundColor={this.lightColor} style={Styles.horizontalLayout}>
                    <View style={Styles.flex}>
                        <Text style={[Styles.cardHeaderText, {color: this.darkColor}]}>{name}</Text>
                        {/* {subheader && <Text style={[Styles.cardSubheaderText, {color: this.mediumColor}]}>{subheader}</Text>} */}
                        {location && <Text style={[Styles.cardLocationText, {color: this.mediumColor}]}>{location}</Text>}
                        <Text style={[Styles.cardLocationText, {color: getTimeColor(startDate)}]}>{getTimeString(startDate, endDate)}</Text>
                    </View>
                    <Feather name="chevron-right" size={40} color={this.darkColor} style={Styles.centerRight} />
                </Card>
            </Button>
        );
    }
}

export default withNavigation(EventItem);
