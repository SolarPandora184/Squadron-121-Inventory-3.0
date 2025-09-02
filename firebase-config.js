// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, set, get, child, push, update, remove } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDCo2OweTTS-g60MVwL9N-VUCyCyctZavc",
  authDomain: "squadron-72.firebaseapp.com",
  databaseURL: "https://squadron-72-default-rtdb.firebaseio.com",
  projectId: "squadron-72",
  storageBucket: "squadron-72.firebasestorage.app",
  messagingSenderId: "572966132981",
  appId: "1:572966132981:web:44053bbe8c60378647f9bc",
  measurementId: "G-0D77CRVR83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Firebase Database Functions for CAP Squadron 121 Inventory System
export const InventoryDB = {
  // Add new inventory item
  async addItem(itemData) {
    try {
      const itemsRef = ref(database, 'inventory');
      const newItemRef = push(itemsRef);
      await set(newItemRef, {
        ...itemData,
        id: newItemRef.key,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { success: true, id: newItemRef.key };
    } catch (error) {
      console.error('Error adding item:', error);
      return { success: false, error: error.message };
    }
  },

  // Get all inventory items
  async getAllItems() {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'inventory'));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.values(data);
      } else {
        return [];
      }
    } catch (error) {
      console.error('Error getting items:', error);
      return [];
    }
  },

  // Update existing item
  async updateItem(itemId, updates) {
    try {
      const itemRef = ref(database, `inventory/${itemId}`);
      await update(itemRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating item:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete item
  async deleteItem(itemId) {
    try {
      const itemRef = ref(database, `inventory/${itemId}`);
      await remove(itemRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting item:', error);
      return { success: false, error: error.message };
    }
  },

  // Get item by ID
  async getItem(itemId) {
    try {
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, `inventory/${itemId}`));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  },

  // Search items by criteria
  async searchItems(searchTerm, type = null, status = null) {
    try {
      const items = await this.getAllItems();
      return items.filter(item => {
        const matchesSearch = !searchTerm ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.assignedTo && item.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesType = !type || item.type === type;
        const matchesStatus = !status || item.status === status;
        
        return matchesSearch && matchesType && matchesStatus;
      });
    } catch (error) {
      console.error('Error searching items:', error);
      return [];
    }
  }
};

export { app, analytics, database };