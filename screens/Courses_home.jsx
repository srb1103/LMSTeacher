import React from 'react'
import {View, Text, FlatList} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import { useSelector } from 'react-redux'

export default function Courses_home(props){
    const {navigation} = props
    let user = useSelector(state=>state.user)
    let {subjects,classes} = user
    const renderCourse = (item)=>{
        let itm = item.item
        let clsID = itm.class_id
        let cls_str = ''
        clsID.forEach((s,i)=>{
            let com = i == 0 || i+1 == classes.length ? '' : ', '
            let c = classes.find(e=>e.id === s)
            let clsName = c ? c.name : ''
            cls_str = `${clsName}${com}`
        })
        let {chapters} = itm
        let tops = []
        chapters.forEach(c=>{
            let {topics} = c
                topics.forEach(t=>{
                    let {id,status} = t
                    let ind = tops.findIndex(e=>e.id == id)
                    if(ind < 0){tops.push({id,status})}
                })
        })
        let ttl = tops.length
        let complete = 0
        tops.forEach(t=>{
            let {status} = t
            if(status == 'complete'){
                complete += 1
            }
        })
        let percent = ttl > 0 ? Math.round((complete/ttl)*100) : 0
        return(
            <NotificationBlock head={itm.title} text={`Class: ${cls_str}`} text2={`Course progress ${percent}%`} fun={()=>{navigation.navigate('course',{id:itm.id})}}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Courses' fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <FlatList data={subjects} showsVerticalScrollIndicator={false} overScrollMode='never' keyExtractor={(item, index)=>index.toString()} renderItem={renderCourse}/>
            </View>
        </View>
    )
}