/*@flow */
import React from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { TabBarIOS, Text } = React;


export default class Tabbar extends React.Component {
  constructor() {
    super();
    this.state = {selectedTab: 'trackslist'}
  }
  render() {
    return (
      <TabBarIOS
        tintColor="black"
        barTintColor="#F5D700">
        <Icon.TabBarItem
          title="Videos"
          iconName="ios-list-outline"
          selected={this.state.selectedTab === 'trackslist'}
          onPress={() => {
            this.setState({
              selectedTab: 'trackslist',
            });
          }}>
          {this.props.tab1}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="Classes"
          iconName="university"
          selected={this.state.selectedTab === 'university'}
          onPress={() => {
            this.setState({
              selectedTab: 'university',
            });
          }}>
          {this.props.tab2}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          title="My recordings"
          iconName="ios-mic"
          badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
          selected={this.state.selectedTab === 'recordings'}
          onPress={() => {
            this.setState({
              selectedTab: 'recordings'
            });
          }}>
          {this.props.tab3}
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName="ios-star-outline"
          title="Favorites"
          selected={this.state.selectedTab === 'greenTab'}
          onPress={() => {
            this.setState({
              selectedTab: 'greenTab',
              presses: this.state.presses + 1
            });
          }}>
          {this.props.tab4}
        </Icon.TabBarItem>
      </TabBarIOS>
    );
  }
}
