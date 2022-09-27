import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBfZ0oz3vtgMVNDU1L2-6AvkGA7kU68GE8",
  authDomain: "stablehelper-51218.firebaseapp.com",
  projectId: "stablehelper-51218",
  storageBucket: "stablehelper-51218.appspot.com",
  messagingSenderId: "738495708908",
  appId: "1:738495708908:web:948ce5d4c4a1fe37e7efc9",
  measurementId: "G-SJ173VPJLK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export const signIn = async(email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password)
  return res
};

export const signOut = () => {
  window.parent.postMessage({pluginMessage: {type: 'signOut'}}, '*')
}

export const getVersion = async() => {
  const docRef = doc(db, "plugin_version", "uvmIy9zWXfu2mfFhYVpC");
  const docSnap = await getDoc(docRef);
  const data = docSnap.data()
  return data?.version
}

export const getNewToken =async (user: any) => {

  const refToken = user.creds.refreshToken
  const body = {
    grant_type: 'refresh_token',
    refresh_token: refToken
  }

  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${firebaseConfig.apiKey}`, {
    method: 'POST',
    body : JSON.stringify(body)
  })
  const newCreds = await res.json()

  return {
    refreshToken: newCreds.refresh_token,
    accessToken: newCreds.access_token,
    uid: newCreds.user_id 
  }
}
