import * as React from 'react';
import { Provider } from 'react-redux';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { createStore } from 'redux';
import Reducers from './src/reducers/Reducers';
import MyEvents from './src/components/MyEvents';
import EventOverview from './src/components/EventOverview';
import CreateEvent from './src/components/CreateEvent';

export interface MyStore {
    count: number;
}

let store = createStore<MyStore>(Reducers);

let RootStack = createStackNavigator({
    MyEvents: MyEvents,
    EventOverview: EventOverview,
    CreateEvent: CreateEvent
});

let Navigation = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}
