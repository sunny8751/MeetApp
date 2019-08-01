import * as React from 'react';
import * as Styles from '../../styles/styles';
import {Text as TextRN} from 'react-native';

class Text extends React.Component<any> {
    render() {
        return (
            <TextRN style={Styles.text} {...this.props}>{this.props.children}</TextRN>
        );
    }
}

export default Text;

