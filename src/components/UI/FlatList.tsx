import * as React from 'react';
import * as Styles from '../../styles/styles';
import {FlatList as FlatListRN} from 'react-native';

export interface FlatListProps {
    data: any;
    renderItem: (item) => JSX.Element;
}

class FlatList extends React.Component<FlatListProps | any> {
    render() {
        const { data, renderItem, ...rest } = this.props;
        return (
            <FlatListRN data={data} renderItem={renderItem} {...rest}>{this.props.children}</FlatListRN>
        );
    }
}

export default FlatList;
