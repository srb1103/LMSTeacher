import React from 'react'
import {View, Text, StyleSheet, Image,Alert} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { useSelector,useDispatch } from 'react-redux'
import Category from '../components/Category'
import { logOUT } from '../store/actions'
import BigCTA from '../components/BigCTA'
export default function Profile(props){
    const {navigation} = props
    let user = useSelector(state=>state.user)
    let {teacher_attendance} = user
    let us = user.user
    let id = us.id
    let dispatch = useDispatch()
    let callLogout = ()=>{
        dispatch(logOUT(id))
    }
    const handleLogout = ()=>{
        Alert.alert('Are you sure?','Do you really want to log out?',[{text:'Cancel'},{text:'Logout',onPress:callLogout}])
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Profile' fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Image source={{uri: us.img}} style={{height: 80, width: 80, marginBottom: 10, borderRadius: 40}}/>
                    <Text style={styles.head}>{us.name}</Text>
                    <Text style={Style.ovrvw}>{us.category}</Text>
                    <Text style={Style.ovrvw}>ID: {us.id}</Text>
                </View>
                <View style={{flexDirection:'row',paddingVertical:9,justifyContent:'space-between'}}>
                    <Category text="My Attendance" fun={()=>navigation.navigate('my-attendance',{teacher_attendance,id})} icon='calendar-outline' width='48%' left/>
                    <Category text="Change Password" fun={()=>navigation.navigate('change-password')} icon='key-outline' width='49%' right/>
                </View>
                <View style={{position:'relative',marginTop:RFValue(85)}}>
                    <BigCTA text="Logout" fun={handleLogout}/>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    head:{color: colors.black, fontSize: RFValue(16), fontFamily: 'p5', marginBottom: -4}
})