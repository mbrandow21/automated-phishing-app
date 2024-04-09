"use client"

import { UserButton } from '@/components/auth/user-button'
import Link from 'next/link'
import React from 'react'

import { FaHome } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { GrSchedule } from "react-icons/gr";
import { usePathname, useSearchParams } from "next/navigation";

const DashboardNav = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams()

  const companyId = searchParams.get("companyId")

  return (
    <div className='hidden z-0 sticky lg:flex flex-col w-[330px] h-full p-8 items-left border-r-2 justify-between'>
      <div>
        <Link 
          href="/dashboard"
        >
          <h1 className='font-extrabold text-2xl mb-16'>PhishAudits</h1>
        </Link>
        <ul>
        <Link href={`/dashboard?companyId=${companyId}`}>
            <li className={`${pathName === "/dashboard" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><FaHome size={25} /> Overview</li>
          </Link>
          <Link href={`/dashboard/audits?companyId=${companyId}`}>
            <li className={`${pathName === "/dashboard/audits" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><GrSchedule size={25} /> Scheduled Audits</li>          
          </Link>
          <Link href={`/dashboard/contacts?companyId=${companyId}`}>
            <li className={`${pathName === "/dashboard/contacts" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><IoPerson size={25} /> Contacts</li>
          </Link>
        </ul>
      </div>
      <UserButton />
    </div>
  )
}

export default DashboardNav