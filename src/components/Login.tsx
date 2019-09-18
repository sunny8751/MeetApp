import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { setMyId } from '../actions/Actions';
// import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView } from './UI';
import database from '../database/Database';

export interface LoginProps {

}

class Login extends React.Component<LoginProps | any> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.populateLogin = this.populateLogin.bind(this);
        this.isFinished = this.isFinished.bind(this);

        this.state = {
            username: '',
            password: ''
        };
    }

    async componentDidMount() {
    }

    populateLogin(username, password) {
        this.setState({
            username: username,
            password: password
        }, () => {
            this.login();
        });
    }

    isFinished(showAlert=false) {
        const { username, password } = this.state;
        if (!username || !password) {
            if (showAlert) {
                alert('Please fill in all fields');
            }
            return false;
        }
        return true;
    }

    async login() {
        console.log('login');
        if (!this.isFinished(true)) {
            return;
        }
        const { username, password } = this.state;
        const { setMyId } = this.props; //setFirstName, setLastName, setAvatar, setFriends, setEvents
        try {
            const userId = await database.loginWithEmail(username, password);
            setMyId(userId);
            const { firstName, lastName, avatar } = await database.getUser(userId);
            // setFirstName(firstName);
            // setLastName(lastName);
            // setAvatar(avatar);
            await database.getEvents(userId);
            await database.getFriends(userId);
            // setFriends(await database.getFriends(userId));
            // setEvents(await database.getEvents(userId));

            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'MyEvents' }) })],
            });
            this.props.navigation.dispatch(resetAction);
        } catch(err) {
            console.log(err);
            alert(err);
        }
    }

    createAccount() {
        console.log('createAccount');
        const { username } = this.state;
        this.props.navigation.navigate('CreateAccount', {username})
    }

    forgotPassword() {
        console.log('forgotPassword');
        const { username } = this.state;
        this.props.navigation.navigate('ForgotPassword', {username})
    }

    render() {
        const colorScheme = Styles.defaultColorScheme;
        const iconViewStyle = [Styles.verticalCenter, {paddingRight: 10}];
        const smallButtonStyle = [{fontSize: 15, color: colorScheme.darkColor, textAlign: 'left', fontWeight: 'bold'}];
        return (
            <Container
                navigation={this.props.navigation}
                style={[Styles.verticalCenter, Styles.headerView]}
                keyboardBehavior={"position"}
                disableSafeAreaView
            >
                <ScrollView>
                    <View style={Styles.horizontalCenter}>
                        <Entypo name={"calendar"} size={150} style={{color: Styles.colors.green, paddingTop: 100}} />
                        <Text style={Styles.logoText}>MeetApp</Text>
                    </View>
                    <TextInputCard
                        icon={<View style={iconViewStyle}><AntDesign name={"user"} size={20} style={{color: colorScheme.darkColor}}/></View>}
                        handleChangeText={(text) => this.setState({username: text})}
                        textValue={this.state['username']}
                        placeholder={"Email"}
                        placeholderTextColor={colorScheme.mediumColor}
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({username: ''})}
                        colorScheme={colorScheme}
                        autoCapitalize={"none"}
                    />
                    <TextInputCard
                        icon={<View style={iconViewStyle}><AntDesign name={"lock"} size={20} style={{color: colorScheme.darkColor}}/></View>}
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
                    <Button onPress={this.isFinished() ? this.login: () => {}}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={[Styles.cardSubheaderText, {color: this.isFinished() ? colorScheme.darkColor : Styles.colors.grey, textAlign: 'center'}]}>Login</Text>
                        </Card>
                    </Button>
                    <View style={[Styles.leftRightView, Styles.horizontalCenter]}>
                        <Button onPress={this.createAccount}>
                            <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                                <Text style={smallButtonStyle}>Create Account</Text>
                            </Card>
                        </Button>
                        <Button onPress={this.forgotPassword}>
                            <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                                <Text style={smallButtonStyle}>Forgot Password?</Text>
                            </Card>
                        </Button>
                    </View>
                </ScrollView>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
    };
};
  
const mapDispatchToProps = {
    setMyId,
    // setFirstName,
    // setLastName,
    // setAvatar,
    // setFriends,
    // setEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(Login));