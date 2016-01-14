/**
 * Created by tronin on 11.01.16.
 */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, } = React;
const { width, height} = Dimensions.get('window');

export default class TracksListItem extends React.Component {
	render() {
		console.log(this.props)
		return (
				<View style={{width: width * 0.95, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', marginTop: 10}}>
					<TouchableOpacity style={[styles.videoWrapperBasics, styles.videoWrapperTheme]} onPress={this.props.onPress}>
						<View style={styles.componentWrapper}>
							<View style={styles.screen}>
								<Image source={{uri: this.props.snippet.thumbnails.default.url}} resizeMode='cover' style={styles.image}/>
							</View>
							<View style={styles.meta}>
								<Text numberOfLines={2} style={styles.title}>{this.props.snippet.title}</Text>
								<Text style={styles.descr}>{this.props.snippet.channelTitle}</Text>
								<Text style={styles.descr}>{Math.round(this.props.details.statistics.viewCount / 1000)}K views
								— {this.props.details.contentDetails.caption ? 'CC' : 'No CC'}
								— {new Date(this.props.snippet.publishedAt).toLocaleDateString()}</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View style={styles.actionArea}>
						<TouchableOpacity onPress={this.props.deleteVideo}>
							<Icon name={this.props.inSearch ? 'ios-plus-outline' : 'ios-trash-outline'} size={40} color='#1F1F21'/>
						</TouchableOpacity>
					</View>
				</View>

		)
	}
}


const styles = StyleSheet.create({
	videoWrapperBasics  : { width: width * 0.85, justifyContent: 'space-between', alignItems: 'flex-start', overflow: 'hidden' },
	componentWrapper:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
	image   : { flex: 1 },
	screen  : { width: width * 0.25, height: width * 0.166, backgroundColor: '#f7f7f7' },
	meta    : { justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 10, width: width * 0.6},
	title   : { color: '#4A4A4A', fontSize: 14, },
	descr   : { color: '#BDBEC2', fontSize: 11, },
	actionArea : { width: width * 0.10, alignItems: 'center' }
});
