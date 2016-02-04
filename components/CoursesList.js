/* @flow */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
//import TracksListItem from './TracksListItem';

const COURSES = [{
  title: 'English: Beginner',
  desc: '8 videos, 100 minutes'
}, {
  title: 'English: Advanced',
  desc: '8 videos, 120 minutes'
}, {
  title: 'French: Beginner',
  desc: '8 videos, 88 minutes'
}, {
  title: 'French: Intermediate',
  desc: '5 videos, 120 minutes'
}]

const { View, Text, TouchableOpacity, ActivityIndicatorIOS, ScrollView } = React;

export default class CoursesList extends React.Component {
	render() {
    return (
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={true}>
        {COURSES.map( (e, index) =>
            <View key={index} style={{flex: 1, borderColor: '#ccc', borderBottomWidth: 1, justifyContent: 'center', alignItems: 'center', padding: 40}}>
              <Text style={{fontSize: 20}}>{e.title}</Text>
              <Text style={{fontSize: 14}}>{e.desc}</Text>
            </View>
        )}
      </ScrollView>);

	}
}
