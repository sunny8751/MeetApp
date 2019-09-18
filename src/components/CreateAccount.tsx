import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import * as Constants from './../constants/Constants';
// import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { addAvatar } from '../utils/Utils';
import { Avatar, TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database from '../database/Database';

export interface CreateAccountProps {
}

class CreateAccount extends React.Component<CreateAccountProps | any> {
    constructor(props) {
        super(props);
        this.createAccount = this.createAccount.bind(this);
        this.isFinished = this.isFinished.bind(this);

        this.state = {
            firstName: '',
            lastName: '',
            username: this.props.navigation.getParam('username', ''),
            password: '',
            passwordConfirmation: '',
            avatar: '',
        };
    }

    // async addAvatar() {
    //     const options = {
    //         title: 'Select Avatar',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //         },
    //     };
    //     ImagePicker.showImagePicker(options, async (response) => {
    //         if (response.didCancel) {
    //           console.log('User cancelled image picker');
    //         } else if (response.error) {
    //           console.log('ImagePicker Error: ', response.error);
    //         } else {
    //             const source = response.uri;

    //             // You can also display the image using data:
    //             // const source = { uri: 'data:image/jpeg;base64,' + response.data };

    //             this.setState({
    //                 avatar: source,
    //             });
    //         }
    //       });
    // }

    isFinished(showAlert=false) {
        const { firstName, lastName, username, password, passwordConfirmation, isUsernameLocked } = this.state;
        if (!firstName || !lastName || !username || (!isUsernameLocked && (!password || !passwordConfirmation))) {
            if (showAlert) {
                alert('Please fill in all fields');
            }
            return false;
        }
        if (password !== passwordConfirmation) {
            if (showAlert) {
                alert('Passwords do not match');
            }
            return false;
        }
        return true;
    }

    async createAccount() {
        console.log('createAccount');
        if (!this.isFinished(true)) {
            return;
        }
        const { avatar: avatarFile, firstName, lastName, username, password } = this.state;
        // const { setMyId, setFirstName, setLastName, setAvatar, setFriends, setEvents } = this.props;
        try {
            const userId = await database.createAccount(username, password);
            const avatar = (avatarFile === Constants.DEFAULT_AVATAR) ? avatarFile : await database.uploadProfilePicture(avatarFile, userId);
            const friends = [];
            await database.addUser(userId, {
                firstName,
                lastName,
                avatar,
            }, friends);
            // setMyId(userId);
            // setFirstName(firstName);
            // setLastName(lastName);
            // setAvatar(avatar);
            // setFriends([]);
            // setEvents([]);
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
        const colorScheme = Styles.defaultColorScheme;
        return (
            <Container
                title={"Create Account"}
                navigation={this.props.navigation}
            >
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Button
                            style={[Styles.horizontalCenter, {marginBottom: 20}]}
                            onPress={() => {addAvatar((avatar) => { this.setState({ avatar }); })}}
                        >
                            <Avatar
                                // source={this.state.avatar}
                                user={this.state}
                                size={80}
                            />
                        </Button>
                    </View>
                    
                    <TextInputCard
                        title={"Email"}
                        handleChangeText={(text) => this.setState({username: text})}
                        textValue={this.state['username']}
                        placeholder={"johndoe@gmail.com"}
                        placeholderTextColor={colorScheme.mediumColor}
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({username: ''})}
                        colorScheme={colorScheme}
                        autoCapitalize={"none"}
                    />

                    <TextInputCard
                        title={"First Name"}
                        handleChangeText={(text) => this.setState({firstName: text})}
                        textValue={this.state['firstName']}
                        placeholder={"John"}
                        placeholderTextColor={colorScheme.mediumColor}
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({firstName: ''})}
                        colorScheme={colorScheme}
                    />
                    <TextInputCard
                        title={"Last Name"}
                        handleChangeText={(text) => this.setState({lastName: text})}
                        textValue={this.state['lastName']}
                        placeholder={"Doe"}
                        placeholderTextColor={colorScheme.mediumColor}
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({lastName: ''})}
                        colorScheme={colorScheme}
                    />
                    <TextInputCard
                        title={"Password"}
                        handleChangeText={(text) => this.setState({password: text})}
                        textValue={this.state['password']}
                        placeholder={"Password"}
                        placeholderTextColor={colorScheme.mediumColor}
                        password={true}
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({password: ''})}
                        colorScheme={colorScheme}
                        autoCapitalize={"none"}
                    />
                    <TextInputCard
                        title={"Confirm Password"}
                        handleChangeText={(text) => this.setState({passwordConfirmation: text})}
                        textValue={this.state['passwordConfirmation']}
                        placeholder={"Password"}
                        placeholderTextColor={colorScheme.mediumColor}
                        password={true}
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({passwordConfirmation: ''})}
                        colorScheme={colorScheme}
                        autoCapitalize={"none"}
                    />
                    <Button onPress={this.isFinished() ? this.createAccount : ()=>{}}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={[Styles.cardSubheaderText, {color: this.isFinished() ? colorScheme.darkColor : Styles.colors.grey, textAlign: 'center'}]}>Create Account</Text>
                        </Card>
                    </Button>
                </ScrollView>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        firstName: state.firstName,
        lastName: state.lastName,
        avatar: state.avatar,
    };
};
  
const mapDispatchToProps = {
    // setMyId,
    // setFirstName,
    // setLastName,
    // setAvatar,
    // setFriends,
    // setEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(CreateAccount));