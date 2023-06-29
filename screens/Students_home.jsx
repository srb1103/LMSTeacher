import React, { useState, useReducer, useCallback } from 'react'
import {View, Text, StyleSheet, FlatList, Dimensions} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import InputField from '../components/InputField'
import { useSelector } from 'react-redux'

const FILTER = 'FILTER'
let {height} = Dimensions.get('window')
const dataReducer = (state, action)=>{
    switch (action.type){
        case FILTER:
            let value = action.value
            if(!value){return action.students}
            let array = state.filter(el=>{
                return el.name.match(value)
            })
            return array
    }
}
export default function Students_home(props){
    const {navigation, route} = props
    const {class_name} = route.params
    const [srch, setSrch] = useState(null)
    let user = useSelector(state=>state.user)
    let {students} = user
    const [studentList, dispatchList] = useReducer(dataReducer, students)
    function renderStudent(item){
        let itm = item.item
        let rn = itm.rollNo
        return(
            <NotificationBlock head={itm.name} text={`Roll No: ${rn}`} fun={()=>navigation.navigate('student',{itm})}/>
        )
    }
    const handleChange = useCallback((name, value)=>{
        setSrch(value)
        dispatchList({type: FILTER, value, students})
    },[dispatchList])
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={class_name} fun={()=>navigation.goBack()}/>
            <View style={Style.bodyContainer}>
                <InputField name='srch' label="Search Student" onChangeFun={handleChange} placeholder="Enter Name..." value={srch}/>
                <View style={{height: 5}}/>
                <View style={{height: height*.81}}>
                    <FlatList data={studentList} extraData={studentList} keyExtractor={(item, index)=>index.toString()} showsVerticalScrollIndicator={false} overScrollMode='never' renderItem={renderStudent}/>
                </View>
            </View>
        </View>
    )
}