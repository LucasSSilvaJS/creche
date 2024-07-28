import './alterar-senha.css'

import Titulo from '../../components/Titulo'
import InputText from '../../components/InputText'
import InputField from '../../components/InputField'
import ButtonFull from '../../components/ButtonFull'
import NavBar from '../../components/NavBar'

import { useContext, useState } from 'react'

import { confirmPasswordReset, sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { toast } from 'react-toastify'
import { AuthContext } from '../../contexts/auth'
import { useLocation, useNavigate } from 'react-router-dom'

function AlterarSenha() {

    const { user } = useContext(AuthContext)

    const navigate = useNavigate()

    const [ email, setEmail ] = useState('')
    const [ senha, setSenha ] = useState('')

    const query = new URLSearchParams(useLocation().search)
    const oobCode = query.get('oobCode')

    async function enviarEmail(){
        if(email !== ''){
            await sendPasswordResetEmail(auth, email)
            .then(() => {
                if( email === user.email ){
                    toast.success('Email enviado!')
                    navigate('/perfil')
                }else{
                    toast.warn("Esse email não corresponde com o cadastrado!")
                }
            })
            .catch(error => {
                toast.error('Esse email não é válido!')
            })
        }else{
            toast.error('Digite um email!')
        }
    }

    async function redefinirSenha(){
        if(senha !== ''){
            await confirmPasswordReset(auth, oobCode, senha)
            .then(() => {
                toast.success('Senha redefinada com sucesso!')
                navigate('/perfil')
            })
            .catch(() => {
                toast.error('Ops! Ocorreu um erro tente mais tarde!')
            })
        }else{
            toast.error('Digite uma senha!')
        }
    }

    return ( 
        <div className="alterar-senha container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>Alterar Senha</h1>
            </Titulo>

            {oobCode ? (
                <InputField textLabel="Nova senha">
                    <InputText type="password" value={senha} handleInput={e => setSenha(e.target.value)}/>
                </InputField>
            ) : (
                <InputField textLabel="Email cadastrado">
                    <InputText type="email" value={email} handleInput={e => setEmail(e.target.value)}/>
                </InputField>
            )}

            {oobCode ? (
                <ButtonFull texto="Redefinir senha" marginTop="20px" handleAction={redefinirSenha}/>
            ) : (
                <ButtonFull texto="Enviar email" marginTop="20px" handleAction={enviarEmail}/>
            )}

            <NavBar/>
        </div>
    )
}

export default AlterarSenha