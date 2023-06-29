import React, { useState, useReducer, useCallback } from 'react'
import {View, Text, FlatList, ActivityIndicator, Dimensions} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import NotificationBlock from '../components/NotificationBlock'
import CTABtn from '../components/CTABtn'
import { useSelector, useDispatch } from 'react-redux'
import { addNewAnnouncement, deleteAnnouncement } from '../store/actions'
import { Button1 } from '../components/Button'
import { addDoc, collection, deleteDoc,doc } from 'firebase/firestore'
import colors from '../colors'
import { db } from '../firebase-config/config'
import { setNum,makeDate } from '../firebase-config/functions'


let {height} = Dimensions.get('window')
const ADD = 'ADD'
const DELETE = 'DELETE'
const dataReducer = (state, action)=>{
    switch (action.type){
        case ADD:
            let data = action.data
            let a = state.data
            a = a.concat(data)
            a.sort(function(a,b){
                let d1 = a.date
                let d2 = b.date
                d1 = makeDate(d1)
                d2 = makeDate(d2)
                return d2 - d1;
            })
            return{
                ...state,
                data: a
            }
        case DELETE:
            let id = action.id
            let array = state.data
            array = array.filter(f=>f.id !== id)
            return {
                ...state, 
                data: array
            }

    }
}
export default function Announcements_home(props){
    const {navigation} = props
    let user = useSelector(state=>state.user)
    let {announcements,students} = user
    let sesID = user.session.id
    const [loading,setLoading] = useState(false)
    let {iid,name} = user.user
    let t_id = user.user.id
    let dispatch = useDispatch()
    announcements.sort(function(a,b){
        let d1 = a.date
        let d2 = b.date
        d1 = makeDate(d1)
        d2 = makeDate(d2)
        return d2 - d1;
    })
    const [state, dispatchState] = useReducer(dataReducer,{
        data : announcements,
        classes : user.classes
    })
    const sendNotif = async(data,tokens)=>{
        let {title} = data
        await fetch('https://exp.host/--/api/v2/push/send',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                to: tokens,
                title: `New announcement from ${name}`,
                body: `${title}`,
                data:{type:'announcement',nav:'homepage',screen:'notification',source:name,data}
            }),
        })
    }
    const remove_announcement = useCallback(async(id)=>{
        setLoading(true)
        try{
            await deleteDoc(doc(db,'teacher-announcements',id))
            dispatch(deleteAnnouncement(id))
            dispatchState({
                type: DELETE,
                id
            })
            setLoading(false)
        }catch(err){console.warn(err);setLoading(false)}
    },[dispatchState])
    const add = useCallback(async(title, classes, text)=>{
        setLoading(true)
        let d = new Date()
        let date = `${d.getDate()}-${d.getMonth()+1}-${d.getFullYear()}`
        let tokens = []
        classes.forEach(c=>{
            let st = students.filter(e=>e.classId == c)
            if(st){
                st.forEach(s=>{
                    let t = s.pushToken
                    if(t){
                        tokens.push(t)
                    }
                })
            }
        })
        try{
            let res = await addDoc(collection(db,'teacher-announcements'),{title,text,date,teacherID:t_id,instituteID:iid,classes,session:sesID})
            let id = res.id
            await sendNotif({id,title,text,date,teacherID:t_id,instituteID:iid,classes,session:sesID},tokens)
            let data = {id,title,date,classes,text}
            dispatch(addNewAnnouncement(data))
            dispatchState({
                type: ADD,
                data
            })
            setLoading(false)
        }catch(err){console.log(err);setLoading(false)}
        
    },[dispatchState])
    function renderList(item){
        let itm = item.item
        let cls = itm.classes
        let st_cl = state.classes
        let clas = ''
        cls.forEach((c,i)=>{
            let e = st_cl.find(e=>e.id == c).name
            let sep = ''
            sep = i == (cls.length - 1) ? '' : ','
            clas = `${clas} ${e}${sep}`
        })
        return(
            <NotificationBlock head={itm.title} text={`${clas} (${setNum(itm.date)})`} fun={()=>navigation.navigate('announcement',{data: {id: itm.id,head: itm.date,title:itm.title,text:itm.text,clas}, fun:{delFun: remove_announcement}})}/>
        )
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading='Announcements' fun={()=>navigation.goBack()}/>
            {loading && <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>}
            {!loading && (announcements.length > 0 ? <View style={{...Style.bodyContainer,maxHeight:height*.97}}>
                <FlatList data={state.data} keyExtractor={(item, index)=>index.toString()} renderItem={renderList} showsVerticalScrollIndicator={false} overScrollMode='never'/>
            </View> : <View style={Style.ai_screen}><Text style={Style.label}>You haven't made any announcement.</Text><Button1 text="New Annoucement" fun={()=>{navigation.navigate('new_announcement',{fun: add,classes:state.classes})}}/></View>)}
            {!loading && announcements.length > 0 && <CTABtn icon='add' fun={()=>{navigation.navigate('new_announcement',{fun: add,classes:state.classes})}}/>}
        </View>
    )
}

