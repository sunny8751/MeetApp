import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Text, Card, TextInput, Button, View } from '../UI';

export interface WithOptionalProps {
    optional?: boolean;
    optionalText?: string;
    onOptionalPress?: () => void;
    optionalStyle?: any;
    optionalTextStyle?: any;
}

const withOptional = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return class WithOptional extends React.Component<P & WithOptionalProps> {
        constructor(props) {
            super(props);
            this.onOptionalPress = this.onOptionalPress.bind(this);
            this.state = {
                showComponent: false
            }
        }

        onOptionalPress() {
            const { onOptionalPress } = this.props;
            if (onOptionalPress) {
                this.props.onOptionalPress();
            }
            this.setState({showComponent: true});
        }

        render() {
            const { optional, optionalText, optionalStyle, optionalTextStyle, ...rest } = this.props
            return (
                <>
                    {!optional || this.state['showComponent'] ? (
                        <WrappedComponent {...rest as P} />
                    ) : (
                        <Button onPress={this.onOptionalPress}>
                            <Card backgroundColor={Styles.defaultColorScheme.lightColor} style={[{marginBottom: 20}, optionalStyle]}>
                                    <Text style={[Styles.cardSubheaderText, {color: Styles.colors.green, textAlign: 'center'}, optionalTextStyle]}>{optionalText}</Text>
                            </Card>
                        </Button>
                    )}
                </>
            );
        }
    }
};

export default withOptional;

