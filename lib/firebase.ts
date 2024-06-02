// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getStorage, uploadString, getDownloadURL, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1ttdgimsB68AkmhQbHUQoiWXTPxffGcQ",
  authDomain: "celulares-3b407.firebaseapp.com",
  projectId: "celulares-3b407",
  storageBucket: "celulares-3b407.appspot.com",
  messagingSenderId: "217003058631",
  appId: "1:217003058631:web:453f5c147c5f24e29565e2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

//Auth Functions
//Crear usuario con correo y contraseña
export const createUser = async(user: {email: string, password: string})=>{
  return await createUserWithEmailAndPassword(auth, user.email, user.password)
}
//Acceder como usuario
export const signIn = async(user: {email: string, password: string})=>{
    return await signInWithEmailAndPassword(auth, user.email, user.password)
}
//Actualizar el nombre del usuario y la foto
export const updateUser = async(user: {
  displayName?: string | null | undefined;
  photoURL?: string | null | undefined;
})=>{
  if(auth.currentUser) return updateProfile(auth.currentUser,user)
}

//Database functions
export const getCollection = async(collectionName: string, queryArray?: any[])=>{
  const ref=collection(db, collectionName);
  const q = queryArray ? query(ref, ...queryArray) : query(ref);

  return ((await getDocs(q)).docs.map((doc)=> ({id:doc.id, ...doc.data()})));

}
//Enviar correo de recuperacion de contraseña
export const sendResetEmail = (email: string)=>{
  return sendPasswordResetEmail(auth, email)
}
//Cerrar sesión
export const SingOutAccount = ()=>{
  localStorage.removeItem('user');
  return auth.signOut();
}

//Obtener documento de una colección
export const getDocument = async(path:string)=>{
  return (await getDoc(doc(db, path))).data();
}
//Poner documento en una coleccion
export const setDocument = (path:string, data: any)=>{
  data.createdAt = serverTimestamp();
  return setDoc(doc(db, path), data);
}
//Agregar un documento
export const addDocument = (path:string, data: any)=>{
  data.createdAt = serverTimestamp();
  return addDoc(collection(db, path), data);
}
//Eliminar documentos
export const deleteDocument = (path:string)=>{
  return deleteDoc(doc(db, path));
}
//Storage Functions
//Actualizar documentos
export const updateDocument = (path:string, data: any)=>{
  return updateDoc(doc(db, path), data);
}
//Subir archivos
export const uploadBase64 = async(path: string, base64: string)=>{
  return uploadString(ref(storage, path), base64, 'data_url').then(()=>{
    return getDownloadURL(ref(storage, path))
  })
}