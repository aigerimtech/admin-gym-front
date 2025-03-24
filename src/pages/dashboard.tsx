import Head from 'next/head'
import {getPageTitle} from "../config";
import { useAuthStore } from '../stores/auth/authStore';
import AdminDashboard from '../components/dashboard/adminDashboard';
import ClientDashboard from '../components/dashboard/clientDashboard';


const DashboardPage = () => {
  const currentUser = useAuthStore(state => state.currentUser)  

  return (
      <>
        <Head>
          <title>{getPageTitle('Dashboard')}</title>
        </Head>
        {currentUser ?  currentUser?.access_level === 'client' ? (
            <ClientDashboard/>
          ) : (
            <AdminDashboard />
          ) : null}
      </>
  )
}



export default DashboardPage
