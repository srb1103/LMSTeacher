import React, { useState } from 'react'
import {View, Text, FlatList, Dimensions} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import { useSelector } from 'react-redux'
let {height} = Dimensions.get('window')
export default function Notifications_home(props){
    const {navigation} = props
    let data = useSelector(state=>state.user.notifications)
    function renderList(item){
        let notice = item.item
        let {title,date} = notice
        return(
            <NotificationBlock head={title} text={`(${date})`} fun={()=>navigation.navigate('notification',{notice})}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Notifications' fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer,maxHeight:height*.97}}>
                <FlatList data={data} keyExtractor={(item, index)=>index.toString()} renderItem={renderList} showsVerticalScrollIndicator={false} overScrollMode='never'/>
            </View>
        </View>
    )
}

