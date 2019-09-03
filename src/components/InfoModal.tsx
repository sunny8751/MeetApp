import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import { removeEvents } from '../actions/Actions';
import { getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Container, View, Text, Header, Button, ScrollView, Chat } from './UI';
import database, { myId } from '../database/Database';

export interface InfoModalProps {

}

class InfoModal extends React.Component<InfoModalProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
    }

    closeModal() {
        this.props.navigation.goBack();
    }

    render() {
        const { eventId, colorScheme } = this.props.navigation.state.params;
        const headerButtonStyle = [Styles.headerButton, { backgroundColor: colorScheme.mediumColor }];
        return (
            <View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent'}}>
                <View style={{ height: "50%" ,width: '100%', justifyContent:"flex-end"}}>
                    <Container
                        style={{width: "100%", height: "50%", backgroundColor: colorScheme.lightColor, borderRadius: 15}}
                        headerOverride = {
                            <View style={Styles.horizontalLayout}>
                                <View style={[Styles.headerView, Styles.leftRightView]}>
                                    <Text style={[Styles.headerTitle, {color: colorScheme.darkColor}]}>Info</Text>
                                    <Button onPress={this.closeModal} style={{justifyContent: 'center'}}>
                                        <View style={headerButtonStyle}>
                                            <Ionicons name="ios-close" size={45} color={colorScheme.darkColor} style={{ paddingLeft: 10, paddingRight: 10,  marginBottom: -5, marginTop: -5 }}/>
                                        </View>
                                    </Button>
                                </View>
                            </View>
                        }
                        disableKeyboardAvoidingView={true}
                        colorScheme={colorScheme}
                    >
                        <Text>Hi</Text>
                    </Container>
                </View>
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