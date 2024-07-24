import './login.css'
import logo from '../../assets/logo.svg'

import { Link, useNavigate } from 'react-router-dom'

import Titulo from '../../components/Titulo'
import InputField from '../../components/InputField'
import InputText from '../../components/InputText'
import ButtonBorder from '../../components/ButtonBorder'
import ButtonFull from '../../components/ButtonFull'
import Loading from '../../components/Loading'

import { useState, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import { toast } from 'react-toastify'

function Login(){
    const { login, loadingLogin } = useContext(AuthContext)
    
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const navigate = useNavigate()

    async function handleLogin(){
        if(email && senha){
            const isLog = await login(email, senha)
            if(isLog){
                setEmail('')
                setSenha('')
                toast.success('Login efetuado com sucesso!')
            }else{
                toast.warn('Não é possível acessar essa conta!')
            }
        }else{
            toast.error('Preencha todos os campos!')
        }
    }

    return(
        <div className="container login">
            {loadingLogin && <Loading/>}

            <Titulo 
                marginBottom="15px" 
                marginTop="83px"
            >
                <h1>Creche<br/>Sem Perdas</h1>
            </Titulo>

            <img src={logo} alt="logo" />

            <InputField textLabel="Email">
                <InputText value={email} handleInput={e => setEmail(e.target.value)}/>
            </InputField>

            <InputField textLabel="Senha">
                <InputText type="password" value={senha} handleInput={e => setSenha(e.target.value)}/>
            </InputField>

            <ButtonFull texto="Login" marginTop="15px" handleAction={() => handleLogin()}/>

            <Link to="/recuperar-senha">Recuperar Senha</Link>

            <ButtonBorder 
                texto="Cadastro" 
                marginTop="60px" 
                marginBottom="30px" 
                handleNavigate={() => navigate('/cadastro')}
            />
        </div>
    )
}

export default Login