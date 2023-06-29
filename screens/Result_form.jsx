import React, { useCallback, useReducer } from 'react'
import {View, Text, Alert} from 'react-native'
import colors from '../colors'
import Style from '../Style'
import Header from '../components/Header'
import InputField from '../components/InputField'
import ButtonCombo from '../components/ButtonCombo'

const UPDATE = 'UPDATE'
const formReducer = (state, action)=>{
    switch(action.type){
        case UPDATE:
            let {name, value} = action
            return{
                ...state,
                [name]: value
            }
    }
    return state
}
export default function Result_form(props){
    const {navigation, route} = props
    const {rollNo, name, id, mode, fun} = route.params
    const [state, dispatchState] = useReducer(formReducer,{
        theory: mode == 'edit' ? '60' : null,
        practical: mode == 'edit' ? '25' : null,
        assessment: mode == 'edit' ? '14' : null,
    })
    const changeFun = useCallback((name, value)=>{
        dispatchState({
            type: UPDATE,
            name,
            value
        })
    },[dispatchState])
    const save = ()=>{
        const {theory} = state
        if(!theory){Alert.alert('Error','Please enter theory marks',[{text: 'Okay'}])}
        mode == 'add' ? fun(id) : console.log(state)
        navigation.goBack()
    }
    return(
        <View style={Style.screen}>
            <Header icon="chevron-back-outline" heading={name} fun={()=>navigation.goBack()}/>
            <View style={{...Style.bodyContainer, paddingHorizontal: 25}}>
                <InputField val={state.theory} label="Theory" name="theory" onChangeFun={changeFun} keyboard = 'number-pad'></InputField>
                <InputField val={state.practical} label="Practical" name="practical" onChangeFun={changeFun} keyboard = 'number-pad'></InputField>
                <InputField val={state.assessment} label="Assessment" name="assessment" onChangeFun={changeFun} keyboard = 'number-pad'></InputField>
                <View style={{height: 30}}/>
                <ButtonCombo text1='Cancel' text2='Save' fun1={()=>{navigation.goBack()}} fun2={save}/>
            </View>
        </View>
    )
}