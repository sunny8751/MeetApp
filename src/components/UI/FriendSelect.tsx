import * as React from 'react';
import * as Styles from '../../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { getTimeColor, getTimeString } from '../../utils/Utils';
import { Card, Avatar, View, Text, Header, Button, ScrollView, TextInput } from './';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FriendSelectProps {
    user: any;
    onPress?: () => void;
    selected: boolean;
    selectedElement?: JSX.Element;
    unselectedElement?: JSX.Element;
    style?: any;
}

class FriendSelect extends React.Component<FriendSelectProps | any> {
    render() {
        const { style, user, onPress, selected, selectedElement, unselectedElement } = this.props;
        const { firstName, lastName, avatar } = user;
        const name = firstName + ' ' + lastName;
        return (
            <Button onPress={onPress} disableAnimate>
                <Card backgroundColor={Styles.defaultColorScheme.lightColor} style={[Styles.horizontalLayout, style]}>
                    <View style={[Styles.center, {paddingRight: 10}]}>
                        <Avatar size={40} user={user} backgroundColor={"white"}/>
                    </View>
                    <View style={[Styles.flex, {marginTop: "auto", marginBottom: "auto"}]}>
                        <Text style={[Styles.cardHeaderText, {color: Styles.defaultColorScheme.darkColor}]}>{name}</Text>
                        {/* <Text style={[Styles.cardSubheaderText, {color: mediumColor}]}>{subheader}</Text> */}
                    </View>
                    {selected ? (
                        selectedElement ? selectedElement : (
                            <MaterialCommunityIcons name="circle" size={40} color={Styles.colors.green} style={Styles.centerRight} />
                        )
                    ) : (
                        unselectedElement ? unselectedElement : (
                            <MaterialCommunityIcons name="circle-outline" size={40} color={Styles.defaultColorScheme.darkColor} style={Styles.centerRight} />
                        )
                    )}
                </Card>
            </Button>
        );
    }
}
  
export default FriendSelect;