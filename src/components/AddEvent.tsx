import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import moment from 'moment';
import SwitchSelector from 'react-native-switch-selector';
import { StyleSheet } from 'react-native';
import { Container, TextInputCard, ScrollView, Text, Card, View, DatePicker, Button, DatePickerCard } from './UI';
import { getDarkerColor, getLighterColor, getNextHour } from '../utils/Utils';

export interface AddEventProps {

}

class AddEvent extends React.Component<AddEventProps | any> {
    static navigationOptions = {
        // title: `New Event`,
        // headerStyle: Styles.headerStyle,
        // headerTitleStyle: Styles.headerTitleStyle
        header: null
    };

    constructor(props) {
        super(props);
        this.getTimeString = this.getTimeString.bind(this);
        this.getTimeElapsed = this.getTimeElapsed.bind(this);
        this.getPublicInviteInput = this.getPublicInviteInput.bind(this);
        this.isFinished = this.isFinished.bind(this);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.state = {
            name: '',
            location: '',
            publicInvite: false,
        }
    }

    isFinished() {
        return this.state['name'];
    }

    handleOnFinish() {
        if (!this.isFinished()) { return; }
        this.props.navigation.navigate('InviteFriends', {event: this.props});
    }

    getTimeString(date: Date) {
        return moment(date).format("LT, MMM D");
    }

    getTimeElapsed(start: Date, end: Date) {
        const duration = moment.duration(moment(end).diff(moment(start)));
        let str = "";
        if(duration.asDays() >= 1) {str = str + Math.floor(duration.asDays()) + "d ";}
        if(duration.hours() >= 1) {str = str + Math.floor(duration.hours()) + "h ";}
        if(duration.minutes() >= 1) {str = str + Math.floor(duration.minutes()) + "m ";}
        return str;
    }

    getPublicInviteInput() {
        return (
            <Card
                backgroundColor={Styles.colors.white}
                style={{padding: 0, margin: 0, marginRight: 0, marginBottom: -5, width: 200, flexDirection: 'column'}}
            >
                <View style={{flex: 1}}/>
                <SwitchSelector
                    options={[
                        {label: "Private", value: "false"},
                        {label: "Public", value: "true"}
                    ]}
                    initial={0}
                    onPress={(value) => this.setState({publicInvite: value === "true"})}
                    buttonColor={Styles.colors.green}
                    backgroundColor={getLighterColor(Styles.colors.grey)}
                    textColor={styles.inputText.color}
                    textStyle={Styles.switchText}
                    selectedTextStyle={Styles.switchText}
                    animationDuration={100}
                />
            </Card>
        );
    }

    render() {
        const finishComponentStyle = [Styles.headerText, this.isFinished() ? {} : {color: Styles.colors.grey}];
        return (
            <Container
                navigation={this.props.navigation}
                finishComponent={<Text style={finishComponentStyle}>Next</Text>}
                onFinish={this.handleOnFinish}
                titleElementOverride={
                    <View style={Styles.leftRightView}>
                        <Text style={Styles.headerTitle}>{"Add Event"}</Text>
                        {this.getPublicInviteInput()}
                    </View>
                }
            >
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    <TextInputCard
                        title={"Name"}
                        handleChangeText={(text) => this.setState({name: text})}
                        textValue={this.state['name']}
                        placeholder={"Lunch"}
                        style={styles.inputText}
                        handleClearPress={() => this.setState({name: ''})}
                    />
                    <TextInputCard
                        title={"Location"}
                        handleChangeText={(text) => this.setState({location: text})}
                        textValue={this.state['location']}
                        placeholder={"Type to search a location"}
                        style={styles.inputText}
                        optional={true}
                        optionalText={"Add location"}
                        handleClearPress={() => this.setState({location: ''})}
                    />

                    <DatePickerCard
                        title={"Start time"}
                        onDateChange={(date) => this.setState({
                            startDate: date,
                            endDate: moment.max([moment(date).add(1, 'hour'), moment(this.state['endDate'])]).toDate()
                        })}
                        date={this.state['startDate']}
                        initialDate={this.state['startDate']}
                        initialShowDatePicker={false}
                        timeText={(
                            <Text style={[Styles.text, styles.timeText]}>{this.getTimeString(this.state['startDate'])}</Text>
                        )}
                        optional={true}
                        optionalText={"Add start time"}
                        onOptionalPress={() => this.setState({startDate: getNextHour()})}
                    />

                    {this.state['startDate'] ? (
                        <DatePickerCard
                        title={"End time"}
                        onDateChange={(date) => this.setState({endDate: date})}
                        date={this.state['endDate']}
                        initialDate={this.state['endDate']}
                        initialShowDatePicker={false}
                        minimumDate={this.state['startDate']}
                        maximumDate={moment(this.state['startDate']).add(1, 'year').toDate()}
                        timeText={(
                            <View style={Styles.leftRightView}>
                                <Text style={[Styles.text, styles.timeText]}>{this.getTimeString(this.state['endDate'])}</Text>
                                <Text style={[Styles.text, styles.timeText]}>{this.getTimeElapsed(this.state['startDate'], this.state['endDate'])}</Text>
                            </View>
                        )}
                        optional={this.state['startDate'] !== undefined}
                        optionalText={"Add end time"}
                        onOptionalPress={() => this.setState({endDate: moment(this.state['startDate']).add(1, 'hour').toDate()})}
                    />
                    ) : <View />}

                    <TextInputCard
                        title={"Description"}
                        handleChangeText={(text) => this.setState({description: text})}
                        textValue={this.state['description']}
                        placeholder={"Celebrate my promotion!"}
                        optional={true}
                        optionalText={"Add description"}
                        multiline
                    />
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    inputText: {
      color: Styles.colors.black
    },
    timeText: {
      color: Styles.colors.black,
      paddingBottom: 5
    }
  });

const mapStateToProps = (state) => {
    return {
    };
};
  
const mapDispatchToProps = {
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(AddEvent));