import * as React from 'react';
import * as Styles from '../../styles/styles';
import { DatePickerIOS } from 'react-native';

export interface DatePickerProps {
    onDateChange: (date) => void;
    date: any;
}

class DatePicker extends React.Component<DatePickerProps | any> {
    render() {
        const { onDateChange, date, ...rest } = this.props;
        return (
            <DatePickerIOS date={date} onDateChange={onDateChange} minuteInterval={5} {...rest}/>
        );
    }
}

export default DatePicker;
