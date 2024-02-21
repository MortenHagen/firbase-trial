import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'

// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

// CONNECT TO THE DATABASE
const database = getFirestore();

// CONNECT TO THE USERS COLLECTION
const corporateUserCollection = collection(database, 'corporateUsers');

// Get the Auth service
const authService = getAuth(); // Initialize the Auth service

// SELECT FORM ELEMENTS
const passwordCorporate = document.querySelector('#passwordCorporate');
const nameCorporate = document.querySelector('#nameCorporate');
const emailCorporate = document.querySelector('#emailCorporate');
const phoneCorporate = document.querySelector('#phoneCorporate');
const orgCorporate = document.querySelector('#orgCorporate');

const addCorporateForm = document.querySelector('.create-account__corporate-submit-button');

addCorporateForm.addEventListener('click', (e) => {
    e.preventDefault();
    const newCorporateUser = {
        name: nameCorporate.value,
        email: emailCorporate.value,
        phone: phoneCorporate.value,
        orgNr: orgCorporate.value
    };
    
    // Add user to Firestore collection
    addDoc(corporateUserCollection, newCorporateUser)
    .then(() => {
        console.log(`${newCorporateUser.name} data has been stored successfully in Firestore!`);
    })
    .catch(err => console.log(err.message));

    const corporateEmail = emailCorporate.value;
    const corporatePassword = passwordCorporate.value;

    // Create user account with email and password
    createUserWithEmailAndPassword(authService, corporateEmail, corporatePassword)
    .then((corporateCredential) => {
        console.log('The account has been created successfully:', corporateCredential);
    })
    .catch(err => console.log(err.message));
});
