import * as React from 'react';
import * as Styles from '../../styles/styles';
import {ScrollView as ScrollViewRN, Platform, Keyboard} from 'react-native';

export interface ScrollViewProps {
}

class ScrollView extends React.Component<ScrollViewProps | any> {
    render() {
        return (
            <ScrollViewRN keyboardShouldPersistTaps={'handled'} keyboardDismissMode={'on-drag'} {...this.props}>{this.props.children}</ScrollViewRN>
        );
    }
}

export default ScrollView;
