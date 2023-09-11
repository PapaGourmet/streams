import { initializeApp } from "firebase/app"
import { getStorage, ref } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAe9gHY2gkSp25Tl0s4RcIIeaFKRNA-Lr8",
    authDomain: "papa-gourmet.firebaseapp.com",
    databaseURL: "https://papa-gourmet-default-rtdb.firebaseio.com",
    projectId: "papa-gourmet",
    storageBucket: "papa-gourmet.appspot.com",
    messagingSenderId: "1018334031180",
    appId: "1:1018334031180:web:8c80330fb37e987754b3e9",
    measurementId: "G-3YXC9GFFVM"
}

const config = initializeApp(firebaseConfig)


export default config
