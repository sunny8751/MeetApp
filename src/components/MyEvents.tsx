import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import _ from 'lodash';
import moment from 'moment';
import { increment, decrement } from '../actions/Actions';
import EventsList from './EventsList';
import { Button } from './UI';
import { AntDesign } from '@expo/vector-icons';

export interface MyEventsProps {

}

class MyEvents extends React.Component<MyEventsProps | any> {
    static navigationOptions = {
        title: `My Events`,
        headerStyle: Styles.headerStyle
    };

    constructor(props) {
        super(props);
        this.convertToSections = this.convertToSections.bind(this);
        this.createNewEvent = this.createNewEvent.bind(this);
        this.getAddButton = this.getAddButton.bind(this);
        const data = {
            events: [
                {
                    name: 'Basketball practice with some other text in here for giggles',
                    public: true,
                    startDate: Date.now(),
                    endDate: Date.now() + 2 * 60*60*1000,
                    location: 'KFPC'
                },
                {
                    name: 'Dinner',
                    public: false,
                    startDate: Date.now() + 1000,
                    location: 'HMart'
                },
                {
                    name: 'Running',
                    public: false,
                    startDate: Date.now() + 1 * 86400000,
                    endDate: Date.now() + 1 * 86400000 + 1 * 60*60*1000,
                    location: 'Park'
                },
                {
                    name: 'Movie',
                    public: false,
                    startDate: Date.now() + 3 * 86400000,
                    endDate: Date.now() + 2 * 86400000 + 3 * 60*60*1000,
                    location: 'AMC Theater'
                },
            ]
        };
        this.state = {
            sections: this.convertToSections(data)
        };
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
        this.props.navigation.navigate('CreateEvent');
    }

    getAddButton(): JSX.Element {
        return (
            <Button onPress={this.createNewEvent} style={Styles.addButton}>
                <AntDesign name="plus" size={35}/>
            </Button>
        );
    }

    render() {
        return (
            <>
                <EventsList sections={this.state['sections']} />
                {this.getAddButton()}
            </>
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