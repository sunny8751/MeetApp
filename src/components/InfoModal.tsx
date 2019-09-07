import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { removeEvents, updateEvent } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Modal, View, Text, Header, Button } from './UI';
import database from '../database/Database';

export interface InfoModalProps {

}

class InfoModal extends React.Component<InfoModalProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.inviteFriends = this.inviteFriends.bind(this);
        this.editEvent = this.editEvent.bind(this);
    }

    inviteFriends() {
        const { eventId } = this.props.navigation.state.params;
        const { events } = this.props;
        this.props.navigation.navigate('InviteFriends', { eventId: eventId, event: events[eventId] })
    }

    closeModal() {
        this.props.navigation.goBack();
    }

    async deleteEvent() {
        const { eventId } = this.props.navigation.state.params;
        console.log('delete', eventId);
        database.removeEvent(eventId); // don't await
        // this.props.navigation.popToTop({immediate: true});
        this.props.removeEvents([eventId]);

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'MyEvents' }) })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    editEvent() {
        const navigation = this.props.navigation;
        const { eventId } = navigation.state.params;

        const saveEvent = (event) => {
            if (!event.name) { return; }
            this.props.updateEvent(eventId, event);
            database.updateEvent(eventId, event);
            // navigation.goBack();
            this.props.navigation.pop(1)
        };

        navigation.navigate('EditEvent', {
            startEvent: this.props.events[eventId],
            title: "Edit Event",
            handleOnFinish: saveEvent,
            finishText: "Save",
        });

    }

    render() {
        const { eventId, colorScheme } = this.props.navigation.state.params;
        if (!this.props.events[eventId]) {
            return (<View />)
        }
        return (
            <Modal
                title={"Info"}
                handleClose={this.closeModal}
                colorScheme={colorScheme}
            >
                
                <Button onPress={this.editEvent}>
                    <Card backgroundColor={colorScheme.mediumColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Edit Event</Text>
                    </Card>
                </Button>
                
                <Button onPress={this.inviteFriends}>
                    <Card backgroundColor={colorScheme.mediumColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Invite Friends</Text>
                    </Card>
                </Button>

                <Button onPress={this.deleteEvent}>
                    <Card backgroundColor={colorScheme.mediumColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, textAlign: 'center'}]}>Delete Event</Text>
                    </Card>
                </Button>

            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      events: state.events
    };
};
  
const mapDispatchToProps = {
    removeEvents, updateEvent
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InfoModal));