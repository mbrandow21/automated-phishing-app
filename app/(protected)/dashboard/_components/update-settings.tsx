"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { useSession } from "next-auth/react"
import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

import { FormSuccess } from "@/components/shared/form-success"
import { settings } from "@/actions/settings"
import { SettingsSchema } from "@/schemas"
import { useCurrentUser } from "@/hooks/use-current-user"
import { FormError } from "@/components/shared/form-error"



const UpdateSettings = () => {
  const user = useCurrentUser();

  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();


  const [isPending, startTransition] = useTransition();

  const { update } = useSession();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {

    console.log("This tried to run")

    startTransition(() => {
      settings(values)
      .then((data: any) => {
        if (data.error) {
          setError(data.error);
        }
        if (data.success) {
          update()
          setSuccess(data.success)
        }
      })
      .catch(() => {
        setError("Something went wrong")
      })
    })
  }
  
  return (

    <Form {... form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 ">
          <FormField 
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input 
                    {...field}
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {user.isOAuth === false && 
            <>
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="John@mail.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comfirm New Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField 
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between shadow-sm rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Two Factor Authentication</FormLabel>
                      <FormDescription>
                        Enable two factor authentication for your account
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch 
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          }
        </div>
        {success && 
        <FormSuccess
          message={success}
        />}
        {error &&
        <FormError 
          message={error}
        />}
        <Button
          type="submit"
          disabled={isPending}
        >
          Save
        </Button>
      </form>
    </Form>
  )
}

export default UpdateSettings