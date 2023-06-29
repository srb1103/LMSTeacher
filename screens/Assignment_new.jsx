import React, { useCallback, useReducer, useState } from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import InputField from '../components/InputField'
import ButtonCombo from '../components/ButtonCombo'
import DateTimePicker from '@react-native-community/datetimepicker'

const UPDATE = 'UPDATE'
const formReducer = (state, action)=>{
    switch(action.type){
        case UPDATE:
            let {name, value} = action
            return{
                ...state,
                [name]: value
            }
    }
    return state
}
export default function Assignment_edit(props){
    const {navigation, route} = props
    const {fun} = route.params
    const [datePop, setDatePop] = useState(false)
    function setDateFun(event, selectedDate){
        setDatePop(false)
        if(selectedDate && event.type == 'set'){
            let currentDate = selectedDate
            const tmpDate = new Date(currentDate)
            setDate(currentDate)
            const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
            changeFun('date',fullDate)
        }
    }
    const [state, dispatchState] = useReducer(formReducer,{
        title: null,
        overview: null,
        date: null
    })
    const [date, setDate] = useState(new Date())
    const changeFun = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE,
            name,
            value
        })
    },[dispatchState])
    const save = ()=>{
        fun(state);
        navigation.goBack()
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='New Assignment' fun={()=>navigation.goBack()}/>
            {datePop  && <DateTimePicker
                testID = 'DateTimePicker'
                value={date}
                is24Hour = {false}
                display = 'default'
                onChange={setDateFun}
                minimumDate={new Date()}
            />}
            <View style={{...Style.bodyContainer, paddingHorizontal: 25}}>
                <InputField val={state.title} label="Title" name="title" onChangeFun={changeFun}></InputField>
                <InputField val={state.overview} label="Description" name="overview" onChangeFun={changeFun} multiline={true} nol={5}></InputField>
                <View style={{paddingVertical: 10}}><Text style={Style.label}>Submission Date</Text><TouchableOpacity activeOpacity={.7} onPress={()=>{setDatePop(true)}}><Text style={Style.input}>{state.date}</Text></TouchableOpacity></View>
                <View style={{height: 30}}/>
                <ButtonCombo text1='Cancel' text2='Save' fun1={()=>{navigation.goBack()}} fun2={save}/>
            </View>
        </View>
    )
}