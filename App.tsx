import * as React from 'react';
import { Provider } from 'react-redux';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createStore } from 'redux';
import Reducers from './src/reducers/Reducers';
import MyEvents from './src/components/MyEvents';
import EventOverview from './src/components/EventOverview';
import AddEvent from './src/components/AddEvent';
import InviteFriends from './src/components/InviteFriends';

export interface MyStore {
    count: number;
}

const store = createStore<MyStore>(Reducers);

const routes = {
    MyEvents: MyEvents,
    EventOverview: EventOverview,
    AddEvent: AddEvent,
    InviteFriends: InviteFriends
};

const fade = (props) => {
    const {position, layout, scene} = props
    const index = scene.index;
    const width = layout.initWidth;
    const height = layout.initHeight;
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0]
    });
    const translateY = 0
    const opacity = position.interpolate({
        inputRange: [index - 0.7, index, index + 0.7],
        outputRange: [0.3, 1, 0.3]
    });
    return {
        opacity,
        transform: [{translateX}, {translateY}]
    }
}

const RootStack = createStackNavigator(routes, {
    // initialRouteName: 'InviteFriends',
    transitionConfig: () => ({
        screenInterpolator: (props) => {
            return fade(props);
        }
    })
});

const Navigation = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}
