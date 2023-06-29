import React, { useState, useReducer, useCallback } from 'react'
import {View, Text, StyleSheet, Alert, TouchableOpacity,ScrollView} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import colors from '../colors'
import ButtonCombo from '../components/ButtonCombo'
import InputField from '../components/InputField'
import { SelectList } from 'react-native-dropdown-select-list'
import DateTimePicker from '@react-native-community/datetimepicker'
import { setNum } from '../firebase-config/functions'

const UPDATE_VALUE = 'UPDATE_VALUE'

const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE_VALUE:
            let {name,value} = action.data
            return {
                ...state,
                [name]:value
            }
    }
}
export default function Add_exam(props){
    const {navigation, route} = props
    const {fun, mode,title,type,marksType,maxMarks,subject_options,subjectID,examDate} = route.params
    const [datePop, setDatePop] = useState(false)
    let dt = null
    if(mode == 'edit'){
        let d = examDate.split('-')
        let m = d[1] < 10 ? `0${d[1]}` : d[1]
        let dte = d[0] < 10 ? `0${d[0]}` : d[0]
        dt = `${d[2]}-${m}-${dte}`
    }
    const [date, setDate] = useState(mode == 'edit' ? new Date(dt) : new Date())
    const [dateText, setDateText] = useState(mode == 'edit' ? examDate : null)
    const [state, dispatchState] = useReducer(stateReducer,{
        title: mode == 'edit' ? title : null,
        type: mode == 'edit' ? type : null,
        marksType: mode == 'edit' ? marksType : null,
        maxMarks: mode == 'edit' ? maxMarks : null,
        subjectID: mode == 'edit' ? subjectID: null,
        examDate:mode == 'edit' ? examDate : null,
        date:''
    })
    const changeFun = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE_VALUE,
            data:{name,value }
        })
    },[dispatchState])
    function save(){
        let {title,subjectID,maxMarks,type,examDate,marksType} = state
        if(!title || !subjectID || !maxMarks || !type || !examDate || !marksType){
            Alert.alert('Error','All fields are required',[{text:'Okay'}])
        }else{
            fun(state)
            navigation.goBack()
        }
    }
    const [selected, setSelected] = useState("");
    const [selected1, setSelected1] = useState("");
    const [selected2, setSelected2] = useState("");
    let exam_types = [
        {key:'class_test',value:'Class Test'},
        {key:'house_test',value:'House Test'},
        {key:'mid_term',value:'Mid Term'},
        {key:'term_end',value:'Term End'},
    ]
    let marks_types = [
        {key:'cgpa',value:'CGPA'},
        {key:'marks',value:'Marks'},
    ]
    const setCat = (selected,cat)=>{
        changeFun(cat,selected)
    }
    function setDateFun(event, selectedDate){
        setDatePop(false)
        if(selectedDate && event.type == 'set'){
            let currentDate = selectedDate
            const tmpDate = new Date(currentDate)
            setDate(currentDate)
            const fullDate = `${tmpDate.getDate()}-${tmpDate.getMonth()+1}-20${tmpDate.getYear()-100}`
            setDateText(fullDate)
            changeFun('examDate',fullDate)
        }
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={mode == 'edit' ? `Update ${title}`:'Create New Exam'} fun={()=>navigation.goBack()}/>
            {datePop  && <DateTimePicker
                testID = 'DateTimePicker'
                value={date}
                is24Hour = {false}
                display = 'default'
                onChange={setDateFun}
                maximumDate={new Date()}
            />}
            <ScrollView style={{...Style.bodyContainer, padding: 25}} showsVerticalScrollIndicator={false} overScrollMode='never'>
                <InputField val={state.title} label="Exam Name" name="title" onChangeFun={changeFun}/>
                <View style={{paddingVertical: 10,paddingTop:4}}><Text style={Style.label}>Exam Date</Text><TouchableOpacity activeOpacity={.7} onPress={()=>{setDatePop(true)}}><Text style={{...Style.input,paddingVertical:20}}>{dateText}</Text></TouchableOpacity></View>
                <Text style={Style.label}>Select Exam Type</Text>
                <SelectList setSelected={setSelected} data={exam_types} onSelect={()=>setCat(selected,'type')} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Exam Type" searchPlaceholder="Search exam type..." dropdownStyles={{backgroundColor: colors.white, borderColor: '#eee'}} 
                defaultOption={mode == 'edit' ? exam_types.find(e=>e.key == type) : null}
                />
                <View style={{height: 13}}/>
                <Text style={Style.label}>Result Type</Text>
                <SelectList setSelected={setSelected1} data={marks_types} onSelect={()=>setCat(selected1,'marksType')} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Result Type" searchPlaceholder="Search result type..." dropdownStyles={{backgroundColor: colors.white, borderColor: '#eee'}} 
                defaultOption={mode == 'edit' ? marks_types.find(e=>e.key == marksType) : null}
                />
                <View style={{height: 13}}/>
                <Text style={Style.label}>Select Subject</Text>
                <SelectList setSelected={setSelected2} data={subject_options} onSelect={()=>setCat(selected2,'subjectID')} boxStyles={{...Style.input, paddingVertical: 20}} placeholder="Subject" searchPlaceholder="Search subject..." dropdownStyles={{backgroundColor: colors.white, borderColor: '#eee'}} 
                defaultOption={mode == 'edit' ? subject_options.find(e=>e.key == subjectID) : null}
                />
                <View style={{height: 13}}/>
                <InputField val={state.maxMarks} label="Maximum Marks/CGPA" name="maxMarks" onChangeFun={changeFun} keyboard="number-pad"/>
                <View style={{height: 20}}/>
                <ButtonCombo text1='Cancel' text2={mode == 'edit'?'Update':'Create'} fun1={()=>{navigation.goBack()}} fun2={save}/>
                <View style={{height: 40}}/>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    msWrap:{padding: 3, marginVertical: 5}
})