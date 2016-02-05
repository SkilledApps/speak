import React from 'react-native';
const { View, Text, TouchableOpacity, SliderIOS, StyleSheet, Dimensions, Switch,} = React;
const { width, height } = Dimensions.get('window');

export default class Settings extends React.Component {
	getEstimates() {
		if (!this.props.selectedIndex) {
			return 0;
		}
		const t = this.props.selectedIndex.type === 'found' ?
			this.props.foundTracks[this.props.selectedIndex.index] :
			this.props.savedTracks[this.props.selectedIndex.index];

		if (!t.timestamps) {
			return 0;
		}

		return Math.round(
			Math.round(
				this.props.settings.repeats * t.timestamps[t.timestamps.length - 1].time * (this.props.settings.intervalRatio + 1)) / 60);
	}

	render() {

		return (
			<View style={styles.wrapper}>

				<Text style={[styles.title, { marginTop: 20 }]}>Start From</Text>
				<View style={styles.toggleWrapper}>
					<Text style={[styles.title, { paddingRight: 55 }]}>Beginning</Text>
					<Switch onTintColor="#FF9500"
						value={this.props.settings.startFromPause}
						onValueChange={(startFromPause) => this.props.onSettingsChanged({startFromPause}) }
				  />
					<Text style={[styles.title, { paddingLeft: 30 }]}>Current Pause</Text>
				</View>

				<Text style={styles.title}>How many times repeat each segment?</Text>
				<View style={styles.sliderWrapper}>
					<SliderIOS
						minimumTrackTintColor="#FF9500"
						minimumValue={1}
						maximumValue={10}
						step={1}
						value={this.props.settings.repeats}
						onValueChange={(repeats) => this.props.onSettingsChanged({repeats}) }
						style={[styles.sliderIOSBasics]}
					/>
					<View style={styles.slidersParams}>
						<Text style={styles.slidersParam}>1</Text>
						<Text style={styles.slidersParam}>Current: {this.props.settings.repeats}</Text>
						<Text style={styles.slidersParam}>10</Text>
					</View>
				</View>

				<Text style={styles.title}>Interval Ratio on Speak phase</Text>
				<View style={styles.sliderWrapper}>
					<SliderIOS
						minimumTrackTintColor="#FF9500"
						minimumValue={1}
						maximumValue={5}
						step={0.1}
						value={this.props.settings.intervalRatio}
						onValueChange={(intervalRatio) => this.props.onSettingsChanged({intervalRatio}) }
						style={[styles.sliderIOSBasics]}
					/>
					<View style={styles.slidersParams}>
						<Text style={styles.slidersParam}>2x</Text>
						<Text style={styles.slidersParam}>Current: {this.props.settings.intervalRatio}x</Text>
						<Text style={styles.slidersParam}>10x</Text>
					</View>
				</View>

				<Text style={styles.title}>Estimate Practice Time:  <Text>{this.getEstimates()}</Text> min.</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: { justifyContent: 'center', alignItems: 'center' },
	sliderIOSBasics:{ width: width * 0.75 },
	sldierWrapper:  { width: width * 0.75 },
	slidersParams:  { flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: width * 0.75 },
	slidersParam:   { color: '#8E8E93', fontSize: 11},
	title: { color: '#4A4A4A', fontSize: 16, marginTop: 10 },
	toggleWrapper: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: width * 0.9, marginTop: 20, marginBottom: 20 }
});
