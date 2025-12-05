import React from 'react';
import TextField from '@mui/material/TextField';

function InvoiceDetailsForm({ id, formTitle, name, address, onChange }) {
  return (
    <div className='flex flex-col items-center'>
        <h4 className="text-2xl my-2">{formTitle}</h4>
        <TextField 
            id={`${id}-name`} 
            className='w-full'
            label="Name" 
            defaultValue={name}
            variant="outlined" 
            size="small"
            onChange={(e) => {onChange('name', e.target.value)}} />
        <TextField 
            id={`${id}-address`} 
            className='w-full'
            label="Address" 
            defaultValue={address}
            variant="outlined" 
            size="small" 
            multiline
            rows={4}
            onChange={(e) => {onChange('address', e.target.value)}} />
    </div>
  )
}

export default InvoiceDetailsForm;