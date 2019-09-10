import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Container, View, Text, Header, Button, ScrollView, Chat, Avatar, StackedAvatar } from './UI';
import database from '../database/Database';

export interface EventOverviewProps {

}

class EventOverview extends React.Component<EventOverviewProps | any> {
    static navigationOptions = {
        // title: navigation.getParam('name', 'Event Overview'),
        // headerStyle: Styles.headerStyle,
        // headerTitleStyle: Styles.headerTitleStyle,
        // return {
        //     header: (props) => <Header title={} />
        // };
        header: null,
        // headerLeft: <Button onPress={() => console.log('click')}><Text>{"Hello"}</Text></Button>
    }

    eventId: string;
    colorScheme: any;

    constructor(props) {
        super(props);
        this.openInfoModal = this.openInfoModal.bind(this);
        this.state = {
            refresh: false
        };
        ({ eventId: this.eventId, colorScheme: this.colorScheme } = this.props.navigation.state.params);
    }

    changeTitle() {

    }

    changeDates() {

    }

    openInfoModal() {
        console.log('open info', this.eventId);
        this.props.navigation.navigate('InfoModal', { eventId: this.eventId, colorScheme: this.colorScheme })
    }

    render() {
        const { myId, firstName, lastName, avatar, events, friends } = this.props;
        if (!this.props.events[this.eventId]) {
            return (<View />)
        }
        const { name, publicInvite, startDate, endDate, location, description, invited } = events[this.eventId];
        const othersInvited = invited.filter(id => id !== myId);
        return (
            <Container
                navigation={this.props.navigation}
                disableKeyboardAvoidingView={true}
                titleElementOverride={(
                    <View style={Styles.leftRightView}>
                        <View>
                            <Text style={[Styles.headerTitle, {color: this.colorScheme.darkColor}]}>{name}</Text>
                            {location ? <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.mediumColor}]}>{location}</Text> : <View />}
                            <Text style={[Styles.cardSubheaderText, {color: getTimeColor(startDate)}]}>{getTimeString(startDate, endDate)}</Text>
                        </View>
                        
                        <Button
                            onPress={() => this.props.navigation.navigate('InviteFriends', { eventId: this.eventId, event: events[this.eventId] })}
                            style={{flex: 1, paddingLeft: 10, justifyContent: 'flex-end', alignItems: 'flex-end'}}
                        >
                            {othersInvited.length > 0 ? (
                                <StackedAvatar
                                    users={Object.keys(othersInvited).reduce(function(result, key) {
                                        const username = othersInvited[key];
                                        result[username] = {avatar: friends[username].avatar}
                                        return result
                                      }, {})}
                                />
                            ) : (
                                <Card backgroundColor={this.colorScheme.lightColor} style={{marginRight: 0, marginLeft: 0, marginBottom: 0}}>
                                    <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor, textAlign: 'center'}]}>Invite Friends</Text>
                                </Card>
                            )}
                        </Button>
                    </View>
                )}
                finishComponent={
                    <Ionicons name="ios-information" size={45} color={this.colorScheme.darkColor} style={{ paddingLeft: 17, paddingRight: 17,  marginBottom: -5, marginTop: -5 }}/>
                }
                onFinish={this.openInfoModal}
                colorScheme={this.colorScheme}
            >
                {/* <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    <Text>Hi</Text>
                </ScrollView> */}
                <Chat
                    eventId={this.eventId}
                />
            </Container>
            
        );
    }
}

const mapStateToProps = (state) => {
    return {
      events: state.events,
      friends: state.friends,
      myId: state.myId,
      firstName: state.firstName,
      lastName: state.lastName,
      avatar: state.avatar
    };
};
  
const mapDispatchToProps = {
    removeEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(EventOverview));