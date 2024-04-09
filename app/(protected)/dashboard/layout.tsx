import React from 'react'
import DashboardNav from './_components/dashboard-nav';
import DesktopHeader from './_components/desktop-header';
import { redirect } from 'next/navigation';
import { getAllCompaniesByUserId, getFirstCompanyByUserId } from '@/data/company';
import { currentUser } from '@/lib/auth';

interface DashboardLayoutProps {
  children: React.ReactNode;
};



const dashboardLayout = async ({children}: DashboardLayoutProps) => {

  const user = await currentUser()
  
  const companyExists = await getFirstCompanyByUserId(user.id)

  if (!companyExists) {
    redirect("/setup/company")
  }

  const companies = await getAllCompaniesByUserId(user.id);


  return (
    <div className='w-full h-full flex flex-row'>
      <DashboardNav />
      <div className='flex flex-col w-full h-full'>
        <DesktopHeader companies={companies} />
        {children}
      </div>
    </div>
  )
}

export default dashboardLayout