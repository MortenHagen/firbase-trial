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
const privateButton = document.querySelector('.create-account__private-button');
const corporateButton = document.querySelector('.create-account__corporate-button');
const privateForm = document.querySelector('.create-account__private-form');
const corporateForm = document.querySelector('.create-account__corporate-form');

privateButton.addEventListener('click', function() {
    privateButton.style.background = 'linear-gradient(to top, #620084, #015BAB)';
    corporateButton.style.background = ''; // Reset corporate button style
    corporateForm.style.display = 'none';
    privateForm.style.display = 'grid';
});

corporateButton.addEventListener('click', function() {
    corporateButton.style.background = 'linear-gradient(to top, #620084, #015BAB)';
    privateButton.style.background = ''; // Reset private button style
    privateForm.style.display = 'none';
    corporateForm.style.display = 'grid';
});



// SELECT PRIVATE ELEMENTS
const userNamePrivate = document.querySelector('#userNamePrivate');
const passwordPrivate = document.querySelector('#passwordPrivate');
const namePrivate = document.querySelector('#namePrivate');
const emailPrivate = document.querySelector('#emailPrivate');
const phonePrivate = document.querySelector('#phonePrivate');
const birthdatePrivate = document.querySelector('#birthdatePrivate');

const addPrivateForm = document.querySelector('.create-account__submit-button');

addPrivateForm.addEventListener('click', (e) => {
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
    const inputFields = document.querySelectorAll('.create-account__private-form input');
    inputFields.forEach(input => {
        input.value = '';
        console.log('clear');
    });

    })
    .catch(err => console.log(err.message));
});

// SELECT CORPORATE ELEMENTS
const passwordCorporate = document.querySelector('#passwordCorporate');
const nameCorporate = document.querySelector('#nameCorporate');
const emailCorporate = document.querySelector('#emailCorporate');
const phoneCorporate = document.querySelector('#phoneCorporate');
const orgCorporate = document.querySelector('#orgCorporate');

const addCorporateForm = document.querySelector('.create-account__corp-button');

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
        const inputCorporateFields = document.querySelectorAll('.create-account__corporate-form input');
        inputCorporateFields.forEach(input => {
            input.value = '';
            console.log('clear');
        });
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
    console.log('signed out');
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