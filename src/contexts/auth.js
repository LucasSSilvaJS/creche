import { createContext, useState, useEffect } from 'react'

import { auth, db, storage } from '../services/firebaseConnection'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export const AuthContext = createContext({})

function AuthProvider({ children }) {

    const [user, setUser] = useState(null)

    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingRegister, setLoadingRegister] = useState(false)

    useEffect(() => {
        function setLocalUser(){
            const userLocal = getLoginInLocalStorage()
            if(userLocal){
                setUser(userLocal)
            }
        }
        setLocalUser()
    }, [])

    async function login(email, password) {
        try{
            setLoadingLogin(true)

            const login = await signInWithEmailAndPassword(auth, email, password)

            if(login.user){
                const docRef = doc(db, 'usuarios', login.user.uid)
                const userInfo = await getDoc(docRef)
                
                const user = {
                    id: userInfo.data().id,
                    email: userInfo.data().email,
                    nome: userInfo.data().nome,
                    cargo: userInfo.data().cargo,
                    imageUrl: userInfo.data().imageUrl,
                    created: userInfo.data().created
                }
    
                setUser(user)
                setLoginInLocalStorage(user)

                return true
            }

            return false

        }catch(error){
            console.error('Falha ao realizar o login', error)
        }finally{
            setLoadingLogin(false)
        }
    }

    async function logout() {
        try{
            await signOut(auth)
            setUser(null)
            removeLoginInLocalStorage()
        }catch(error){
            console.error('Erro ao deslogar', error)
        }
    }

    async function register(email, password, nome, cargo, avatarImg) {
        try{
            setLoadingRegister(true)

            const account = await createUserWithEmailAndPassword(auth, email, password)

            if(account.user){
                const url = await getUrl(avatarImg, account.user.uid)
    
                const newUser = {
                    id: account.user.uid,
                    email: account.user.email,
                    nome,
                    cargo,
                    imageUrl: url,
                    created: new Date()
                }
                
                const docRef = doc(db, 'usuarios', account.user.uid)
    
                await setDoc(docRef, newUser)
    
                setUser(newUser)
                setLoginInLocalStorage(newUser)

                return true
            }

            return false

        }catch(error){
            console.error('Erro ao realizar o cadastro', error)
        }finally{
            setLoadingRegister(false)
        }
    }

    async function getUrl(avatarImg, id){
        try{
            const uploadRef = ref(storage, `avatar/${id}/${avatarImg.name}`)

            const img = await uploadBytes(uploadRef, avatarImg)
            const imgRef = img.ref

            const url = await getDownloadURL(imgRef)

            return url
            
        }catch(error){
            console.error('Erro ao obter url da imagem', error)
        }
    }

    function setLoginInLocalStorage(data) {
        localStorage.setItem('@creche-login', JSON.stringify(data))
    }

    function removeLoginInLocalStorage() {
        localStorage.removeItem('@creche-login')
    }

    function getLoginInLocalStorage() {
        return JSON.parse(localStorage.getItem('@creche-login'))
    }

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            login,
            logout,
            register,
            loadingLogin,
            loadingRegister,
            getLoginInLocalStorage,
            setLoginInLocalStorage
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
