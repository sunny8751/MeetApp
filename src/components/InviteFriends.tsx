import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
// import { addEvent } from '../actions/Actions';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import database from '../database/Database';
import { getFriends, isMe } from '../utils/Utils';

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
}

class InviteFriends extends React.Component<InviteFriendsProp | any> {
    event: any;
    eventId: string;
    handleAfterFinish: () => {};
    colorScheme: any;

    _isMounted = false;
    
    constructor(props) {
        super(props);
        this.isFinished = this.isFinished.bind(this);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.getFriendSuggestions = this.getFriendSuggestions.bind(this);
        this.selectFriend = this.selectFriend.bind(this);
        this.addInvite = this.addInvite.bind(this);
        this.removeInvite = this.removeInvite.bind(this);
        this.updateFriendSuggestions = this.updateFriendSuggestions.bind(this);

        ({ event: this.event, eventId: this.eventId, handleAfterFinish: this.handleAfterFinish } = this.props.navigation.state.params);
        this.state = {
            invited: this.event && this.event.invited ? this.event.invited : [],
            searchText: '',
            suggestions: {}
        };
        this.colorScheme = Styles.defaultColorScheme;
    }

    componentDidMount() {
        this._isMounted = true;
        this.updateFriendSuggestions(undefined);
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    isFinished() {
        return true;
        // return Object.keys(this.state['invited']).length > 0;
        // return this.state['invited'].length > 0;
    }

    async handleOnFinish() {
        if (!this.isFinished()) { return; }
        console.log("Add event");
        const originalEventId = this.eventId;
        // const originalEvent = this.event;
        // const { myId } = this.props;
        // const event = {
        //     ...(originalEvent || {}),
        //     invited: this.state.invited
        // };
        const eventId = originalEventId ? originalEventId : await database.addEvent({
            ...this.event,
            invited: []
        });
        // await database.removeFriendInvites(eventId, originalEvent.invited.filter(friendId => event.invited.indexOf(friendId) === -1));
        // if (!originalEventId) {
        //     console.log('adding myself', originalEventId)
        //     await database.addFriendInvite(eventId, myId);
        // }
        // for (const friendId of event.invited) {
        //     if (originalEvent.invited.indexOf(friendId) === -1) {
        //         await database.addFriendInvite(eventId, friendId);
        //     }
        // }
        await database.updateFriendInvites(eventId, this.state.invited);
        // for (const friendId of originalEvent.invited) {
        //     if (!(friendId in event.invited)) {
        //         await database.removeFriendInvite(eventId, friendId);
        //     }
        // }
        // this.props.addEvents({ [eventId]: event });
        // this.props.navigation.popToTop({immediate: true});
        // this.props.navigation.pop(1);
        if (this.handleAfterFinish) {
            this.handleAfterFinish();
        }
    }

    handleChangeText(text) {
        this.setState({searchText: text});
        this.updateFriendSuggestions(text);
    }

    addInvite(friendId: string) {
        this.setState((prevState) => {
            return {
                // invited: { ...prevState['invited'], friend: true }
                invited: prevState['invited'].concat(friendId)
            }
        });
    };

    removeInvite(friendId: string) {
        this.setState((prevState) => {
            return {
                invited: prevState['invited'].filter(i => i != friendId)
            }
        });
    };

    selectFriend(friendId) {
        console.log('select', friendId);
        const friend = this.props.users[friendId]; // TODO may not be friend
        this.props.navigation.navigate('ProfileModal', {userId: friendId, user: friend, colorScheme: this.colorScheme});
    }

    async updateFriendSuggestions(friendId) {
        let suggestions;
        if (friendId) {
            const friend = await database.getUser(friendId);
            if (!friend || isMe(friendId)) {
                // no results for friendId
                return;
            }
            suggestions = {
                [friendId]: friend
            }
        } else {
            // auto recommendations
            const friends = getFriends();
            if (this.eventId) {
                const invited = this.state.invited;
                const users = this.props.users;
                suggestions = invited.concat(Object.keys(friends)).filter(id => !isMe(id)).reduce(function(suggestions, id) {
                    suggestions[id] = users[id];
                    return suggestions;
                }, {});
            } else {
                suggestions = friends;
            }
        }
        if (this._isMounted) { // && friendId === this.state.searchText
            this.setState({
                suggestions: suggestions
            });
        }
    }

    getFriendSuggestions() {
        const { suggestions, invited } = this.state;
        return (
            Object.keys(suggestions).sort().map((friendId: string) => {
                // TODO: use user id instead
                const friend = suggestions[friendId];
                const selected = invited.indexOf(friendId) !== -1;
                return (
                    <FriendSelect
                        user={friend}
                        onPress={() => this.selectFriend(friendId)}
                        selected={selected}
                        key={friendId}
                        selectedElement={
                            <Button onPress={() => this.removeInvite(friendId)}  style={Styles.center}>
                                <Card style={[Styles.headerButton, Styles.horizontalLayout, {padding: 10, marginBottom: 0, marginRight: 0, marginLeft: 0, backgroundColor: Styles.colors.red}]}>
                                    <AntDesign name="deleteuser" size={20} style={{ paddingRight: 4 }}/>
                                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Remove</Text>
                                </Card>
                            </Button>
                        }
                        unselectedElement={
                            <Button onPress={() => this.addInvite(friendId)}  style={Styles.center}>
                                <Card style={[Styles.headerButton, Styles.horizontalLayout, {padding: 10, marginBottom: 0, marginRight: 0, marginLeft: 0, backgroundColor: Styles.colors.green}]}>
                                    <AntDesign name="adduser" size={20} style={{ paddingRight: 4 }}/>
                                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Add</Text>
                                </Card>
                            </Button>
                        }
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
                        placeholderTextColor={Styles.colors.grey}
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
        users: state.users,
        events: state.events
    };
};

const mapDispatchToProps = {
    // addEvent,
    // setEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InviteFriends));