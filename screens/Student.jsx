import React from 'react'
import {View, StyleSheet, Image, Text} from 'react-native'
import Header from '../components/Header'
import Style from '../Style'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
 
const width = RFValue(120)
export default function Student(props){
    const {navigation, route} = props
    const {id, rollNo, name,phone,address,admissionNo,img_url,guardian} = route.params.itm
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={name} fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, alignItems: 'center', padding: 15}}>
                <Image source={{uri:img_url}} style={styles.image}/>
                <View style={{...Style.det_wrap, width: '85%'}}>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Name: </Text>{name}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Admission No: </Text>{admissionNo}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Roll No: </Text>{rollNo}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Guardian: </Text>{guardian}</Text>
                <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Contact No: </Text>{phone}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Address: </Text>{address}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image:{height: width, width: width, borderRadius: width/2, marginBottom: 10}
})