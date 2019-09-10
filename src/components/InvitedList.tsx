import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import { addFriends, removeFriends } from '../actions/Actions';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import database from '../database/Database';
import _ from 'lodash';

export interface InvitedListProps {
}

class InvitedList extends React.Component<InvitedListProps | any> {
    static navigationOptions = {
        header: null,
    }

    colorScheme: any;
    
    constructor(props) {
        super(props);
        this.isFriend = this.isFriend.bind(this);
        this.isMe = this.isMe.bind(this);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.selectFriend = this.selectFriend.bind(this);
        this.colorScheme = Styles.defaultColorScheme;
    }

    async handleOnFinish() {
        this.props.navigation.goBack();
    }

    selectFriend(friendId) {
        console.log('select', friendId);
        const friend = this.props.friends[friendId]; // TODO may not be friend
        this.props.navigation.navigate('ProfileModal', {userId: friendId, user: friend, colorScheme: this.colorScheme});
    }

    isFriend(friendId) {
        return friendId in this.props.friends;
    }

    isMe(friendId) {
        return friendId === this.props.myId;
    }

    getFriendSuggestions() {
        const { suggestions } = this.state;
        return (
            Object.keys(suggestions).sort().map((friendId: string) => {
                // TODO: use user id instead
                const selected = this.isFriend(friendId);
                const friend = suggestions[friendId];
                return (
                    <FriendSelect
                        user={friend}
                        // onPress={() => selected ? this.removeFriend(friendId) : this.addFriend(friendId)}
                        selected={selected}
                        key={friendId}
                        onPress={() => this.selectFriend(friendId)}
                        selectedElement={
                            <Button onPress={() => this.removeFriend(friendId)}  style={Styles.center}>
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
        friends: state.friends,
    };
};

const mapDispatchToProps = {
    addFriends,
    removeFriends
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InvitedList));