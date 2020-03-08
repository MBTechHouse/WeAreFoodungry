import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, Layout, Text } from 'react-native-ui-kitten';
import SettingsScreen from '../components/Profile/Profile'
import contactData from './Profile/contact.json'

export default class Profile extends React.Component{
  render()
  {
  return(
  <Layout style={styles.container}>
    <SettingsScreen {...contactData} />
  </Layout>
  )
  }
}

const styles = StyleSheet.create({
  container: { width:'100%',height:'100%', alignItems: 'center' },
  text: { marginVertical: 16 },
});
