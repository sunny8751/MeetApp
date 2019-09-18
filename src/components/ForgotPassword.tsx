import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import * as Constants from './../constants/Constants';
// import { setFriends, setEvents, setMyId, setFirstName, setLastName, setAvatar } from '../actions/Actions';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database from '../database/Database';

export interface ForgotPasswordProps {
}

class ForgotPassword extends React.Component<ForgotPasswordProps | any> {
    constructor(props) {
        super(props);
        this.handleFinish = this.handleFinish.bind(this);
        this.isFinished = this.isFinished.bind(this);

        this.state = {
            username: this.props.navigation.getParam('username', ''),
        };
    }

    isFinished(showAlert=false) {
        const { username } = this.state;
        if (!username) {
            if (showAlert) {
                alert('Please enter your email');
            }
            return false;
        }
        return true;
    }

    async handleFinish() {
        console.log('forgot password');
        if (!this.isFinished(true)) {
            return;
        }
        const { username } = this.state;
        await database.sendPasswordResetEmail(username);

        // const resetAction = StackActions.reset({
        //     index: 0,
        //     actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'MyEvents' }) })],
        // });
        // this.props.navigation.dispatch(resetAction);
        this.props.navigation.pop(1);
    }

    render() {
        const colorScheme = Styles.defaultColorScheme;
        return (
            <Container
                title={"Forgot Password"}
                navigation={this.props.navigation}
            >
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
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
                    <Button onPress={this.handleFinish}>
                        <Card backgroundColor={colorScheme.lightColor} style={{marginBottom: 20}}>
                            <Text style={[Styles.cardSubheaderText, {color: this.isFinished() ? colorScheme.darkColor : Styles.colors.grey, textAlign: 'center'}]}>Submit</Text>
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
)(withNavigation(ForgotPassword));