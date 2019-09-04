import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Ionicons } from '@expo/vector-icons';
import { TextInputCard, Card, Container, View, Text, Header, Button, ScrollView, Chat } from './';
import { TouchableWithoutFeedback } from 'react-native';

export interface ModalProps {
    title: string;
    handleClose: ()=>void;
    colorScheme?: any;
}

class Modal extends React.Component<ModalProps | any> {
    static defaultProps = {
        colorScheme: Styles.defaultColorScheme
    }

    constructor(props) {
        super(props);
    }

    render() {
        const { title, handleClose, colorScheme } = this.props;
        const headerButtonStyle = [Styles.headerButton, { backgroundColor: colorScheme.mediumColor }];
        return (
            <View style={{ flex: 1 ,flexDirection: 'column', justifyContent: 'flex-end', backgroundColor: 'transparent'}}>
                <TouchableWithoutFeedback onPress={handleClose}>
                    <View style={{flex: 1}}/>
                </TouchableWithoutFeedback>

                <Container
                    style={{flex: 1, backgroundColor: colorScheme.lightColor, borderRadius: 15}}
                    headerOverride = {
                        <View style={[Styles.leftRightView, {paddingLeft: 15, paddingRight: 15, paddingBottom: 15}]}>
                            <Text style={[Styles.headerTitle, {color: colorScheme.darkColor}]}>{title}</Text>
                            <Button onPress={handleClose} style={{justifyContent: 'center', paddingTop: 15}}>
                                <View style={headerButtonStyle}>
                                    <Ionicons name="ios-close" size={45} color={colorScheme.darkColor} style={{ paddingLeft: 10, paddingRight: 10,  marginBottom: -7, marginTop: -5 }}/>
                                </View>
                            </Button>
                        </View>
                    }
                    disableKeyboardAvoidingView={true}
                    colorScheme={colorScheme}
                >
                    {this.props.children}
                </Container>
            </View>
        );
    }
}
  
export default Modal;