import React, {useCallback, useReducer, useState} from 'react' 
import {View, Text, StyleSheet, FlatList, ActivityIndicator,TextInput, Dimensions} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import NotificationBlock from '../components/NotificationBlock'
import Header from '../components/Header'
import ButtonTabs from '../components/ButtonTabs'
import CTABtn from '../components/CTABtn'
import { Button1 } from '../components/Button'
import { useSelector } from 'react-redux'
import { setNum } from '../firebase-config/functions'

const ADD = 'ADD'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const SRCH = 'SRCH'
let {height} = Dimensions.get('window')
const stateReducer = (state, action)=>{
    switch (action.type){
        case ADD:
            let obj = action.data
            let t = state.today.concat(obj)
            return{...state,today:t}
        case REMOVE:
            let id = action.id
            t = state.today.filter(e=>e.id!==id)
            return{...state,today:t}
        case SRCH:
            let {value,prev} = action
            let p = state.previous
            if(value){
                p = prev.filter(e=>e.date.match(value))
            }else{p = prev}
            return {...state,previous:p}
        case UPDATE:
            obj = action.data
            id = obj.id
            let {title,description} = obj
            t = state.today
            let ind = t.findIndex(e=>e.id == id)
            t[ind].title = title
            t[ind].description = description
            return{...state,today:t}
    }
    return state
}
export default function HW_list(props){
    const {navigation, route} = props
    let {item,tokens} = route.params
    const {id, title} = item
    let [srch,setSrch] = useState('')
    let subjectID = id
    let d = new Date()
    let date = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
    const [active, setActive] = useState(true)
    const user = useSelector(state=>state.user)
    let {homework,subjects} = user
    const [loading,setLoading] = useState(false)
    let prev = homework ? homework.filter(e=>e.subjectID == id && e.date !== date) : []
    const [state, dispatchState] = useReducer(stateReducer,{
        today: homework ? homework.filter(e=>e.subjectID == id && e.date == date) : [],
        previous: prev
    })
    const addHW = useCallback(data=>{
        dispatchState({type:ADD,data})
    },[dispatchState])
    const updateHW = useCallback(data=>{
        dispatchState({type:UPDATE,data})
    },[dispatchState])
    const removeHw = useCallback((id)=>{
        dispatchState({type:REMOVE,id})
    },[dispatchState])
    const filterData = useCallback((value)=>{
        setSrch(value)
        dispatchState({
            type: SRCH,
            prev,
            value
        })
    },[dispatchState])
    function renderCourse(item, status){
        let {id, title,date,description} = item.item
        let dt = setNum(date)
        return(
            <NotificationBlock head={title} text={dt} fun={()=>{navigation.navigate('hw',{detail:{id,title,date,description,status},fun:{edit:updateHW,remove:removeHw}})}}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>: <View style={Style.bodyContainer}>
                <ButtonTabs first='Today' second="Previous" func={()=>setActive(tab=>!tab)}/>
                <View style={{height:20}}/>
                <View style={{maxHeight:height*.82}}>
                {active ? <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" data={state.today} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 't')}/> : <View><View style={{height:20}}/><TextInput style={{...Style.input, marginBottom: 8}} value={srch} placeholder="Search Date..." onChangeText={(value)=>{filterData(value)}}/><FlatList showsVerticalScrollIndicator={false} overScrollMode="never" data={state.previous} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 'p')} /></View>}
                </View>
            </View>}
            {!loading && active && state.today.length == 0 && <View style={Style.ai_screen}><Text style={Style.label}>You haven't sent any homework.</Text><Button1 text="Give Homework" fun={()=>{navigation.navigate('hw_form',{mode:'add',subjectID,tokens,sub:title,fun:{main:addHW}})}}/></View>}
            {!loading && state.today.length > 0 && active && <CTABtn icon='add' fun={()=>navigation.navigate('hw_form',{mode:'add',subjectID,tokens,sub:title,fun:{main:addHW}})}/>}
        </View>
    )
}

const styles = StyleSheet.create({

})