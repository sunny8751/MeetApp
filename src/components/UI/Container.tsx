import * as React from 'react';
import * as Styles from '../../styles/styles';
import { View, Header, FlatList } from './';
import { KeyboardAvoidingView, Platform } from 'react-native';

export interface ContainerProps {
    navigation: any;
    title?: string;
    titleElementOverride?: JSX.Element;
    finishComponent?: string;
    onFinish?: () => void;
    disableKeyboardAvoidingView?: boolean;
}

class Container extends React.Component<any> {
    render() {
        const { style, navigation, title, titleElementOverride, finishComponent, onFinish, disableKeyboardAvoidingView, ...rest } = this.props;
        const keyboardAvoidingViewProps = {
            enabled: !disableKeyboardAvoidingView
        };
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={[{flex: 1}, style]}
                {...keyboardAvoidingViewProps}
                {...rest}
            >
                <View style={Styles.horizontalLayout}>
                    <Header title={title} navigation={navigation} finishComponent={finishComponent} onFinish={onFinish} titleElementOverride={titleElementOverride}/>
                </View>
                {this.props.children}
            </KeyboardAvoidingView>
        );
    }
}

export default Container;
