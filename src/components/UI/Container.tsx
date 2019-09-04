import * as React from 'react';
import * as Styles from '../../styles/styles';
import { View, Header, FlatList } from './';
import { KeyboardAvoidingView, Platform } from 'react-native';

export interface ContainerProps {
    navigation: any;
    style?: any;
    title?: string;
    titleElementOverride?: JSX.Element;
    backElementOverride?: JSX.Element;
    finishComponent?: string;
    onFinish?: () => void;
    disableKeyboardAvoidingView?: boolean;
    colorScheme?: any;
    headerOverride?: JSX.Element;
}

class Container extends React.Component<any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme,
    };

    render() {
        const { navigation, style, title, titleElementOverride, backElementOverride, finishComponent, onFinish, disableKeyboardAvoidingView, colorScheme, headerOverride, ...rest } = this.props;
        const keyboardAvoidingViewProps = {
            enabled: !disableKeyboardAvoidingView
        };
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={[{flex: 1, backgroundColor: Styles.colors.white}, style]}
                {...keyboardAvoidingViewProps}
                {...rest}
            >
                {headerOverride ? headerOverride : (
                <View style={Styles.horizontalLayout}>
                    <Header
                        title={title}
                        navigation={navigation}
                        finishComponent={finishComponent}
                        onFinish={onFinish}
                        titleElementOverride={titleElementOverride}
                        backElementOverride={backElementOverride}
                        colorScheme={colorScheme}
                    />
                </View>
                )}
                {this.props.children}
            </KeyboardAvoidingView>
        );
    }
}

export default Container;
