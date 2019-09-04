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

export interface EditProfileProps {
}

class EditProfile extends React.Component<EditProfileProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.saveChanges = this.saveChanges.bind(this);
    }

    async saveChanges(avatarFile, firstName, lastName, username, password) {
        console.log('createAccount');
        const { myId, setMyId, setFirstName, setLastName, setAvatar, setFriends, setEvents } = this.props;
        try {
            const avatar = (avatarFile === Constants.DEFAULT_AVATAR) ? avatarFile : await database.uploadProfilePicture(avatarFile, myId);
            await database.updateUser(myId, {
                firstName,
                lastName,
                avatar
            });
            setFirstName(firstName);
            setLastName(lastName);
            setAvatar(avatar);
            if (password) {
                await database.updatePassword(password);
            }
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
                title={"Edit Profile"}
                handleFinish={this.saveChanges}
                finishText={"Save Changes"}
                initialUsername={this.props.myId}
            />
        );
    }
}

const mapStateToProps = (state) => {
    return {
        myId: state.myId
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
)(withNavigation(EditProfile));