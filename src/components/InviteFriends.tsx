import * as React from 'react';
import * as Styles from '../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { getDarkerColor, getLighterColor, getTimeColor, getTimeString } from '../utils/Utils';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput, FriendSelect } from './UI';
import { EventItemProps } from './EventItem';

export interface InviteFriendsProps {
    event: EventItemProps;
}

const users = {
    1: {
        name: 'Bob',
        avatar: 'https://placeimg.com/140/140/any'
    },
    2: {
        name: 'Dylan',
        avatar: 'https://placeimg.com/140/140/any'
    }
}

class InviteFriends extends React.Component<InviteFriendsProps | any> {
    static navigationOptions = {
        header: null,
    }

    constructor(props) {
        super(props);
        this.isFinished = this.isFinished.bind(this);
        this.handleOnFinish = this.handleOnFinish.bind(this);
        this.handleChangeText = this.handleChangeText.bind(this);
        this.getFriendSuggestions = this.getFriendSuggestions.bind(this);
        this.handleSelectFriend = this.handleSelectFriend.bind(this);
        this.state = {
            invited: [],
            searchText: ''
        };
    }

    isFinished() {
        // return Object.keys(this.state['invited']).length > 0;
        return this.state['invited'].length > 0;
    }

    handleOnFinish() {
        if (!this.isFinished()) { return; }
        console.log("Add event");
        this.props.navigation.popToTop({immediate: true});
    }

    handleChangeText(text) {
        this.setState({searchText: text});
    }


    handleSelectFriend(friend: any, selected: boolean) {
        this.setState((prevState) => {
            let invited = prevState['invited'];
            if(selected) {
                return {
                    invited: invited.filter(i => i != friend)
                }
            } else {
                return {
                    // invited: { ...prevState['invited'], friend: true }
                    invited: invited.concat(friend)
                }
            }
        });
    };

    getFriendSuggestions() {
        const suggestions = [1,2];

        return (
            // <FriendSelect name={"Bob"} avatar={undefined} onPress={() => console.log("added bob")} selected={false} />
            suggestions.map((uuid: number) => {
                // TODO: use user id instead
                const selected = this.state['invited'].indexOf(uuid) !== -1;
                const friend = users[uuid];
                return (
                    <FriendSelect
                        name={friend.name}
                        avatar={friend.avatar}
                        onPress={() => this.handleSelectFriend(uuid, selected)}
                        selected={selected}
                        key={uuid}
                    />);
            })
        );
    }

    render() {
        const mediumColor = Styles.colors.grey;
        const lightColor = getLighterColor(mediumColor);
        const darkColor = getDarkerColor(mediumColor);
        const finishComponentStyle = [Styles.headerText, this.isFinished() ? {} : {color: Styles.colors.grey}];
        return (
            <Container
                navigation={this.props.navigation}
                title={"Invite Friends"}
                finishComponent={
                    <Text style={finishComponentStyle}>Invite</Text>
                }
                onFinish={this.handleOnFinish}
            >
                <View style={[Styles.horizontalLayout, {padding: 15}]}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', paddingRight: 10}}>To:</Text>
                    <TextInput
                        style={{flex: 1, fontSize: 20}}
                        onChangeText={this.handleChangeText}
                        value={this.state.searchText}
                        placeholder={"Type to search..."}
                    />
                </View>
                <ScrollView contentContainerStyle={Styles.extraBottomSpace}>
                    {this.getFriendSuggestions()}
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
)(withNavigation(InviteFriends));