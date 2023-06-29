import React, { useState } from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { setNum } from '../firebase-config/functions'

export default function Announcement(props){
    const {navigation, route} = props
    let {id, head,title,text,clas} = route.params.data
    const {delFun} = route.params.fun
    head = setNum(head)
    function deleteNow(){
        delFun(id)
        navigation.goBack()
    }
    function deleteA(){
        Alert.alert('Are you sure?','Do you really want to delete this announcement?',[{text:'Cancel'},{text:'Delete',onPress:deleteNow}])
        
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={head} fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Text style={styles.head}>{title}</Text>
                    <Text style={Style.ovrvw} selectable={true}>{text}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Date: </Text>{head}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>To: </Text>{clas}</Text>
                    <TouchableOpacity activeOpacity={.7} onPress={deleteA}><Text style={Style.btnText}>Delete</Text></TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    head:{color: colors.black, fontSize: RFValue(16), fontFamily: 'p5', marginBottom: -4}
})