
import React from 'react-native';
import Video from 'react-native-video';

const { View, Dimensions } = React;

const window = Dimensions.get('window'); // TODO: get rid of it

export default class VideoWrapper extends React.Component {
  constructor() {
		super();
		this.state = {
			rate: 1,
			volume: 1,
			muted: false,
			resizeMode: 'cover',
			duration: 0.0,
			//currentTime: 0.0,
			chapters: [],
			currentChapter: null,
			//paused: true,
			playIcon: 'pause',
			modeChapterDelete: false,
			practice: false,
			practiceScheme: {
				repeating: 3, 	// repeat chapter 3 times
				interval: 1, 	// 1s between repeatings
			}
		};
	}

  onLoad(data) {
    this.setState({duration: data.duration});
  }


	onProgress(data) {
		// if (debug) console.log(data);
		// if (this.props.debug) {
		// 	if ( this.state.currentChapter) console.log(this.state.currentChapter.end);
		// }

		// if (this.state.currentChapter !== null
		// 	&& this.state.practice === false
		// 	&& Math.round(data.currentTime, -2) === this.state.currentChapter.end)
		// {
		// 	this.setState({paused: true});
		// }
		if (Math.round(data.currentTime, -2) % 0.05) {
      const progress = {
        currentTime: Math.round(data.currentTime * 100) / 100,
				duration: data.playableDuration,
      }
      this.setState(progress);
			this.props.onProgress(progress);
		}
	}

  seek(time) {
    this._videoComponent.seek(time);
  }

  render() {

    const completed = this.state.currentTime ? parseFloat(this.state.currentTime) / parseFloat(this.state.duration) * 100: 0;
    const remaining = 100 - completed;

    return (
      <View style={{
        alignItems: 'center', justifyContent: 'flex-start'
      }}>
        <Video
          ref={component => this._videoComponent = component}
          source={{uri: this.props.source}} // Can be a URL or a local file.
          rate={this.state.rate}
          paused={this.props.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          onLoad={(data) => { this.onLoad(data) }}
          onProgress={(d) => this.onProgress.bind(this)(d) }
          onEnd={() => { /* repeat video */ }}
          repeat={true}
          style={[this.props.style, {flex: 1, height: window.height / 3, width: window.width}]}>
        </Video>
        <View style={[styles.trackingControls]}>
          <View style={[styles.progress]}>
            <View style={[styles.innerProgressCompleted, {flex: completed}]} />
            <View style={[styles.innerProgressRemaining, {flex: remaining}]} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = {
  progress: {
    flexDirection: 'row',
    flex: 1,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 5,
    backgroundColor: 'orange',
  },
  innerProgressRemaining: {
    height: 5,
    backgroundColor: '#f7f7f7',
  }
}
