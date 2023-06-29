import React, {useState, useEffect} from 'react'
import {SafeAreaView, Text, StyleSheet, TextInput,TouchableOpacity} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import colors from '../colors'
import Style from '../Style'
import IonIcon from 'react-native-vector-icons/Ionicons'
export default function InputField(props){
    const {val, onChangeFun, label, placeholder, password, name, keyboard, multiline, nol,max,iseye} = props
    const [focus, setFocus] = useState(false)
    const [value, setValue] = useState(val)
    const [eye,setEye] = useState(password ? true : false)

    const handleChange = (txt)=>{
        let val = keyboard == 'number-pad' ? txt.replace(/[-, ]/g,'') : txt
        if(max && keyboard == 'number-pad' && parseInt(txt) > parseInt(max)){return}
        setValue(val)
    }
    useEffect(()=>{
        onChangeFun(name, value)
    },[name, value, onChangeFun])
    return(
        <SafeAreaView style={styles.inpGrp}>
            <Text style={{...Style.label, color: colors.black}}>{label}</Text>
            <TextInput value={value} style={{...Style.input, borderColor: focus ? colors.black : '#e9e9e9', textAlignVertical: nol ? 'top' : 'center',position:'relative'}} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} onChangeText={handleChange} placeholder={placeholder} secureTextEntry={eye} keyboardType={keyboard ? keyboard : 'default'} multiline={multiline ? true : false} numberOfLines={nol ? nol : 1}/>
            {iseye && <TouchableOpacity activeOpacity={.5} onPress={()=>setEye(e=>!e)} style={{...styles.eye_wrap,top:label?RFValue(46):RFValue(28)}}><IonIcon name={eye?'eye-outline':'eye-off-outline'} style={styles.toggle}/></TouchableOpacity>}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inpGrp:{paddingVertical: 10,position:'relative'},
    eye_wrap:{position:'absolute',right:13},
    toggle:{fontSize:RFValue(20),color:'#a9a9a9',backgroundColor:colors.white}
})