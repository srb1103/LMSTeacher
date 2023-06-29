import React from 'react'
import {View, StyleSheet, Text} from 'react-native'
import Header from '../components/Header'
import Style from '../Style'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { setNum } from '../firebase-config/functions'
 
const width = RFValue(120)
export default function Result_view(props){
    const {navigation, route} = props
    const {id, rollNo, name, course} = route.params

    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={name} fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, alignItems: 'center', padding: 15}}>
                <View style={{...Style.det_wrap, width: '95%'}}>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Name: </Text>{name}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Roll No: </Text>{rollNo}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Course: </Text>{course}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Theory: </Text>62 (C+)</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Practical: </Text>15</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Assessment: </Text>14</Text>

                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
})