import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    deleteField, 
} from "firebase/firestore";
import { db } from "./firebase";

export const addToUserList = async (userId, item) => {
    try {
        const userListRef = doc(db, "userLists", userId);
        
        // Get current list
        const docSnap = await getDoc(userListRef);
        
        const itemData = {
            id: item.id,
            title: item.title || item.name,
            poster_path: item.poster_path,
            release_date: item.release_date || item.first_air_date,
            media_type: item.media_type || 'movie',
            added_at: new Date().toISOString(),
            vote_average: item.vote_average,
            overview: item.overview
        };

        if (docSnap.exists()) {
            // Update existing document
            await updateDoc(userListRef, {
                [`items.${item.id}`]: itemData
            });
        } else {
            // Create new document
            await setDoc(userListRef, {
                userId: userId,
                items: {
                    [item.id]: itemData
                },
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }
        
        return true;
    } catch (error) {
        console.error("Error adding to user list:", error);
        throw error;
    }
};

// Remove item from user's list
export const removeFromUserList = async (userId, itemId) => {
    try {
        const userListRef = doc(db, "userLists", userId);
        
        await updateDoc(userListRef, {
            [`items.${itemId}`]: deleteField(),
            updated_at: new Date().toISOString()
        });
        
        return true;
    } catch (error) {
        console.error("Error removing from user list:", error);
        throw error;
    }
};

// Get user's list
export const getUserList = async (userId) => {
    try {
        const userListRef = doc(db, "userLists", userId);
        const docSnap = await getDoc(userListRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Convert items object to array
            const items = data.items ? Object.values(data.items) : [];
            // Sort by added_at date (newest first)
            return items.sort((a, b) => new Date(b.added_at) - new Date(a.added_at));
        }
        
        return [];
    } catch (error) {
        console.error("Error getting user list:", error);
        throw error;
    }
};

// Check if item is in user's list
export const isInUserList = async (userId, itemId) => {
    try {
        const userListRef = doc(db, "userLists", userId);
        const docSnap = await getDoc(userListRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            return data.items && data.items[itemId] ? true : false;
        }
        
        return false;
    } catch (error) {
        console.error("Error checking user list:", error);
        return false;
    }
};

// Get list stats
export const getUserListStats = async (userId) => {
    try {
        const userListRef = doc(db, "userLists", userId);
        const docSnap = await getDoc(userListRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            const items = data.items ? Object.values(data.items) : [];
            
            const stats = {
                totalItems: items.length,
                movies: items.filter(item => item.media_type === 'movie').length,
                tvShows: items.filter(item => item.media_type === 'tv').length,
                lastAdded: items.length > 0 ? items.reduce((latest, item) => 
                    new Date(item.added_at) > new Date(latest.added_at) ? item : latest
                ) : null
            };
            
            return stats;
        }
        
        return {
            totalItems: 0,
            movies: 0,
            tvShows: 0,
            lastAdded: null
        };
    } catch (error) {
        console.error("Error getting user list stats:", error);
        throw error;
    }
};