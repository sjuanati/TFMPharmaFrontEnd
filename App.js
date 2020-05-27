import React from 'react';
import { Root, Button, Text, Container, Content } from "native-base";

import AppNavigator from './src/navigation/AppNavigator';

import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import orderReducer from './src/store/reducers/order';
import profileReducer from './src/store/reducers/pharmacy';

// Set global state variables through Redux
const rootReducer = combineReducers({
  order: orderReducer,
  pharmacy: profileReducer
});
const store = createStore(rootReducer);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Container>
          {/*{Platform.OS === 'ios' && <StatusBar barStyle="default" />}*/}
          <Root>
            <AppNavigator />
          </Root>
        </Container>
      </Provider>
    );
  }
};