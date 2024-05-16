"use client"
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
// import { editContact } from './editContact'

import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { FaEdit } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from '../_components/data-table'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import CardWrapper from '@/components/auth/card-wrapper'
import EditCardWrapper from '@/components/shared/edit-record-wrapper'
import EditHeader from '@/components/shared/edit-header'
import { Form } from '@/components/ui/form'



interface CompanyContacts {
  id: string
  companyId: string
  firstName: string | null
  lastName: string | null
  email: string
  position: string | null
  lastAuditDate: Date | null
  auditScore: number | null
}[]

const ContactsPage = () => {
  const searchParams = useSearchParams();
  const companyId = searchParams.get("companyId")
  const [contacts, setContacts] = useState<CompanyContacts[]>([])
  const [editingContact, setEditingContact] = useState<CompanyContacts>()

  useEffect(() => {
    if (companyId) {
      fetch(`/api/internal/get/contacts?companyId=${companyId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.contactData) {
            setContacts(data.contactData)
          }
        })
    }
  }, [])

  const columns: ColumnDef<CompanyContacts>[] = [
    {
      accessorKey: "firstName",
      header: "First Name"
    },
    {
      accessorKey: "lastName",
      header: "Last Name"
    },
    {
      accessorKey: "email",
      header: "Email"
    },
    {
      accessorKey: "position",
      header: "Position"
    },
    {
      accessorKey: "lastAuditDate",
      header: "Last Audit Date"
    },
    {
      accessorKey: "auditScore",
      header: "Audit Score"
    },
    {
      id: "edit",
      // header: "Edit",
      cell: ({ row }) => {
        const contact = row.original
        return (
          <>
            {contact &&
            <Button variant="ghost" onClick={() => setEditingContact(contact)}>
              <span className='sr-only'>Edit</span>
              <FaEdit className='h-5 w-5' />
            </Button>
            }
          </>
        )
      }
    },
    {
      id: "delete",
    cell: ({ row }) => {
      const contact = row.original
      return (
        <Button variant="ghost">
          <span className='sr-only'>Delete</span>
          <FaRegTrashAlt className='h-5 w-5' />
        </Button>
      )
    }
    }
  ]

  return (
    <>
      <div className='m-12'>
        <h1 className='text-3xl font-bold mb-2'>Contacts</h1>
        <DataTable columns={columns} data={contacts} />
      </div>
      {editingContact &&
      <div className=' absolute mt-[50px]'>
        <Card className='w-[400px] shadow-md'>
          <CardHeader>
            <EditHeader label="Edit Contact" />
          </CardHeader>
          {/* <CardContent>
            <Form {...form}>

            </Form>
          </CardContent> */}

          <CardFooter>

          </CardFooter>
        </Card>
        {/* <Card className=' shadow-xl'>
          <CardHeader>
            <CardTitle>Edit Contact</CardTitle>
            <CardDescription>Contact Id: {editingContact.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
          <CardFooter className='flex flex-col gap-4'>
            <Button className='w-full'>Save</Button>
            <Button variant="destructive" className='w-full'>Exit</Button>
          </CardFooter>
        </Card> */}
      </div>
    }
    </>

  )
}

export default ContactsPage