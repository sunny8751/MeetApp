import * as React from 'react';
import * as Styles from '../../styles/styles';
import { getDarkerColor, getLighterColor } from '../../utils/Utils';
import { View } from './';

export interface CardProps {
    backgroundColor?: string
}

class Card extends React.Component<CardProps | any> {
    render() {
        const { backgroundColor, style, ...rest } = this.props;
        return (
            <View style={[Styles.cardContainer, {backgroundColor: backgroundColor || getLighterColor(Styles.colors.grey)}, style]} {...rest}>
                {this.props.children}
            </View>
        );
    }
}

export default Card;
