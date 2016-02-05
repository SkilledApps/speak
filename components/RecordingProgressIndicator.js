import React from 'react-native';

const { View, Text, Dimensions, StyleSheet } = React;
import Icon from 'react-native-vector-icons/Ionicons';
const window = Dimensions.get('window');

export default class RecordingProgressIndicator extends React.Component {
  render() {
    const { progress } = this.props;
    const completed = progress * 100;
    //console.log(progress, completed);
    return (
      <View style={{position: 'absolute'}}>
        <View style={[styles.trackingControls, {width: window.width, height: window.height / 5}]}>
          <View style={[styles.progress]}>
            <View style={[styles.innerProgressCompleted, {flex: completed, height: window.height / 5}]} />
            <View style={[styles.innerProgressRemaining, {flex: 100 - completed, height: window.height / 5}]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  trackingControls: {
    flex: 1,
    height: 10,
    backgroundColor: '#f7f7f7'
  },
  progress: {
    flexDirection: 'row',
    flex: 1,
    //overflow: 'hidden',
  },
  innerProgressCompleted: {
    backgroundColor: '#FF9500',
  //  backgroundColor: 'black',
  },
  innerProgressRemaining: {
    //top: -5,
    backgroundColor: '#f7f7f7',
  },
})
