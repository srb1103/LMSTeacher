import React, {useState, useCallback, useReducer} from 'react'
import {View, StyleSheet, Text, TouchableOpacity, FlatList, TextInput,Alert, ActivityIndicator, Dimensions} from 'react-native'
import Header from '../components/Header'
import colors from '../colors'
import Style from '../Style'
import { RFValue } from 'react-native-responsive-fontsize'
import NotificationBlock from '../components/NotificationBlock'
import BigCTA from '../components/BigCTA'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase-config/config'
import { useSelector } from 'react-redux'

let {height} = Dimensions.get('window')
const UPDATE = 'UPDATE'
const SRCH = 'SRCH'
const formReducer = (state, action)=>{
    switch (action.type){
        case UPDATE:
            let {title, overview, date} = action.data
            return {
                ...state,
                title,
                overview,
                submissionDate:date,
            }
        case SRCH:
            let {val, data} = action
            let array = data;
            if(val !== ''){
                array = data.filter(el=>{
                    return el.name.match(val)
                })
            }
            return{
                ...state,
                students: array
            }

    }
}
export default function Assignment_detail(props){
    const {route, navigation} = props
    const {title, id, status,description,submissionDate,students} = route.params.course
    const {update, remove,submit} = route.params.fun
    const [loading,setLoading] = useState(false)
    const [srch, setSrch] = useState('')
    let user = useSelector(state=>state.user)
    let data = status == 'c' ? null : user.assignment_submissions.find(e=>e.assignmentID == id).students
    if(data){
        data = JSON.parse(data)
    }
    const [state, dispatchState] = useReducer(formReducer,{
        title: title,
        overview: description,
        students: data,
        submissionDate
    })
    let st = (status == 'c') ? true : false
    const updateValues = useCallback(async(data)=>{
        setLoading(true)
        let {title, overview, date} = data
        try{
            await updateDoc(doc(db,'assignments',id),{title,description:overview,submissionDate:date})
            dispatchState({
                type: UPDATE,
                data
            })
            setLoading(false)
        }catch{err=>console.log(err); setLoading(false)}
        
        update({data: {...data, id}})
    },[dispatchState])
    const filterData = useCallback((value)=>{
        setSrch(value)
        dispatchState({
            type: SRCH,
            data,
            val: value
        })
    },[dispatchState])
    function delFun(){
        remove(id, status)
        navigation.goBack()
    }
    function dltAlert(){
        Alert.alert('Are you sure?','Do you really want to delete this assignment?',[{text:'Cancel'},{text:'Delete',onPress:delFun}])
    }
    const renderStudent = (item)=>{
        let {name, rollNo, date} = item.item
        return(
            <NotificationBlock head={name} text={`Roll No: ${rollNo}, Date: ${date}`}/>
        )
    }
    return(
        <View style={{...Style.screen, position: 'relative'}}>
            <Header icon="chevron-back-outline" heading={state.title} fun={()=>navigation.goBack()}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator color={colors.black} size="large"/></View> :
            <View style={Style.bodyContainer}>
                <View style={Style.det_wrap}>
                    <Text style={Style.ovrvw}>{state.overview}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Submission Date: </Text>{state.submissionDate}</Text>
                    <View style={Style.tiny_btns}>
                        {st && <TouchableOpacity activeOpacity={.5} onPress={()=>{dltAlert()}}><Text style={Style.tiny_btntxt}>Delete</Text></TouchableOpacity> }
                        {st && <TouchableOpacity activeOpacity={.5} onPress={()=>{navigation.navigate('assignment_edit',{id,detail:state, mode: 'edit',fun: updateValues})}}><Text style={{...Style.tiny_btntxt, backgroundColor: colors.black, color: colors.white, marginHorizontal: 5}}>Edit</Text></TouchableOpacity>}
                    </View>
                </View>
                {!st && <View style={{maxHeight: height*.76, paddingBottom: 20, marginTop: 10}}>
                    <TextInput style={{...Style.input, marginBottom: 8}} value={srch} placeholder="Search Name..." onChangeText={(value)=>{filterData(value)}}/>
                    <FlatList data={state.students} keyExtractor={(item, index)=>index.toString()} renderItem={(item)=>renderStudent(item)} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                </View>}
            </View>}
            {st && !loading && <BigCTA text='Add Submissions' fun={()=>{navigation.navigate('assignment_submit',{title:state.title,students,id,submit})}}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    icon:{fontSize: RFValue(16)},
    ico:{fontSize: RFValue(17), paddingRight: 15},
    
})