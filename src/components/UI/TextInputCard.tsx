import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Text, Card, TextInput, View } from './';
import { getDarkerColor, getLighterColor } from '../../utils/Utils';
import withOptional from '../WithOptional/WithOptional';
import { Ionicons } from '@expo/vector-icons';

export interface TextInputCardProps {
    title: string;
    handleChangeText: (text) => void;
    textValue: string;
    placeholder: string;
    multiline?: boolean;
    handleClearPress?: () => void;
}

class TextInputCard extends React.Component<TextInputCardProps | any> {
    render() {
        const { title, handleChangeText, textValue, placeholder, multiline, handleClearPress } = this.props;
        return (
            <Card backgroundColor={getLighterColor(Styles.colors.grey)} style={{marginBottom: 20}}>
                <Text style={[Styles.cardSubheaderText, {color: getDarkerColor(Styles.colors.grey), paddingBottom: 5}]}>{title}</Text>
                <View style={[Styles.horizontalLayout, {flex: 1}]}>
                    <TextInput
                        onChangeText={handleChangeText}
                        multiline={multiline}
                        scrollEnabled={false}
                        value={textValue}
                        placeholder={placeholder}
                        placeholderTextColor={Styles.colors.grey}
                        style={[{flex:1}, Styles.text]}
                    />
                    {handleClearPress && textValue ? (
                        <Ionicons
                            name="md-close-circle"
                            size={20}
                            color={Styles.colors.transparentBlack}
                            style={{padding: 5, margin: 0}}
                            onPress={handleClearPress}
                        />
                    ) : <View />}
                </View>
            </Card>
        );
    }
}

export default withOptional(TextInputCard);

