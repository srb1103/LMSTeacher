import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import colors from '../colors'
import { RFValue } from 'react-native-responsive-fontsize'

export default function StatBox(props){
    const {stat, heading} = props
    return(
        <View style={styles.stat_wrap}>
            <Text style={styles.stat}>{stat}</Text>
            <Text style={styles.heading}>{heading}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    stat_wrap:{padding: 10, borderRadius: 10, backgroundColor: colors.white, alignItems: 'center', justifyContent:'center',margin: 3, flex: 1},
    stat:{color: colors.black, fontSize: RFValue(25), fontFamily: 'p5', marginBottom: -8},
    heading:{color: colors.lblack, fontSize: RFValue(10)}
})