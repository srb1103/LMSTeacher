import React, {useState, useReducer, useCallback, useEffect} from 'react'
import {View, FlatList, ActivityIndicator, Dimensions,Text} from 'react-native'
import Header from '../components/Header'
import Style from '../Style'
import colors from '../colors'
import ButtonTabs from '../components/ButtonTabs'
import CTABtn from '../components/CTABtn'
import NotificationBlock from '../components/NotificationBlock'
import { useDispatch, useSelector } from 'react-redux'
import {Button1} from '../components/Button'


const stateReducer = (state, action)=>{
    switch (action.type){
        case 'ADD':
            let {obj} = action
            let {chapters} = state
            let arr = chapters.concat(obj)
            arr.sort(function(a,b){
                let c1 = a.count
                let c2 = b.count
                return c1 - c2
            })
            return {...state,chapters:arr}
        case 'UPDATE':
            let chp = action.obj
            let chps = state.chapters
            let {id,count,name} = chp
            let ind = chps.findIndex(e=>e.id === id)
            chps[ind].name = name
            chps[ind].count = count
            return {...state,chapters:chps}
        case 'REMOVE':
            let chapterID = action.id
            let chaps = state.chapters
            let array = chaps.filter(e=>e.id != chapterID)
            return {...state,chapters:array}
        case 'SET':
            let {title,value} = action
            return {...state,[title]:value}
    }
}
export default function Course_view(props){
    const {navigation, route} = props
    const {id} = route.params
    let user = useSelector(state=>state.user)
    let iid = user.user.iid
    let {subjects} = user
    const [state, dispatchState] = useReducer(stateReducer,{
        chapters:[],name:[]
    })
    const setValue = useCallback((title,value)=>{
        dispatchState({type:'SET',title,value})
    })
    useEffect(()=>{
        let sub = subjects.find(e=>e.id == id)
        let {title,chapters} = sub
        chapters.sort(function(a,b){
            let c1 = a.count
            let c2 = b.count
            return c1 - c2
        })
        setValue('name',title)
        setValue('chapters',chapters)
    },[])
    const [loading,setLoading] = useState(false)
    let addNewChapter = useCallback(obj=>{
        dispatchState({type:'ADD',obj})
    },[dispatchState])
    function renderChapter(itm){
        let {item} = itm
        let {count,name,topics} = item 
        let chapterID = item.id
        let tops = topics.length
        let str = tops === 1 ? 'Topic' : 'Topics'
        return <NotificationBlock head={`${count}. ${name}`} text={`${tops} ${str}`} fun={()=>navigation.navigate('chapter',{subjectID:id,chapters:state.chapters,mode:'edit',iid,count,name,chapterID,topics,updateChapter:updateChapter,removeChapter:removeChapter})}/>
    }
    let removeChapter = useCallback(id=>{
        dispatchState({type:'REMOVE',id})
    },[dispatchState])
    let updateChapter = useCallback(obj=>{
        dispatchState({type:'UPDATE',obj})
    },[dispatchState])
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" sub_head={state.name} fun={()=>navigation.goBack()} heading="Chapters"/>
            {loading ? <View style={Style.ai_screen}><ActivityIndicator size="large" color={colors.black}/></View>:
            <View style={Style.bodyContainer}>
                <FlatList showsVerticalScrollIndicator={false} overScrollMode="never" data={state.chapters} keyExtractor={(item, index)=>index.toString()} renderItem = {renderChapter}/>
            </View>
            } 
            {!loading && state.chapters.length == 0 && <View style={Style.ai_screen}><Text style={Style.label}>You haven't added any chapter.</Text><Button1 text="Add Chapter" fun={()=>navigation.navigate('chapter_form',{courseID:id,chapters:state.chapters,mode:'add',iid,addNew:addNewChapter})}/></View>}  
            {!loading && state.chapters.length > 0 && <CTABtn icon='add' fun={()=>navigation.navigate('chapter_form',{courseID:id,chapters:state.chapters,mode:'add',iid,addNew:addNewChapter})}/>}
        </View>
    )

}
