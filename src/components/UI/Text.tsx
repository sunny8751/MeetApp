import * as React from 'react';
import * as Styles from '../../styles/styles';
import {Text as TextRN} from 'react-native';

export interface TextProps {
    style?: any;
}

class Text extends React.Component<any> {
    render() {
        const { style, children, ...rest } = this.props;
        return (
            <TextRN style={[Styles.text, style]} {...rest}>{children}</TextRN>
        );
    }
}

export default Text;

