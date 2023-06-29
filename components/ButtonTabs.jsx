import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'

export default function ButtonTabs(props){
    const {first, second, func} = props
    const [active, setActive] = useState(true)
    function fun(){
        func();
        setActive(t=>!t)
    }
    return(
        <View style={styles.tab_wrap}>
          <TouchableOpacity activeOpacity={.7} onPress={()=>{fun ? setTimeout(()=>{fun()},50) : null}} style={{...styles.wrap_btn, backgroundColor: active ? colors.black : colors.white}}><Text style={{...styles.btn_text, color: active ? colors.white : colors.black}}>{first}</Text></TouchableOpacity>
          <TouchableOpacity activeOpacity={.7} onPress={()=>{fun ? setTimeout(()=>{fun()},50) : null}} style={{...styles.wrap_btn, backgroundColor: !active ? colors.black : colors.white}}><Text style={{...styles.btn_text, color: !active ? colors.white : colors.black}}>{second}</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    tab_wrap:{padding: 2, borderRadius: 10, backgroundColor: colors.white, overflow: 'hidden', flexDirection: 'row', width: '80%',alignSelf:'center', marginVertical: 15},
    wrap_btn:{padding: 10, width: '50%', borderRadius: 10},
    btn_text:{textAlign: 'center', fontSize: RFValue(15),fontFamily: 'p5'}
})