import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Animated, TouchableOpacity } from 'react-native';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export interface ButtonProps {
    onPress: (e) => void;
    disableAnimate?: boolean;
}

class Button extends React.Component<ButtonProps | any> {
    constructor(props) {
        super(props);
        this.handleOnPressIn = this.handleOnPressIn.bind(this);
        this.handleOnPressOut = this.handleOnPressOut.bind(this);
        this.state = {
            animatedScale: new Animated.Value(1)
        };
    }
      
    handleOnPressIn() {
        if (this.props.disableAnimate) { return; }
        Animated.timing(this.state.animatedScale, {
            toValue: 0.95,
            duration: 100
        }).start();
    }
      
    handleOnPressOut() {
        if (this.props.disableAnimate) { return; }
        Animated.timing(this.state.animatedScale, {
            toValue: 1,
            duration: 100
        }).start();
    }

    render() {
        const { onPress, style, ...rest } = this.props;
        const myStyle = this.props.disableAnimate ? style : [{transform: [{ scale: this.state.animatedScale}]}, style];
        return (
            <AnimatedTouchable
                onPress={(e) => onPress(e)}
                activeOpacity={0.7}
                onPressIn={this.handleOnPressIn}
                onPressOut={this.handleOnPressOut}
                style={myStyle}
                {...rest}
            >
                {this.props.children}
            </AnimatedTouchable>
        );
    }
}

export default Button;
