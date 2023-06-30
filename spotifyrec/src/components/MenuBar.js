import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

class MenuBar extends React.Component {
    render() {
        return(
          // 1DB954
            <Navbar type="dark" theme="success" expand="md">
        <NavbarBrand href="/">Spotify Recommender</NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active href="/tracks">
                Tracks
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/artists" >
                Artists
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/albums" >
                Albums
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink active  href="/playlists" >
                Playlists
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
