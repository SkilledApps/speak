/* @flow */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
//import TracksListItem from './TracksListItem';


const { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } = React;

export default class LikedList extends React.Component {
  render() {
    const likedTracks = this.props.tracks
      .filter(c => c.timestamps && c.timestamps.filter(t => t.isLiked).length > 0)

    return (
      <ScrollView style={{flex: 1}}>
        {likedTracks && likedTracks.map( (track, index) =>
            <TouchableOpacity key={index} style={styles.itemContainer} onPress={() => this.props.onSelect(track)}>
              <Text style={styles.title}>{track.snippet.title}</Text>
              {track.timestamps.filter(tt => tt.isLiked).map((timestamp, i) =>
                <View key={i} style={styles.recording} onPress={() => this.props.onSelect(track)}>
                  <Text style={{marginRight: 10, color: 'blue'}}>open</Text>
                  <Text>{timestamp.time.toFixed(2)}</Text>
                  <Text>{timestamp.title}</Text>
                </View>
              )}
            </TouchableOpacity>
        )}
        {(!likedTracks || likedTracks.length === 0) &&
          <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
            <Text numberOfLines={2} style={{fontSize: 20, marginTop: 100}}>Your favorite quotes will appear here</Text>
            <Image source={require('./favexample.png')} resizeMode={'contain'} style={{width: 350}}/>
          </View>
        }

      </ScrollView>
    );
	}
}

const styles = StyleSheet.create({
  container: {},
  itemContainer: {
    marginBottom: 20,
    padding: 10,
    borderColor: '#ccc',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20
  },
  recording: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 15
  },
  playIcon: {paddingVertical: 4, paddingHorizontal: 15},
  image   : { flex: 1 },
	screen  : { width: 100, height: 100, backgroundColor: '#f7f7f7' },
  progress: {position: 'absolute', top: -10, height: 20, width: 2, backgroundColor: 'black'},
  timestamps: {marginHorizontal: 10}
})
