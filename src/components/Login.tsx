import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database, { myId } from '../database/Database';

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
    }

    populateLogin(username, password) {
        this.setState({
            username: username,
            password: password
        });
        this.login(username, password);
    }

    async login(username=this.state.username, password=this.state.password) {
        console.log('login');
        try {
            const userId = await database.loginWithEmail(username, password);
            this.props.navigation.navigate('MyEvents', { userId });
        } catch(err) {
            alert(err);
        }
    }

    createAccount() {
        console.log('createAccount');
        const { username } = this.state;
        this.props.navigation.navigate('CreateAccount', {username: username})
    }

    forgotPassword() {
        console.log('forgotPassword');
    }

    render() {
        const colorScheme = Styles.defaultColorScheme;
        const iconViewStyle = [Styles.verticalCenter, {paddingRight: 10}];
        return (
            <View style={[Styles.verticalCenter, Styles.headerView]}>
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
                />
                <Button onPress={this.login}>
                    <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Login</Text>
                    </Card>
                </Button>
                <View style={Styles.leftRightView}>
                    <Button onPress={this.createAccount}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={{color: colorScheme.darkColor, textAlign: 'left', fontWeight: 'bold'}}>Create Account</Text>
                        </Card>
                    </Button>
                    <Button onPress={this.forgotPassword}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={{color: colorScheme.darkColor, textAlign: 'left', fontWeight: 'bold'}}>Forgot Password?</Text>
                        </Card>
                    </Button>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      events: state.events
    };
};
  
const mapDispatchToProps = {
    removeEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(Login));