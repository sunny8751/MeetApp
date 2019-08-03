import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Text, Card, TextInput, View } from './';
import { getDarkerColor, getLighterColor } from '../../utils/Utils';
import withOptional from '../WithOptional/WithOptional';

export interface TextInputCardProps {
    title: string;
    onChangeText: (text) => void;
    textValue: string;
    placeholder: string;
}

class TextInputCard extends React.Component<TextInputCardProps | any> {
    render() {
        const { title, onChangeText, textValue, placeholder } = this.props;
        return (
            <Card backgroundColor={getLighterColor(Styles.colors.grey)} style={{marginBottom: 20}}>
                <Text style={[Styles.cardSubheaderText, {color: getDarkerColor(Styles.colors.grey), paddingBottom: 5}]}>{title}</Text>
                <View style={{flex: 1}}>
                    <TextInput
                        onChangeText={onChangeText}
                        multiline
                        scrollEnabled={false}
                        value={textValue}
                        placeholder={placeholder}
                        placeholderTextColor={Styles.colors.grey}
                        style={[{flex:1}, Styles.text]}
                    />
                </View>
            </Card>
        );
    }
}

export default withOptional(TextInputCard);

