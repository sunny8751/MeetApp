import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { addEvents } from '../actions/Actions';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import database from '../database/Database';

// const users = {
//     1: {
//         name: 'Bob',
//         avatar: 'https://placeimg.com/140/140/any'
//     },
//     2: {
//         name: 'Dylan',
//         avatar: 'https://placeimg.com/140/140/any'
//     }
// }

// navigation parameters: event, eventId

export interface InviteFriendsProp {
    newEvent?: boolean;
}

class InviteFriends extends React.Component<InviteFriendsProp | any> {
    static navigationOptions = {
        header: null,
    }
    
    constructor(props) {
        super(props);
        this.isFinished = this.isFinished.bind(this);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.getFriendSuggestions = this.getFriendSuggestions.bind(this);
        this.handleSelectFriend = this.handleSelectFriend.bind(this);

        const { event } = this.props.navigation.state.params;
        this.state = {
            invited: event && event.invited ? event.invited : [],
            searchText: '',
        };
        console.log('beginning invited', event && event.invited ? event.invited : []);
    }

    isFinished() {
        return true;
        // return Object.keys(this.state['invited']).length > 0;
        // return this.state['invited'].length > 0;
    }

    async handleOnFinish() {
        if (!this.isFinished()) { return; }
        console.log("Add event");
        const { eventId: originalEventId, event: originalEvent } = this.props.navigation.state.params;
        const { myId } = this.props;
        const event = {
            ...(originalEvent || {}),
            invited: this.state.invited
        };
        const eventId = originalEventId ? originalEventId : await database.addEvent(event);
        await database.removeFriendInvites(eventId, originalEvent.invited.filter(friendId => event.invited.indexOf(friendId) === -1));
        if (!originalEventId) {
            console.log('adding myself', originalEventId)
            await database.addFriendInvite(eventId, myId);
        }
        for (const friendId of event.invited) {
            if (originalEvent.invited.indexOf(friendId) === -1) {
                await database.addFriendInvite(eventId, friendId);
            }
        }
        // for (const friendId of originalEvent.invited) {
        //     if (!(friendId in event.invited)) {
        //         await database.removeFriendInvite(eventId, friendId);
        //     }
        // }
        this.props.addEvents({ [eventId]: event });
        this.props.navigation.popToTop({immediate: true});
    }

    handleChangeText(text) {
        this.setState({searchText: text});
    }


    handleSelectFriend(friendId: string, selected: boolean) {
        this.setState((prevState) => {
            let invited = prevState['invited'];
            if(selected) {
                return {
                    invited: invited.filter(i => i != friendId)
                }
            } else {
                return {
                    // invited: { ...prevState['invited'], friend: true }
                    invited: invited.concat(friendId)
                }
            }
        });
    };

    getFriendSuggestions() {
        const suggestionIds = Object.keys(this.props.friends).sort();

        return (
            suggestionIds.map((friendId: string) => {
                // TODO: use user id instead
                const selected = this.state['invited'].indexOf(friendId) !== -1;
                const friend = this.props.friends[friendId];
                return (
                    <FriendSelect
                        user={friend}
                        onPress={() => this.handleSelectFriend(friendId, selected)}
                        selected={selected}
                        key={friendId}
                    />);
            })
        );
    }

    render() {
        const finishComponentStyle = [Styles.headerFinishComponent, this.isFinished() ? {} : {color: Styles.defaultColorScheme.mediumColor}]
        return (
            <Container
                navigation={this.props.navigation}
                title={"Invite Friends"}
                finishComponent={ <Text style={finishComponentStyle}>Invite</Text> }
                onFinish={this.handleOnFinish}
            >
                <View style={[Styles.horizontalLayout, {padding: 15}]}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', paddingRight: 10}}>To:</Text>
                    <TextInput
                        style={{flex: 1, fontSize: 20}}
                        onChangeText={this.handleChangeText}
                        value={this.state.searchText}
                        placeholder={"Type to search..."}
                        autoCapitalize={"none"}
                    />
                </View>
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    {this.getFriendSuggestions()}
                </ScrollView>
            </Container>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {
        myId: state.myId,
        friends: state.friends,
        events: state.events
    };
};

const mapDispatchToProps = {
    addEvents,
    // setEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InviteFriends));