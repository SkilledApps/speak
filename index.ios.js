/* @flow */

import React from 'react-native';
import { createStore, applyMiddleware, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux/native';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import storage from 'redux-storage';
import createEngine from 'redux-storage/engines/reactNativeAsyncStorage';


import * as Actions from './actions';
import reducer from './reducers';
import App from './components/App';

const engine = createEngine('speakapp_');
const wrappedReducer = storage.reducer(reducer);
const storageMiddleware = storage.createMiddleware(engine);

const middleware = process.env.NODE_ENV === 'production' ?
  [ thunk, storageMiddleware ] :
  [ thunk, logger(), storageMiddleware ];

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(wrappedReducer);

function mapStateToProps(state) {
  return state;
}

class SpeakApp extends React.Component {
  componentWillMount() {
    const load = storage.createLoader(engine);
    load(store);
  }
  render() {
    return (
      <Provider store={store}>
        {() => <AppContainer />}
      </Provider>
    );
  }
}
//
// class Container extends React.Component {
//   render() {
//     console.log(this.props)
//     const actions = bindActionCreators(Actions, this.props.dispatch);
//     console.log(actions)
//     return <App actions={actions} />;
//   }
// }

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch)
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);


React.AppRegistry.registerComponent('speak', () => SpeakApp);
