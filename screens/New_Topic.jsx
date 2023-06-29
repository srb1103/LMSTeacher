import React, { useReducer, useCallback } from 'react'
import {View,Alert} from 'react-native'
import Style from '../Style'
import Header from '../components/Header'
import ButtonCombo from '../components/ButtonCombo'
import InputField from '../components/InputField'

const UPDATE_VALUE = 'UPDATE_VALUE'
const stateReducer = (state, action)=>{
    switch (action.type){
        case UPDATE_VALUE:
            let {name,value} = action
            return {
                ...state,[name]:value
            }
        
    }
}
export default function New_Topic(props){
    const {navigation, route} = props
    const {fun, mode, title,count,topics,topicID} = route.params
    const [state, dispatchState] = useReducer(stateReducer,{
        title: mode == 'edit' ? title : null,count:mode == 'edit' ? count :''
        
    })
    const changeFun = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE_VALUE,
            name,value
        })
    },[dispatchState])
    function save(){
        let {count,title} = state
        let error = ''
        if(!count){ error = 'Please enter topic number'}
        if(!title){ error = 'Please enter topic name'}
        if(mode == 'edit' && topics.find(e=>e.id !== topicID && e.count == count)){
            error = `Topic number ${count} already exists`
        }
        if(mode == 'add' && topics.find(e=>e.count == count)){
            error = `Topic number ${count} already exists`
        }
        if(error){
            Alert.alert('Error',error,[{text:'Okay'}])
        }else{
            fun(title,count) 
            navigation.goBack()
        }
    }
    
    
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={mode == 'edit' ? `Edit ${title}` : 'Add New Topic'} fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, padding: 25}}>
                <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                    <View style={{width:'29%'}}>
                        <InputField val={state.count} label="Topic No." name="count" onChangeFun={changeFun} keyboard='number-pad' placeholder="Number"/>
                    </View>
                    <View style={{width:'70%'}}>
                        <InputField val={state.title} label="Name" name="title" onChangeFun={changeFun} placeholder='Topic Name'/>
                    </View>
                </View>
                <View style={{height: 50}}/>
                <ButtonCombo text1='Cancel' text2='Save' fun1={()=>{navigation.goBack()}} fun2={save}/>
            </View>
        </View>
    )
}
