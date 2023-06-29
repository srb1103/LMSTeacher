import React,{useState} from 'react'
import { View , Text, StyleSheet, TouchableOpacity} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import colors from '../colors'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import Style from '../Style'

export default function Result_semester(props) {
  const {navigation, route} = props
  const {class_id, class_name, name, semID} = route.params
  return (
    <View style={Style.screen}>
      <Header icon="chevron-back-outline" heading={name} fun={()=>navigation.goBack()}/>
      <View style={Style.bodyContainer}>
        <NotificationBlock head="Fundamentals of Calculus" text="See Result" fun={()=>navigation.navigate('prev',{class_id,class_name,course_id: 'afkdufds',course_name: 'Fundamentals of Calculus'})}/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  
})
