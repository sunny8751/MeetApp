import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import _ from 'lodash';
import moment from 'moment';
import { addEvents, setEvents } from '../actions/Actions';
import EventsList from './EventsList';
import { View, Button, Container, Avatar } from './UI';
import { AntDesign } from '@expo/vector-icons';
import {getNextHour } from '../utils/Utils';
import database from '../database/Database';

export interface MyEventsProps {

}

class MyEvents extends React.Component<MyEventsProps | any> {
    static navigationOptions = {
        // headerTitleStyle: Styles.headerTitleStyle
        header: null
    };
    
    constructor(props) {
        super(props);
        this.convertToSections = this.convertToSections.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.getAddButton = this.getAddButton.bind(this);
        this.refresh = this.refresh.bind(this);
        this.openProfileModal = this.openProfileModal.bind(this);

        this.state = {
            sections: this.convertToSections(this.props.events)
        };
        // this.createNewEvent();
        const { firstName, lastName, myId, avatar } = this.props;
        console.log(firstName, lastName, myId, avatar);
    }

    async openProfileModal() {
        console.log('open profile');
        this.props.navigation.navigate('EditProfile');
    }

    // async componentDidMount() {
    //     // await database.removeEvent('jtYVcg6BGTIwI50gNHMZ');
    //     await this.refresh();
    //     // if (this._isMounted) {
    //     //     this.setState({sections: this.convertToSections(this.props.events)});
    //     // }
    // }

    componentDidUpdate(prevProps) {
      if(this.props.events != prevProps.events)
      {
        this.setState({sections: this.convertToSections(this.props.events)});
      }
    } 

    async refresh() {
        this.props.setEvents(await database.getEvents(this.props.myId));
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
        this.props.navigation.navigate('AddEvent');
    }

    getAddButton(): JSX.Element {
        return (
            <Button onPress={this.createNewEvent} style={Styles.addButtonFloating}>
                <AntDesign name="plus" size={35} color={Styles.colors.green}/>
            </Button>
        );
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
        return (
            <Container
                title={'My Events'}
                navigation={this.props.navigation}
                finishComponent={
                    <AntDesign name="plus" size={35} style={{ padding: 2 }}/>
                }
                onFinish={this.createNewEvent}
                backElementOverride={
                    <Button onPress={this.openProfileModal}  style={{justifyContent: 'center'}}>
                        <View style={[Styles.headerButton, { backgroundColor: Styles.defaultColorScheme.lightColor }]}>
                            <Avatar source={this.props.avatar} size={35}/>
                        </View>
                    </Button>
                }
            >
                <EventsList
                    sections={this.state['sections']}
                    // onScroll={this.handleOnScroll}
                    // scrollEventThrottle={300}
                />
                {this.getAddButton()}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      events: state.events,
      myId: state.myId,
      avatar: state.avatar
    };
};

const mapDispatchToProps = {
    addEvents,
    setEvents
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(MyEvents));