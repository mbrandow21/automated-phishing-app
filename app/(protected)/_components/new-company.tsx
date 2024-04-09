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
import { CompanySetupSchema } from '@/schemas'
import { addCompanyUser } from '@/actions/add-company-user'
import { redirect } from 'next/navigation'

export const NewCompanyForm = () => {

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [companyId, setCompanyId] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition(); 


  const form = useForm<z.infer<typeof CompanySetupSchema>>({
    resolver: zodResolver(CompanySetupSchema),
    defaultValues: {
      companyName: "",
      companyInviteLink: "",
    }
  })

  const onSubmit = (values: z.infer<typeof CompanySetupSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      addCompanyUser(values)
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success)
          // setSuccess(data.success);
          setCompanyId(data?.companyId)
          console.log(`/dashboard?company=${data?.companyId}`)
        })
    })
  }

  useEffect(() => {
    if (companyId !== "") {
      redirect(`/dashboard?company=${companyId}`)
    }
  }, [companyId])
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField 
            control={form.control}
            name='companyName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    disabled={isPending}
                    placeholder='PhishAudits'
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p>OR</p>
          <FormField 
            control={form.control}
            name='companyInviteLink'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Invite Link</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    disabled={isPending}
                    placeholder='ljlvvplhu39rf541ww8fu0dg'
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
          Create company
        </Button>
      </form>
    </Form>
  )
}

