import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import colors from '../colors'
import {RFValue} from 'react-native-responsive-fontsize'

export default function Button(props) {
    const {text, fun} = props
  return (
    <TouchableOpacity activeOpacity={.7} onPress={fun}>
    <Text style={styles.btn_text}>{text}</Text>
    </TouchableOpacity>
  )
}
export function Button1(props) {
  const {text, fun} = props
return (
  <TouchableOpacity activeOpacity={.7} onPress={fun} style={{...styles.btn_text,padding:0,paddingHorizontal:50,alignItems:'center',justifyContent:'center',height:RFValue(35)}}>
  <Text style={{fontSize:RFValue(15),color:colors.white,fontFamily: 'p5'}}>{text}</Text>
  </TouchableOpacity>
)
}
const styles = StyleSheet.create({
    btn_text:{backgroundColor: colors.black, color: colors.white, fontSize: RFValue(17), fontFamily: 'p5', padding: 17, borderRadius: 15, textAlign: 'center'}
})