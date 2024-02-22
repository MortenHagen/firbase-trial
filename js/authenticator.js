import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', function(){

    // Initialize Firebase app
    const firebaseApp = initializeApp(firebaseConfig);
    const authService = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);

    const checkUsersStatus = () => {
        const secretContent = document.querySelector('.secret-content');
        onAuthStateChanged(authService, user => {
            if(user){
                secretContent.style.display = 'block';
                const userId = user.uid; // Get the UID of the logged-in user
                // Fetch user document from Firestore
                const userDocRef = doc(database, "users", userId);
                getDoc(userDocRef)
                  .then((doc) => {
                    if (doc.exists()) {
                      // Document data exists, retrieve it
                      const userData = doc.data();
                      // Now you can use userData to display information on your landing page
                      console.log(userData);
                    } else {
                      // Document does not exist
                      console.log("No such document!");
                    }
                  })
                  .catch((error) => {
                    console.log("Error getting document:", error);
                  });
            } else {
                secretContent.style.display = 'none';
            }
        });
    }
    
    checkUsersStatus();

});
