import { Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Cadastro from '../pages/Cadastro'
import PaginaInicial from '../pages/PaginaInicial'
import AdicionarGrupo from '../pages/AdicionarGrupo'
import GrupoMenu from '../pages/GrupoMenu'
import ListaEstudantes from '../pages/ListaEstudantes'
import AdicionarEstudante from '../pages/AdicionarEstudante'
import ListaItens from '../pages/ListaItens'
import AdicionarItem from '../pages/AdicionarItem'

import Private from './Private'
import Public from './Public'
import ListaProfissionais from '../pages/ListaProfissionais'
import AdicionarProfissional from '../pages/AdicionarProfissional'
import ItensPerdidos from '../pages/ItensPerdidos'
import AdicionarItemPerdido from '../pages/AdicionarItemPerdido'
import AtribuiDono from '../pages/AtribuirDono'

function RoutesApp(){
    return(
        <Routes>

            {/* rotas publicas */}
            <Route 
                path="/" 
                element={<Public><Login/></Public>}
            />
            <Route 
                path="/cadastro" 
                element={<Public><Cadastro/></Public>}
            />

            {/* rotas privadas */}
            <Route 
                path="/pagina-inicial/" 
                element={<Private><PaginaInicial/></Private>}
            />
            <Route 
                path="/grupo" 
                element={<Private><AdicionarGrupo/></Private>}
            />
            <Route 
                path="/grupo/:id" 
                element={<Private><AdicionarGrupo/></Private>}
            />
            <Route 
                path="/grupo/menu/:id" 
                element={<Private><GrupoMenu/></Private>}
            />
            <Route
                 path="/grupo/menu/:id/estudantes" 
                element={<Private><ListaEstudantes/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/estudantes/estudante" 
                element={<Private><AdicionarEstudante/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/estudantes/estudante/:idEstudante" 
                element={<Private><AdicionarEstudante/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/estudantes/estudante/:idEstudante/itens" 
                element={<Private><ListaItens/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/estudantes/estudante/:idEstudante/itens/item" 
                element={<Private><AdicionarItem/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/estudantes/estudante/:idEstudante/itens/item/:idItem" 
                element={<Private><AdicionarItem/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/profissionais" 
                element={<Private><ListaProfissionais/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/profissionais/profissional" 
                element={<Private><AdicionarProfissional/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/perdidos" 
                element={<Private><ItensPerdidos/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/perdidos/perdido" 
                element={<Private><AdicionarItemPerdido/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/perdidos/perdido/:idItem" 
                element={<Private><AdicionarItemPerdido/></Private>}
            />
            <Route 
                path="/grupo/menu/:id/perdidos/perdido/:idItem/atribuir" 
                element={<Private><AtribuiDono/></Private>}
            />
        </Routes>
    )
}

export default RoutesApp