import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Feather } from '@expo/vector-icons';
import {View, Text, Button} from './';

interface HeaderProps {
    navigation: any;
    colorScheme?: any;
    title?: string;
    finishComponent?: JSX.Element;
    onFinish?: () => void;
    titleElementOverride?: JSX.Element;
}

class Header extends React.Component<HeaderProps | any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme,
    };

    constructor(props) {
        super(props);
        this.shouldRenderBackButton = this.shouldRenderBackButton.bind(this);
    }

    shouldRenderBackButton() {
        // return true;
        return this.props.navigation.dangerouslyGetParent().state.index !== 0;
        // return this.props.navigation.state.routes.length > 1;
    }

    render() {
        const { navigation, colorScheme, title, finishComponent, onFinish, titleElementOverride } = this.props;
        const headerButtonStyle = [Styles.headerButton, { backgroundColor: colorScheme.lightColor }];
        return (
            <View style={Styles.headerView}>
                <View style={Styles.leftRightView}>
                    {this.shouldRenderBackButton() ? (
                        <Button onPress={() => navigation.goBack()}>
                            <View style={headerButtonStyle}>
                                <Feather name="chevron-left" size={40} style={{color: colorScheme.darkColor}}/>
                            </View>
                        </Button>
                    ) : <View />}
                    {this.props.finishComponent ? (
                        <Button onPress={onFinish} style={{justifyContent: 'center'}}>
                            <View style={headerButtonStyle}>
                                {finishComponent}
                            </View>
                        </Button>
                    ) : <View />}
                </View>
                {titleElementOverride ? titleElementOverride : (
                    title ? <Text style={[Styles.headerTitle, {color: colorScheme.darkColor}]}>{title}</Text> : <View />
                )}
            </View>
        );
    }
}

export default Header;

