/**
 * Created by tronin on 11.01.16.
 */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, Image, } = React;
const { width, height} = Dimensions.get('window');

export default class VideoItem extends React.Component {
	render() {
		return(
			<View>
				<View style={{width: width * 0.95, justifyContent: 'space-between', alignItems: 'flex-start', flexDirection: 'row', marginTop: 10}}>
					<TouchableOpacity style={[styles.videoWrapperBasics, styles.videoWrapperTheme]} onPress={this.props.onPress}>
						<View style={styles.componentWrapper}>
							<View style={styles.screen}>
								<Image source={{uri: this.props.image.src}} resizeMode='cover' style={styles.image}/>
							</View>
							<View style={styles.meta}>
								<Text numberOfLines={2} style={styles.title}>E85 Fuel Explained - Race Fuel of the Future?</Text>
								<Text style={styles.descr}>MightyCarMods</Text>
								<Text style={styles.descr}>4M views - 5 months ago</Text>
							</View>
						</View>
					</TouchableOpacity>
					<View style={styles.actionArea}>
						<TouchableOpacity onPress={this.props.deleteVideo}>
							<Icon name='ios-trash' size={40} color='#4A4A4A'/>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	videoWrapperBasics  : { width: width * 0.80, justifyContent: 'space-between', alignItems: 'flex-start', overflow: 'hidden' },
	componentWrapper:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
	image   : { flex: 1 },
	screen  : { width: width * 0.25, height: width * 0.166, backgroundColor: '#f7f7f7' },
	meta    : { justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: 10, width: width * 0.5},
	title   : { color: '#4A4A4A', fontSize: 14, },
	descr   : { color: '#BDBEC2', fontSize: 11, },
	actionArea : { width: width * 0.15, alignItems: 'center' }
});