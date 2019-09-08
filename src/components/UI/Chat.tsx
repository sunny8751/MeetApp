import * as React from 'react'
import { Platform } from 'react-native';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';

import ChatMessage from './ChatMessage';
import database from '../../database/Database';

export interface ChatProps {
    eventId: string,
}

class Chat extends React.Component<ChatProps | any> {

    constructor(props) {
        super(props);
        this.formatMessages = this.formatMessages.bind(this);
        this.state = {
            messages: []
        }
    }

    formatMessages(messages) {
        const { friends, myId, firstName, lastName, avatar } = this.props;
        return messages.map(({senderId, text, createdAt}) => {
            const sender = senderId === myId ? {firstName, lastName, avatar} : friends[senderId];
            console.log('sender', friends, senderId, sender);
            return {
                _id: createdAt.getTime().toString() + senderId,
                text,
                createdAt,
                user: {
                    _id: senderId,
                    name: sender.firstName + ' ' + sender.lastName,
                    avatar: sender.avatar
                }
            }
        });
    }

    async componentWillMount() {
        // this.setState({
        //     messages: [{
        //         _id: 1,
        //         text: 'I heard this place is really good!!',
        //         createdAt: new Date(),
        //         user: {
        //             _id: 2,
        //             name: 'Bob',
        //             avatar: 'https://placeimg.com/140/140/any',
        //         },
        //     }],
        // })

        const { eventId } = this.props;
        console.log('retrieve', eventId, await database.getMessages(eventId));
        this.setState({
            messages: this.formatMessages(await database.getMessages(eventId))
        });
    }

    onSend(messages = []) {
        const { eventId } = this.props;
        for (const message of messages) {
            database.addMessage(eventId, {
                senderId: message.user._id,
                createdAt: message.createdAt,
                text: message.text
            });
        }
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
    }

    renderMessage(props) {
        const { currentMessage: { text: currText } } = props;

        let messageTextStyle;

        // Make "pure emoji" messages much bigger than plain text.
        if (currText && emojiUtils.isPureEmojiString(currText)) {
            messageTextStyle = {
                fontSize: 28,
                // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            };
        }

        return (
            <ChatMessage {...props} messageTextStyle={messageTextStyle} />
        );
    }

    render() {
        const { myId, firstName, lastName, avatar } = this.props;
        return (
            <GiftedChat
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: myId,
                    name: firstName + ' ' + lastName,
                    avatar: avatar
                }}
                renderMessage={this.renderMessage}
                listViewProps={{
                    keyboardShouldPersistTaps: 'handled',
                    keyboardDismissMode: 'on-drag'
                }}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
      friends: state.friends,
      myId: state.myId,
      firstName: state.firstName,
      lastName: state.lastName,
      avatar: state.avatar
    };
};
  
const mapDispatchToProps = {
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);