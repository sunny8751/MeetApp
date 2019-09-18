import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './';
import { TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { BlurView } from '@react-native-community/blur';

export interface ModalProps {
    title: string;
    handleClose: ()=>void;
    handleSave: ()=>void;
    colorScheme?: any;
    flexSize?: number;
    topFlexSize?: number;
    bottomFlexSize?: number;
    style?: any;
}

class Modal extends React.Component<ModalProps | any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme,
        topFlexSize: 1,
        bottomFlexSize: 0,
        flexSize: 1
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { style, title, handleClose, colorScheme, flexSize, topFlexSize, bottomFlexSize } = this.props;
        const headerButtonStyle = [Styles.headerButton, { backgroundColor: colorScheme.lightColor }];
        return (
            <SafeAreaView style={{flex: 1}}>
            {/* <BlurView blurType="dark" blurAmount={20} style={Styles.modal}> */}
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View style={{flex: topFlexSize}}/>
                    </TouchableWithoutFeedback>

                    <Container
                        style={[{flex: flexSize, backgroundColor: Styles.colors.white, borderRadius: 15}, style]}
                        disableSafeAreaView
                        headerOverride = {
                            <View style={[Styles.leftRightView, {padding: 20}]}>
                                <Text style={[Styles.headerTitle, {paddingTop: 5, color: colorScheme.darkColor}]}>{title}</Text>
                                
                                <Button onPress={handleClose} style={{justifyContent: 'center'}}>
                                    <View style={headerButtonStyle}>
                                        <Ionicons name="ios-close" size={45} color={colorScheme.darkColor} style={{ paddingLeft: 10, paddingRight: 10,  marginBottom: -7, marginTop: -5 }}/>
                                    </View>
                                </Button>
                                {/* <Button onPress={handleSave} style={{justifyContent: 'center'}}>
                                    <Card backgroundColor={colorScheme.mediumColor} style={{padding: 10, marginLeft: 0, marginRight: 0, marginBottom: 0}}>
                                        <Text style={{color: colorScheme.darkColor, textAlign: 'center', fontWeight: 'bold', fontSize: 20}}>Save</Text>
                                    </Card>
                                </Button> */}
                            </View>
                        }
                        disableKeyboardAvoidingView={true}
                        colorScheme={colorScheme}
                    >
                        <ScrollView style={{paddingBottom: 20}}>
                            {this.props.children}
                        </ScrollView>
                    </Container>

                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View style={{flex: bottomFlexSize}}/>
                    </TouchableWithoutFeedback>
            {/* </BlurView> */}
            </SafeAreaView>
        );
    }
}
  
export default Modal;