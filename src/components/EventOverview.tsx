import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { getDarkerColor, getLighterColor, getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';

export interface EventOverviewProps {

}

class EventOverview extends React.Component<EventOverviewProps | any> {
    static navigationOptions = {
        // title: navigation.getParam('name', 'Event Overview'),
        // headerStyle: Styles.headerStyle,
        // headerTitleStyle: Styles.headerTitleStyle,
        // return {
        //     header: (props) => <Header title={} />
        // };
        header: null,
        // headerLeft: <Button onPress={() => console.log('click')}><Text>{"Hello"}</Text></Button>
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { name, publicInvite, startDate, endDate, location, description, invited, colorScheme } = this.props.navigation.state.params;
        const mediumColor = colorScheme;
        const lightColor = getLighterColor(mediumColor);
        const darkColor = getDarkerColor(mediumColor);
        return (
            <Container
                navigation={this.props.navigation}
                style={{backgroundColor: lightColor}}
                disableKeyboardAvoidingView={true}
                titleElementOverride={(
                    <View>
                        <Text style={Styles.headerTitle}>{name}</Text>
                        {location && (
                        <Text style={Styles.cardSubheaderText}>{location}</Text>
                        )}
                        <Text style={[Styles.cardSubheaderText, {color: getTimeColor(startDate)}]}>{getTimeString(startDate, endDate)}</Text>
                    </View>
                )}
            >
                {/* <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    <Text>Hi</Text>
                </ScrollView> */}
                <Chat />
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
)(withNavigation(EventOverview));