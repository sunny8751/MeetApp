import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import { removeEvents, updateEvent } from '../actions/Actions';
import { Card, Modal, View, Text, Avatar, Button } from './UI';
import database from '../database/Database';

export interface ProfileModalProps {

}

class ProfileModal extends React.Component<ProfileModalProps | any> {
    static navigationOptions = {
        header: null,
    }

    userId: string;
    user: any;
    colorScheme: any;

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.addFriend = this.addFriend.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
        this.addFriendElement = this.addFriendElement.bind(this);
        this.removeFriendElement = this.removeFriendElement.bind(this);

        ({ userId: this.userId, user: this.user, colorScheme: this.colorScheme } = this.props.navigation.state.params);
    }

    closeModal() {
        this.props.navigation.goBack();
    }

    addFriend() {
        console.log('add', this.userId);
        database.addFriend(this.props.myId, this.userId);
        this.props.addFriends({[this.userId]: this.user});
    };

    removeFriend() {
        console.log('remove', this.userId);
        database.removeFriend(this.props.myId, this.userId);
        this.props.removeFriends([this.userId]);
    };

    addFriendElement() {
        return (
            <Button onPress={this.addFriend}>
                <Card style={[Styles.headerButton, Styles.horizontalLayout, {backgroundColor: Styles.colors.green}]}>
                    <AntDesign name="adduser" size={20} style={{ paddingRight: 4 }}/>
                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Add</Text>
                </Card>
            </Button>
        );
    }

    removeFriendElement() {
        return (
            <Button onPress={this.removeFriend}>
                <Card style={[Styles.headerButton, Styles.horizontalLayout, {backgroundColor: Styles.colors.red}]}>
                    <AntDesign name="deleteuser" size={20} style={{ paddingRight: 4 }}/>
                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Remove</Text>
                </Card>
            </Button>
        );
    }

    render() {
        return (
            <Modal
                title={this.user.firstName + ' ' + this.user.lastName}
                handleClose={this.closeModal}
                colorScheme={this.colorScheme}
                flexSize={0}
                topFlexSize={1}
                bottomFlexSize={1}
                style={{marginBottom: 100}}
            >
                <View style={[Styles.center, {paddingBottom: 30}]}>
                    <Avatar
                        source={this.user.avatar}
                        size={100}
                    />
                </View>

                <Card backgroundColor={this.colorScheme.mediumColor} style={[Styles.leftRightView, {marginBottom: 20}]}>
                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor}]}>Email</Text>
                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor, fontWeight: 'normal',}]}>{this.userId}</Text>
                </Card>
                
                {this.userId in this.props.friends ? this.removeFriendElement() : this.addFriendElement()}

            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        friends: state.friends
    };
};
  
const mapDispatchToProps = {
    removeEvents, updateEvent
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(ProfileModal));