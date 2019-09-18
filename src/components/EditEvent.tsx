import * as React from 'react';
import * as Styles from '../styles/styles';
import moment from 'moment';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import SwitchSelector from 'react-native-switch-selector';
import { Container, TextInputCard, ScrollView, Text, Card, View, DatePicker, Button, DatePickerCard } from './UI';
import { getNextHour, getFormattedTimeString, getTimeElapsed } from '../utils/Utils';

/** navigation params:
    title: string;
    handleOnFinish: (event) => void;
    finishText: string;
    startEvent: any;
**/

class EditEvent extends React.Component<any> {
    handleOnFinish: () => {};
    title: string;
    finishText: string;
    
    constructor(props) {
        super(props);
        this.getPublicInviteInput = this.getPublicInviteInput.bind(this);
        this.isFinished = this.isFinished.bind(this);
        
        let startEvent = {};
        ({ startEvent, handleOnFinish: this.handleOnFinish, title: this.title, finishText: this.finishText } = this.props.navigation.state.params);
        this.state = {
            ...startEvent
        };

    }

    isFinished() {
        return this.state.name;
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
                    backgroundColor={Styles.defaultColorScheme.lightColor}
                    textColor={Styles.inputText.color}
                    textStyle={Styles.switchText}
                    selectedTextStyle={Styles.switchText}
                    animationDuration={100}
                />
            </Card>
        );
    }

    render() {
        const finishComponentStyle = [Styles.headerFinishComponent,  this.isFinished() ? {} : {color: Styles.defaultColorScheme.mediumColor}]
        return (
            <Container
                navigation={this.props.navigation}
                finishComponent={ <Text style={finishComponentStyle}>{this.finishText}</Text> }
                onFinish={() => this.isFinished() ? this.handleOnFinish(this.state) : {}}
                titleElementOverride={
                    <View style={Styles.leftRightView}>
                        <Text style={Styles.headerTitle}>{this.title}</Text>
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
                        style={Styles.inputText}
                        handleClearPress={() => this.setState({name: ''})}
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
                            <Text style={Styles.timeText}>{getFormattedTimeString(this.state['startDate'])}</Text>
                        )}
                        // optional={true}
                        // optionalText={"Add start time"}
                        // onOptionalPress={() => this.setState({startDate: getNextHour()})}
                    />

                    {/* {this.state['startDate'] ? ( */}
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
                                <Text style={Styles.timeText}>{getFormattedTimeString(this.state['endDate'])}</Text>
                                <Text style={Styles.timeText}>{getTimeElapsed(this.state['startDate'], this.state['endDate'])}</Text>
                            </View>
                        )}
                        // optional={this.state['startDate'] !== undefined}
                        // optionalText={"Add end time"}
                        // onOptionalPress={() => this.setState({endDate: moment(this.state['startDate']).add(1, 'hour').toDate()})}
                    />
                    {/* ) : <View />} */}

                    <TextInputCard
                        title={"Location"}
                        handleChangeText={(text) => this.setState({location: text})}
                        textValue={this.state['location']}
                        placeholder={"Type to search a location"}
                        style={Styles.inputText}
                        optional={true}
                        optionalText={"Add location"}
                        handleClearPress={() => this.setState({location: ''})}
                    />

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

const mapStateToProps = (state) => {
    return {
    };
};
  
const mapDispatchToProps = {
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(EditEvent));