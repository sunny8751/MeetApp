import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
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

    constructor(props) {
        super(props);
        this.openInfoModal = this.openInfoModal.bind(this);
    }

    async openInfoModal() {
        const { eventId, colorScheme } = this.props.navigation.state.params;
        console.log('open info', eventId);
        this.props.navigation.navigate('InfoModal', { eventId, colorScheme })
    }

    render() {
        const { eventId, colorScheme } = this.props.navigation.state.params;
        if (!this.props.events[eventId]) {
            return (<View />)
        }
        const { name, publicInvite, startDate, endDate, location, description, invited } = this.props.events[eventId];
        return (
            <Container
                navigation={this.props.navigation}
                disableKeyboardAvoidingView={true}
                titleElementOverride={(
                    <View>
                        <Text style={[Styles.headerTitle, {color: colorScheme.darkColor}]}>{name}</Text>
                        {location ? <Text style={[Styles.cardSubheaderText, {color: colorScheme.mediumColor}]}>{location}</Text> : <View />}
                        <Text style={[Styles.cardSubheaderText, {color: getTimeColor(startDate)}]}>{getTimeString(startDate, endDate)}</Text>
                    </View>
                )}
                finishComponent={
                    <Ionicons name="ios-information" size={45} color={colorScheme.darkColor} style={{ paddingLeft: 17, paddingRight: 17,  marginBottom: -5, marginTop: -5 }}/>
                }
                onFinish={this.openInfoModal}
                colorScheme={colorScheme}
            >
                {/* <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    <Text>Hi</Text>
                </ScrollView> */}
                <Chat />
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
)(withNavigation(EventOverview));