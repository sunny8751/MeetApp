import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Text, Card, TextInput, View } from './';
import withOptional from '../WithOptional/WithOptional';
import { Ionicons } from '@expo/vector-icons';

export interface TextInputCardProps {
    title?: string;
    icon?: JSX.Element;
    handleChangeText: (text) => void;
    textValue: string;
    placeholder: string;
    placeholderTextColor?: string;
    multiline?: boolean;
    password?: boolean;
    handleClearPress?: () => void;
    colorScheme?: any;
    autoCapitalize?: string;
}

class TextInputCard extends React.Component<TextInputCardProps | any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme
    }

    render() {
        const { title, icon, handleChangeText, textValue, placeholder, placeholderTextColor, multiline, password, handleClearPress, style, colorScheme, autoCapitalize } = this.props;
        return (
            <Card backgroundColor={colorScheme.lightColor} style={[{marginBottom: 20}, style]}>
                {title ? <Text style={[Styles.cardSubheaderText, {color: colorScheme.darkColor, paddingBottom: 5}]}>{title}</Text> : <View />}
                <View style={Styles.horizontalLayout}>
                    {icon ? icon : <View />}
                    <TextInput
                        onChangeText={handleChangeText}
                        multiline={multiline}
                        scrollEnabled={false}
                        value={textValue}
                        placeholder={placeholder}
                        secureTextEntry={password}
                        placeholderTextColor={placeholderTextColor ? placeholderTextColor : Styles.colors.grey}
                        style={[{flex:1}, Styles.text]}
                        autoCapitalize={autoCapitalize}
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

