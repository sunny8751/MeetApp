import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import * as Constants from './../constants/Constants';
import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Avatar, TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';

export interface ProfileProps {
    title?: string;
    handleFinish: (avatarFile, firstName, lastName, username, password) => void;
    finishText: string;
    initialUsername?: string;
    isUsernameLocked?: boolean;
}

class Profile extends React.Component<ProfileProps | any> {
    static navigationOptions = {
        header: null,
    }

    static defaultProps = {
        username: ''
    }

    constructor(props) {
        super(props);
        this.saveChanges = this.saveChanges.bind(this);
        this.isFinished = this.isFinished.bind(this);
        this.addAvatar = this.addAvatar.bind(this);

        const { initialUsername, firstName, lastName, avatar } = this.props;
        this.state = {
            firstName: firstName,
            lastName: lastName,
            username: initialUsername,
            password: '',
            passwordConfirmation: '',
            avatar: avatar,
        };
    }

    async addAvatar() {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        ImagePicker.showImagePicker(options, async (response) => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
                const source = response.uri;

                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };

                this.setState({
                    avatar: source,
                });
            }
          });
    }

    isFinished() {
        const { firstName, lastName, username, password, passwordConfirmation, isUsernameLocked } = this.state;
        if (!firstName || !lastName || !username || (!isUsernameLocked && (!password || !passwordConfirmation))) {
            alert('Please fill in all fields');
            return false;
        }
        if (password !== passwordConfirmation) {
            alert('Passwords do not match');
            return false;
        }
        return true;
    }

    async saveChanges() {
        console.log('createAccount');
        const { avatar: avatarFile, firstName, lastName, username, password } = this.state;
        if (!this.isFinished()) {
            return;
        }

        this.props.handleFinish(avatarFile, firstName, lastName, username, password);
    }

    render() {
        const { title, finishText, isUsernameLocked } = this.props;
        const colorScheme = Styles.defaultColorScheme;
        const iconViewStyle = [Styles.verticalCenter, {paddingRight: 10}];
        return (
            <Container
                title={title}
                navigation={this.props.navigation}
            >
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                        style={[Styles.horizontalCenter, {marginBottom: 20}]}
                        onPress={this.addAvatar}
                    >
                        <Avatar
                            source={this.state.avatar}
                            size={80}
                        />
                    </Button>
                </View>
                
                {isUsernameLocked ? (
                    <Card backgroundColor={colorScheme.lightColor} style={[{marginBottom: 20}]}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, paddingBottom: 5}]}>Email</Text>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>{this.state.username}</Text>
                    </Card>
                ) : (
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
                )}
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
                <Button onPress={this.saveChanges}>
                    <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>{finishText}</Text>
                    </Card>
                </Button>
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
)(withNavigation(Profile));