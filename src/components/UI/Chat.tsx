import * as React from 'react'
import { Platform } from 'react-native';
import * as Styles from '../../styles/Styles';
import { connect } from 'react-redux';
import { addMessages, removeMessageEvents, setMessages } from '../../actions/Actions';
// import PropTypes from 'prop-types';
import * as Constants from '../../constants/Constants';
import { GiftedChat } from 'react-native-gifted-chat';
import emojiUtils from 'emoji-utils';
import { View } from './';
import ChatMessage from './ChatMessage';
import database from '../../database/Database';

export interface ChatProps {
    eventId: string,
}

class Chat extends React.Component<ChatProps | any> {

    listenerUnsubscriber: any;
    isLoadingEarlier = false;

    constructor(props) {
        super(props);
        this.formatMessages = this.formatMessages.bind(this);
        this.listener = this.listener.bind(this);
        this.handleLoadEarlier = this.handleLoadEarlier.bind(this);
        this.state = {
            refresh: false,
        };
    } 

    componentDidUpdate(prevProps) {
        if(this.props.messages != prevProps.messages) {
            this.setState(prevState => ({refresh: !prevState.refresh}));
        }
    }

    componentWillUnmount() {
        this.listenerUnsubscriber();

        const { eventId, setMessages } = this.props;
        const { messages, numMessages } = this.props.messages[eventId];
        setMessages(eventId, messages.slice(0, Constants.START_NUM_MESSAGES), numMessages);
    }

    async componentWillMount() {
        const { eventId, setMessages } = this.props;
        if (!(eventId in this.props.messages)) {
            const { messages, numMessages } = await database.getMessages(eventId);
            setMessages(eventId, this.formatMessages(messages.reverse(), numMessages), numMessages);
        }
        this.listenerUnsubscriber = await database.addMessagesListener(eventId, this.listener);
    }

    async listener(numMessages: number) {
        const { eventId, addMessages } = this.props;
        const currentNumMessages = this.props.messages[eventId].numMessages;
        const { messages: newMessages } = await database.getMessages(eventId, numMessages - currentNumMessages);
        addMessages(eventId, this.formatMessages(newMessages.reverse(), numMessages));

        // GiftedChat.append(this.props.messages[eventId].messages, newMessages)
    }

    formatMessages(messages: any[], numMessages: number, reverseIndices=false) {
        const { eventId, friends, myId, firstName, lastName, avatar } = this.props;
        return messages.map(({senderId, text, createdAt}, index) => {
            const sender = senderId === myId ? {firstName, lastName, avatar} : friends[senderId];
            const messageId = reverseIndices ? 
                1 + index - numMessages :
                numMessages - index - 1 - (this.props.messages[eventId] ? this.props.messages[eventId].messages.length : 0);
            return {
                _id: messageId,
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

    onSend(newMessages = []) {
        const { eventId, addMessages } = this.props;
        for (const message of newMessages) {
            database.addMessage(eventId, {
                senderId: message.user._id,
                createdAt: message.createdAt,
                text: message.text
            });
        }
        addMessages(eventId, newMessages);
        // addMessages(eventId, GiftedChat.append(this.props.messages[eventId].messages, newMessages));
        // this.setState(previousState => ({
        //     messages: GiftedChat.append(previousState.messages, messages),
        // }));
    }

    async handleLoadEarlier() {
        if (this.isLoadingEarlier) {
            return;
        } else {
            this.isLoadingEarlier = true;

            const { eventId, addMessages } = this.props;
            const { messages: newMessages, numMessages } = await database.getMessages(eventId, Constants.START_NUM_MESSAGES, this.props.messages[eventId].messages.length);
            console.log('load earlier');
            addMessages(eventId, this.formatMessages(newMessages, numMessages, true), true);
            this.isLoadingEarlier = false;
        }
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
        const { myId, firstName, lastName, avatar, eventId } = this.props;

        if (!(eventId in this.props.messages)) {
            return <View />
        }

        const messages = this.props.messages[eventId].messages;
        return (
            <GiftedChat
                messages={messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: myId,
                    name: firstName + ' ' + lastName,
                    avatar: avatar
                }}
                renderMessage={this.renderMessage}
                listViewProps={{
                    keyboardShouldPersistTaps: 'handled',
                    keyboardDismissMode: 'on-drag',
                    onEndReached: this.handleLoadEarlier,
                    onEndReachedThreshold: 0,
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
      avatar: state.avatar,
      messages: state.messages,
    };
};
  
const mapDispatchToProps = {
    addMessages,
    removeMessageEvents,
    setMessages,
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);