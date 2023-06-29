import React, { useState } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { setNum } from '../firebase-config/functions'

export default function Announcement(props){
    const {navigation, route} = props
    const {title,text,date} = route.params.notice
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Text style={styles.head}>{title}</Text>
                    <Text style={Style.ovrvw} selectable={true}>{text}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Date: </Text>{setNum(date)}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>By: </Text>Admin</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    head:{color: colors.black, fontSize: RFValue(16), fontFamily: 'p5', marginBottom: -4}
})