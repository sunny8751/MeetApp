import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Text, Card, TextInput, View } from './';
import withOptional from '../WithOptional/WithOptional';
import { Ionicons } from '@expo/vector-icons';

export interface TextInputCardProps {
    title: string;
    handleChangeText: (text) => void;
    textValue: string;
    placeholder: string;
    placeholderTextColor?: string;
    multiline?: boolean;
    handleClearPress?: () => void;
    colorScheme?: any;
}

class TextInputCard extends React.Component<TextInputCardProps | any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme
    }

    render() {
        const { title, handleChangeText, textValue, placeholder, placeholderTextColor, multiline, handleClearPress, style, colorScheme } = this.props;
        return (
            <Card backgroundColor={colorScheme.lightColor} style={[{marginBottom: 20}, style]}>
                <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, paddingBottom: 5}]}>{title}</Text>
                <View style={[Styles.horizontalLayout, {flex: 1}]}>
                    <TextInput
                        onChangeText={handleChangeText}
                        multiline={multiline}
                        scrollEnabled={false}
                        value={textValue}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor ? placeholderTextColor : Styles.colors.grey}
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

