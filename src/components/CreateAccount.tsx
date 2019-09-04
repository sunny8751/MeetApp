import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import * as Constants from './../constants/Constants';
import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import Profile from './Profile';
import { Avatar, TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database from '../database/Database';

export interface CreateAccountProps {
}

class CreateAccount extends React.Component<CreateAccountProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.createAccount = this.createAccount.bind(this);
    }

    async createAccount(avatarFile, firstName, lastName, username, password) {
        console.log('createAccount');
        const { setMyId, setFirstName, setLastName, setAvatar, setFriends, setEvents } = this.props;
        try {
            const userId = await database.createAccount(username, password);
            const avatar = (avatarFile === Constants.DEFAULT_AVATAR) ? avatarFile : await database.uploadProfilePicture(avatarFile, userId);
            await database.addUser(userId, {
                firstName,
                lastName,
                friends: [],
                events: [],
                avatar
            });
            setMyId(userId);
            setFirstName(firstName);
            setLastName(lastName);
            setAvatar(avatar);
            setFriends([]);
            setEvents([]);
        } catch(err) {
            alert(err);
            return;
        }

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'MyEvents' }) })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <Profile
                title={"Create Account"}
                handleFinish={this.createAccount}
                finishText={"Create Account"}
                initialUsername={this.props.navigation.getParam('username', '')}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};
  
const mapDispatchToProps = {
    setMyId,
    setFirstName,
    setLastName,
    setAvatar,
    setFriends,
    setEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(CreateAccount));