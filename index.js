/**
 * @format
 */
import 'react-native-gesture-handler'; // Import at the top to avoid errors

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';


import { GestureHandlerRootView } from 'react-native-gesture-handler';

  
AppRegistry.registerComponent(appName, () => App);


  