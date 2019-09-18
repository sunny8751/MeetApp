import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import _ from 'lodash';
import moment from 'moment';
// import { addEvent, setEvents } from '../actions/Actions';
import EventsList from './EventsList';
import { Text, View, Button, Container } from './UI';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { getNextHour, getFormattedTimeString, getTimeElapsed, getFriends } from '../utils/Utils';
import database from '../database/Database';

export interface MyEventsProps {

}

class MyEvents extends React.Component<MyEventsProps | any> {    
    constructor(props) {
        super(props);
        this.convertToSections = this.convertToSections.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.getAddButton = this.getAddButton.bind(this);
        this.refresh = this.refresh.bind(this);
        this.openProfileModal = this.openProfileModal.bind(this);
        this.addFriends = this.addFriends.bind(this);

        this.state = {
            sections: this.convertToSections(this.props.events)
        };
        // this.createNewEvent();
    }

    async openProfileModal() {
        console.log('open profile');
        this.props.navigation.navigate('EditProfile');
    }

    async componentDidMount() {
        // await database.removeEvent('jtYVcg6BGTIwI50gNHMZ');
        // await database.addMessage('Qfr9ilhpCVE7W7z2Cgsh', {senderId: 'johndoe@gmail.com', text: 'This place looks really good!', createdAt: new Date()})
        // console.log('returned', await database.getMessages('Qfr9ilhpCVE7W7z2Cgsh', 5));
        // if (this._isMounted) {
        //     this.setState({sections: this.convertToSections(this.props.events)});
        // }
    }

    componentDidUpdate(prevProps) {
        if(this.props.events != prevProps.events) {
            this.setState({sections: this.convertToSections(this.props.events)});
        }
    } 

    async refresh() {
        // this.props.setEvents(await database.getEvents(this.props.myId));
        await database.getEvents(this.props.myId);
    }

    convertToSections(events) {
        const getSectionTitle = (date) => {
            const eventDate = moment(date);
            // if (moment().isSame(eventDate, 'd')) {
            //     return 'Today';
            // }
            // if (moment().add(1, 'days').isSame(eventDate, 'd')) {
            //     return 'Tomorrow';
            // }
            return eventDate.format('MM/DD/YY');
        };

        let eventIds = Object.keys(events);
        eventIds.sort(function(a,b) {
            if (events[a].startDate == events[b].startDate) {
                return events[a].endDate - events[b].endDate;
            }
            return events[a].startDate - events[b].startDate;
        });

        const groups = _.groupBy(eventIds, function(id) {
            return getSectionTitle(events[id].startDate);
        });
        const sections = _.map(groups, function(group, day) {
            return {
                sectionTitle: day,
                data: group
            };
        });
        return sections;
    }

    createNewEvent() {
        const startEvent = {
            name: '',
            location: '',
            publicInvite: false,
            startDate: getNextHour(),
            endDate: moment(getNextHour()).add(1, 'hour').toDate(),
            invited: [this.props.myId]
        };

        const handleNext = (event) => {
            console.log('handle next called');
            if (!event.name) { return; }
            this.props.navigation.navigate('InviteFriends', {
                event, handleAfterFinish: () => {
                    this.props.navigation.pop(2);
                }
            });
        };

        this.props.navigation.navigate('EditEvent', {
            startEvent: startEvent,
            title: "Add Event",
            handleOnFinish: handleNext,
            finishText: "Next",
        })
    }

    getAddButton(): JSX.Element {
        return (
            <Button onPress={this.createNewEvent} style={Styles.addButtonFloating}>
                <AntDesign name="plus" size={35} color={Styles.colors.green}/>
            </Button>
        );
    }

    addFriends() {
        this.props.navigation.navigate('AddFriends');
    }

    // handleOnScroll({nativeEvent}) {
    //     const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    //         const paddingToBottom = 20;
    //         return layoutMeasurement.height + contentOffset.y >=
    //             contentSize.height - paddingToBottom;
    //     };
        
    //     if (isCloseToBottom(nativeEvent)) {
    //         console.log("reached end");
    //     }
    // }

    render() {
        console.log('My Events', this.props.state);
        return (
            <Container
                title={'My Events'}
                navigation={this.props.navigation}
                finishComponent={
                    <AntDesign name="plus" size={35} style={[Styles.center, { padding: 2 }]}/>
                }
                onFinish={this.createNewEvent}
                backElementOverride={
                    <View style={Styles.horizontalLayout}>
                        <Button onPress={this.openProfileModal}  style={[Styles.center, {paddingRight: 10}]}>
                            {/* <View style={[Styles.headerButton, { backgroundColor: Styles.defaultColorScheme.lightColor }]}>
                                <Avatar source={this.props.avatar} size={35}/>
                            </View> */}
                            <View style={[Styles.headerButton, Styles.center, { backgroundColor: Styles.defaultColorScheme.lightColor }]}>
                                <Ionicons name="ios-settings" size={35} style={{ padding: 2, paddingLeft: 7, paddingRight: 7 }}/>
                            </View>
                        </Button>
                        <Button onPress={this.addFriends}  style={Styles.center}>
                            <View style={[Styles.headerButton, Styles.center, { backgroundColor: Styles.defaultColorScheme.lightColor }]}>
                                <AntDesign name="adduser" size={33} style={{ padding: 3, paddingLeft: 4, paddingRight: 4 }}/>
                            </View>
                        </Button>
                    </View>
                }
            >
                {this.state['sections'] === [] ? (
                    <View style={{flex: 1, backgroundColor: 'red'}}>
                        <Text
                            style={[Styles.sectionTitle, {color: Styles.colors.lightGrey}]}
                        >
                            You have no events yet. Add a new event now.
                        </Text>
                    </View>
                ) : (
                    <EventsList
                        sections={this.state['sections']}
                        // onScroll={this.handleOnScroll}
                        // scrollEventThrottle={300}
                    />
                )}
                
                {this.getAddButton()}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      events: state.events,
      myId: state.myId,
      avatar: state.avatar,
      state: state
    };
};

const mapDispatchToProps = {
    // addEvent,
    // setEvents
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(MyEvents));