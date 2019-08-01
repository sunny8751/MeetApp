import * as React from 'react';
import * as Styles from '../../styles/styles';
import { View } from 'react-native';
import pSBC from 'shade-blend-color';
import { Text } from './';

const COLOR_MULTIPLIER_LIGHTER = 0.8;
const COLOR_MULTIPLIER_DARKER = 0.4;

export interface CardProps {
    header: string,
    subheader?: string,
    time: string,
    timeColor: string,
    location?: string
    icon?: JSX.Element,
    colorTheme?: string
}

class Card extends React.Component<CardProps> {
    static defaultProps = {
        colorTheme: Styles.colors.silver
    }

    lightColor: string;
    mediumColor: string;
    darkColor: string;

    constructor(props) {
        super(props);

        this.mediumColor = this.props.colorTheme;
        this.lightColor = pSBC(COLOR_MULTIPLIER_LIGHTER, this.mediumColor);
        this.darkColor = pSBC(-COLOR_MULTIPLIER_DARKER, this.mediumColor);
    }

    render() {
        const {header, subheader, time, timeColor, location, icon} = this.props;
        return (
            <View style={[Styles.cardContainer, {backgroundColor: this.lightColor}]}>
                <View style={Styles.flex}>
                    <Text style={[Styles.cardHeaderText, {color: this.darkColor}]}>{header}</Text>
                    {subheader && <Text style={[Styles.cardSubheaderText, {color: this.mediumColor}]}>{subheader}</Text>}
                    {location && <Text style={[Styles.cardLocationText, {color: this.mediumColor}]}>{location}</Text>}
                    <Text style={[Styles.cardLocationText, {color: timeColor}]}>{time}</Text>
                </View>
                {React.cloneElement(icon, {size: 40, color: this.darkColor, style: Styles.centerRight})}
            </View>
        );
    }
}

export default Card;
