import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TracksListItem from './TracksListItem';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, ScrollView } = React;

export default class TracksList extends React.Component {
	render() {
    return (
      <ScrollView style={{flex: 1}}>
        {this.props.tracks.map( (e, index) =>
            <TracksListItem
              key={index}
              {...e}
              onPress={ () => { alert('onPress') }}
              descr={e.toString()}
            />
        )}
      </ScrollView>);

	}
}
