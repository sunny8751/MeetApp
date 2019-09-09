import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView } from './UI';
import database from '../database/Database';

export interface LoginProps {

}

class Login extends React.Component<LoginProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.createAccount = this.createAccount.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.populateLogin = this.populateLogin.bind(this);
        this.state = {
            username: '',
            password: ''
        };
        this.login('sunny8751@gmail.com', 'password');
    }

    // async componentDidMount() {
    //     const userId = 'sunny8751@gmail.com';
    //     const { setMyId, setFirstName, setLastName, setAvatar, setFriends, setEvents } = this.props;
    //     const { firstName, lastName, avatar, friendIds, events } = await database.getUser(userId);
    //         setMyId(userId);
    //         setFirstName(firstName);
    //         setLastName(lastName);
    //         setAvatar(avatar);
    //         setFriends(await database.getFriends(userId));
    //         setEvents(await database.getEvents(userId));

    //         const resetAction = StackActions.reset({
    //             index: 0,
    //             actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'MyEvents' }) })],
    //         });
    //         this.props.navigation.dispatch(resetAction);
    // }

    populateLogin(username, password) {
        this.setState({
            username: username,
            password: password
        });
        this.login(username, password);
    }

    async login(username, password) {
        console.log('login');
        const { setMyId, setFirstName, setLastName, setAvatar, setFriends, setEvents } = this.props;
        try {
            const userId = await database.loginWithEmail(username, password);
            const { firstName, lastName, avatar, friendIds, events } = await database.getUser(userId);
            setMyId(userId);
            setFirstName(firstName);
            setLastName(lastName);
            setAvatar(avatar);
            setFriends(await database.getFriends(userId));
            setEvents(await database.getEvents(userId));

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
    }

    render() {
        const colorScheme = Styles.defaultColorScheme;
        const iconViewStyle = [Styles.verticalCenter, {paddingRight: 10}];
        const smallButtonStyle = [{fontSize: 15, color: colorScheme.darkColor, textAlign: 'left', fontWeight: 'bold'}];
        return (
            <Container
                navigation={this.props.navigation}
                style={[Styles.verticalCenter, Styles.headerView, {paddingTop: 100}]}
            >
                <ScrollView>
                    <View style={Styles.horizontalCenter}>
                        <Entypo name={"calendar"} size={150} style={{color: Styles.colors.green}} />
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
                    <Button onPress={()=>this.login(this.state.username, this.state.password)}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Login</Text>
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
    setFirstName,
    setLastName,
    setAvatar,
    setFriends,
    setEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(Login));