import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
// import { addFriends, removeFriends } from '../actions/Actions';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import database from '../database/Database';
import _ from 'lodash';
import { getFriends, isMe } from '../utils/Utils';

export interface AddFriendsProps {
}

class AddFriends extends React.Component<AddFriendsProps | any> {
    _isMounted = false;
    colorScheme: any;
    
    constructor(props) {
        super(props);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.getFriendSuggestions = this.getFriendSuggestions.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.updateFriendSuggestions = this.updateFriendSuggestions.bind(this);
        this.selectFriend = this.selectFriend.bind(this);
        this.state = {
            searchText: '',
            suggestions: getFriends(),
            refresh: false
        };
        this.colorScheme = Styles.defaultColorScheme;
    }

    componentDidMount() {
        this._isMounted = true;
    }
    
    componentWillUnmount() {
        this._isMounted = false;
    }

    async handleOnFinish() {
        this.props.navigation.goBack();
    }

    handleChangeText(text) {
        this.setState({searchText: text});
        this.updateFriendSuggestions(text);
    }

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
            suggestions = getFriends();
        }
        if (this._isMounted) { // && friendId === this.state.searchText
            this.setState({
                suggestions: suggestions
            });
        }
    }

    addFriend(friendId: string, friend: any) {
        console.log('add', friendId);
        database.addFriend(this.props.myId, friendId, friend);
        // this.props.addFriends({[friendId]: friend});
    };

    removeFriend(friendId: string, friend: any) {
        console.log('remove', friendId);
        database.removeFriend(this.props.myId, friendId, friend);
        // this.props.removeFriends([friendId]);
    };

    componentDidUpdate(prevProps) {
        if(this.props.users != prevProps.users) {
            this.setState({refresh: !this.state.refresh});
        }
    } 

    getFriendSuggestions() {
        const { suggestions } = this.state;
        return (
            Object.keys(suggestions).sort().map((friendId: string) => {
                // TODO: use user id instead
                const friend = suggestions[friendId];
                const selected = friend.isFriend;
                return (
                    <FriendSelect
                        user={friend}
                        // onPress={() => selected ? this.removeFriend(friendId) : this.addFriend(friendId)}
                        selected={selected}
                        key={friendId}
                        onPress={() => this.selectFriend(friendId)}
                        selectedElement={
                            <Button onPress={() => this.removeFriend(friendId, friend)}  style={Styles.center}>
                                <Card style={[Styles.headerButton, Styles.horizontalLayout, {padding: 10, marginBottom: 0, marginRight: 0, marginLeft: 0, backgroundColor: Styles.colors.red}]}>
                                    <AntDesign name="deleteuser" size={20} style={{ paddingRight: 4 }}/>
                                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Remove</Text>
                                </Card>
                            </Button>
                        }
                        unselectedElement={
                            <Button onPress={() => this.addFriend(friendId, friend)}  style={Styles.center}>
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
        return (
            <Container
                navigation={this.props.navigation}
                title={"Add Friends"}
                finishComponent={ <Text style={Styles.headerFinishComponent}>Done</Text> }
                onFinish={this.handleOnFinish}
            >
                <View style={[Styles.horizontalLayout, {padding: 15}]}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', paddingRight: 10}}>To:</Text>
                    <TextInput
                        style={{flex: 1, fontSize: 20}}
                        onChangeText={this.handleChangeText}
                        value={this.state.searchText}
                        placeholder={"Type an email..."}
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
        // friends: state.friends,
        users: state.users
    };
};

const mapDispatchToProps = {
    // addFriends,
    // removeFriends
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(AddFriends));