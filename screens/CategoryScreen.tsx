import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';

const CategoryScreen = () => {
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
        // Fetch all categories on component mount
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
        const response = await fetch('http://10.0.2.2:3000/api/categories'); // Replace with your backend URL
        const data = await response.json();
        setCategories(data);
        } catch (error) {
        console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async () => {
        if (newCategoryName.trim()) {
        try {
            const response = await fetch('http://10.0.2.2:3000/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newCategoryName }),
            });
            if (response.ok) {
            setNewCategoryName('');
            setIsAddingCategory(false);
            fetchCategories(); // Refetch categories after adding
            } else {
            console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
        }
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {isAddingCategory ? (
                <>
                <TextInput
                    value={newCategoryName}
                    onChangeText={setNewCategoryName}
                    placeholder="Enter category name"
                    style={{ borderBottomWidth: 1, marginBottom: 10 }}
                />
                <Button title="Add Category" onPress={handleAddCategory} />
                <Button title="Cancel" onPress={() => setIsAddingCategory(false)} />
                </>
            ) : (
                <>
                <Button title="Add New Category" onPress={() => setIsAddingCategory(true)} />
                </>
            )}

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                <View style={{ padding: 10, borderBottomWidth: 1 }}>
                    <Text>{item.name}</Text>
                </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    label: { fontSize: 16, marginBottom: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    }
});

export default CategoryScreen;