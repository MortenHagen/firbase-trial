import firebaseConfig from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

document.addEventListener('DOMContentLoaded', function(){

    // Initialize Firebase app
    const firebaseApp = initializeApp(firebaseConfig);
    const authService = getAuth(firebaseApp);
    const database = getFirestore(firebaseApp);
    const storage = getStorage(firebaseApp); 

	// Check user's authentication status
	const checkUsersStatus = () => {
		onAuthStateChanged(authService, async (user) => {
			if (user) {
					try {
							// Fetch data from the "privateUsers" collection
							const q = query(collection(database, "privateUsers"), where("email", "==", user.email));
							const querySnapshot = await getDocs(q);
							querySnapshot.forEach((doc) => {
									const displayUserInfoContainer = document.querySelector('.greetUser')
									const userData = doc.data();
									// Create <p> element to display user data
									const userDataParagraph = document.createElement('p');
									// Set innerHTML of <p> element with user data
									userDataParagraph.innerHTML = `
										<strong>Name:</strong> ${userData.name}<br>
										<strong>Username:</strong> ${userData.username}<br>
										<strong>Email:</strong> ${userData.email}<br>
										<strong>Phone:</strong> ${userData.phone}<br>
										<strong>Birthdate:</strong> ${userData.birthdate}<br>
									`;
									// Append <p> element to the body
									displayUserInfoContainer.appendChild(userDataParagraph);
							});
					} catch (error) {
							console.log("Error getting documents: ", error);
					}
			} else {
					window.location.href = '../index.html';
			}
		});
	};

	checkUsersStatus();

    // Event listener for form submission
    const imageUploadForm = document.querySelector('.upload-picture__container');
    const imageInput = document.querySelector('.upload-picture__input');

    imageUploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const file = imageInput.files[0];
        handleFileUpload(file);
    });

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
