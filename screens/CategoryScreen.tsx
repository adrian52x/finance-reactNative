import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList } from 'react-native';
import { BACKEND_URL } from '@env';
import { Category } from '../entities/category';
import { CreateCategoryDTO } from '../entities/CreateCategoryDTO';

const CategoryScreen = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);


    const fetchCategories = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/categories`); // Replace with your backend URL
            const data = await response.json();
            
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async () => {
        if (newCategoryName.trim()) {
        try {
            const response = await fetch(`${BACKEND_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newCategoryName } as CreateCategoryDTO),
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

    const handleDeleteCategory = async (category: Category) => {
        Alert.alert(
            'Delete Category',
            `Are you sure you want to delete this category (${category.title})?`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: async () => {
                        try {
                            const response = await fetch(`${BACKEND_URL}/api/categories/${category.id}`, {
                                method: 'DELETE',
                            });
                            if (response.ok) {
                                fetchCategories();
                            } else {
                                console.error('Failed to delete category');
                            }
                        } catch (error) {
                            console.error('Error deleting category:', error);
                        }
                    },
                },
            ],
            { cancelable: false }
        );
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
                    <View style={{ height: 10 }} />
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
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderBottomWidth: 1 }}>
                    <Text>{item.title}</Text>
                    <Button title="X" onPress={() => handleDeleteCategory(item)} />
                </View>
                )}
            />
        </View>
    );
};


export default CategoryScreen;