import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './';
import { TouchableWithoutFeedback } from 'react-native';
import { BlurView } from '@react-native-community/blur';

export interface ModalProps {
    title: string;
    handleClose: ()=>void;
    handleSave: ()=>void;
    colorScheme?: any;
    flexSize?: number;
}

class Modal extends React.Component<ModalProps | any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme,
        flexSize: 1
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { title, handleClose, colorScheme, flexSize } = this.props;
        const headerButtonStyle = [Styles.headerButton, { backgroundColor: colorScheme.mediumColor }];
        return (
            <BlurView blurType="light" blurAmount={20} style={Styles.fullscreenAbsolute}>
                <View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent'}}>
                    <TouchableWithoutFeedback onPress={handleClose}>
                        <View style={{flex: 1}}/>
                    </TouchableWithoutFeedback>

                    <Container
                        style={{flex: flexSize, backgroundColor: colorScheme.lightColor, borderRadius: 15}}
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
                        <ScrollView>
                            {this.props.children}
                        </ScrollView>
                    </Container>
                </View>
            </BlurView>
        );
    }
}
  
export default Modal;