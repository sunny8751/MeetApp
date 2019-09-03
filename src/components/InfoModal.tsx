import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database, { myId } from '../database/Database';
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
        this.props.navigation.popToTop({immediate: true});
        this.props.removeEvents([eventId]);
    }

    render() {
        const { eventId, colorScheme } = this.props.navigation.state.params;
        if (!this.props.events[eventId]) {
            return (<View />)
        }
        const { name, endDate, location, description, invited } = this.props.events[eventId];
        const headerButtonStyle = [Styles.headerButton, { backgroundColor: colorScheme.mediumColor }];
        return (
            <View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent'}}>
                <TouchableWithoutFeedback onPress={this.closeModal}>
                    <View style={{flex: 1}}/>
                </TouchableWithoutFeedback>

                <Container
                    style={{flex: 1, backgroundColor: colorScheme.lightColor, borderRadius: 15}}
                    headerOverride = {
                        <View style={[Styles.leftRightView, {paddingLeft: 15, paddingRight: 15, paddingBottom: 15}]}>
                            <Text style={[Styles.headerTitle, {color: colorScheme.darkColor}]}>{name}</Text>
                            <Button onPress={this.closeModal} style={{justifyContent: 'center', paddingTop: 15}}>
                                <View style={headerButtonStyle}>
                                    <Ionicons name="ios-close" size={45} color={colorScheme.darkColor} style={{ paddingLeft: 10, paddingRight: 10,  marginBottom: -7, marginTop: -5 }}/>
                                </View>
                            </Button>
                        </View>
                    }
                    disableKeyboardAvoidingView={true}
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

                </Container>
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
)(withNavigation(InfoModal));