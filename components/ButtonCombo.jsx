import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'


export default function ButtonCombo(props){
    const {text1, text2, fun1, fun2} = props
    return(
        <View style={styles.btn_wrap}>
            <TouchableOpacity activeOpacity={.7} onPress={fun1}><Text style={[styles.btn, styles.sec]}>{text1}</Text></TouchableOpacity>
            <TouchableOpacity activeOpacity={.7} onPress={fun2}><Text style={[styles.btn, styles.pri]}>{text2}</Text></TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btn_wrap:{flexDirection: 'row',alignItems:'center', justifyContent:'center', paddingVertical: 5},
    btn:{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, borderWidth: 1,fontFamily: 'p5', fontSize: RFValue(15), margin: 2, minWidth: 110, textAlign:'center'},
    sec:{color: colors.lblack, borderColor: '#e1e1e1'},
    pri:{color: colors.white, borderColor: colors.black, backgroundColor: colors.black},
})