import * as React from 'react';
import * as Styles from '../../styles/styles';
import moment from 'moment';
import { Text, Card, View, DatePicker, Button } from './';
import { Keyboard, Animated } from 'react-native';
import withOptional from '../WithOptional/WithOptional';

export interface DatePickerCardProps {
    title: string;
    onDateChange: (date) => void;
    date: any;
    initialShowDatePicker?: boolean;
    timeText: string;
}

class DatePickerCard extends React.Component<DatePickerCardProps | any> {
    constructor(props) {{
        super(props);
        this.handleOnPress = this.handleOnPress.bind(this);
        this.initContentHeight = this.initContentHeight.bind(this);
        this.getMinHeight = this.getMinHeight.bind(this);
        this.getMaxHeight = this.getMaxHeight.bind(this);
        this.state = {
            showDatePicker: props.initialShowDatePicker,
            animatedHeight: new Animated.Value(200),
            contentHeight: 0
        }
    }}

    handleOnPress(e) {
        Keyboard.dismiss();
        Animated.timing(this.state.animatedHeight, {
            toValue: this.state.showDatePicker ? this.getMinHeight() : this.getMaxHeight(),
            duration: 100,
        }).start();
        this.setState({showDatePicker: !this.state['showDatePicker']});
    }

    initContentHeight(e) {
        if (this.state.contentHeight>0) return;
        this.state.contentHeight = e.nativeEvent.layout.height;
        this.state.animatedHeight.setValue(this.state.showDatePicker ? this.getMaxHeight() : this.getMinHeight() );
    }

    getMinHeight() {
        return 0;
    }

    getMaxHeight() {
        return this.state.contentHeight;
    }

    render() {
        const { title, onDateChange, date, timeText, ...rest } = this.props;
        return (
            <Button onPress={this.handleOnPress} disableAnimate>
                <Card backgroundColor={Styles.defaultColorScheme.lightColor} style={{marginBottom: 20}}>
                    <Text style={[Styles.cardSubheaderText, {color: Styles.defaultColorScheme.darkColor, paddingBottom: 5}]}>{title}</Text>

                    {timeText}

                    <Animated.View style={{height: this.state.animatedHeight, overflow: "hidden" }} onLayout={this.initContentHeight}>
                        <DatePicker
                            onDateChange={onDateChange}
                            date={date}
                            {...rest}
                        />
                    </Animated.View>
                </Card>
            </Button>
        );
    }
}

export default withOptional(DatePickerCard);

