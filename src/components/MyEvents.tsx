import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import _ from 'lodash';
import moment from 'moment';
import { increment, decrement } from '../actions/Actions';
import EventsList from './EventsList';
import { Header, Button, Container } from './UI';
import { AntDesign } from '@expo/vector-icons';
import {getNextHour } from '../utils/Utils';

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
        // this.handleOnScroll = this.handleOnScroll.bind(this);
        const data = {
            events: [
                {
                    name: 'Dinner',
                    public: false,
                    startDate: getNextHour(),
                    endDate: moment(getNextHour()).add(1, 'hours').toDate(),
                    location: 'Restaurant'
                },
                {
                    name: 'Basketball practice',
                    public: true,
                    startDate: moment(getNextHour()).add(2, 'hours').toDate(),
                    endDate: moment(getNextHour()).add(4, 'hours').toDate(),
                    location: 'Gym'
                },
                {
                    name: 'Running',
                    public: false,
                    startDate: moment(getNextHour()).add(19.5, 'hours').toDate(),
                    endDate: moment(getNextHour()).add(21, 'hours').toDate(),
                    location: 'Park'
                },
                {
                    name: 'Movie',
                    public: false,
                    startDate: moment(getNextHour()).add(74.5, 'hours').toDate(),
                    endDate: moment(getNextHour()).add(77, 'hours').toDate(),
                    location: 'Theater'
                },
                {
                    name: 'Lunch',
                    public: false,
                    startDate: moment(getNextHour()).add(138, 'hours').toDate(),
                    endDate: moment(getNextHour()).add(139, 'hours').toDate(),
                    location: 'Theater'
                },
            ]
        };
        this.state = {
            sections: this.convertToSections(data)
        };
        this.createNewEvent();
    }

    convertToSections(data) {
        const getSectionTitle = (date) => {
            const eventDate = moment(date);
            if (moment().isSame(eventDate, 'd')) {
                return 'Today';
            }
            if (moment().add(1, 'days').isSame(eventDate, 'd')) {
                return 'Tomorrow';
            }
            return eventDate.format('MM/DD/YY');
        };

        const groups = _.groupBy(data.events, function(event) {
            return getSectionTitle(event.startDate);
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
                    <AntDesign name="plus" size={35}/>
                }
                onFinish={this.createNewEvent}
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
      count: state.count
    };
};

const mapDispatchToProps = {
    increment,
    decrement
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withNavigation(MyEvents));