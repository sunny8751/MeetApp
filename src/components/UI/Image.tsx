import * as React from 'react';
import * as Styles from '../../styles/styles';
import {Image as ImageRN} from 'react-native';
import { CachedImage } from 'react-native-cached-image';

export interface ImageProps {
    source: any;
    style?: any;
}

class Image extends React.Component<ImageProps> {
    render() {
        const { source, children, ...rest } = this.props;
        return (
            <CachedImage source={source} {...rest}>{children}</CachedImage>
        );
    }
}

export default Image;

