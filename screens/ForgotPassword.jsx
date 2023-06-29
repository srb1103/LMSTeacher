import React from 'react'
import {View, Text, StyleSheet, Dimensions, TouchableOpacity} from 'react-native'
import colors from '../colors'
import InputField from '../components/InputField'
import {RFValue} from 'react-native-responsive-fontsize'
import Button from '../components/Button'
const {height, width} = Dimensions.get('window')
export default function ForgotPassword({navigation}) {
    function addItem(){
        console.log('hello')
    }
    function submitForm(){
        console.log('submit')
    }
  return (
    <View style={styles.screen}>
        <View style={styles.top}>
            <Text style={styles.topHead}>Logo</Text>
        </View>
        <View style={styles.main_view}>
            <Text style={styles.form_head}>Forgot Password</Text>
            <InputField val='' placeholder='Enter Username' label='Username' name='username' onChangeFun={addItem}/>
            <TouchableOpacity activeOpacity={.5} onPress={()=>navigation.goBack()}><Text style={styles.fp_link}>Log in to your account</Text></TouchableOpacity>
            <Button text='Proceed' fun={submitForm}/>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    screen:{flex: 1, backgroundColor: colors.black},
    top:{height: height * .4, alignItems:'center', justifyContent:'center'},
    main_view:{backgroundColor: colors.white, padding: 35, borderTopLeftRadius: 40, borderTopRightRadius: 40, flex: 1, marginTop: -40, height: height * .8},
    topHead:{fontSize: RFValue(35), color: colors.white, fontFamily: 'p6'},
    form_head:{fontSize: RFValue(20), color:colors.black, fontFamily: 'p5', marginBottom: 20, textAlign: 'center'},
    fp_link:{marginTop: 10, textAlign: 'right', color: colors.black, fontSize: RFValue(15), marginBottom: 40}
})
