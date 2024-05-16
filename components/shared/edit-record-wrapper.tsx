"use client"
import React from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import EditHeader from '@/components/shared/edit-header';


interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel?: string;
  backButtonHref?: string;
  showSocial?: boolean;
};

const EditCardWrapper = ({
  children,
  headerLabel,
}: CardWrapperProps) => {
  return (
    <Card className='w-[400px] shadow-md'>
      <CardHeader>
        <EditHeader label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>

      <CardFooter>

      </CardFooter>
    </Card>
  )
}

export default EditCardWrapper