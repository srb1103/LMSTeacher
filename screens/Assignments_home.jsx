import React, {useCallback, useReducer, useState} from 'react' 
import {View, Text, StyleSheet, FlatList, ActivityIndicator, Dimensions} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import NotificationBlock from '../components/NotificationBlock'
import Header from '../components/Header'
import ButtonTabs from '../components/ButtonTabs'
import CTABtn from '../components/CTABtn'
import { Button1 } from '../components/Button'
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { db } from '../firebase-config/config'
import { addAssignment, removeAssignment, updateAssignment } from '../store/actions'

let {height} = Dimensions.get('window')
const ADD = 'ADD'
const UPDATE = 'UPDATE'
const REMOVE = 'REMOVE'
const SUBMIT = 'SUBMIT'
const stateReducer = (state, action)=>{
    switch (action.type){
        case ADD:
            let data = action.data
            let obj = {
                id:data.id,
                title: data.title,
                description: data.description,
                createdOn: data.createdOn,
                submissionDate: data.submissionDate,
                submitted:'no',
                subjectID:data.subjectID
            }
            let cur = state.current.concat(obj)
            return{
                ...state,
                current: cur
            }
        case UPDATE:
            let {id, overview, date, title} = action.data.data
            let live = state.current
            let ind = live.findIndex(i=>i.id == id)
            live[ind].title = title
            live[ind].description = overview
            live[ind].submissionDate = date
        case REMOVE:
            let {aid, status} = action
            let c = state.current
            let p = state.previous
            if(status == 'p'){
                p = p.filter(p=>p.id !== aid)
            }else if(status == 'c'){
                c = c.filter(p=>p.id !== aid)
            }
            return{
                ...state,
                previous: p,
                current: c
            }
        case SUBMIT:
            id = action.id
            c = state.current
            p = state.previous
            let ass = c.find(e=>e.id == id)
            c = c.filter(e=>e.id !== id)
            p = p.concat(ass)
            return{...state,current:c,previous:p}
    }
    return state
}
export default function Assignments_home(props){
    const {navigation, route} = props
    const {id, title} = route.params.itm
    const [active, setActive] = useState(true)
    const user = useSelector(state=>state.user)
    let students = route.params.students
    const [loading,setLoading] = useState(false)
    let {iid,name} = user.user
    let sesID = user.session.id
    let tokens = []
    students.forEach(s=>{
        let t = s.pushToken
        if(t){
            tokens.push(t)
        }
    })
    const previous_assignments = user.assignments.filter(e=>e.submitted !== 'no' && e.subjectID == id)
    const current_assignments = user.assignments.filter(e=>e.submitted == 'no' && e.subjectID == id)
    const [state, dispatchState] = useReducer(stateReducer,{
        current: current_assignments ? current_assignments : [],
        previous: previous_assignments ? previous_assignments : [],
    })
    let dispatch = useDispatch()
    const sendNotif = async(data)=>{
        let {title} = data
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: tokens,
                title: `${name} posted a new assignment`,
                body: `${title}`,
                data:{type:'assignment',nav:'assign',screen:'assignment_view',data}

            }),
        })
    }
    const newAssignment = useCallback(async(data)=>{
        setLoading(true)
        let {title, overview, date} = data
        let newD = new Date()
        newD = `${newD.getDate()}-${newD.getMonth()+1}-${newD.getFullYear()}`
        try{
            let res = await addDoc(collection(db,'assignments'),{
                title,description:overview,submissionDate:date,createdOn:newD,subjectID:id,submitted:'no',iid,session:sesID
            })
            let ass_id = res.id
            await sendNotif({id:ass_id,title,description:overview,submissionDate:date,createdOn:newD,subjectID:id,submitted:'no',iid,session:sesID})
            let new_ass = {id:ass_id,title,description: overview,submissionDate: date,createdOn: newD,subjectID:id,submitted:'no'}
            dispatchState({
                type: ADD,
                data:new_ass
            })
            dispatch(addAssignment(new_ass))
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
    },[dispatchState])
    const updateAssn = useCallback((data)=>{
        dispatchState({
            type: UPDATE,
            data
        })
        dispatch(updateAssignment(data))
    },[dispatchState])
    const dltAssign = useCallback(async(aid, status)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'assignments',aid))
            dispatchState({
                type:REMOVE,
                aid,
                status
            })
            dispatch(removeAssignment(aid))
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
    },[dispatchState])
    const submit = useCallback(id=>{
        dispatchState({type:SUBMIT,id})
    },[dispatchState])
    function renderCourse(item, status){
        let {id, title,description,submissionDate} = item.item
        return(
            <NotificationBlock head={title} fun={()=>navigation.navigate('assignment',{course:{title, id, status,description,submissionDate,students},fun:{update: updateAssn, remove: dltAssign,submit}})}/>

        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={title} fun={()=>navigation.goBack()}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>: <View style={Style.bodyContainer}>
                <ButtonTabs first='Current' second="Previous" func={()=>setActive(tab=>!tab)}/>
                <View style={{maxHeight:height*.82}}>
                {active ? <FlatList data={state.current} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 'c')}/> : <FlatList data={state.previous} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 'p')} />}
                </View>
            </View>}
            {!loading && active && state.current.length == 0 && <View style={Style.ai_screen}><Text style={Style.label}>You haven't created any assignment.</Text><Button1 text="Create Assignment" fun={()=>{navigation.navigate('assignment_new',{fun: newAssignment})}}/></View>}
            {!loading && state.current.length > 0 && active && <CTABtn icon='add' fun={()=>{navigation.navigate('assignment_new',{fun: newAssignment})}}/>}
        </View>
    )
}

const styles = StyleSheet.create({

})