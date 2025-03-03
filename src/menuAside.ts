import {
  mdiMonitor, 
  mdiTable,
  mdiViewList,
  mdiAccountGroup,
} from '@mdi/js'
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/tables',
    label: 'Tables',
    icon: mdiTable,
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
]

export default menuAside
