import React, { ReactNode, useEffect } from 'react'
import { useState } from 'react'
import { mdiForwardburger, mdiBackburger, mdiMenu } from '@mdi/js'
import {menuAsideAdmin, menuAsideUser} from '../menuAside'
import menuNavBar from '../menuNavBar'
import Icon from '../components/Icon'
import NavBar from '../components/NavBar'
import NavBarItemPlain from '../components/NavBar/Item/Plain'
import AsideMenu from '../components/AsideMenu'
import FooterBar from '../components/FooterBar'
import { Formik } from 'formik'
import { useRouter } from 'next/router'
import {AuthState, useAuthStore} from "../stores/auth/authStore";
import {MenuAsideItem} from "../interfaces";

type Props = {
  children: ReactNode
}

export default function LayoutAuthenticated({ children }: Props) {
  const currentUser = useAuthStore((state: AuthState ) => state.currentUser);
  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false)
  const [isAsideLgActive, setIsAsideLgActive] = useState(false)
  const [currentMenu, setCurrentMenu] = useState< MenuAsideItem[] | null>(null)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsAsideMobileExpanded(false)
      setIsAsideLgActive(false)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events])

  //switching user menu depend on their role
  useEffect(() => {
    if(currentUser){
      switch (currentUser.role){
        case "admin":
          setCurrentMenu(menuAsideAdmin)
          break;
        case "user":
          setCurrentMenu(menuAsideUser)
          break;
        default:
          setCurrentMenu(null)
          break;
      }
    }
  }, [currentUser]);

  const layoutAsidePadding = 'xl:pl-60'

  return (
    <div className={`overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''
        } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100`}
      >
        {/*header*/}
        <NavBar
          menu={menuNavBar}
          className={`${layoutAsidePadding} ${isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''}`}
        >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <Icon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <Icon path={mdiMenu} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain useMargin>
            <Formik
              initialValues={{
                search: '',
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
              
            </Formik>
          </NavBarItemPlain>
        </NavBar>
        {/*sidebar*/}
        {currentMenu && <AsideMenu
            isAsideMobileExpanded={isAsideMobileExpanded}
            isAsideLgActive={isAsideLgActive}
            menu={currentMenu}
            onAsideLgClose={() => setIsAsideLgActive(false)}
        />}
        {/*main*/}
        {children}
      </div>
    </div>
  )
}
