import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Feather } from '@expo/vector-icons';
import {View, Text, Button} from './';

interface HeaderProps {
    navigation: any;
    title?: string;
    finishComponent?: JSX.Element;
    onFinish?: () => void;
    titleElementOverride?: JSX.Element;
}

class Header extends React.Component<HeaderProps | any> {
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
        const { navigation, title, finishComponent, onFinish, titleElementOverride } = this.props;
        (titleElementOverride);
        return (
            <View style={Styles.headerView}>
                <View style={Styles.leftRightView}>
                    {this.shouldRenderBackButton() ? (
                        <Button onPress={() => navigation.goBack()}>
                            <Feather name="chevron-left" size={40}/>
                        </Button>
                    ) : <View />}
                    {this.props.finishComponent ? (
                        <Button onPress={onFinish} style={{justifyContent: 'center'}}>
                            {finishComponent}
                        </Button>
                    ) : <View />}
                </View>
                {titleElementOverride ? titleElementOverride : (
                    title && <Text style={Styles.headerTitle}>{title}</Text>
                )}
            </View>
        );
    }
}

export default Header;

