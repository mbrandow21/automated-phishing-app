import React from 'react'
import { NewCompanyForm } from '../../_components/new-company'
import CardWrapper from '@/components/auth/card-wrapper'

const CompanySetupPage = () => {
  return (
    <CardWrapper
      headerLabel="Welcome! Let's begin by setting you up"
    >
      <NewCompanyForm />
    </CardWrapper>
  )
}

export default CompanySetupPage