import * as React from 'react';
import { Platform } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer, createStackNavigator, SafeAreaView } from 'react-navigation';
import { createStore } from 'redux';
import Reducers from './src/reducers/Reducers';
import MyEvents from './src/components/MyEvents';
import EventOverview from './src/components/EventOverview';
import InviteFriends from './src/components/InviteFriends';
import InfoModal from './src/components/InfoModal';
import Login from './src/components/Login';
import CreateAccount from './src/components/CreateAccount';
import EditProfile from './src/components/EditProfile';
import AddFriends from './src/components/AddFriends';
import EditEvent from './src/components/EditEvent';
import ProfileModal from './src/components/ProfileModal';

export interface MyStore {
    count: number;
}

const store = createStore<MyStore>(Reducers);

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

const MainStack = createStackNavigator(
    {
        Login: Login,
        CreateAccount: CreateAccount,
        AddFriends: AddFriends,
        MyEvents: MyEvents,
        EditProfile: EditProfile,
        EventOverview: EventOverview,
        EditEvent: EditEvent,
        InviteFriends: InviteFriends,
    },
    {
        // initialRouteName: 'Login',
        transitionConfig: () => ({
            screenInterpolator: (props) => {
                return fade(props);
            }
        })
    }
);

const RootStack = createStackNavigator(
    {
      Main: {
        screen: MainStack,
      },
      InfoModal: {
        screen: InfoModal,
      },
      ProfileModal: {
          screen: ProfileModal
      }
    },
    {
        mode: 'modal',
        headerMode: 'none',
        cardStyle: { opacity: 1 },
        transparentCard: true,
    }
  );

const Navigation = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
                <Provider store={store}>
                    <Navigation />
                </Provider>
            </SafeAreaView>
            
        );
    }
}
