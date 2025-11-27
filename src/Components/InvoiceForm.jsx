import { React, useState, useCallback, useEffect, useContext } from 'react';   
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { TextField, InputAdornment } from '@mui/material'
import { InputLabel, Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NumericFormat } from 'react-number-format';

import { InvoiceContext } from './InvoiceContext';
import InvoiceDetailsForm from './InvoiceDetailsForm';
import CurrencySelector from './CurrencySelector';
import ItemsForm from './ItemsForm';

import './InvoiceForm.css';
import { FormControl } from '@mui/material';

function InvoiceForm() {

  const invoiceContext = useContext(InvoiceContext);

  //Details
  const invoiceDetailsContext = invoiceContext.invoiceDetails;
  let invoiceDetails = invoiceDetailsContext.getDetails();
  const setInvoiceDetails = useCallback((value) => {invoiceDetailsContext.setDetails(value);})

  const handleDetailChange = useCallback((e) => {
    console.log('The target:', e.target);
    try{
      console.log('handleDetailChange called with event:', e);
      const { id, value } = e.target;

      // Check if it's a nested path (contains '-')
      if (id.includes('-')) {
        const [parent, child] = id.split('-');
        setInvoiceDetails({
          ...invoiceDetails,
          [parent]: {
            ...[parent],
            [child]: value
          }
        });
      } else {
        // Handle top-level fields
        setInvoiceDetails({ ...invoiceDetails, [id]: value });
      }
    } catch (error) {
      toast.error(`❌ ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
      console.error('handleDetailChange error:', error);
    }
  }, []);

  const handleDateChange = useCallback((dateObj, field) => {
    const date = dateObj.$d;
    setInvoiceDetails({
      ...invoiceDetails,
      [field]: date ? date.toISOString().split('T')[0] : ''
    });

    console.log(`handleDateChange: Updated ${field} to`, date);
  }, []);

  useEffect(() => {
    console.log('InvoiceDetails updated:', invoiceDetails);
  }, [invoiceDetails]);

  //Currency 7 Items
  const currency = invoiceContext.currency.getCurrency();

  //Deductions && Billing Calcs
  const TAX_RATE = invoiceContext.tax.getTaxRate();
  const DISCOUNT_RATE = invoiceContext.discount.getDiscountRate();

  const { subtotal, discountAmount, taxAmount, total }  = invoiceContext.computedValues;

  const handleTaxRateChange = useCallback((value)=>{
    invoiceContext.tax.setTaxRate(value);
  },[]);
  const handleDiscountRateChange = useCallback((value)=>{
    invoiceContext.discount.setDiscountRate(value);
  },[]);


  return (
    <div className="invoice-form">
      <Box 
        className="p-2 flex flex-col items-center space-y-4" 
        component="form" 
        sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}>

        <div className='grid grid-cols-4 p-4'>
            <div className='grid grid-cols-4 col-span-4 flex flex-row border-b pb-4'>
              <div className='grid grid-cols-2 col-span-2 flex flex-row'>
                <InvoiceDetailsForm
                  id="company"
                  formTitle="From"
                  onChange={handleDetailChange}
                  name={invoiceDetails.company.name}
                  address={invoiceDetails.company.address}
                 />
                 <InvoiceDetailsForm
                  id="client"
                  formTitle="To"
                  onChange={handleDetailChange}
                  name={invoiceDetails.client.name}
                  address={invoiceDetails.client.address}
                 />
              </div>
              <div className='flex flex-col grid-cols-2 col-span-2'>
                <div className='flex flex-col items-center'>
                  <h4 className="text-2xl my-2 mr-4 mb-4">Invoice Details</h4>
                    <FormControl className='grid grid-cols-1 gap-2'sx={{ '& .MuiTextField-root, & .MuiFormControl-root': { m: 0 } }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TextField 
                          id="invoiceNumber" 
                          label="Invoice Number"
                          value={invoiceDetails.invoiceNumber} 
                          variant="outlined" 
                          size="small" 
                          onChange={handleDetailChange}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                INV -
                              </InputAdornment>
                            ),
                          }} 
                        />
                        <DatePicker 
                          id="invoiceDate"
                          label="Invoice Date"
                          value={dayjs(invoiceDetails.invoiceDate)}
                          onChange={(date) => handleDateChange(date, 'invoiceDate')}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: { mb: 1 } // Consistent bottom margin
                            }
                          }} 
                        />
                        <DatePicker 
                          id="dueDate"
                          label="Due Date"
                          value={dayjs(invoiceDetails.dueDate)}
                          onChange={(date) => handleDateChange(date, 'dueDate')}
                          slotProps={{
                              textField: {
                              size: 'small',
                              sx: { mb: 0 } // No margin on last item
                            }
                          }} 
                        />
                    </LocalizationProvider>
                  </FormControl>
                </div>
              </div>
            </div>

            <div className='flex flex-col grid-cols-2 col-span-4 py-2 gap-2'>
              <h3 className="text-3xl my-2">Billing Deatils</h3>
              <div className='flex flex-col col-span-1'>
                <CurrencySelector/>
              </div>
              <div className='py-2 col-span-2 bg-white'>
                <ItemsForm />
              </div>
            </div>
            <div className='grid grid-cols-2 col-span-4 flex items-center p-3 pb-2'>
                <div className='grid grid-col'>
                  <div className='mb-2'>
                  <h3 className='text-1xl'>Notes</h3>
                  <TextField
                    id="notes"
                    label="Additional Notes"
                    style={{'width' : '450px'}}
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                  />
                  </div>
                  <div className='mb-1'>
                  <h3 className='text-1xl'>Terms</h3>
                  <TextField
                    id="terms"
                    label="Terms and Conditions"
                    style={{'width' : '450px'}}
                    multiline
                    rows={3}
                    variant="outlined"
                    size="small"
                  />
                </div>
                </div>
                <div className='flex flex-col items-start bg-[#dcdcdc] p-4 rounded-md'>
                  <div className='flex flex-col w-100 border-gray-400 border-b mb-2'>
                    <div className='flex flex-row items-start justify-between mb-3'>
                      <span className='text-lg'>
                        Tax Rate (0%): 
                          <span>
                            <TextField 
                              onChange={(e)=> handleTaxRateChange(e.target.value)}
                              style={{'width' : '80px'}} 
                              size="small" />
                          </span>
                      </span>
                      <span className='text-lg'>
                          Tax: 
                        <span>
                          <NumericFormat 
                            value={taxAmount}
                            prefix={currency.symbol} 
                            displayType="text"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                          />
                        </span>
                      </span>
                    </div>
                    <div className='flex flex-row justify-between'>
                      <span className='text-lg'>
                        Discount Rate (0%): 
                        <span>
                          <TextField 
                            onChange={(e)=> handleDiscountRateChange(e.target.value)}
                            style={{'width' : '80px'}}  
                            size="small" />
                        </span>
                      </span>
                      <span className='text-lg'>
                        Discount: 
                        <span>
                          <NumericFormat 
                            value={discountAmount}
                            prefix={currency.symbol} 
                            displayType="text"
                            decimalScale={2}
                            fixedDecimalScale={true}
                            thousandSeparator={true}
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className='flex flex-col w-100 border-b-3 border-blue-600 mb-3 pb-3'>
                    <span className='text-lg'>
                      Subtotal: 
                      <span>
                        <NumericFormat 
                          value={subtotal}
                          prefix={currency.symbol} 
                          displayType="text"
                          decimalScale={2}
                          fixedDecimalScale={true}
                          thousandSeparator={true}
                        />
                      </span>
                    </span>
                  </div>
                  <span className='text-2xl font-bold'>
                    Total: 
                    <span>
                      <NumericFormat 
                        value={total}
                        prefix={currency.symbol} 
                        displayType="text"
                        decimalScale={2}
                        fixedDecimalScale={true}
                        thousandSeparator={true}
                         />
                    </span>
                  </span>
                </div>
            </div>
            <div className='grids col-span-4 flex flex-col items-center my-3'>
              <Button 
                variant='contained' 
                color="primary"
                sx={{
                  minWidth: 'auto',
                  width: '260px',
                }}
                startIcon={<AutoFixHighIcon />} 
                >
                Generate Invoice
              </Button>
            </div>
        </div>
      </Box>
    </div>
  );
}
export default InvoiceForm;