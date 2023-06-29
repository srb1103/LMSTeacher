import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import colors from '../colors'
import {RFValue} from 'react-native-responsive-fontsize'
import IonIcon from 'react-native-vector-icons/Ionicons'

export default function CTABtn(props) {
    const {icon, fun} = props
  return (
    <TouchableOpacity activeOpacity={.9} style={styles.faBtnWrap} onPress={()=>{fun ? setTimeout(()=>{fun()},50) : null}}><IonIcon name={icon} style={styles.faBtnIcon}></IonIcon></TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    faBtnWrap:{height: RFValue(60), width: RFValue(60), borderRadius: RFValue(30), backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 20, right: 20, zIndex: 5},
    faBtnIcon:{color: colors.white, fontSize: RFValue(40)}
})