import React from 'react'
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import colors from '../colors'
import {RFValue} from 'react-native-responsive-fontsize'

export default function CTABtn(props) {
    const {text, fun} = props
  return (
    <View style={styles.cta_wrap}>
        <TouchableOpacity activeOpacity={.7} onPress={()=>fun ? setTimeout(()=>{fun()},50) : null} style={styles.cta_btn}><Text style={styles.btnTxt}>{text}</Text></TouchableOpacity>
            </View>
  )
}
const styles = StyleSheet.create({
    cta_wrap:{alignItems: 'center', justifyContent:'center', position:'absolute', bottom:15, padding: 20, width: '100%'},
    cta_btn:{backgroundColor: colors.black, paddingVertical: 18, borderRadius: 15, width: '90%'},
    btnTxt:{color: colors.white, textAlign: 'center', fontSize: RFValue(16)}
})