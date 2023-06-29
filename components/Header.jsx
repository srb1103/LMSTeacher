import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import IonIcon from 'react-native-vector-icons/Ionicons'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { useSelector } from 'react-redux'

export default function Header(props) {
    const {icon, heading, fun,sub_head,right_fun,icon2} = props
    let user = useSelector(state=>state.user.user)
  return (
    <View style={styles.header}>
        <TouchableOpacity activeOpacity={.7} onPress={()=>{setTimeout(()=>{fun()},50)}}><IonIcon name={icon} style={styles.icon}/></TouchableOpacity>
        <View style={{alignItems:'center',justifyContent:'center',flex:1}}>
          <Text style={styles.heading}>{heading}</Text>
          {sub_head && <Text style={styles.sub_heading}>{sub_head}</Text>}
        </View>
        {right_fun ? <TouchableOpacity activeOpacity={.7} onPress={()=>{setTimeout(()=>{right_fun()},50)}}><IonIcon name={icon2?icon2:'create-outline'} style={styles.icon}/></TouchableOpacity>:<Image source={{uri: user.img}} style={styles.user_icon}/>}
    </View>
  )
}

const styles = StyleSheet.create({
    header:{flexDirection:'row', padding: 15, paddingTop:10,alignItems:'center', justifyContent:'space-between', borderBottomWidth: 1, borderBottomColor: '#f4f4f4', backgroundColor:colors.white},
    icon:{fontSize: RFValue(30), color: colors.black},
    user_icon:{height: RFValue(35), width: RFValue(35), borderRadius: 20},
    heading:{fontSize: RFValue(15), fontFamily: 'p5'},
    sub_heading:{fontSize:RFValue(9),color:'grey',fontFamily:'p5',marginTop:-3}
  })
