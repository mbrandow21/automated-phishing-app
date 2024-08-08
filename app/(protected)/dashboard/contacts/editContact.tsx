import React, { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { ContactSchema } from '@/schemas'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { editContact } from '@/actions/edit-contact' // Adjust this import based on your project structure

interface EditContactProps {
  id: string
  FirstName: string | undefined
  LastName: string | undefined
  Email: string
  Position: string | undefined
}

const EditContact: React.FC<EditContactProps> = ({ id, FirstName, LastName, Email, Position }) => {
  const [isPending, startTransition] = useTransition()


  if (FirstName === undefined) {
    FirstName = ""
  }
  if (LastName === undefined) {
    LastName = ""
  }
  if (Position === undefined) {
    Position = ""
  }

  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      firstName: FirstName,
      lastName: LastName,
      email: Email,
      position: Position,
    }
  })

  const onSubmit = (values: z.infer<typeof ContactSchema>) => {
    console.log(values)

    startTransition(() => {
      editContact(id, values)
      .then((data) => {
        if (data?.success) {
          window.location.reload()
        }
      })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='space-y-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder='Jane'
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder='Doe'
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder='jdoe@domain.com'
                    type="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='position'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder='Admin'
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          disabled={isPending}
          type="submit"
          className='w-full'
        >
          Confirm
        </Button>
      </form>
    </Form>
  )
}

export default EditContact
