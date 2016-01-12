/**
 * Created by tronin on 11.01.16.
 */

import React from 'react-native';
import Header from './Header';
const { View, Text, TouchableOpacity, SliderIOS, StyleSheet, Dimensions, Switch,} = React;
const { width, height } = Dimensions.get('window');

export default class Settings extends React.Component {
	render() {
		return (
			<View style={styles.wrapper}>
				<Header
					color={{left: '#4A4A4A', right: 'transparent'}}
					size={{left: 40, right: 30}}
					icon={{left: 'ios-arrow-back', right: ' '}}
					actionLeft={this.props.onHideModal}
					actionRight={this.props.onHideModal}
				    title="Practice Settings"
				    style={{marginBottom: 20}}
				/>

				<Text style={[styles.title, { marginTop: 20 }]}>Start From</Text>
				<View style={styles.toggleWrapper}>
					<Text style={[styles.title, { paddingRight: 55 }]}>Beginning</Text>
					<Switch onTintColor="#FF9500" value={this.props.switchStartMode} onValueChange={this.props.onSwitchStartMode}/>
					<Text style={[styles.title, { paddingLeft: 30 }]}>Current Pause</Text>
				</View>

				<Text style={styles.title}>Repeat Times</Text>
				<View style={styles.sliderWrapper}>
					<SliderIOS
						minimumTrackTintColor="#FF9500"
						minimumValue={1}
						maximumValue={10}
						step={1}
						value={this.props.currentRepeatCount}
						onValueChange={(value) => {
						this.props.onRepeatsValueChange(value);
						if (this.props.debug) {console.log(value);}}
					}
						style={[styles.sliderIOSBasics]}
					/>
					<View style={styles.slidersParams}>
						<Text style={styles.slidersParam}>1</Text>
						<Text style={styles.slidersParam}>{this.props.currentRepeatCount}</Text>
						<Text style={styles.slidersParam}>10</Text>
					</View>
				</View>

				<Text style={styles.title}>Cycle Time (Approximate)</Text>
				<View style={styles.sliderWrapper}>
					<SliderIOS
						minimumTrackTintColor="#FF9500"
						minimumValue={3}
						maximumValue={60}
						step={1}
						value={this.props.currentCycleTimeCount}
						onValueChange={(value) => {
						this.props.onCycleTimeCount(value);
						if (this.props.debug) {console.log(value);}}
					}
						style={[styles.sliderIOSBasics]}
					/>
					<View style={styles.slidersParams}>
						<Text style={styles.slidersParam}>3 seconds</Text>
						<Text style={styles.slidersParam}>{this.props.currentCycleTimeCount}</Text>
						<Text style={styles.slidersParam}>60 seconds</Text>
					</View>
				</View>

				<Text style={styles.title}>Estimate Practice Time:  <Text>{this.props.estimatePracticeTime}</Text> min.</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	wrapper: { justifyContent: 'center', alignItems: 'center' },
	sliderIOSBasics:{ width: width * 0.75 },
	sldierWrapper:  { width: width * 0.75 },
	slidersParams:  { flex: 1, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: width * 0.75 },
	slidersParam:   { color: '#8E8E93', fontSize: 11, fontFamily: 'Bree Serif' },
	title: { color: '#4A4A4A', fontSize: 16, fontFamily: 'Bree Serif', marginTop: 10 },
	toggleWrapper: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: width * 0.9, marginTop: 20, marginBottom: 20 }
});
