import * as React from 'react';
import { connect } from 'react-redux';
import { View, Text } from './UI';

export interface EventOverviewProps {

}

class EventOverview extends React.Component<EventOverviewProps | any> {
    static navigationOptions = {
        title: `New Event`,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Text>New event!</Text>
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
)(EventOverview);