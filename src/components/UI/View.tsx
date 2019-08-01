import * as React from 'react';
import * as Styles from '../../styles/styles';
import {View as ViewRN} from 'react-native';

class View extends React.Component<any> {
    render() {
        return (
            <ViewRN {...this.props}>{this.props.children}</ViewRN>
        );
    }
}

export default View;
