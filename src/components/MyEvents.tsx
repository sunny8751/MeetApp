import * as React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { increment, decrement } from '../actions/Actions';

export interface MyEventsProps {

}

class MyEvents extends React.Component<MyEventsProps | any> {
    static navigationOptions = {
        title: `My Events`,
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.paragraph}>{this.props.count}</Text>
                <Button
                    title="Increment"
                    onPress={ this.props.increment }
                />
                <Button
                    title="Decrement"
                    onPress={ this.props.decrement }
                />
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      count: state.count
    };
};
  
const mapDispatchToProps = {
    increment,
    decrement
};
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MyEvents);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});