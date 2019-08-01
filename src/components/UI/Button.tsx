import * as React from 'react';
import * as Styles from '../../styles/styles';
import {TouchableHighlight} from 'react-native';

export interface ButtonProps {
    onPress: (e) => void;
}

class Button extends React.Component<ButtonProps | any> {
    render() {
        const {onPress, ...rest} = this.props;
        return (
            <TouchableHighlight onPress={(e) => onPress(e)} underlayColor='none' {...rest}>
                {this.props.children}
            </TouchableHighlight>
        );
    }
}

export default Button;
