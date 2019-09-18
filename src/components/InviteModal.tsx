import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
// import { removeEvents, updateEvent } from '../actions/Actions';
import { AntDesign } from '@expo/vector-icons';
import { addEvent } from '../actions/Actions';
import { Modal, Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import database from '../database/Database';
import { getFriends } from '../utils/Utils';

export interface InviteModalProps {

}

class InviteModal extends React.Component<InviteModalProps | any> {
    eventId: string;
    colorScheme: any;
    invited: string[];

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.getFriendSuggestions = this.getFriendSuggestions.bind(this);
        this.selectFriend = this.selectFriend.bind(this);
        this.addInvite = this.addInvite.bind(this);
        this.removeInvite = this.removeInvite.bind(this);

        ({ invited: this.invited, eventId: this.eventId, colorScheme: this.colorScheme } = this.props.navigation.state.params);

        this.state = {
            invited: this.invited ? this.invited : [],
            searchText: '',
        };
    }

    closeModal() {
        this.props.navigation.goBack();
    }

    handleChangeText(text) {
        this.setState({searchText: text});
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

    getFriendSuggestions() {
        const suggestionIds = Object.keys(getFriends()).sort();

        return (
            suggestionIds.map((friendId: string) => {
                // TODO: use user id instead
                const selected = this.state['invited'].indexOf(friendId) !== -1;
                const friend = this.props.users[friendId];
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
        return (
            <Modal
                title={"Invite"}
                handleClose={this.closeModal}
                colorScheme={this.colorScheme}
                flexSize={0}
                topFlexSize={1}
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
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    };
};
  
const mapDispatchToProps = {
    // removeEvents, updateEvent
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InviteModal));