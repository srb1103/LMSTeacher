import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { RFValue } from 'react-native-responsive-fontsize'
import IonIcon from 'react-native-vector-icons/Ionicons'
import colors from '../colors'

export default function NotificationBlock(props){
    const {head, text, fun,text2} = props
    return(
        <TouchableOpacity style={styles.container} activeOpacity={.5} onPress={()=>{fun ? setTimeout(()=>{fun()},50) : null}}>
            <View style={styles.textWrap}>
                <Text style={styles.head}>{head}</Text>
                {text && <Text style={styles.p}>{text}</Text>}
                {text2 && <Text style={{...styles.p,marginTop:-3}}>{text2}</Text>}
            </View>
            {fun && <IonIcon name='chevron-forward-outline' style={styles.icon}/>}
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{padding: 20, borderRadius: 10, backgroundColor: colors.white, margin: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',minHeight:RFValue(70)},
    head:{color:colors.black, fontSize: RFValue(15), fontFamily: 'p5', marginVertical: 1, lineHeight:RFValue(21)},
    p:{color:colors.lblack,fontSize: RFValue(11), fontFamily: 'p4'},
    icon:{color: '#ccc', fontSize: RFValue(20)},
    textWrap:{width: '92%'}
})