"use client"
import React, { useEffect, useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { ColumnDef } from "@tanstack/react-table"
import { Button } from '@/components/ui/button'
import { FaEdit } from "react-icons/fa"
import { FaRegTrashAlt } from "react-icons/fa"
import { DataTable } from '../_components/data-table'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

import { FaXmark } from "react-icons/fa6";
import EditContact from './editContact' // Remove the named import
import { cn } from '@/lib/utils'

import { Poppins } from "next/font/google";
import CreateContact from './createContact'
import { deleteContact } from '@/actions/delete-contact'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
});


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
  const searchParams = useSearchParams()
  const companyId = searchParams.get("companyId")
  const [contacts, setContacts] = useState<CompanyContacts[]>([])
  const [editingContact, setEditingContact] = useState<CompanyContacts | null>(null)
  const [creatingContact, setCreatingContact] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()


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
  }, [companyId])

  const clickDeleteContact = (id: string) => {
    startTransition(() => {
      deleteContact(id)
        .then((data) => {
          if (data?.success) {
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error("Error deleting contact:", error);
        });
    });
  }

  const columns: ColumnDef<CompanyContacts>[] = [
    { accessorKey: "firstName", header: "First Name" },
    { accessorKey: "lastName", header: "Last Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "position", header: "Position" },
    { accessorKey: "lastAuditDate", header: "Last Audit Date" },
    { accessorKey: "auditScore", header: "Audit Score" },
    {
      id: "edit",
      cell: ({ row }) => {
        const contact = row.original
        return (
          <Button variant="ghost" onClick={() => setEditingContact(contact)}>
            <span className='sr-only'>Edit</span>
            <FaEdit className='h-5 w-5' />
          </Button>
        )
      }
    },
    {
      id: "delete",
      cell: ({ row }) => {
        const contact = row.original
        return (
          <Dialog>
            <DialogTrigger>
              <Button variant="ghost">
                <span className='sr-only'>Delete</span>
                <FaRegTrashAlt className='h-5 w-5' />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete this contact
                  and remove their data from our servers.
                </DialogDescription>
                <Button variant="destructive" onClick={() => clickDeleteContact(contact.id)}>Confirm</Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )
      }
    }
  ]

  return (
    <div className='w-full'>

      {editingContact &&
        <div className='sticky mt-[50px] flex justify-center'>
          <Card className='shadow-md w-[50vw]'>
            <CardHeader>
            <div className="w-full flex flex-row gap-y-4 items-center justify-between">
              <h1 className={cn("text-3xl font-semibold", font.className)}>
                Edit Contact
              </h1>
              <Button variant="ghost" onClick={() => setEditingContact(null)}>
                <FaXmark size={35} />
              </Button>
            </div>
            </CardHeader>
            <CardContent>
              <EditContact 
                id={editingContact.id}
                FirstName={editingContact.firstName ? editingContact.firstName : undefined}
                LastName={editingContact.lastName ? editingContact.lastName : undefined} 
                Email={editingContact.email} 
                Position={editingContact.position ? editingContact.position : undefined} 
              />
            </CardContent>
            <CardFooter>
              {/* Add any footer content if needed */}
            </CardFooter>
          </Card>
        </div>
      }
      {creatingContact === true && 
        <div className='sticky mt-[50px] flex justify-center'>
        <Card className='shadow-md w-[50vw]'>
          <CardHeader>
          <div className="w-full flex flex-row gap-y-4 items-center justify-between">
            <h1 className={cn("text-3xl font-semibold", font.className)}>
              Create Contact
            </h1>
            <Button variant="ghost" onClick={() => setCreatingContact(false)}>
              <FaXmark size={35} />
            </Button>
          </div>
          </CardHeader>
          <CardContent>
            <CreateContact />
          </CardContent>
          <CardFooter>
            {/* Add any footer content if needed */}
          </CardFooter>
        </Card>
      </div>
      }
      <div className='m-12'>
        <h1 className='text-3xl font-bold mb-2'>Contacts</h1>
        <Button className='mb-5' onClick={() => {setCreatingContact(true), setEditingContact(null)}}>Create New</Button>
        <DataTable columns={columns} data={contacts} />
      </div>
    </div>
  )
}

export default ContactsPage
