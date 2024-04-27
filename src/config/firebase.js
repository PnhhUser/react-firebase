import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import * as firestore from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAzqr-a4ArCdN-dTClJ2SvCm9uSOyd4LZ0",
  authDomain: "fir-course-d2392.firebaseapp.com",
  projectId: "fir-course-d2392",
  storageBucket: "fir-course-d2392.appspot.com",
  messagingSenderId: "415565310552",
  appId: "1:415565310552:web:a45194790058c030f2f82d",
  measurementId: "G-B537Y97211",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const db = firestore.getFirestore(app);
export const storage = getStorage(app);
