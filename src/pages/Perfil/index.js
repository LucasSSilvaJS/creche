import './perfil.css'

import ImgCircle from '../../components/ImgCircle';
import Titulo from '../../components/Titulo';
import NavBar from '../../components/NavBar';
import ButtonFull from '../../components/ButtonFull';

import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';
import { useNavigate } from 'react-router-dom';

function Perfil() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()

    return ( 
        <div className="perfil container responsive-navbar">
            <Titulo marginBottom="20px" marginTop="20px">
                <h1>{user.nome}</h1>
            </Titulo>

            <ImgCircle 
                alt="avatar do usuario" 
                src={user.imageUrl} 
                marginBottom="20px"
            />

            <ButtonFull 
                marginBottom="20px" 
                texto="Editar perfil"
                handleAction={() => navigate('/perfil/editar')}
                />

            <ButtonFull 
                marginBottom="20px" 
                texto="Alterar senha"
                handleAction={() => navigate('/perfil/alterar-senha')}
                />

            <ButtonFull 
                texto="Solicitações"
                handleAction={() => navigate('/perfil/solicitacoes')}
            />

            <NavBar/>
        </div>
     );
}

export default Perfil;