import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "project-4a207984-cce4-401c-aab",
  appId: "1:494828166357:web:696c364a4780d4de08d65c",
  apiKey: "AIzaSyBZUg54RBsx19pTv3FmQVrHu64Cfy1G12I",
  authDomain: "project-4a207984-cce4-401c-aab.firebaseapp.com",
  storageBucket: "project-4a207984-cce4-401c-aab.firebasestorage.app",
  messagingSenderId: "494828166357",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, "ai-studio-clipgenius-8bad68fe-42b6-43e3-ac2d-901732156815");
export const storage = getStorage(app);
