import * as React from 'react';
import * as Styles from '../../styles/styles';
import { Text, Card, TextInput, Button, View } from '../UI';
import { getDarkerColor, getLighterColor } from '../../utils/Utils';

export interface WithOptionalProps {
    optional?: boolean;
    optionalText?: string;
    onOptionalPress?: () => void;
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
            const { optional, optionalText, ...rest } = this.props
            return (
                <>
                    {!optional || this.state['showComponent'] ? (
                        <WrappedComponent {...rest as P} />
                    ) : (
                        <Button onPress={this.onOptionalPress}>
                            <Card backgroundColor={getLighterColor(Styles.colors.grey)} style={{marginBottom: 20}}>
                                    <Text style={[Styles.cardSubheaderText, {color: Styles.colors.green, textAlign: 'center'}]}>{optionalText}</Text>
                            </Card>
                        </Button>
                    )}
                </>
            );
        }
    }
};

export default withOptional;

