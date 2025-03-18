import {
  mdiMonitor, 
  mdiCalendar,
  mdiViewList,
  mdiAccountGroup,
  mdiClipboardCheck
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'

export const menuAsideUser: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/sessions',
    label: 'Sessions',
    icon: mdiCalendar,
  },
  {
    href: '/subscriptions',
    icon: mdiViewList,
    label: 'Subscriptions',
  },
]

export const menuAsideAdmin: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/sessions',
    label: 'Sessions',
    icon: mdiCalendar,
  },
  {
    href: '/subscriptions',
    icon: mdiViewList,
    label: 'Subscriptions',
  },
  {
    href: '/users',
    icon: mdiAccountGroup,
    label: 'Users',
  },
  {
    href: '/attendance',
    icon: mdiClipboardCheck, 
    label: 'Attendance',
  },
]