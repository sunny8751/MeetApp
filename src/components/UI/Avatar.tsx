import * as React from 'react';
import { AntDesign } from '@expo/vector-icons';
// import {Image} from 'react-native';
import * as Constants from '../../constants/Constants';
import { Image, Card, Container, View, Text, Header, Button } from './';
import * as Styles from '../../styles/styles';

export interface AvatarProps {
    user?: any;
    size?: number;
    backgroundColor?: string;
    style?: any;
}

class Avatar extends React.Component<AvatarProps | any> {
    static defaultProps = {
        // source: Constants.DEFAULT_AVATAR,
        size: 200,
        backgroundColor: Styles.defaultColorScheme.lightColor
    }

    render() {
        const { user, size, backgroundColor } = this.props;
        const { avatar, firstName, lastName } = user;
        let initials = '';
        let source = avatar;
        if (!avatar && firstName && lastName) {
            initials = firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
        } else if (!avatar && (!firstName || !lastName)) {
            source = Constants.DEFAULT_AVATAR;
        }
        const style = [Styles.verticalCenter, Styles.horizontalCenter, this.props.style, { width: size, height: size, borderRadius: size / 2, backgroundColor: backgroundColor, borderWidth: 2, borderColor: 'white' }]
        return (
            <View style={style}>
                {source ? (
                    <Image
                        source={{uri: source}}
                        style={style}
                    />
                ) : (
                    // <AntDesign
                    //     name={"user"}
                    //     size={size * .8}
                    //     borderRadius={size / 2}
                    //     backgroundColor={backgroundColor}
                    // />
                    <Text style={[Styles.text, {fontSize: size / 2, textAlign: 'center', }]}>{initials}</Text>
                )}
            </View>
            
        );
    }
}

export default Avatar;


