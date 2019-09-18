import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { AntDesign } from '@expo/vector-icons';
import * as Constants from './../constants/Constants';
// import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { Avatar, TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import { addAvatar } from '../utils/Utils';
import database from '../database/Database';

export interface EditProfileProps {
}

class EditProfile extends React.Component<EditProfileProps | any> {
    constructor(props) {
        super(props);
        this.saveChanges = this.saveChanges.bind(this);
        this.logout = this.logout.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.isFinished = this.isFinished.bind(this);
        this.profileCard = this.profileCard.bind(this);
        this.canSave = this.canSave.bind(this);
        this.addFriends = this.addFriends.bind(this);

        const { myId, firstName, lastName, avatar } = this.props;
        this.state = {
            firstName: firstName,
            lastName: lastName,
            username: myId,
            password: '',
            passwordConfirmation: '',
            avatar: avatar,
            showComponent: {}
        };
    }

    addFriends() {
        this.props.navigation.navigate('AddFriends');
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

    canSave() {
        const { firstName, lastName, username, password, passwordConfirmation, avatar: avatarFile } = this.state;
        const { myId: originalUsername, firstName: originalFirstName, lastName: originalLastName, avatar: originalAvatar } = this.props;
        return !(originalUsername === username && originalFirstName === firstName && originalLastName === lastName && originalAvatar === avatarFile && !password && !passwordConfirmation);
    }

    isFinished() {
        const { firstName, lastName, username, password, passwordConfirmation, avatar: avatarFile } = this.state;
        if (!firstName || !lastName || !username) {
            alert('Please fill in all fields');
            return false;
        }
        if (password !== passwordConfirmation) {
            alert('Passwords do not match');
            return false;
        }
        return true;
    }

    async logout() {
        await database.logout();
        // setMyId('');
        // setFirstName('');
        // setLastName('');
        // setAvatar('');
        // setFriends({});
        // setEvents({});

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'Login' }) })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    async saveChanges() {
        if (!this.isFinished() || !this.canSave()) {
            return;
        }
        const { avatar: avatarFile, firstName, lastName, username, password } = this.state;
        const { myId } = this.props; // setMyId, setFirstName, setLastName, setAvatar, setFriends, setEvents
        try {
            const avatar = (avatarFile === this.props.avatar) ? avatarFile : await database.uploadProfilePicture(avatarFile, myId);
            await database.updateUser(myId, {
                firstName,
                lastName,
                avatar
            });
            // setFirstName(firstName);
            // setLastName(lastName);
            // setAvatar(avatar);
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

    profileCard(name: string, card, component): JSX.Element {
        const { showComponent } = this.state;
        if (showComponent[name]) {
            return component;
        } else {
            if (component) {
                return (
                    <Button onPress={() => {
                        this.setState({showComponent: {
                            ...showComponent,
                            [name]: true
                        }})
                    }}>
                        { card }
                    </Button>
                );
            } else {
                return card;
            }
        }
    }

    render() {
        const colorScheme = Styles.defaultColorScheme;
        const { firstName, lastName, username, password, passwordConfirmation, avatar } = this.state;
        const finishComponentStyle = [Styles.headerFinishComponent,  this.canSave() ? {} : {color: Styles.defaultColorScheme.mediumColor}]
        return (
            <Container
                title={"Settings"}
                navigation={this.props.navigation}
                onFinish={this.saveChanges}
                finishComponent={<Text style={finishComponentStyle}>Save</Text>}
            >
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    <View style={Styles.center}>
                        <Button
                            style={[Styles.horizontalCenter, {marginBottom: 20}]}
                            onPress={() => {addAvatar((avatar) => { this.setState({ avatar }); })}}
                        >
                            <Avatar
                                user={this.state}
                                size={100}
                            />
                        </Button>
                    </View>
                    
                    {this.profileCard("Email", (
                        <Card backgroundColor={colorScheme.lightColor} style={[{marginBottom: 20}, Styles.leftRightView]}>
                            <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor}]}>Email</Text>
                            <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, fontWeight: 'normal',}]}>{username}</Text>
                        </Card>
                    ), undefined)}

                    {this.profileCard("Name", (
                            <Card backgroundColor={colorScheme.lightColor} style={[{marginBottom: 20}, Styles.leftRightView]}>
                                <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor}]}>Name</Text>
                                <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, fontWeight: 'normal',}]}>{firstName + " " + lastName}</Text>
                            </Card>
                        ), (
                            <>
                                <TextInputCard
                                    title={"First Name"}
                                    handleChangeText={(text) => this.setState({firstName: text})}
                                    textValue={firstName}
                                    placeholder={"John"}
                                    placeholderTextColor={colorScheme.mediumColor}
                                    style={Styles.inputText}
                                    handleClearPress={() => this.setState({firstName: ''})}
                                    colorScheme={colorScheme}
                                />
                                <TextInputCard
                                    title={"Last Name"}
                                    handleChangeText={(text) => this.setState({lastName: text})}
                                    textValue={lastName}
                                    placeholder={"Doe"}
                                    placeholderTextColor={colorScheme.mediumColor}
                                    style={Styles.inputText}
                                    handleClearPress={() => this.setState({lastName: ''})}
                                    colorScheme={colorScheme}
                                />
                            </>
                    ))}

                    <Button onPress={this.addFriends}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <View style={[Styles.horizontalLayout, Styles.verticalCenter]}>
                                <AntDesign name="adduser" size={20} color={Styles.colors.green} style={{paddingRight: 5}}/>
                                <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Add Friends</Text>
                            </View>
                        </Card>
                    </Button>
                    
                    {this.profileCard("Change Password", (
                            <Card backgroundColor={colorScheme.lightColor} style={[Styles.leftRightView, {marginBottom: 20}]}>
                                <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, flex: 1, textAlign: 'center'}]}>Change Password</Text>
                            </Card>
                        ), (
                            <>
                                <TextInputCard
                                    title={"Password"}
                                    handleChangeText={(text) => this.setState({password: text})}
                                    textValue={password}
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
                                    textValue={passwordConfirmation}
                                    placeholder={"Password"}
                                    placeholderTextColor={colorScheme.mediumColor}
                                    password={true}
                                    style={Styles.inputText}
                                    handleClearPress={() => this.setState({passwordConfirmation: ''})}
                                    colorScheme={colorScheme}
                                    autoCapitalize={"none"}
                                />
                            </>
                    ))}
                    <Button onPress={this.logout}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Sign Out</Text>
                        </Card>
                    </Button>
                </ScrollView>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        myId: state.myId,
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
)(withNavigation(EditProfile));