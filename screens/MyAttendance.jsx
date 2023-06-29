import React, { useCallback, useEffect, useReducer } from 'react'
import {View, Text, StyleSheet} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'
import { Calendar } from 'react-native-calendars'

let stateReducer = (state,action)=>{
    switch (action.type){
        case 'SET':
            let {name,value} = action
            return {...state,[name]:value}
    }
}
export default function MyAttendance(props){
    const {navigation,route} = props
    let {teacher_attendance,id} = route.params
    let [state,dispatchState] = useReducer(stateReducer,{
        marked:{},percent:''
    })
    let handleUpdate = useCallback((name,value)=>{
        dispatchState({type:'SET',name,value})
    },[dispatchState])
    useEffect(()=>{
        let marked = {}
        let array = []
        teacher_attendance.forEach(a=>{
            let attn = JSON.parse(a.attendance)
            let at = attn.find(e=>e.id === id)
            if(at){
                let obj = {date:a.date,status:at.attendance}
                array.push(obj)
            }
        })
        let present = array.filter(e=>e.status == 'present').length
        let ttl = array.length
        let percent = ttl > 0 ? Math.floor((present/ttl)*100) : 0
        array.forEach(s=>{
            let {date,status} = s
            let d = date.split('-')
            let m = d[1]
            let dt = d[0]
            if(m<9){m = `0${m}`}
            if(dt<9){dt = `0${dt}`}
            let finalDate = `${d[2]}-${m}-${dt}`
            marked = {...marked,[finalDate]:{selected: true, selectedColor: status=='present'?'green':'red'}}
        })
        handleUpdate('marked',marked)
        handleUpdate('percent',percent)
    },[])
    let date = new Date()
    let m = date.getMonth()+1
    let dt = date.getDate()
    if(m<9){m = `0${m}`}
    if(dt<9){dt = `0${dt}`}
    let d = `${date.getFullYear()}-${m}-${dt}`
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={`My Attendance (${state.percent}%)`} fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <Calendar maxDate={d} hideExtraDays={true} markedDates={state.marked} markingType={'custom'} horizontal={true}/>
           </View>
        </View>
    )
}

const styles = StyleSheet.create({
    head:{color: colors.black, fontSize: RFValue(16), fontFamily: 'p5', marginBottom: -4}
})