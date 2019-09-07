import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Avatar, View, Text } from './';

export interface StackedAvatarProps {
    users: string[];
    maxNumber?: number;
    minMargin?: number;
}

class StackedAvatar extends React.Component<StackedAvatarProps | any> {
    constructor(props) {
        super(props);
        this.getStackedAvatar = this.getStackedAvatar.bind(this);

        this.state = {
            containerWidth: undefined,
            avatarWidth: 45
        }
    }

    static defaultProps = {
        minMargin: -30
    }

    getStackedAvatar() {
        const colorScheme = Styles.defaultColorScheme;
        const { users, maxNumber, minMargin } = this.props;
        // const users = {
        //     'id1': {
        //         avatar: 'https://firebasestorage.googleapis.com/v0/b/meetapp-8a9ab.appspot.com/o/avatars%2FHjC6uGv5jaRWOhDSeq59AD89GT52.jpg?alt=media&token=a3492985-f0b4-4947-9d2d-af826b6c4d9c'
        //     },
        //     'id2': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id3': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id4': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id5': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id6': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id7': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id8': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id9': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id10': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        //     'id11': {
        //         avatar: 'https://placeimg.com/140/140/any'
        //     },
        // }

        const userIds = Object.keys(users);
        const numShown = Math.min(userIds.length, maxNumber || Math.floor((this.state.containerWidth+minMargin)/(this.state.avatarWidth+minMargin)));
        
        let marginRight = 0;
        let overflowSize = numShown * this.state.avatarWidth - this.state.containerWidth;
        if (overflowSize > 0) {
            marginRight = overflowSize / (numShown - 1);
        }

        const stackedAvatarsElement = 
            userIds.slice(0, numShown).slice(0, numShown).reverse().map((userId: string) => {
                const user = users[userId];
                const { avatar } = user;
                return (
                    <View
                    // paddingLeft: 5
                        style={{marginRight: -marginRight}}
                        key={userId}
                    >
                        <Avatar
                            source={avatar}
                            size={this.state.avatarWidth}
                            style={{ borderWidth: 2, borderColor: 'white'}}
                            // onLayout={(event) => {
                            //     if (!this.state.avatarWidth) {
                            //         this.setState({
                            //             avatarWidth: event.nativeEvent.layout.width
                            //         });
                            //     }
                            // }}
                        />
                    </View>
                );
            });
        const numOverflowUsers = userIds.length - numShown;
        const overflowElement = (
            <View style={[Styles.verticalCenter, Styles.horizontalCenter, this.props.style, { width: this.state.avatarWidth, height: this.state.avatarWidth, borderRadius: this.state.avatarWidth / 2, backgroundColor: Styles.colors.lightGrey }]}>
                <Text style={Styles.cardHeaderText}>+{numOverflowUsers}</Text>
            </View>
        );
        return (
            <View style={[Styles.horizontalLayout]}>
                <View style={[Styles.horizontalLayout, {direction: 'rtl'}]}>
                    {stackedAvatarsElement}
                </View>
                
                {numOverflowUsers > 0 ? overflowElement : <View />}
            </View>
        );
    }
      
    render() {
        const { users, maxAvatars, style, ...rest } = this.props;
        return (
            <View
                style={[{flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', marginLeft: 50}, style]}
                onLayout={(event) => {
                    if (!this.state.containerWidth) {
                        this.setState({
                            containerWidth: event.nativeEvent.layout.width
                        });
                    }
                }}
                {...rest}
            >
                {this.getStackedAvatar()}
            </View>
        );
    }
}

export default StackedAvatar;
