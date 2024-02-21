import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import {getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'

// INITIALIZE FIREBASE
const app = initializeApp(firebaseConfig);

// CONNECT TO THE DATABASE
const database = getFirestore();

// CONNECT TO THE USERS COLLECTION
const userCollection = collection(database, 'privateUsers');
const corporateUserCollection = collection(database, 'corporateUsers');


// Get the Auth service
const authService = getAuth(); // Initialize the Auth service

// Select private or corporate
const privateForm = document.querySelector('.create-account__private-form');
const corporateForm = document.querySelector('.create-account__corporate-form');

const privateButton = document.querySelector('.create-account__private-button');
const corporateButton = document.querySelector('.create-account__corporate-button');

privateButton.addEventListener('click', () => {
    corporateForm.style.display = 'none'; // Hide corporate form
    privateForm.style.display = 'grid'; // Show private form
});

corporateButton.addEventListener('click', () => {
    privateForm.style.display = 'none'; // Hide private form
    corporateForm.style.display = 'grid'; // Show corporate form
});



// SELECT PRIVATE ELEMENTS
const userNamePrivate = document.querySelector('#userNamePrivate');
const passwordPrivate = document.querySelector('#passwordPrivate');
const namePrivate = document.querySelector('#namePrivate');
const emailPrivate = document.querySelector('#emailPrivate');
const phonePrivate = document.querySelector('#phonePrivate');
const birthdatePrivate = document.querySelector('#birthdatePrivate');

const addUsersForm = document.querySelector('.create-account__submit-button');

addUsersForm.addEventListener('click', (e) => {
    e.preventDefault();
    const newUser = {
        username: userNamePrivate.value,
        name: namePrivate.value,
        email: emailPrivate.value,
        phone: phonePrivate.value,
        birthdate: birthdatePrivate.value
    };
    
    // Add user to Firestore collection
    addDoc(userCollection, newUser)
    .then(() => {
        console.log(`${newUser.name} data has been stored successfully in Firestore!`);
    })
    .catch(err => console.log(err.message));

    const userEmail = emailPrivate.value;
    const userPassword = passwordPrivate.value;

    // Create user account with email and password
    createUserWithEmailAndPassword(authService, userEmail, userPassword)
    .then((userCredential) => {
        console.log('The account has been created successfully:', userCredential);
    })
    .catch(err => console.log(err.message));
});

// SELECT CORPORATE ELEMENTS
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


// SIGN OUT USERS
const signOutButton = document.querySelector('.sign-out-button');
const signOutUsers = ()=>{
    signOut(authService)
    .then(()=> console.log('Signed out successfully!!'))
    .catch(err => console.log(err.message))
}

signOutButton.addEventListener('click', (e)=>{
    e.preventDefault();
    signOutUsers();
})


const email = document.querySelector('.email');
const password = document.querySelector('.password');

// SIGNING IN USERS
const signInButton = document.querySelector('.sign-in-button');
const signInUsers = ()=>{
    const userEmail = email.value;
    const userPassword = password.value;
    signInWithEmailAndPassword(authService, userEmail, userPassword)
    .then(()=> {
        console.log('You have successfully logged back in');
    })
    .catch(err => console.log(err.message))
}

signInButton.addEventListener('click', (e)=>{
    e.preventDefault();
    signInUsers()
})

// CHECK USERS AUTHENTICATION STATE

const checkUsersStatus = ()=>{
    const secretContent = document.querySelector('.secret-content');
    onAuthStateChanged(authService, user =>{
        if(user){
            secretContent.style.display = 'block';
        } else{
            secretContent.style.display = 'none';
        }
    })
}

checkUsersStatus();