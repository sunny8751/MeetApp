import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
// import { removeEvents, updateEvent } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Modal, View, Text, Header, Button } from './UI';
import database from '../database/Database';

export interface InfoModalProps {

}

class InfoModal extends React.Component<InfoModalProps | any> {
    eventId: string;
    colorScheme: any;

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.inviteFriends = this.inviteFriends.bind(this);
        this.editEvent = this.editEvent.bind(this);

        ({ eventId: this.eventId, colorScheme: this.colorScheme } = this.props.navigation.state.params);
    }

    inviteFriends() {
        const { events } = this.props;
        this.props.navigation.pop(1);
        this.props.navigation.navigate('InviteFriends', { eventId: this.eventId, event: events[this.eventId], handleAfterFinish: () => this.props.navigation.pop(1) });
    }

    closeModal() {
        this.props.navigation.goBack();
    }

    async deleteEvent() {
        console.log('delete', this.eventId);
        database.removeEvent(this.eventId); // don't await
        // this.props.navigation.popToTop({immediate: true});
        // this.props.removeEvents([this.eventId]);

        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Main', action: NavigationActions.navigate({ routeName: 'MyEvents' }) })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    editEvent() {
        const navigation = this.props.navigation;

        const saveEvent = (event) => {
            if (!event.name) { return; }
            // this.props.updateEvent({[this.eventId]: event});
            database.updateEvent(this.eventId, event);
            // navigation.goBack();
            this.props.navigation.pop(1)
        };

        navigation.navigate('EditEvent', {
            startEvent: this.props.events[this.eventId],
            title: "Edit Event",
            handleOnFinish: saveEvent,
            finishText: "Save",
        });

    }

    render() {
        if (!this.props.events[this.eventId]) {
            return (<View />)
        }
        return (
            <Modal
                title={"Info"}
                handleClose={this.closeModal}
                colorScheme={this.colorScheme}
                flexSize={0}
                topFlexSize={1}
            >
                
                <Button onPress={this.editEvent}>
                    <Card backgroundColor={this.colorScheme.lightColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor, textAlign: 'center'}]}>Edit Event</Text>
                    </Card>
                </Button>
                
                <Button onPress={this.inviteFriends}>
                    <Card backgroundColor={this.colorScheme.lightColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor, textAlign: 'center'}]}>Invite Friends</Text>
                    </Card>
                </Button>

                <Button onPress={this.deleteEvent}>
                    <Card backgroundColor={this.colorScheme.lightColor} style={{marginBottom: 20}}>
                        <Text style={[Styles.cardSubheaderText, {color: this.colorScheme.darkColor, textAlign: 'center'}]}>Delete Event</Text>
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
    // removeEvents, updateEvent
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InfoModal));