import {
  mdiMonitor, 
  mdiTable,
  mdiViewList,
  
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
]

export default menuAside
