import { BiExit, BiSolidGroup, BiSolidUser } from 'react-icons/bi'
import {Link, useNavigate} from 'react-router-dom'

import './nav-bar.css'

import { useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

function NavBar(){
    const { logout } = useContext(AuthContext)

    const navigate = useNavigate()

    async function handleLogout(){
        await logout()
        .then(() => {
            navigate('/')
        })
    }

    return(
        <nav className="navbar">
            <Link to="/perfil" className="btn__nav">
                <BiSolidUser size={35} color="var(--quaternary__color)"/>
            </Link>

            <Link to="/pagina-inicial" className="btn__nav">
                <BiSolidGroup size={35} color="#F3EEEA"/>
            </Link>

            <button className="btn__nav" onClick={handleLogout}>
                <BiExit size={35} color="var(--quaternary__color)"/>
            </button>
        </nav>
    )
}

export default NavBar