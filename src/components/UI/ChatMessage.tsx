import PropTypes from 'prop-types';
import React from 'react';
import {
    ViewPropTypes,
    StyleSheet,
} from 'react-native';
import { View, Avatar } from './';
import { Day, utils } from 'react-native-gifted-chat';
import ChatBubble from './ChatBubble';
import Button from './Button';

const { isSameUser, isSameDay } = utils;

class ChatMessage extends React.Component {

    getInnerComponentProps() {
        const { containerStyle, ...props } = this.props;
        return {
            ...props,
            position: 'left',
            renderAvatarOnTop: true,
            isSameUser,
            isSameDay,
        };
    }

    renderDay() {
        if (this.props.currentMessage.createdAt) {
            const dayProps = this.getInnerComponentProps();
            if (this.props.renderDay) {
                return this.props.renderDay(dayProps);
            }
            return <Day {...dayProps} />;
        }
        return null;    
    }

    renderBubble() {
        const bubbleProps = this.getInnerComponentProps();
        if (this.props.renderBubble) {
            return this.props.renderBubble(bubbleProps);
        }
        return <ChatBubble {...bubbleProps} />;
    }

    renderAvatar() {
        let extraStyle;
        if (
            isSameUser(this.props.currentMessage, this.props.previousMessage)
            && isSameDay(this.props.currentMessage, this.props.previousMessage)
        ) {
            // Set the invisible avatar height to 0, but keep the width, padding, etc.
            extraStyle = { height: 0 };
        }

        const avatarProps = this.getInnerComponentProps();
        const {renderAvatarOnTop,
            showAvatarForEveryMessage,
            currentMessage,
            previousMessage,
            nextMessage,
            onPressAvatar,
        } = avatarProps;
        const messageToCompare = renderAvatarOnTop ? previousMessage : nextMessage;
        if (!showAvatarForEveryMessage &&
            currentMessage &&
            messageToCompare &&
            isSameUser(currentMessage, messageToCompare) &&
            isSameDay(currentMessage, messageToCompare)) {
            return (<View style={{paddingRight: 48}}/>);
        } else {
            return (
                <Button
                    style={{marginRight: 8, alignSelf: 'flex-start'}}
                    onPress={() => onPressAvatar(currentMessage.user._id)}
                >
                    <Avatar
                        source={currentMessage.user.avatar}
                        size={40}
                        // {...avatarProps}
                        // imageStyle={{ left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle] }}
                    />
                </Button>
            );
        }
    }

    render() {
        const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10;

        return (
            <View>
                {this.renderDay()}
                <View
                    style={[
                        styles.container,
                        { marginBottom },
                        this.props.containerStyle,
                    ]}
                >
                    {this.renderAvatar()}
                    {this.renderBubble()}
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: 8,
        marginRight: 0,
    },
    slackAvatar: {
        // The bottom should roughly line up with the first line of message text.
        height: 40,
        width: 40,
        borderRadius: 3,
    },
});

ChatMessage.defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
};

ChatMessage.propTypes = {
    renderAvatar: PropTypes.func,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
};

export default ChatMessage;
