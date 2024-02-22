import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage'; // Added for file upload

document.addEventListener('DOMContentLoaded', function(){

    // Initialize Firebase app
    const firebaseApp = initializeApp(firebaseConfig);
    const authService = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);
    const storage = getStorage(firebaseApp); // Added for file upload

    // Function to handle file upload
    const handleFileUpload = (file) => {
        if (file) {
            // Upload file to Firebase Storage
            const storageRef = ref(storage, 'images/' + file.name);
            uploadBytes(storageRef, file)
                .then(() => {
                    console.log('File uploaded successfully!');
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                });
        } else {
            console.error('No file selected');
        }
    };

    // Check user's authentication status
    const checkUsersStatus = () => {
        onAuthStateChanged(authService, user => {
            if(user){
                const userId = user.uid;
                // Fetch user document from Firestore
                const userDocRef = doc(database, "users", userId);
                getDoc(userDocRef)
                    .then((doc) => {
                        if (doc.exists()) {
                            const userData = doc.data();
                            // Now you can use userData to display information on your landing page
                        } 
                    })
                    .catch((error) => {
                        console.log("Error getting document:", error);
                    });
            } else {
					window.location.href = '../index.html';
            }
        });
    };
    
    checkUsersStatus();

    // Event listener for form submission
    const imageUploadForm = document.getElementById('image-upload-form');
    const imageInput = document.getElementById('image-input');
    imageUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = imageInput.files[0];
        handleFileUpload(file);
    });

    // Sign out users
    const signOutButton = document.querySelector('.sign-out-button');
    const signOutUsers = () => {
        signOut(authService)
            .then(() => {
                console.log('Signed out successfully!!');
                window.location.href = '../index.html';
            })
            .catch(err => console.log(err.message));
    };

    signOutButton.addEventListener('click', (e) => {
        e.preventDefault();
        signOutUsers();
    });
});
