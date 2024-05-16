"use client"

import { $Enums, UserRole } from '@prisma/client';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import { DataTable } from '../_components/data-table';
import { Button } from '@/components/ui/button';
import { FaRegCopy } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"
 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NewCompanyForm } from '../../_components/new-company';
import { ChangeUserCompanyRole } from './change-role';

export type CompanyUser = {
  user: {
    name: string;
    email: string;
  };
  userCompanyRole: $Enums.UserRole;
  id: string;
}

interface PermissiveCompanyUsers {
  user: {
    name: string;
    email: string
  };
  company: {
      companyName: string;
      adminInviteToken: string | undefined;
      userInviteToken: string | undefined;
  };
  userCompanyRole: $Enums.UserRole;
  id: string;
}[]

const CompanyPage = () => {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId")

  const [userData, setUserData] = useState<PermissiveCompanyUsers[]>([])
  const [companyUserRole, setCompanyUserRole] = useState<$Enums.UserRole | null>(null)

  useEffect(() => {
    if (companyId) {
      fetch(`/api/internal/get/companyUsersPage?companyId=${companyId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.companyUserData) {
            setUserData(data.companyUserData);
            setCompanyUserRole(data.userRoll);
          }
        })
        .catch((error) => {
          if (error) {
            runRedirect()
          }
        })
        .finally(() => {
          if (companyUserRole === "USER" || companyUserRole !== null) {
            runRedirect()
          }
        })
    }
  }, [companyId]);

  const runRedirect = () => {
    window.location.assign("/dashboard")
  }

  const columns: ColumnDef<CompanyUser>[] = [
    {
      accessorKey: "user.name",
      header: "Name",
    },
    {
      accessorKey: "user.email",
      header: "Email",
    },
    {
      accessorKey: "userCompanyRole",
      header: "Role",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
        if (companyUserRole === "ADMIN" || companyUserRole === "OWNER" && companyUserRole !== null) {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <Sheet>
                <SheetTrigger
                  className={`relative flex w-full select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent hover:bg-accent focus:text-accent-foreground ${
                      (user.userCompanyRole === "OWNER" || companyUserRole === user.userCompanyRole) ? 'cursor-no-drop pointer-events-none opacity-50' : ''
                    }`}
                    data-disabled={user.userCompanyRole === "OWNER" || companyUserRole === user.userCompanyRole ? 'true' : 'false'}
>
                    <div className='focus:bg-accent w-full h-full'>
                      Change role
                    </div>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Change user role</SheetTitle>
                      <SheetDescription>
                        <ChangeUserCompanyRole currentUserRole={companyUserRole} companyId={companyId} changingUserId={user.id} changinguserRole={user.userCompanyRole} /> {/* Make this actually do what I need it to */}
                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
                <DropdownMenuItem className='hover:cursor-pointer'
                  // onClick={() => navigator.clipboard.writeText(payment.id)}
                >
                  Remove User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      },
    },
  ]

  const [userTokenCopied, setUserTokenCopied] = useState<boolean>(false)
  const [adminTokenCopied, setAdminTokenCopied] = useState<boolean>(false)

  const copyUserToken = () => {
    if (userData[0].company.userInviteToken) {
      navigator.clipboard.writeText(userData[0].company.userInviteToken)
      setUserTokenCopied(true)
    }
  }
  const copyAdminToken = () => {
    if (userData[0].company.adminInviteToken) {
      navigator.clipboard.writeText(userData[0].company.adminInviteToken)
      setAdminTokenCopied(true)
    }
  }

  return (
    <>
      {companyUserRole &&
        <div className='flex flex-row text-lg'>
          <div className='flex flex-col w-[30%] py-12 pl-12'>
            <h1 className=' text-3xl font-bold mb-2'>
              {userData[0] ? userData[0].company.companyName : ""}
            </h1>
            {/* <h2>You have the role {companyUserRole} in this company:</h2> */}
            {companyUserRole === "ADMIN" || companyUserRole === "OWNER" && userData !== undefined &&
            <>
              <div className="border-2 rounded-md p-5 mb-2 flex flex-col">
                <div className='mb-2 flex flex-row items-center'>
                  <p className='mr-2'>
                    Admin invite token:
                  </p>
                  <FaRegCopy size={20} onClick={() => copyAdminToken()} className={`hover:cursor-pointer ${adminTokenCopied && 'hidden'}`} />
                  <FaCheck size={20} onClick={() => copyAdminToken()} className={`hover:cursor-pointer ${!adminTokenCopied && 'hidden'}`} />
                </div>
                <p>
                  {userData[0].company.adminInviteToken}
                </p>
                <Button>Change</Button>
              </div>
              <div className="border-2 rounded-md p-5 mb-2 flex flex-col">
                <div className='mb-2 flex flex-row items-center'>
                  <p className='mr-2'>
                    User invite token: 
                  </p>
                  <FaRegCopy size={20} onClick={() => copyUserToken()} className={`hover:cursor-pointer ${userTokenCopied && 'hidden'}`} />
                  <FaCheck size={20} onClick={() => copyUserToken()} className={`hover:cursor-pointer ${!userTokenCopied && 'hidden'}`} />
                </div>
                <p>
                   {userData[0].company.userInviteToken}
                </p>
                <Button>Change</Button>
              </div>
            </>
            }
            <div className='border-2 rounded-md p-5 flex flex-col mb-2'>
              <p className='mb-2'>Delete company:</p>
              <Button variant="destructive">Delete</Button>
            </div>
            <div className='border-2 rounded-md p-5 flex flex-col'>
              <p className='mb-2'>Create or add new company:</p>
              <Sheet>
                <SheetTrigger>
                  <Button className='w-full h-full'>Add</Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] sm:w-[1200px]">
                  <SheetHeader>
                    <SheetTitle>Add a new company</SheetTitle>
                    <SheetDescription>
                      <NewCompanyForm />
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className='w-full m-12'>
            <h1 className='text-3xl font-bold mb-2'>Company Users</h1>
            <DataTable columns={columns} data={userData} />
          </div>
        </div>
      }
    </>
  )
}

export default CompanyPage