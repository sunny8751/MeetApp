import * as React from 'react';
import { Platform, Easing, Animated } from 'react-native';
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
import InvitedList from './src/components/InvitedList';
import InviteModal from './src/components/InviteModal';
import ForgotPassword from './src/components/ForgotPassword';

export interface MyStore {
    count: number;
}

const store = createStore<MyStore>(Reducers);

export { store };

const rightTransition = (props) => {
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

const modalTransition = (props) => {
    const {position, layout, scene} = props
    const index = scene.index;
    const width = layout.initWidth;
    const height = layout.initHeight;
    const translateX = 0;
    const translateY = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [height, 0, 0]
    });
    const opacity = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [1, 1, 0.4]
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
        InvitedList: InvitedList,
        ForgotPassword: ForgotPassword,
    },
    {
        // initialRouteName: 'Login',
        transitionConfig: () => ({
            screenInterpolator: (props) => {
                return rightTransition(props);
            }
        }),
        headerMode: 'none',
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
      },
      InviteModal: {
          screen: InviteModal
      }
    },
    {
        mode: 'modal',
        headerMode: 'none',
        // cardStyle: { opacity: 1 },
        transparentCard: true,
        transitionConfig: () => ({
            screenInterpolator: (props) => {
                return modalTransition(props);
            },
        })

        // transitionConfig: () => ({
        //     transitionSpec: {
        //     duration: 750,
        //     easing: Easing.out(Easing.poly(4)),
        //     timing: Animated.timing,
        //     useNativeDriver: true,
        //     },
        //     screenInterpolator: sceneProps => {
        //     const { layout, position, scene } = sceneProps;
        //     const thisSceneIndex = scene.index;
        
        //     const height = layout.initHeight;
        //     const translateY = position.interpolate({
        //         inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        //         outputRange: [height, 0, 0],
        //     });
        
        //     const opacity = position.interpolate({
        //         inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
        //         outputRange: [1, 1, 0.5],
        //     });
        
        //     return { opacity, transform: [{ translateY }] };
        //     },
        // }),

    }
  );

const Navigation = createAppContainer(RootStack);

console.disableYellowBox = true;

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <Navigation />
            </Provider>
        );
    }
}
