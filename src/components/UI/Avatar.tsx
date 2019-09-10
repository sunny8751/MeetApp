import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
// import {Image} from 'react-native';
import { CachedImage as Image } from 'react-native-cached-image';
import * as Constants from '../../constants/Constants';
import { TextInputCard, Card, Container, View, Text, Header, Button } from './';
import * as Styles from '../../styles/styles';

export interface AvatarProps {
    source?: string;
    size?: number;
    backgroundColor?: string;
    style?: any;
}

class Avatar extends React.Component<AvatarProps | any> {
    static defaultProps = {
        source: Constants.DEFAULT_AVATAR,
        size: 200,
        backgroundColor: Styles.defaultColorScheme.lightColor
    }

    render() {
        const { source, size, backgroundColor } = this.props;
        const style = [Styles.verticalCenter, Styles.horizontalCenter, this.props.style, { width: size, height: size, borderRadius: size / 2, backgroundColor: backgroundColor }]
        return (
            <View style={style}>
                {/* {source ? ( */}
                    <Image
                        source={{uri: source}}
                        style={style}
                    />
                {/* ) : (
                    <AntDesign
                        name={"user"}
                        size={size * .8}
                        borderRadius={size / 2}
                        backgroundColor={backgroundColor}
                    />
                )} */}
            </View>
            
        );
    }
}

export default Avatar;


