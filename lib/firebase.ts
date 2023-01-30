import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
	apiKey: `${process.env.NEXT_PUBLIC_FIRE_API_KEY}`,
	appId: `${process.env.NEXT_PUBLIC_FIRE_APP_ID}`,
	authDomain: `${process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN}`,
	projectId: `${process.env.NEXT_PUBLIC_FIRE_PROJECT_ID}`,
	storageBucket: `${process.env.NEXT_PUBLIC_FIRE_STORAGE_BUCKET}`,
	messagingSenderId: `${process.env.NEXT_PUBLIC_FIRE_MESSAGING}`,
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth();

export const googleAuthProvider = new GoogleAuthProvider();
