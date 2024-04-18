"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useEffect, useState, useTransition } from 'react'

import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from '@/components/ui/button'
import { FormError } from '@/components/shared/form-error'
import { FormSuccess } from '@/components/shared/form-success'
import { ChangeCompanyUserRoleSchema, CompanySetupSchema } from '@/schemas'
import { UserRole } from '@prisma/client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface UserCompanyRoleProps {
  currentUserRole: UserRole
  companyId: string | null
  changingUserId: string
  changinguserRole: UserRole
}

export const ChangeUserCompanyRole = ({
  currentUserRole,
  companyId,
  changingUserId,
  changinguserRole
}: UserCompanyRoleProps) => {

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition();
  
  const [newUserRole, setNewUserRole] = useState<UserRole>();
  const [newOwner, setNewOwner] = useState<boolean | null>(null);


  const form = useForm<z.infer<typeof ChangeCompanyUserRoleSchema>>({
    resolver: zodResolver(ChangeCompanyUserRoleSchema),
    defaultValues: {
      newUserRole: "",
    }
  })

  const onSubmit = (values: z.infer<typeof ChangeCompanyUserRoleSchema>) => {
    setError("");
    setSuccess("");

  }
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField 
            control={form.control}
            name='newUserRole'
            render={({ field }) => (
              <FormItem className='flex flex-col justify-start'>
                <FormLabel>Change role to:</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <div className={`border-2 rounded-md w-full text-left p-2 text-sm`}>{changinguserRole}</div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start' className='w-full'>
                      <DropdownMenuItem>
                        {changinguserRole === "ADMIN" && currentUserRole === "OWNER" ? "USER" : "ADMIN"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>

                  </DropdownMenu>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p>OR</p>
          <FormField 
            control={form.control}
            name='newUserRole'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Change this user to OWNER, you will be removed as OWNER</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    disabled={isPending}
                    placeholder='Type confirm to continue'
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormError message={error}/>
        <FormSuccess message={success} />
        <Button
          disabled={isPending}
          type="submit"
          className='w-full'
        >
          Change
        </Button>
      </form>
    </Form>
  )
}

