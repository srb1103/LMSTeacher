import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import colors from '../colors'
import IonIcon from 'react-native-vector-icons/Ionicons'
import { RFValue } from 'react-native-responsive-fontsize'

export default function NavItem(props) {
    const {icon, text, fun} = props
    return (
        <TouchableOpacity style={styles.navList} activeOpacity={.7} onPress={()=>{setTimeout(()=>{fun()},50)}}>
           <View style={styles.navLeft}>
                <IonIcon name={icon} style={[styles.navText, styles.nl_icon]}></IonIcon>
                <Text style={styles.navText}>{text}</Text>
            </View>
            <IonIcon name="chevron-forward-outline" color={colors.black} style={styles.navText}></IonIcon>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    navList:{
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5'
    },
    navLeft:{
        flexDirection: 'row'
    },
    navText:{
        color: '#767676',
        fontSize: RFValue(15),
        fontFamily: 'p4'
    },
    nl_icon:{
        marginTop: 4,
        marginRight: 7,
        fontSize: RFValue(15),
        color: colors.black
    }
})
