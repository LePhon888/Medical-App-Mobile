import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';

/**
 * The emoji picker using in chat UI
 * @function onEmojiSelected the callback function to handle the emoji selected
 * @returns 
 */
const EmojiPicker = ({ onEmojiSelected }) => {
    const [categories, setCategories] = useState([])
    const [categorySlug, setCategorySlug] = useState({ "slug": "smileys-emotion" });
    const [listEmoji, setListEmoji] = useState([]);
    const accessKey = `c80c217099ae61ded3fa20627d87b049773b8a87`
    const scrollViewRef = useRef(null);
    const maxRecord = 30

    const onSelectEmoji = (emoji) => {
        onEmojiSelected(emoji);
    };

    const onSelectCategory = (item) => {
        setCategorySlug(item);
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    };

    const getListEmojis = async (slug) => {
        try {
            const res = await fetch(`https://emoji-api.com/categories/${slug}?access_key=${accessKey}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch emoji data: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            data && setListEmoji(data.slice(0, maxRecord));
        } catch (error) {
            console.error('Error fetching emoji data:', error);
            // You might want to handle the error in a way that makes sense for your application
        }
    };


    const getCategories = async () => {
        try {
            const res = await fetch(`https://emoji-api.com/categories?access_key=${accessKey}`);

            if (!res.ok) {
                throw new Error(`Failed to fetch categories: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Handle the error as needed for your application
        }
    };


    useEffect(() => {
        getCategories()
    }, [])

    useEffect(() => {
        getListEmojis(categorySlug.slug)
    }, [categorySlug]);

    const renderEmojiItem = (item, index) => {
        if (item.character !== "🫠") {
            return (
                <TouchableOpacity key={index} onPress={() => onSelectEmoji(item.character)}>
                    <View style={styles.emojiItem}>
                        <Text style={{ fontSize: 30 }}>{item.character}</Text>
                    </View>
                </TouchableOpacity>
            )
        }
    }

    const renderCategoryItem = (item, index) => {
        if (item.slug !== 'component')
            return (
                <TouchableOpacity key={index} onPress={() => onSelectCategory(item)}>
                    <View style={styles.categoryItem}>
                        <Text style={item.slug !== categorySlug.slug ? styles.categoryText : styles.categoryTextActive}>
                            {item.slug.substring(0, 7)}...
                        </Text>
                    </View>
                </TouchableOpacity>
            )
    };

    return (
        <View style={styles.container}>

            {/* View Categories */}
            <View>
                <ScrollView horizontal contentContainerStyle={styles.categoryList}>
                    {categories.length > 0 && categories.map((item, index) => (
                        renderCategoryItem(item, index)
                    ))}
                </ScrollView>
            </View>

            {/* View Categories Title */}
            <View>
                {categorySlug && (
                    <Text style={styles.categoryTitle}>{categorySlug.slug}</Text>
                )}
            </View>

            {/* View Emojis */}
            <ScrollView ref={scrollViewRef} style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {listEmoji.length > 0 && listEmoji.map((item, index) => (
                    renderEmojiItem(item, index)
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f1f1f1',
        paddingHorizontal: 20,
    },
    scrollContent: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    scrollView: {
        height: 150
    },
    emojiItem: {
        padding: 5,
    },
    categoryTitle: {
        fontSize: 15,
        padding: 5,
        color: '#000000',
        fontWeight: 'bold'
    },
    categoryItem: {
        marginVertical: 5
    },
    categoryText: {
        fontSize: 15,
        color: '#797979',
        padding: 7,
    },
    categoryTextActive: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#000000',
        backgroundColor: '#e7e7e7',
        padding: 7,
        borderRadius: 15,
    },
    selectedCategory: {
        padding: 10,
        backgroundColor: '#e7e7e7',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EmojiPicker;
