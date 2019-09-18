import * as React from 'react';
import * as Styles from '../../styles/styles';
import { View, Header, FlatList } from './';
import { KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Header as RNHeader } from 'react-navigation';

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
    disableSafeAreaView?: boolean;
    keyboardBehavior?: string;
}

const ConditionalSafeAreaView = ({ children, disableSafeAreaView }) => (
    disableSafeAreaView ? children : (
        <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
    )
);

class Container extends React.Component<any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme,
        disableKeyboardAvoidingView: false,
        disableSafeAreaView: false
    };

    render() {
        const { navigation, style, title, titleElementOverride, backElementOverride,
            finishComponent, onFinish, disableKeyboardAvoidingView, colorScheme,
            headerOverride, disableSafeAreaView, keyboardBehavior, ...rest } = this.props;
        const keyboardAvoidingViewProps = {
            enabled: !disableKeyboardAvoidingView
        };
        return (
            <KeyboardAvoidingView
                behavior={keyboardBehavior ? keyboardBehavior : (Platform.OS === "ios" ? "padding" : null)}
                // keyboardVerticalOffset={RNHeader.HEIGHT}
                style={[{flex: 1, backgroundColor: Styles.colors.white}, style]}
                {...keyboardAvoidingViewProps}
                {...rest}
            >
                <ConditionalSafeAreaView
                    disableSafeAreaView={disableSafeAreaView}
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
                </ConditionalSafeAreaView>
            </KeyboardAvoidingView>
        );
    }
}

export default Container;
