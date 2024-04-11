"use client"

import React from 'react'
import { NewCompanyForm } from '../../_components/new-company'
import CardWrapper from '@/components/auth/card-wrapper'
import { useCurrentUser } from '@/hooks/use-current-user'
import LogoutButton from '@/components/auth/logout-button'
import { Button } from '@/components/ui/button'
import { logout } from '@/actions/logout'


const CompanySetupPage = () => {

  const user = useCurrentUser();

  if (!user) {
    logout()
  }

  return (
    <CardWrapper
      headerLabel={`Welcome! Let's begin by setting you up ${user.name}`}
    >
      <NewCompanyForm />
    </CardWrapper>
  )
}

export default CompanySetupPage