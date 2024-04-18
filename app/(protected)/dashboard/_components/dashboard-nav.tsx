"use client"

import { UserButton } from '@/components/auth/user-button'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { FaHome } from "react-icons/fa";
import { IoPerson } from "react-icons/io5";
import { GrSchedule } from "react-icons/gr";
import { FaBuilding } from "react-icons/fa";

import { usePathname, useSearchParams } from "next/navigation";
import { UserRole } from '@prisma/client';

const DashboardNav = () => {
  const pathName = usePathname();
  const searchParams = useSearchParams()

  const [userCompanyRole, setUserCompanyRole] = useState<UserRole | null>(null)

  const companyId = searchParams.get("companyId")

  useEffect(() => {
    if (companyId) {
      fetch(`/api/internal/get/user-company-role?companyId=${companyId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.role) {
          setUserCompanyRole(data.role)
        }
      })
      .catch((error) => {
        console.error("Failed to fetch company users:", error);
      });
    }
  }, [companyId])
  

  return (
    <div className='hidden z-0 sticky lg:flex flex-col w-[330px] h-full p-8 items-left border-r-2 justify-between'>
      <div>
        <Link 
          href="/dashboard"
        >
          <h1 className='font-extrabold text-2xl mb-16'>CompanyManager</h1>
        </Link>
        <ul>
        <Link href={`/dashboard?companyId=${companyId}`}>
            <li className={`${pathName === "/dashboard" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><FaHome size={25} /> Overview</li>
          </Link>
          {/* <Link href={`/dashboard/audits?companyId=${companyId}`}>
            <li className={`${pathName === "/dashboard/audits" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><GrSchedule size={25} /> Scheduled Audits</li>          
          </Link>
          <Link href={`/dashboard/contacts?companyId=${companyId}`}>
            <li className={`${pathName === "/dashboard/contacts" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><IoPerson size={25} /> Contacts</li>
          </Link> */}
          {userCompanyRole !== "USER" && userCompanyRole !== null && userCompanyRole !== undefined &&
            <Link href={`/dashboard/company?companyId=${companyId}`}>
              <li className={`${pathName === "/dashboard/company" && 'bg-slate-100 dark:bg-slate-800'} nav-list-item`}><FaBuilding size={25} /> Company</li>
            </Link>
          }
        </ul>
      </div>
      <UserButton />
    </div>
  )
}

export default DashboardNav