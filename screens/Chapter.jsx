import React, {useState, useReducer, useCallback} from 'react'
import {View, FlatList, ActivityIndicator, Dimensions,Text} from 'react-native'
import Header from '../components/Header'
import Style from '../Style'
import colors from '../colors'
import ButtonTabs from '../components/ButtonTabs'
import CTABtn from '../components/CTABtn'
import NotificationBlock from '../components/NotificationBlock'
import { useDispatch, useSelector } from 'react-redux'
import { addNewTopic, deleteTopic, markTopicComplete, startTopicAction, updateTopic } from '../store/actions'
import {Button1} from '../components/Button'
import { updateDoc,doc, addDoc,collection, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase-config/config'
let {height} = Dimensions.get('window')

const UPDATE_PENDING = 'UPDATE_PENDING'
const UPDATE_COMPLETED = 'UPDATE_COMPLETED'
const REMOVE_TOPIC = 'REMOVE_TOPIC'
const UPDATE_TOPIC = 'UPDATE_TOPIC'
const ADD_NEW = 'ADD_NEW'
const START_TOPIC = 'START_TOPIC'

const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE_PENDING:
            let itm = action.data
            let topics = state.pending
            let isThere = topics.filter(t=>t.name === itm.name)
            if(isThere.length === 0){topics = topics.concat(itm) }
            return{
                ...state,
                pending: topics
            }
        case REMOVE_TOPIC:
            let id = action.id
            let c = state.completed
            let cr = state.current
            let p = state.pending
            if(action.cat == 'c'){c = c.filter(f=>f.id !== id)}
            else if(action.cat == 'p'){p = p.filter(f=>f.id !== id)}
            else if(action.cat == 'cr'){cr = cr.filter(f=>f.id !== id)}
            return {
                ...state,
                pending: p,
                completed: c,
                current: cr,
            }
        case UPDATE_COMPLETED:
            let tid = action.id
            let cur = state.current
            let com = state.completed
            let tpc = cur.find(t=>t.id == tid)
            let date = action.date
            tpc.date = date
            cur = cur.filter(p=>p.id !== tid)
            com = com.concat(tpc)
            return{
                ...state,
                current: cur,
                completed: com
            }
        case START_TOPIC:
            tid = action.id
            let pen = state.pending
            cur = state.current
            tpc = pen.find(t=>t.id == tid)
            pen = pen.filter(p=>p.id !== tid)
            cur = cur.concat(tpc)
            return{
                ...state,
                pending: pen,
                current: cur
            }
        case UPDATE_TOPIC:
            let {ide, title,count} =  action.topic  
            let pen_topics = state.pending
            let ttbu = pen_topics.findIndex(t=>t.id == ide)
            pen_topics[ttbu].name = title
            pen_topics[ttbu].count = count
            return{
                ...state,
                pending: pen_topics
            }
        case ADD_NEW:
            let data = action.data
            id = data.id
            let name = data.name
            date  = date
            let obj = {id,name,date,status:'pending',completedOn:'',count:data.count}
            p = state.pending.concat(obj)
            return {...state,pending:p}
    }
}
export default function Chapter(props){
    const {navigation, route} = props
    const {subjectID,chapterID,topics,chapters,iid,count,name,updateChapter,removeChapter} = route.params
    const [active, setActive] = useState(true)
    const [loading,setLoading] = useState(false)
    const completed_topics = topics ? topics.filter(e=>e.status == 'complete') : []
    const pending_topics = topics ? topics.filter(e=>e.status == 'pending') : []
    const current_topic = topics ? topics.filter(e=>e.status == 'current') : []
    let dispatch = useDispatch()
    const [state, dispatchState] = useReducer(stateReducer,{
        pending: pending_topics,
        completed: completed_topics,
        current: current_topic
    })
    const newTopic = useCallback(async(name,count)=>{
        setLoading(true)
        let d = new Date()
        let date = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
        try{
            let res = await addDoc(collection(db,'topics'),{
                instituteID:iid,name,date,status:'pending',subjectID,chapterID,count
            })
            let id = res.id
            let data = {subjectID,chapterID,id,name,date,count}
            dispatch(addNewTopic(data))
            dispatchState({
                type: ADD_NEW,
                data
            })
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
        
    },[dispatchState])
    const markCompleted = useCallback(async(id)=>{
        setLoading(true)
        let d = new Date()
        let date = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
        try{
            updateDoc(doc(db,'topics',id),{
                status:'complete',date
            })
            dispatch(markTopicComplete(subjectID,chapterID,id,date))
            dispatchState({
                type: UPDATE_COMPLETED,
                id: id,date
            })
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    const remove = useCallback(async(id, cat)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'topics',id))
            dispatch(deleteTopic(subjectID,chapterID,id))
            dispatchState({
                type: REMOVE_TOPIC,
                id, 
                cat
            })
            setActive(true)
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
        
    },[dispatchState])
    const update_topic = useCallback(async(id,title,count)=>{
        setLoading(true)
        try{
            await updateDoc(doc(db,'topics',id),{
                name:title,count
            })
            dispatch(updateTopic(subjectID,chapterID,id,title,count))
            dispatchState({
                type: UPDATE_TOPIC,
                topic:{
                    ide: id,
                    title,count
                }
            })
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
    },[dispatchState])
    function toggleTab(){
        setActive(tab=>!tab)
    }
    const startTopic = useCallback(async(id)=>{
        setLoading(true)
        let d = new Date()
        let date = `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}`
        try{
            updateDoc(doc(db,'topics',id),{
                status:'current',date
            })
            dispatch(startTopicAction(subjectID,chapterID,id))
            dispatchState({
                type: START_TOPIC,
                id: id
            })
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
    },[dispatchState])
    function renderCourse(item, status){
        let {id, name, date,count} = item.item
        return(
            <NotificationBlock head={`${count}. ${name}`} text={status == 'c' ? `Completed on ${date}` : status == 'cr' ? 'Current' : null} fun={()=>navigation.navigate('topic',{id, name, topics:[...state.pending,...state.completed,...state.current],count,status, remove: remove, mc: markCompleted, ut: update_topic,start:startTopic})}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading="Topics" sub_head={name} fun={()=>navigation.goBack()} right_fun={()=>navigation.navigate('chapter_form',{courseID:subjectID,chapters,mode:'edit',iid,count,name,chapterID,update:updateChapter,remove:removeChapter})}/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>:
            <View style={Style.bodyContainer}>
                <ButtonTabs first='Pending' second="Completed" func={toggleTab}/>
                <View style={{height:20}}/>
                <View style={{maxHeight:height*.82}}>
                    {active ? <View>{state.current.length > 0 && <FlatList data={state.current} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 'cr')} showsVerticalScrollIndicator={false} overScrollMode='never'/>}<View style={{height:height*.71}}><FlatList data={state.pending} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 'p')} showsVerticalScrollIndicator={false} overScrollMode='never'/></View></View> :  <View style={{height:height*.8}}><FlatList data={state.completed} keyExtractor={(item, index)=>index.toString()} renderItem = {(item)=>renderCourse(item, 'c')}  showsVerticalScrollIndicator={false} overScrollMode='never'/></View>}
                    </View>
                </View>}
                {!loading && <CTABtn icon='add' fun={()=>{navigation.navigate('new_topic',{fun: newTopic, mode: 'add',topics:[...state.pending,...state.completed,...state.current]})}}/>}
                <View style={{height: 40}}></View>
        </View>
    )

}
