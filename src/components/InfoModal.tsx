import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { TextInputCard, Card, Modal, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database from '../database/Database';
import { TouchableWithoutFeedback } from 'react-native';

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

        const { eventId } = this.props.navigation.state.params;
        this.state = {
            location: '',
            endDate: moment(this.props.events[eventId].startDate).add(1, 'hour').toDate(),
        }
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

    render() {
        const { eventId, colorScheme } = this.props.navigation.state.params;
        if (!this.props.events[eventId]) {
            return (<View />)
        }
        const { name, endDate, location, description, invited } = this.props.events[eventId];
        return (
            <Modal
                title={name}
                handleClose={this.closeModal}
                colorScheme={colorScheme}
            >
                {location ? <View /> : (
                    <TextInputCard
                        title={"Location"}
                        handleChangeText={(text) => this.setState({location: text})}
                        textValue={this.state['location']}
                        placeholder={"Type to search a location"}
                        placeholderTextColor={Styles.colors.transparentBlack}
                        style={[Styles.inputText, {backgroundColor: colorScheme.mediumColor}]} // TODO fix height issue
                        colorScheme={colorScheme}
                        optional={true}
                        optionalText={"Add location"}
                        handleClearPress={() => this.setState({location: ''})}
                        optionalStyle={{backgroundColor: colorScheme.mediumColor}}
                        optionalTextStyle={{color: colorScheme.darkColor}}
                    />
                )}

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
    removeEvents
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(InfoModal));