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
import { useDispatch, useSelector } from 'react-redux'
import StatBox from '../components/StatBox'
import { setNum } from '../firebase-config/functions'

const UPDATE = 'UPDATE'
const SRCH = 'SRCH'
const {height} = Dimensions.get('window')
const formReducer = (state, action)=>{
    switch (action.type){
        case UPDATE:
            let {title,examDate,maxMarks,type,marksType,subjectID} = action.data
            return {
                ...state,
                title,examDate,maxMarks,type,marksType,subjectID
            }
        case SRCH:
            let {val, res_data} = action
            let array = res_data;
            if(val !== ''){
                array = res_data.filter(el=>{
                    return el.name.match(val)
                })
            }
            return{
                ...state,
                res: array
            }

    }
}
export default function Exam_detail(props){
    const {route, navigation} = props
    const {id,title,examDate,subjectID,type,marksType,maxMarks} = route.params.exam
    let {status,subject_options} = route.params
    const {update, remove,submit} = route.params.fun
    const [loading,setLoading] = useState(false)
    const [srch, setSrch] = useState('')
    let dispatch = useDispatch()
    let user = useSelector(state=>state.user)
    let students = user.students
    let data = status == 'c' ? null : user.result.find(e=>e.id == id).result
    let total,appeared,absent,res_data;
    if(data){
        res_data = JSON.parse(data)
        total = res_data.length
        appeared = res_data.filter(e=>e.marks !== 'absent').length
        absent = res_data.filter(e=>e.marks == 'absent').length
    }
    const [state, dispatchState] = useReducer(formReducer,{
        title,examDate,subjectID,type,marksType,maxMarks,res: data ? res_data : null
    })
    let st = (status == 'c') ? true : false
    const updateValues = useCallback(async(data)=>{
        setLoading(true)
        let {title,examDate,marksType,maxMarks,type,subjectID} = data
        try{
            await updateDoc(doc(db,'results',id),{title,examDate,marksType,maxMarks,type,subjectID})
            dispatchState({type: UPDATE,data})
            dispatch(UpdateExam({...data,id}))
            setLoading(false)
        }catch{err=>console.log(err); setLoading(false)}
        update({data: {...data, id}})
    },[dispatchState])
    const filterData = useCallback((value)=>{
        setSrch(value)
        dispatchState({
            type: SRCH,
            res_data,
            val: value
        })
    },[dispatchState])
    function delFun(){
        remove(id)
        navigation.goBack()
    }
    function dltAlert(){
        Alert.alert('Are you sure?','Do you really want to delete this exam?',[{text:'Cancel'},{text:'Delete',onPress:delFun}])
    }
    const renderStudent = (item)=>{
        let {name, rollNo, marks} = item.item
        let txt = `Marks: ${marks}`
        if(marks == 'absent'){
            txt = 'Absent'
        }
        return(
            <NotificationBlock head={name} text={`Roll No: ${rollNo}, ${txt}`}/>
        )
    }
    return(
        <View style={{...Style.screen, position: 'relative'}}>
            <Header icon="chevron-back-outline" heading={state.title} fun={()=>navigation.goBack()} sub_head={st?null : `Date: ${setNum(examDate)} | Max Marks: ${maxMarks} (${marksType})`}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator color={colors.black} size="large"/></View> :
            <View style={Style.bodyContainer}>
                {st && <View style={Style.det_wrap}>
                    <Text style={Style.ovrvw}>{state.overview}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Exam Date: </Text>{setNum(state.examDate)}</Text>
                    <Text style={Style.ovrvw}><Text style={{color: colors.lblack}}>Max Marks: </Text>{`${state.maxMarks} (${state.marksType})`}</Text>
                    <View style={Style.tiny_btns}>
                        {st && <TouchableOpacity activeOpacity={.5} onPress={()=>{dltAlert()}}><Text style={Style.tiny_btntxt}>Delete</Text></TouchableOpacity> }
                        {st && <TouchableOpacity activeOpacity={.5} onPress={()=>{navigation.navigate('add_exam',{title,examDate,marksType,maxMarks,type,subjectID, mode: 'edit',fun: updateValues,subject_options})}}><Text style={{...Style.tiny_btntxt, backgroundColor: colors.black, color: colors.white, marginHorizontal: 5}}>Edit</Text></TouchableOpacity>}
                    </View>
                </View>}
                {!st && <View style={{maxHeight: height*.98, paddingBottom: 20}}>
                    <View style={{flexDirection:'row',marginBottom:10}}>
                        <StatBox stat={total} heading="Total Students"/>
                        <StatBox stat={appeared} heading="Present"/>
                        <StatBox stat={absent} heading="Absent"/>
                    </View>
                    <TextInput style={{...Style.input, marginBottom: 8}} value={srch} placeholder="Search Name..." onChangeText={(value)=>{filterData(value)}}/>
                    <FlatList data={state.res} keyExtractor={(item, index)=>index.toString()} renderItem={(item)=>renderStudent(item)} showsVerticalScrollIndicator={false} overScrollMode='never'/>
                </View>}
            </View>}
            {st && !loading && <BigCTA text='Add Result' fun={()=>{navigation.navigate('add_result',{students,det:state,id,submit})}}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    icon:{fontSize: RFValue(16)},
    ico:{fontSize: RFValue(17), paddingRight: 15},
    
})