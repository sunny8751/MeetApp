import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
// import { addFriends, removeFriends } from '../actions/Actions';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import database from '../database/Database';
import _ from 'lodash';

export interface InvitedListProps {
}

class InvitedList extends React.Component<InvitedListProps | any> {
    colorScheme: any;
    invited: string[];
    eventId: string;
    
    constructor(props) {
        super(props);
        this.isMe = this.isMe.bind(this);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.selectFriend = this.selectFriend.bind(this);
        this.colorScheme = Styles.defaultColorScheme;

        ({ invited: this.invited, eventId: this.eventId } = this.props.navigation.state.params);
    }

    async handleOnFinish() {
        // this.props.navigation.navigate('InviteFriends');
        const { events } = this.props;
        this.props.navigation.navigate('InviteFriends', { eventId: this.eventId, event: events[this.eventId], handleAfterFinish: () => this.props.navigation.pop(1) },
            this.props.navigation.goBack())
    }

    selectFriend(friendId) {
        console.log('select', friendId);
        const friend = this.props.users[friendId];
        this.props.navigation.navigate('ProfileModal', {userId: friendId, user: friend, colorScheme: this.colorScheme});
    }

    isMe(friendId) {
        return friendId === this.props.myId;
    }

    getInvitedMembers() {
        const { users } = this.props;
        const sortByName = (a, b) => {
            const aName = users[a].firstName + ' ' + users[a].lastName;
            const bName = users[b].firstName + ' ' + users[b].lastName;
            return (aName > bName) ? 1 : ((bName > aName) ? -1 : 0);
        };
        // TODO selected element should be status (GOING, MAYBE, NOT GOING)
        return (
            this.invited.filter((invitedId) => !this.isMe(invitedId)).sort(sortByName).map((invitedId: string) => {
                const invitedUser = users[invitedId];
                console.log(invitedUser);
                return (
                    <FriendSelect
                        user={invitedUser}
                        // onPress={() => selected ? this.removeFriend(friendId) : this.addFriend(friendId)}
                        selected={true}
                        key={invitedId}
                        onPress={() => this.selectFriend(invitedId)}
                        selectedElement={
                            // <Card style={[Styles.headerButton, Styles.horizontalLayout, {padding: 10, marginBottom: 0, marginRight: 0, marginLeft: 0, backgroundColor: Styles.colors.red}]}>
                            //     <AntDesign name="deleteuser" size={20} style={{ paddingRight: 4 }}/>
                            //     <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Remove</Text>
                            // </Card>
                            <View />
                        }
                    />);
            })
        );
    }

    render() {
        return (
            <Container
                navigation={this.props.navigation}
                title={"Invited Members"}
                finishComponent={ <Text style={Styles.headerFinishComponent}>Add</Text> }
                onFinish={this.handleOnFinish}
            >
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    {this.getInvitedMembers()}
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
    // addFriends,
    // removeFriends
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InvitedList));