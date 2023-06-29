import React,{useState,useCallback, useReducer} from "react";
import {View,Text,Alert,StyleSheet, ActivityIndicator} from 'react-native'
import InputField from './InputField'
import Style from "../Style";
import colors from "../colors";
import ButtonCombo from './ButtonCombo'

const stateReducer = (state, action)=>{
    switch (action.type){
        case 'UPDATE':
            let {name,value} = action
            return {...state,[name]:value}
    }
}
export default function NewChapterForm(props){
    let {heading,save,chapters,hide,mode} = props
    let [loading,setLoading] = useState(false)
    let [state,dispatchState] = useReducer(stateReducer,{count:'',name:''})
    const handleUpdate = useCallback((name,value)=>{
        dispatchState({type:'UPDATE',name,value})
    },[dispatchState])
    const handleSubmit = async()=>{
        let {count,name} = state
        let error = ''
        if(!count){error = 'Please enter chapter number'}
        if(!name){error = 'Chapter Name is required'}
        if(error){
            Alert.alert('Error',{error},[{text:'Okay'}])
        }else{
            let isThere = chapters.findIndex(e=>e.count === count)
            if(isThere > -1){
                setLoading(true)
            }else{
                Alert.alert('Error',`Chapter ${count} already exists`,[{text:'Okay'}])
            }
        }
    }
    return (
        <View style={styles.wrap}>
            <Text style={styles.heading}>{heading}</Text>
            {!loading ? mode == 'add' ? <ButtonCombo text1='Cancel' text2='Save' fun1={hide} fun2={handleSubmit}/>: null : <ActivityIndicator size="large" color={colors.black}/>}
        </View>
    )
}

const styles = StyleSheet.create({
    wrap:{padding:10,position:'relative'},
    heading:{fontFamily:'p6',textAlign:'center',marginBottom:10}
})