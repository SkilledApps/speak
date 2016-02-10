/* @flow */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as AudioRecorder from './AudioRecorder'
import moment from 'moment'
import reformat from './reformatTime'

const { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, LayoutAnimation } = React;

export default class Recordings extends React.Component {
  constructor() {
    super();
    this.state = {
      tracks: {}
    };
  }

  componentWillUpdate() {
    LayoutAnimation.linear();
  }

	render() {
    const recordings = this.props.tracks.filter(c => c.recordings);
    return (
      <ScrollView style={{flex: 1}}>
        {recordings.map( (track, index) =>
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.title}>{track.snippet.title}</Text>
              {track.recordings.reverse().map((recording, i) =>
                <View key={i} style={styles.recording}>
                  {recording.createdAt && <Text>Practiced {moment(recording.createdAt).calendar()}</Text>}
                  <View key={i} style={styles.recordingControls}>
                    <TouchableOpacity onPress={() => this.playRecording(recording)} style={{width: 50}}>
                      <Icon name={this.state.tracks[recording.trackName] && this.state.tracks[recording.trackName].isPlaying ? 'pause' : 'play'}
                        size={28} color='#F5D700'
                        style={styles.playIcon}
                      />
                    </TouchableOpacity>
                    <View style={{height: 1, width: 200, backgroundColor: 'black'}}>
                      <View style={[styles.progress, {left: this.state.tracks[recording.trackName] && this.state.tracks[recording.trackName].time / recording.duration * 200}]} />
                    </View>
                    <Text style={styles.timestamps}>{this.state.tracks[recording.trackName] ? reformat(this.state.tracks[recording.trackName].time): '00:00'} / {reformat(recording.duration)}</Text>
                  </View>
                </View>
              )}
            </View>
        )}

      </ScrollView>
    );
	}

  _onProgress(trackName, data) {
    if (data.currentTime + 0.25 > this.state.tracks[trackName].duration) {
      this.state.tracks[trackName].time = this.state.tracks[trackName].duration;
      this.state.tracks[trackName].isPlaying = false;
      AudioRecorder.stopPlayer(trackName);
    } else {
      this.state.tracks[trackName].time = data.currentTime;
    }
    this.setState({
      tracks: this.state.tracks
    })
  }

  playRecording({trackName, duration}) {
    if (!this.state.tracks[trackName] || this.state.tracks[trackName].time === duration) {
      this.state.tracks[trackName] = {
        isPlaying: true,
        duration,
        time: 0
      };
      this.setState({
        tracks: this.state.tracks
      })
      AudioRecorder.playRecording(trackName, this._onProgress.bind(this, trackName));
    } else {
      if (this.state.tracks[trackName].isPlaying) {
        AudioRecorder.stopPlayer(trackName);
      } else {
        AudioRecorder.resume(trackName, this.state.tracks[trackName].time, this._onProgress.bind(this, trackName));
      }
      Object.keys(this.state.tracks).forEach(t => {
        this.state.tracks[t].isPlaying = t === trackName ? !this.state.tracks[trackName].isPlaying : false;
      });
      this.setState({
        tracks: this.state.tracks
      })
    }

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
    marginVertical: 15
  },
  recordingControls: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  playIcon: {paddingVertical: 4, paddingHorizontal: 15},
  image   : { flex: 1 },
	screen  : { width: 100, height: 100, backgroundColor: '#f7f7f7' },
  progress: {position: 'absolute', top: -10, height: 20, width: 2, backgroundColor: 'black'},
  timestamps: {marginHorizontal: 10}
})
