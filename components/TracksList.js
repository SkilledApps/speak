/* @flow */

import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import TracksListItem from './TracksListItem';

const { View, Text, TouchableOpacity, ActivityIndicatorIOS, ScrollView } = React;

export default class TracksList extends React.Component {
	renderSpinner() {
		return (
			<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
				<ActivityIndicatorIOS size={'large'} />
			</View>
		)
	}
	render() {
		if (!this.props.tracks || this.props.tracks.length === 0) {
			return (
				this.props.isLoading ?
					this.renderSpinner() :
					<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
						<Text style={{fontSize: 20}}>Empty list.</Text>
						<Text style={{fontSize: 20}}>Onboarding goes here </Text>
						<Text style={{fontSize: 20}}>... or recommended videos</Text>
					</View>
			)
		}
    return (
      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={true}>
        {this.props.tracks.map( (e, index) =>
            <TracksListItem
              key={index}
              {...e}
              onSelect={() => this.props.onSelect(e) }
							onAdd={() => this.props.addTrackToCollection(index) }
							onDelete={() => this.props.deleteTrackFromCollection(e) }
            />
        )}
				{this.props.isLoading ? this.renderSpinner() : null}
      </ScrollView>);

	}
}
