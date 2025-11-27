import React from 'react';
import TextField from '@mui/material/TextField';

function InvoiceDetailsForm({ id, formTitle, name, address, onChange }) {
  return (
    <div className='flex flex-col items-center grid-col col-span-1'>
        <h4 className="text-2xl my-2">{formTitle}</h4>
        <TextField 
            id={`${id}-name`} 
            label="Name" 
            value={name}
            variant="outlined" 
            size="small"
            onChange={onChange} />
        <TextField 
            id={`${id}-address`} 
            label="Address" 
            value={address}
            variant="outlined" 
            size="small" 
            multiline
            rows={4}
            onChange={onChange} />
    </div>
  )
}

export default InvoiceDetailsForm;