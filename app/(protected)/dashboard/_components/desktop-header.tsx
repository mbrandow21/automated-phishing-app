"use client"

import Link from 'next/link'
import React, { useTransition, useEffect, useState } from 'react'

import { GoArrowUpRight } from "react-icons/go";

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from "@/components/ui/select"
import { SelectValue } from "@radix-ui/react-select"
import { redirect } from "next/navigation";


import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { NewCompanyForm } from '../../_components/new-company';
import { useSearchParams } from 'next/navigation';



interface Company {
  id: string;
  companyName: string;
  adminInviteToken: string;
  userInviteToken: string;
  companyOwnerId: string;
}

interface DesktopHeaderProps {
  companies: Company[] | null;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = ({ companies }) => {

  const [isPending, startTransition] = useTransition();
  const [activeCompany, setActiveCompany] = useState<Company | null | undefined>(null);

  const searchParams = useSearchParams();

  const companyId = searchParams.get("companyId")

  useEffect(() => {
    if (activeCompany && companyId !== activeCompany.id) {
      redirect(`/dashboard?companyId=${activeCompany.id}`)
    }
    if (companyId && companies) {
      const findActiveCompany = companies.find(company => company.id === companyId)
      setActiveCompany(findActiveCompany)
    }
    if (!companyId && companies) {
      setActiveCompany(companies[0])
    }
  }, [companies,activeCompany]); // This effect depends on the companies prop

  const selectCompany = (newActiveCompany: Company) => {
    setActiveCompany(newActiveCompany)
  }

  return (
    <div className='hidden z-10 w-full h-[50px] border-b-2 lg:flex flex-row justify-between items-center px-4 gap-10'>
      <div className='flex flex-row gap-1 items-center'>
        Company:
        <Select
          disabled={isPending}
        >
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder={activeCompany?.companyName} />
            </SelectTrigger>

          <SelectContent>
            {companies?.map((company: Company) => (
              <div key={company.id} className=" relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              onClick={() => {selectCompany(company)}}>
                {company.companyName}
              </div>
            ))}
            <Sheet>
              <SheetTrigger className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                Add New:
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Add a new company</SheetTitle>
                  <SheetDescription>
                    <NewCompanyForm />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </SelectContent>
        </Select>
      </div>
      <div className='px-4 gap-10 flex flex-row'>
        <Link href="/help">
          <div className='flex flex-row gap-1 items-center'>
            <p>Help</p>
          </div>
        </Link>
        <Link href="/docs">
          <div className='flex flex-row gap-1 items-center'>
            <p>Docs</p>
            <GoArrowUpRight size={25} />
          </div>
        </Link>
      </div>
    </div>
  )
}

export default DesktopHeader