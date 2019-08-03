import * as React from 'react';
import * as Styles from '../../styles/styles';
import {TextInput as TextInputRN} from 'react-native';

class TextInput extends React.Component<any> {
    render() {
        return (
            <TextInputRN style={Styles.text} {...this.props}>{this.props.children}</TextInputRN>
        );
    }
}

export default TextInput;

