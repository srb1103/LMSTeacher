import React from 'react'
import { View , Text, StyleSheet, TouchableOpacity} from 'react-native'
import colors from '../colors'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'

export default function Category(props) {
    const {icon, fun, text,width,left,right,num} = props
  return (
    <TouchableOpacity style={{...styles.category,width: width ? width :'31.5%',marginLeft:left? 0 : 3,marginRight:right? 0 : 3}} activeOpacity={0.5} onPress={()=>{fun ? setTimeout(()=>{fun()},50) : null}}>
        <IonIcon name={icon} style={styles.category_icon}/>
        <Text style={styles.category_text}>{text}</Text>
        {num && <View style={styles.num_wrap}><Text style={styles.num}>{num}</Text></View>}
    </TouchableOpacity>
  )
}
const styles = StyleSheet.create({
    category:{paddingVertical: 20, backgroundColor:colors.white, borderRadius: 10, margin: 3, alignItems:'center', justifyContent:'center',position:'relative',marginVertical:4},
    category_icon:{fontSize: RFValue(30), color: colors.black},
    category_text:{fontSize:RFValue(10), color: colors.black, fontFamily:'p5'},
    num_wrap:{position:'absolute',top:RFValue(10),right:RFValue(10),height:20,borderRadius:20,backgroundColor:'#057b58',alignItems:'center',justifyContent:'center',minWidth:20,maxWidth:40,paddingHorizontal:5},
    num:{color:'white',fontFamily:'p6',fontSize:RFValue(12)}
})
