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

const { View, Text, TouchableOpacity, Image, ActivityIndicatorIOS, ScrollView } = React;

export default class CoursesList extends React.Component {
	render() {
    return (
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={true}>
        {COURSES.map( (e, index) =>
            <View key={index} style={{flex: 1, borderColor: '#ccc', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', padding: 10}}>
              <Image source={require('../comingsoon.png')} style={{width: 100, height: 100, marginRight: 10}}/>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20}}>{e.title}</Text>
                <Text style={{fontSize: 14}}>{e.desc}</Text>
              </View>
            </View>
        )}
      </ScrollView>);

	}
}
