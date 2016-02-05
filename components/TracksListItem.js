/**
 * Created by tronin on 11.01.16.
 */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, LayoutAnimation} = React;
const { width, height} = Dimensions.get('window');

export default class TracksListItem extends React.Component {

	render() {
		return (
				<View style={styles.mainContainer}>
						<View style={styles.rowWrapper}>
						<TouchableOpacity style={[styles.videoWrapperBasics, styles.videoWrapperTheme]} onPress={this.props.onSelect}>
							<View style={styles.componentWrapper}>
								<View style={styles.screen}>
									<Image source={{uri: this.props.snippet.thumbnails.default.url}} resizeMode='cover' style={styles.image}/>
								</View>
								<View style={styles.meta}>
									<Text numberOfLines={2} style={styles.title}>{this.props.snippet.title}</Text>
									<Text style={[styles.descr, {fontWeight: 'bold'}]}>{this.props.snippet.channelTitle}</Text>
									<Text style={styles.descr}>{Math.round(this.props.details.statistics.viewCount / 1000)}K views
									/ {this.props.details.contentDetails.caption !== 'false' ? 'CC ' : 'No CC '}
									/ {new Date(this.props.snippet.publishedAt).toLocaleDateString()}</Text>
								</View>
							</View>
						</TouchableOpacity>
						<View style={styles.actionArea}>
							<TouchableOpacity onPress={this.props.inSearch ? this.props.onAdd : this.props.onDelete}>
								<Icon name={this.props.inSearch ? 'ios-plus-outline' : 'ios-trash-outline'} size={40} color='#1F1F21'/>
							</TouchableOpacity>
						</View>
					</View>
					{!this.props.inSearch &&
						<View style={{padding: 5, flexDirection: 'row', justifyContent: 'space-around'}}>
							<View style={styles.statItem}>
								<Icon name="ios-timer-outline" size={20} />
								<Text style={{marginLeft: 5}}>0 min / 0%</Text>
							</View>
							<View style={styles.statItem}>
								<Icon name="bookmark" size={20} />
								<Text style={{marginLeft: 5}}>{this.props.timestamps ? this.props.timestamps.length : 0}</Text>
							</View>
							<View style={styles.statItem}>
								<Icon name="ios-star-outline" size={20} />
								<Text style={{marginLeft: 5}}>{this.props.timestamps ? this.props.timestamps.filter(t => t.isLiked).length : 0}</Text>
							</View>
						</View>
					}
				</View>

		)
	}
}


const styles = StyleSheet.create({
	rowWrapper: {width: width * 0.95, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', marginTop: 10},
	mainContainer: {borderColor: '#ccc', borderBottomWidth: 1},
	videoWrapperBasics  : { width: width * 0.85, justifyContent: 'space-between', alignItems: 'flex-start', overflow: 'hidden' },
	componentWrapper:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
	image   : { flex: 1 },
	screen  : { width: width * 0.25, height: width * 0.166, backgroundColor: '#f7f7f7' },
	meta    : { justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 10, width: width * 0.6},
	title   : { color: '#4A4A4A', fontSize: 14, },
	descr   : { color: '#988500', fontSize: 11, },
	actionArea : { width: width * 0.10, alignItems: 'center' },
	statItem: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}
});
