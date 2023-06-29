import React,{useState,useCallback,useReducer} from 'react'
import {View,Text,StyleSheet,FlatList,Alert,ActivityIndicator} from 'react-native'
import InputField from '../components/InputField'
import ButtonCombo from '../components/ButtonCombo'
import Style from '../Style'
import colors from '../colors'
import Header from '../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { addNewChapter, deleteChapter, updateChapter } from '../store/actions'
import { db } from '../firebase-config/config'
import { updateDoc,addDoc,collection,doc, deleteDoc } from 'firebase/firestore'
import ButtonTabs from '../components/ButtonTabs'

const stateReducer = (state, action)=>{
    switch (action.type){
        case 'UPDATE':
            let {name,value} = action
            return {...state,[name]:value}
    }
}
export default function Chapter_form(props){
    let {navigation,route} = props
    let {name,chapterID,count,mode,addNew,update,remove,chapters,courseID,iid,} = route.params
    let [loading,setLoading] = useState(false)
    let [state,dispatchState] = useReducer(stateReducer,{count:mode=='add'?'':count,name:mode=='add'?'':name})
    const handleUpdate = useCallback((name,value)=>{
        dispatchState({type:'UPDATE',name,value})
    },[dispatchState])
    let dispatch = useDispatch()
    const handleSubmit = async()=>{
        let {count,name} = state
        let error = ''
        if(!count){error = 'Please enter chapter number'}
        if(!name){error = 'Chapter Name is required'}
        if(error != ''){
            Alert.alert('Error',{error},[{text:'Okay'}])
        }else{
            if(mode == 'add'){
                let isThere = chapters.findIndex(e=>e.count === count)
                if(isThere == -1){
                    setLoading(true)
                    try{
                        let res = await addDoc(collection(db,'chapters'),{count,name,instituteID:iid,subjectID:courseID})
                        let id = res.id
                        let obj = {id,count,name,topics:[]}
                        dispatch(addNewChapter(courseID,obj))
                        addNew(obj)
                        navigation.goBack()
                    }catch(err){
                        setLoading(false)
                        console.log(err)
                        Alert.alert('Error','Something went wrong. Please try again.',[{text:'Okay'}])
                    }
                    
                }else{
                    Alert.alert('Error',`Chapter ${count} already exists`,[{text:'Okay'}])
                }
            }else if(mode == 'edit'){
                let isThere = chapters.find(e=>e.count == count && e.id != chapterID)
                if(isThere){
                    Alert.alert('Error',`Another chapter with chapter number ${count} already exists`,[{text:'Okay'}])
                }else{
                    setLoading(true)
                    try{
                        await updateDoc(doc(db,'chapters',chapterID),{count,name})
                        dispatch(updateChapter(courseID,chapterID,name,count))
                        let obj = {id:chapterID,count,name}
                        update(obj)
                        navigation.pop(2)
                    }catch(err){
                        setLoading(false)
                        console.log(err)
                        Alert.alert('Error','Something went wrong. Please try again.',[{text:'Okay'}])
                    }
                }
            }
            
        }
    }
    async function handleDelete(){
        setLoading(true)
        try{
            await deleteDoc(doc(db,'chapters',chapterID))
            dispatch(deleteChapter(courseID,chapterID))
            remove(chapterID)
            navigation.pop(2)
        }catch(err){
            setLoading(false)
            console.log(err)
            Alert.alert('Error','Something went wrong. Please try again.',[{text:'Okay'}])
        }
    }
    function deleteAlert(){
        Alert.alert('Are you sure?','Do you really want to delete this chapter?',[{text:'Cancel'},{text:'Yes, Delete',onPress:handleDelete}])
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={mode == 'add' ? 'Add New Chapter' : name} fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, padding: 15}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{width:'29%'}}>
                        <InputField val={state.count} label="Chapter No." name="count" onChangeFun={handleUpdate} keyboard='number-pad' placeholder="Number"/>
                    </View>
                    <View style={{width:'70%'}}>
                        <InputField val={state.name} label="Name" name="name" onChangeFun={handleUpdate} placeholder='Chapter Name'/>
                    </View>
                </View>
                <View style={{height: 10}}/>
                {!loading ? mode == 'add' ? <ButtonCombo text1='Cancel' text2='Save' fun1={()=>{navigation.goBack()}} fun2={handleSubmit}/> : <ButtonCombo text1='Delete' text2='Update' fun1={deleteAlert} fun2={handleSubmit}/> : <ActivityIndicator size="large" color={colors.black}/>}
            </View>
        </View>
    )
}
