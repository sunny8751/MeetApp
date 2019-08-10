import * as React from 'react';
import * as Styles from '../../styles/styles';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { getDarkerColor, getLighterColor, getTimeColor, getTimeString } from '../../utils/Utils';
import { Card, Container, View, Text, Header, Button, ScrollView, TextInput } from './';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface FriendSelectProps {
    avatar: any;
    name: string;
    onPress: () => void;
    selected: boolean;
}

class FriendSelect extends React.Component<FriendSelectProps | any> {
    render() {
        const mediumColor = Styles.colors.grey;
        const lightColor = getLighterColor(mediumColor);
        const darkColor = getDarkerColor(mediumColor);
        const { avatar, name, onPress, selected } = this.props;
        return (
            <Button onPress={onPress} disableAnimate>
                <Card backgroundColor={lightColor} style={Styles.horizontalLayout}>
                    <View style={[Styles.flex, {marginTop: "auto", marginBottom: "auto"}]}>
                        <Text style={[Styles.cardHeaderText, {color: darkColor}]}>{name}</Text>
                        {/* <Text style={[Styles.cardSubheaderText, {color: mediumColor}]}>{subheader}</Text> */}
                    </View>
                    {selected ? (
                        <MaterialCommunityIcons name="circle" size={40} color={Styles.colors.green} style={Styles.centerRight} />
                    ) : (
                        <MaterialCommunityIcons name="circle-outline" size={40} color={darkColor} style={Styles.centerRight} />
                    )}
                </Card>
            </Button>
        );
    }
}
  
export default FriendSelect;