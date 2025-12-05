import { React, useState, useCallback, useEffect, useContext } from 'react';   
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { TextField, InputAdornment } from '@mui/material'
import { InputLabel, Button } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ClearIcon from '@mui/icons-material/Clear'

import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { NumericFormat } from 'react-number-format';

import { InvoiceContext } from './InvoiceContext';
import InvoiceDetailsForm from './InvoiceDetailsForm';
import CurrencySelector from './CurrencySelector';
import ItemsForm from './ItemsForm';
import InvoiceReview from './InvoiceReview';

import './InvoiceForm.css';
import { FormControl } from '@mui/material';

function InvoiceForm() {

  //Invoice Review pop up
  const [isInvoiceReviewed, setIsInvoiceReviewd] = useState(false)
  const openReviewPopup = ()=>{
    setIsInvoiceReviewd(true);
  }
  const closeReviewPopup = ()=>{
    setIsInvoiceReviewd(false)
  }

  const invoiceContext = useContext(InvoiceContext);

  //Details
  const invoiceDetailsContext = invoiceContext.invoiceDetails;
  const invoiceDetails = invoiceDetailsContext.getDetails();

  //Detail change handlers
  const handleCompanyDetailsChange = (field, value)=>{
    console.log(field, value)
    invoiceDetailsContext.companyDetails.set(field, value)
  }
  const handleClientDetailsChange = (field, value)=>{
    invoiceDetailsContext.clientDetails.set(field, value)
  }
  const handleInvoiceNumberChange = useCallback((value)=>{
    invoiceDetailsContext.invoiceNumber.set(`INV-${new Date().getFullYear()}-${value}`);
  }, [])

  //Dates
  const handleDateChange = useCallback((dateObj, field) => {
    const date = dateObj.$d;
    if(field === 'invoiceDate')
      invoiceDetailsContext.Dates.invoiceDate.set(dateObj);
    else if(field === 'dueDate')
      invoiceDetailsContext.Dates.dueDate.set(dateObj);

    console.log(`handleDateChange: Updated ${field} to`, date);
  }, []);

  //Notes & Terms
  const handleNotesChange = (field, value)=> {
    if(field === 'additionalNote')
      invoiceContext.note.additionalNotes.set(value);
    else if(field === 'terms')
      invoiceContext.note.terms.set(value);
    else
      throw new Error('Invalid Notes field');
  }

  //Currency
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
        className="p-2 flex flex-col space-y-4 w-full max-w-7xl mx-auto" 
        component="form" 
        sx={{ '& .MuiTextField-root': { m: 1 } }}>

        {/* Top Section */}
        <div className='flex flex-col lg:flex-row p-4 gap-8 border-b pb-6 my-10 w-full'>
          <div className='flex flex-col lg:flex-row gap-4 w-full lg:w-3/5'>
            <div className='flex-1 min-w-0'>
              <InvoiceDetailsForm
                id="company"
                formTitle="From"
                onChange={handleCompanyDetailsChange}
                name={invoiceDetails.company.name}
                address={invoiceDetails.company.address}
              />
            </div>
            <div className='flex-1 min-w-0'>
              <InvoiceDetailsForm
                id="client"
                formTitle="To"
                onChange={handleClientDetailsChange}
                name={invoiceDetails.client.name}
                address={invoiceDetails.client.address}
              />
            </div>
          </div>

          <div className='flex justify-center lg:justify-end mt-2 w-full lg:w-2/5 '>
            <div className='w-full max-w-md'>
              <h4 className="text-2xl mb-4 text-center">Invoice Details</h4>
              <FormControl 
                className='w-full space-y-3' 
                sx={{ '& .MuiTextField-root, & .MuiFormControl-root': { margin: 0,  } }}>
                  <TextField 
                    id="invoiceNumber" 
                    style={{marginBottom: '15px'}}
                    label="Invoice Number"
                    defaultValue={`${new Date().getFullYear()}-001`} 
                    variant="outlined" 
                    size="small" 
                    onChange={(e) => handleInvoiceNumberChange(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          INV-
                        </InputAdornment>
                      ),
                    }} 
                  />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker 
                    id="invoiceDate"
                    label="Invoice Date"
                    value={dayjs(invoiceDetails.invoiceDate)}
                    onChange={(date) => handleDateChange(date, 'invoiceDate')}
                    slotProps={{
                      textField: {
                        size: 'small',
                        fullWidth: true,
                        sx: { paddingBottom: '15px', }
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
                        fullWidth: true
                      }
                    }} 
                  />
                </LocalizationProvider>
              </FormControl>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className='flex flex-col w-full py-2'>
          <h3 className="text-2xl lg:text-3xl font-semibold mb-2">Billing Details</h3>
          
          <div className='w-full mb-4'>
            <CurrencySelector/>
          </div>
          
          <div className='w-full py-4 bg-white rounded-lg'>
            <ItemsForm />
          </div>
        </div>

        {/* Notes & Totals Section */}
        <div className='flex flex-col lg:flex-row gap-6 w-full p-4'>
          {/* Notes & Terms - Full width on mobile, half on desktop */}
          <div className='w-full lg:w-1/2'>
            <div>
              <h3 className='text-xl mb-2'>Notes</h3>
              <TextField
                id="notes"
                label="Additional Notes"
                fullWidth
                multiline
                onChange={(e) => {handleNotesChange('additionalNote', e.target.value)}}
                rows={3}
                variant="outlined"
                size="small"
              />
            </div>
            <div>
              <h3 className='text-xl mb-2'>Terms</h3>
              <TextField
                id="terms"
                label="Terms and Conditions"
                fullWidth
                multiline
                onChange={(e) => {handleNotesChange('terms', e.target.value)}}
                rows={3}
                variant="outlined"
                size="small"
              />
            </div>
          </div>

          {/* Totals Section - Full width on mobile, half on desktop */}
          <div className='w-full lg:w-1/2'>
            <div 
              className='p-4 lg:p-4 rounded-lg border border-gray-200'
              style={{ backgroundColor: '#e0e0e0ff'}}
              >
              <div className='mb-4'>
                {/* Tax Row */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-300'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-base font-medium'>Tax Rate:</span>
                    <TextField 
                      size="small" 
                      sx={{ width: '80px' }}
                      type='number'
                      inputProps={{
                        step: 0.01,
                        min: 0,
                        max: 100
                      }}
                      defaultValue={TAX_RATE}
                      onChange={(e)=> handleTaxRateChange(e.target.value)}
                    />
                    <span>%</span>
                  </div>
                  <span className='text-base font-medium'>
                    Tax: 
                    <NumericFormat 
                      value={taxAmount}
                      prefix={currency.symbol} 
                      displayType="text"
                      decimalScale={2}
                      fixedDecimalScale={true}
                      thousandSeparator={true}
                      className="ml-1"
                    />
                  </span>
                </div>

                {/* Discount Row */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-300'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-base font-medium'>Discount Rate:</span>
                    <TextField
                      size="small" 
                      sx={{ width: '80px' }}
                      type='number'
                      defaultValue={DISCOUNT_RATE}
                      inputProps={{
                        step: 0.01,
                        min: 0,
                        max: 100,
                      }} 
                      onChange={(e)=> handleDiscountRateChange(e.target.value)}
                    />
                    <span>%</span>
                  </div>
                  <span className='text-base font-medium'>
                    Discount: 
                    <NumericFormat 
                      value={discountAmount}
                      prefix={currency.symbol} 
                      displayType="text"
                      decimalScale={2}
                      fixedDecimalScale={true}
                      thousandSeparator={true}
                      className="ml-1"
                    />
                  </span>
                </div>

                {/* Subtotal */}
                <div className='flex justify-between items-center pb-3 border-b-2 border-blue-500'>
                  <span className='text-lg font-semibold'>Subtotal:</span>
                  <span className='text-lg font-semibold'>
                    <NumericFormat 
                      value={subtotal}
                      prefix={currency.symbol} 
                      displayType="text"
                      decimalScale={2}
                      fixedDecimalScale={true}
                      thousandSeparator={true}
                    />
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className='flex justify-between items-center pt-2'>
                <span className='text-2xl font-bold'>Total:</span>
                <span className='text-2xl font-bold'>
                  <NumericFormat 
                    value={total}
                    prefix={currency.symbol} 
                    displayType="text"
                    decimalScale={2}
                    fixedDecimalScale={true}
                    thousandSeparator={true}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className='flex justify-center my-4 w-full'>
          <Button 
            variant='contained' 
            onClick={openReviewPopup}
            color="primary"
            sx={{
              minWidth: 'auto',
              width: { xs: '100%', sm: '280px' },
              height: '40px',
              py: 1.5
            }}
            startIcon={<AutoFixHighIcon />} 
          >
            Generate Invoice
          </Button>
          <Dialog open={isInvoiceReviewed} fullWidth maxWidth='md'>
            <DialogTitle>
              Invoice Review
              <IconButton 
                onClick={closeReviewPopup}
                style={{float:'right'}}>
                <ClearIcon 
                  sx={{ 
                    color: '#7c7c7c', 
                    '&:hover': { color: 'red' } 
                  }} />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <InvoiceReview />
            </DialogContent>
          </Dialog>
        </div>
      </Box>
    </div>
  );
}

export default InvoiceForm;