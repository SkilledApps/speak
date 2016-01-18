import React from 'react-native';

const { View, Text } = React;
import Icon from 'react-native-vector-icons/Ionicons';

export default class OnboardingTip extends React.Component {
  render() {
    return (
      <View style={{paddingVertical: 50}}>
        <Text style={{color: '#888', lineHeight: 30}}>
            Hi! You are in the <Text style={{fontWeight: 'bold'}}>Edit Mode</Text>!
        </Text>
        <Text style={{color: '#888', lineHeight: 30}}>
            Press  <Icon name='scissors' size={20} color='orange' style={{paddingHorizontal: 10}}/> to start splitting video into segments
        </Text>
      </View>
    );
  }
}
