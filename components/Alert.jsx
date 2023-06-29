import React from 'react'
import {View, Text, Dimensions, StyleSheet, ScrollView} from 'react-native'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { MotiView } from 'moti'

const {height, width} = Dimensions.get('window')

export default function Alert(props){
    const {heading, text, children, css} = props
    return(
    <View style={styles.alert}><MotiView from={{opacity:0,marginBottom:-100}} animate={{opacity:1,marginBottom:0}} transition={{type:'timing'}} style={[styles.alertContainer, css]}><Text style={styles.popHead}>{heading}</Text><Text style={styles.popText}>{text}</Text>{children}</MotiView></View>
    )
}

const styles = StyleSheet.create({
    alert:{position: 'absolute', top: 0, left: 0, bottom: 0, flex: 1, alignItems: 'center', justifyContent:'center', backgroundColor: 'rgba(0,0,0,0.5)', height: height*1.1, width: width, zIndex: 5},
    alertContainer:{backgroundColor: colors.white, padding: 20, borderRadius: 20, width: '90%', paddingVertical: 40, minHeight: '45%'},
    popHead:{textAlign:'center', fontFamily: 'p5', fontSize: RFValue(12), color: colors.lblack, marginBottom: -7},
    popText:{textAlign:'center', fontFamily: 'p6', fontSize: RFValue(25), paddingBottom: 10, borderBottomColor: '#eee', borderBottomWidth: 1, color: colors.black},
})
