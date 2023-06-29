import React, { useState, useReducer, useCallback } from 'react'
import {View, FlatList} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import InputField from '../components/InputField'

const FILTER = 'FILTER'
const dataReducer = (state, action)=>{
    switch (action.type){
        case FILTER:
            let value = action.value
            if(!value){return action.students}
            let array = state.filter(el=>el.name.match(value))
            return array
    }
}
export default function Result_previous(props){
    const {navigation, route} = props
    const {class_name} = route.params
    const [srch, setSrch] = useState(null)
    const students = [
        {id: 'iiowjefd', rollNo: '123456789', name: 'John Doe'},
        {id: 'ifghtefd', rollNo: '147258369', name: 'Jack Dorsey'},
        {id: 'iiofghdg', rollNo: '159753284', name: 'Steve Jobs'},
        {id: 'fhfwjefd', rollNo: '731982465', name: 'Jack Ma'},
    ]
    // const [data, setData] = useState(students)
    const [studentList, dispatchList] = useReducer(dataReducer, students)

    function renderStudent(item){
        let {id,name, rollNo} = item.item
        return(
            <NotificationBlock head={name} text={`Roll No: ${rollNo}`} fun={()=>navigation.navigate('r_view',{name, rollNo,id,course: 'Fundamentals of Mathematics'})}/>
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
                <InputField name='srch' label="Search Student" onChangeFun={handleChange} placeholder="Enter Name/Roll No..." value={srch}/>
                <View style={{height: 20}}/>
                <FlatList data={studentList} extraData={studentList} keyExtractor={(item, index)=>index.toString()} showsVerticalScrollIndicator={false} overScrollMode='never' renderItem={renderStudent}/>
            </View>
        </View>
    )
}