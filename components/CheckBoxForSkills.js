import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const getUrl = 'http://192.168.0.102/api_skillLink/api/viewSkill.php';

const SquareCheckbox = ({ checked, onChange }) => {
    return (
        <TouchableOpacity style={[styles.checkbox, checked && styles.checked]} onPress={onChange}>
            {checked && <Text style={{ color: '#F7FFE5' }}>✓</Text>}
        </TouchableOpacity>
    );
};

const CheckBoxForSkills = ({ onSave }) => {
    const [checkboxes, setCheckboxes] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(getUrl);
            const data = response.data;

            const checkboxesData = data.map((item) => ({
                id: item.id,
                label: item.label,
                checked: false,
            }));

            setCheckboxes(checkboxesData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCheckboxChange = (index) => {
        const updatedCheckboxes = [...checkboxes];
        updatedCheckboxes[index].checked = !updatedCheckboxes[index].checked;
        setCheckboxes(updatedCheckboxes);
    };

    useEffect(() => {
        onSave(checkboxes);
    }, [checkboxes, onSave]);

    return (
        <View style={styles.container}>
            {checkboxes.map((checkbox, index) => (
                <View key={checkbox.id} style={styles.itemContainer}>
                    <Text style={styles.label}>{checkbox.label}</Text>
                    <SquareCheckbox
                        checked={checkbox.checked}
                        onChange={() => handleCheckboxChange(index)}
                    />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 8,
    },
    checkbox: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: '#1A5D1A',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1.5,
        marginRight: 70,
        backgroundColor: '#F7FFE5',
    },
    checked: {
        backgroundColor: '#1A5D1A',
    },
    label: {
        flex: 1,
        marginLeft: 10,
        fontSize: 20,
        color: '#1A5D1A',
        fontWeight: 'bold',
        marginLeft: 70,
    },
});

export default CheckBoxForSkills;
