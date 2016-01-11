"use strict";

import React from 'react-native';
import I from 'react-native-vector-icons/Ionicons';

const { View, Text, TouchableOpacity, Dimensions, StyleSheet, TextInput, } = React;
const { width, height } = Dimensions.get('window');

class Button extends React.Component {
	render() {
		return(
			<TouchableOpacity onPress={this.props.action}>
				<I name={this.props.icon} size={this.props.size} color={this.props.color} stle={[styles.buttonBasics, styles.buttonTheme]}/>
			</TouchableOpacity>
		)
	}
}

export default class Header extends React.Component {
	render() {
		const isRightButtonActive = this.props.icon.right ? true : false;
		const isTitleAvailable = this.props.title ? true : false;
		return(
			<View style={[styles.headerBasics, styles.headerTheme]}>
				<Button action={this.props.actionLeft} color={this.props.color.left} size={this.props.size.left} icon={this.props.icon.left}/>
				{isTitleAvailable && !this.props.isSearch && <Text style={styles.titleTheme}>{this.props.title}</Text>}
				{isRightButtonActive && !this.props.isSearch && <Button color={this.props.color.right} size={this.props.size.right} action={this.props.actionRight} icon={this.props.icon.right}/>}
				{this.props.isSearch &&
					<TextInput
						autoCorrect={true}
						onChangeText={ (text) => { this.props.onChangeText(text); }}
						onEndEditing={this.props.onEndEditing}
						placeholder="Search"
						placeholderTextColor="#4A4A4A"
					    style={[styles.searchFieldBasics, styles.searchFieldTheme]}
					/>
				}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	headerBasics: { width: width, paddingHorizontal: width * 0.025, paddingVertical: width * 0.01, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, },
	headerTheme : { backgroundColor: '#F7F7F7', borderBottomColor: '#BDBEC2' },

	buttonBasics: { padding: 5, textAlign: 'center' },
	buttonTheme	: { /**/ },

	titleTheme  : { fontSize: 22, color: '#4A4A4A', textAlign: 'center', fontFamily: 'Bree Serif', top: -3 },

	searchFieldBasics: { padding: 5, flex: 1, fontSize: 18, color: '#4A4A4A', textAlign: 'center', fontFamily: 'Bree Serif', marginRight: 20},
	searchFieldTheme : {  }
});