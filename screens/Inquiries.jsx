import React, {useCallback, useReducer, useState} from 'react' 
import {View, Text, StyleSheet, FlatList, ActivityIndicator,TextInput, Dimensions} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import NotificationBlock from '../components/NotificationBlock'
import Header from '../components/Header'
import ButtonTabs from '../components/ButtonTabs'
import { useSelector } from 'react-redux'

import { setNum,makeDate } from '../firebase-config/functions'
let RESPOND = 'RESPOND'
let reducer = (state,action)=>{
    switch(action.type){
        case RESPOND:
            let {id,note} = action
            let p = state.pending
            let r = state.responded
            let i = p.find(e=>e.id == id)
            i.status == 'responded'
            i.response = note
            r = r.concat(i)
            r.sort(function(a,b){
                let d1 = a.date
                let d2 = b.date
                d1 = makeDate(d1)
                d2 = makeDate(d2)
                return d2 - d1;
            })
            p = p.filter(e=>e.id !== id)
            return {...state,pending:p,responded:r}
    }
    return state
}
let {height} = Dimensions.get('window') 
export default function Inquiries(props){
    let {navigation} = props
    let u = useSelector(state=>state.user)
    const [loading,setLoading] = useState(false)
    const [active,setActive] = useState(true)
    let {inquiries,students,classes} = u
    inquiries.sort(function(a,b){
        let d1 = a.date
        let d2 = b.date
        d1 = makeDate(d1)
        d2 = makeDate(d2)
        return d2 - d1;
    })
    let [state,dispatchState] = useReducer(reducer,{
        pending: inquiries.filter(e=>e.status == 'pending'),
        responded: inquiries.filter(e=>e.status !== 'pending')
    })
    const updateResponse = useCallback((id,note)=>{
        dispatchState({type:RESPOND,id,note})
    },[dispatchState])
    const render = (s)=>{
        let {item} = s
        let {id,title,date,studentID} = item
        let student = students.find(e=>e.id == studentID)
        let studentName = student.name
        let clsID = student.classId
        let className = classes.find(e=>e.id == clsID).name
        date = setNum(date)
        return(
            <NotificationBlock head={title} text={`${studentName} | ${className}`} text2={date} fun={()=>navigation.navigate('inquiry',{id,fun:updateResponse})}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading="Student Inquiries" fun={()=>navigation.goBack()}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>: <View style={Style.bodyContainer}>
                <ButtonTabs first='Pending' second="Responded" func={()=>setActive(tab=>!tab)}/>
                <View style={{height:20}}/>
                <View style={{maxHeight:height*.82}}>
                {active ? <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" data={state.pending} keyExtractor={(item, index)=>index.toString()} renderItem = {render}/> : <View><FlatList showsVerticalScrollIndicator={false} overScrollMode="never" data={state.responded} keyExtractor={(item, index)=>index.toString()} renderItem = {render} /></View>}
                </View>
            </View>}
        </View>
    )
}