import { openDB } from 'idb';

const initdb = async () => {
  console.log('⏳ -  Connecting to IndexedDB');
  // Try to create a new database.
  try {
    // Creating a connection and a new database named 'jate' which will be using version 1 of the database.
    const db = await openDB('jate', 1, {

      // Add  database schema if it has not already been initialized.
      upgrade(db) {
        if (db.objectStoreNames.contains('jate')) {
          console.log('📜 - jate database already exists');

          //exit out of the function if the database already exists.
          return;
        } console.log('🚀 - V.1 Jate on IndexedDB Connected');

        // Create a new object store for the data and give it an key name of 'id' which needs to increment automatically.
        console.log('⏳ - Now creating object storage named jate');
        db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
        console.log('🚀 - jate database created');
        },
    });
    // Return the result from the database.
    return db;
  }
  catch (err) {
    console.error('❌ - Failed to create jate database', err);
  }
};

// Logic for GET method that gets all the content from the database
// Export a function that will use to GET all from the database.
export const getDb = async () => {
  console.log('⏳ - Trying to GET all from the database');
  //Try to get all data from the database.
  try {
    
    // Create a connection to the database and the version to use.
    const contactDb = await openDB('jate', 1);

    // Create a new transaction and specify the database and data privileges.
    const tx = contactDb.transaction('jate', 'readonly');

    // Open up the desired object store.
    const store = tx.objectStore('jate');

    // Check for existing data in the ObjectStore.
    if ('getAllKeys' in store) {

      // initialize variables
      const keys = await store.getAllKeys();

      // if there are no keys:
      if (keys.length === 0) {
        console.log('📭 - The database is clean and clear of entries');

        // if no keys found, return null
        return null;
      }
    }

    // if there's no data in the ObjectStore, fallback for browsers that don't support getAllKeys()
    else {
      const count = await store.count();

      // count if there's any, if not:
      if (count === 0) {
        console.log('📭 - No data stored in the database');

        // return null
        return null;
      }
    }

    // Use the .getAll() method to get all data in the database.
    const request = store.getAll();

    // Get confirmation of the request.
    const result = await request;

    console.log('Retrieved Data: ', result);
    // return the result data
    return result;
  }
  catch (err) {
    console.error('❌ - Failed to GET all data:', err);

    // return null when failed to get data
    return null;
  }
};

// Logic to PUT method that accepts some content and adds it to the database
// Export a function that will use to PUT to the database.
export const putDb = async (content) => {
  console.log('Try to implement PUT method to the database');
  try {
    
    // Create a connection to the database and the version we want to use.
    const contactDb = await openDB('jate', 1);

    // Create a new transaction and specify the database and data privileges.
    const tx = contactDb.transaction('jate', 'readwrite');

    // Open up the desired object store.
    const store = tx.objectStore('jate');

    // Use the .put() method on the store and pass in indexed ID and the content.
    const request = store.put({ content: content });

    // Get confirmation of the request.
    const result = await request;

    console.log('🚀 - PUT data saved to IndexedDB', result);
  }
  catch (err) {
    console.error('❌ - Failed to PUT new data:', err);
  }
};

initdb();
