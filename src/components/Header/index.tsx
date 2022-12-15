import { NavLink } from 'react-router-dom'
import { Timer, Scroll } from 'phosphor-react'

import { HeaderContainer } from './styles'

import logoIgnite from '../../assets/logoIgnite.svg'

export function Header() {
  return (
    <HeaderContainer>
      <img src={logoIgnite} alt="" />
      <nav>
        <NavLink to="/">
          <Timer size={24} />
        </NavLink>
        <NavLink to="/history">
          <Scroll size={24} />
        </NavLink>
      </nav>
    </HeaderContainer>
  )
}
