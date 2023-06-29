import React, {useState} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native'
import Header from '../components/Header'
import Style from '../Style'
import colors from '../colors'

export default function Course(props){
    const {navigation, route} = props
    const {id, name, status, remove, mc, ut,start,topics,count} = route.params
    let st = status == 'c' ? 'Completed' : 'Pending'
    if(status == 'cr'){st = 'Current'}
    const save_fun = (title,count)=>{
        ut(id, title,count)
        navigation.goBack()
    }
    const del_fun = ()=>{
        remove(id,status);
        navigation.goBack()
    }
    const deleteT = ()=>{
        Alert.alert('Are you sure?','Do you really want to delete this topic',[{text:'Cancel'},{text:'Delete',onPress:del_fun}])
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Topic Detail' fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Topic Name: </Text>{name}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Status: </Text>{st}</Text>
                    <View style={Style.tiny_btns}>
                        <TouchableOpacity activeOpacity={.5} onPress={()=>deleteT()}><Text style={Style.tiny_btntxt}>Delete</Text></TouchableOpacity>
                        {st == 'Current' && <TouchableOpacity activeOpacity={.5} onPress={()=>{mc(id); navigation.goBack()}}><Text style={{...Style.tiny_btntxt, backgroundColor: colors.black, color: colors.white, marginHorizontal: 5}}>Mark Complete</Text></TouchableOpacity>}
                        {st == 'Pending' && <TouchableOpacity activeOpacity={.5} onPress={()=>{start(id); navigation.goBack()}}><Text style={{...Style.tiny_btntxt, backgroundColor: colors.black, color: colors.white, marginHorizontal: 5}}>Start Topic</Text></TouchableOpacity>}
                        {st == 'Pending' && <TouchableOpacity activeOpacity={.5} onPress={()=>{navigation.navigate('new_topic',{fun: save_fun,title: name, mode:'edit',topics,topicID:id,count})}}><Text style={Style.tiny_btntxt}>Edit</Text></TouchableOpacity>}
                    </View>
                </View>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    
})