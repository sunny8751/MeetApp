import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Avatar, TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database, { myId } from '../database/Database';

export interface CreateAccountProps {
}

class CreateAccount extends React.Component<CreateAccountProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.createAccount = this.createAccount.bind(this);
        this.isFinished = this.isFinished.bind(this);
        this.addAvatar = this.addAvatar.bind(this);
        this.state = {
            firstName: '',
            lastName: '',
            username: this.props.navigation.getParam('username', ''),
            password: '',
            passwordConfirmation: ''
        };
    }

    addAvatar() {
        console.log('add avatar');
    }

    isFinished() {
        const { firstName, lastName, username, password, passwordConfirmation } = this.state;
        if (!firstName || !lastName || !username || !password || !passwordConfirmation) {
            alert('Please fill in all fields');
            return false;
        }
        if (password !== passwordConfirmation) {
            alert('Passwords do not match');
            return false;
        }
        return true;
    }

    async createAccount() {
        console.log('createAccount');
        const { username, password } = this.state;
        if (!this.isFinished()) {
            return;
        }
        await database.createAccount(username, password);
        this.props.navigation.goBack();
    }

    render() {
        const colorScheme = Styles.defaultColorScheme;
        const iconViewStyle = [Styles.verticalCenter, {paddingRight: 10}];
        return (
            <Container
                title={"Create Account"}
                navigation={this.props.navigation}
            >
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Button
                        style={[Styles.horizontalCenter, {marginBottom: 20}]}
                        onPress={this.addAvatar}
                    >
                        <Avatar
                            // source={"https://placeimg.com/140/140/any"}
                            size={80}
                        />
                    </Button>
                </View>
                
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
                    title={"Email"}
                    handleChangeText={(text) => this.setState({username: text})}
                    textValue={this.state['username']}
                    placeholder={"johndoe@gmail.com"}
                    placeholderTextColor={colorScheme.mediumColor}
                    style={Styles.inputText}
                    handleClearPress={() => this.setState({username: ''})}
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
                />
                <Button onPress={this.createAccount}>
                    <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Create Account</Text>
                    </Card>
                </Button>
            </Container>
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
)(withNavigation(CreateAccount));