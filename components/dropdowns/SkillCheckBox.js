import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CheckBox from '@react-native-community/checkbox';




const SkillCheckBox = () => {

    const [toggleCheckBox, setToggleCheckBox] = useState(false)
    return (
        <View>
            <CheckBox
                disabled={false}
                value={toggleCheckBox}
                onValueChange={(newValue) => setToggleCheckBox(newValue)}
            />
        </View>
    )
}

export default SkillCheckBox

const styles = StyleSheet.create({})