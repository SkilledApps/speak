/* @flow */
import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Dimensions, Text, PanResponder } = React;

const window = Dimensions.get('window'); // TODO: get rid of it
const VIDEO_HEIGHT = window.height / 3;

export default class Cursor extends React.Component {
  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      // onStartShouldSetPanResponder: (evt, gestureState) => true,
      // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The guesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.{x,y}0 will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        //console.log(gestureState)
        this.props.onMove(gestureState.moveX)
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  render() {

    return (
      <View {...this._panResponder.panHandlers}
      style={[styles.cursor, {
        left:this.props.position,
        top: VIDEO_HEIGHT - 95 - this.props.progressHeight
      }]}>
        <Icon name={'ios-location'} size={50} color={this.props.color} />
        <View style={{width: 3, height: 10 + this.props.progressHeight, left: -0.5, top: -10, backgroundColor: this.props.color}} />
      </View>
    )
  }
}

const styles = {
  cursor: {position: 'absolute', alignItems: 'center', opacity: 0.7, backgroundColor: 'transparent'}
}
