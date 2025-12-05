import './InvoiceReview.css'

import { React, useContext, useRef }  from 'react'

import { useReactToPrint }from 'react-to-print';
import { Button } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { NumericFormat } from 'react-number-format';
import { InvoiceContext } from './InvoiceContext';
import InvoiceReviewTable from './InvoiceReviewTable';

function InvoiceReview(){

  const invoiceContext = useContext(InvoiceContext);

  const imageUrl = invoiceContext.logoImageUrl.getImageUrl();
  
  //Details
  const invoiceDetailsContext = invoiceContext.invoiceDetails;

  const invoiceNumber = invoiceDetailsContext.invoiceNumber;
  const dates = invoiceDetailsContext.Dates;

  const companyDetails = invoiceDetailsContext.companyDetails.get();
  const clientDetails = invoiceDetailsContext.clientDetails.get();


  const currency = invoiceContext.currency.getCurrency();

  const TAX_RATE = invoiceContext.tax.getTaxRate();
  const DISCOUNT_RATE = invoiceContext.discount.getDiscountRate();
  const { subtotal, discountAmount, taxAmount, total }  = invoiceContext.computedValues;

  const NotesContext = invoiceContext.note;

  //PDF GENERATION 
  const printRef = useRef();
  const reactToPrintFn = useReactToPrint({
    contentRef: printRef,
    // Optional: handle errors
    onPrintError: (errorLocation, error) => {
      console.error('Print error:', errorLocation, error);
    },
    // Optional: handle after print
    onAfterPrint: () => {
      console.log('Printed successfully');
    }
  });

  return(
    <div className="invoice-review-container" ref={printRef}>
      <div>
        <div className='flex flex-row justify-between'>
          <div className='flex flex-col lg:flex-row space-x-2 py-2 align-center'>
            {imageUrl?
              (
                <div className='logo-container'>
                  <img 
                    src={imageUrl} 
                    alt='invoice-logo'
                    style={{ 
                            maxWidth: '160px', 
                            maxHeight: '128px', 
                            objectFit: 'contain' 
                        }} />
                </div>
              ) : ''
              }
            <h2 className='text-5xl pt-2'>INVOICE</h2>
          </div>
          <div className='my-4'>INVOICE.NO <span>{invoiceNumber.get()}</span></div>
        </div>
      </div>
      <div className="p-2 flex flex-col space-y-4 w-full max-w-7xl mx-auto">

        {/* Top Section */}
        <div className='flex flex-col lg:flex-row p-4 gap-8 border-b pb-6 my-10 w-full'>
          <div className='from-to-content flex flex-col lg:flex-row gap-4 w-full lg:w-3/5'>
            <div className='bill-from-content flex-1 min-w-0'>
              <h3 className='text-2xl'>Bill From</h3>
              <div>
                <p>{companyDetails.name}</p>
                <p>{companyDetails.address}</p>
              </div>
            </div>
            <div className='bill-to-content flex-1 min-w-0'>
              <h3 className='text-2xl'>Bill To</h3>
              <div>
                <p>{clientDetails.name}</p>
                <p>{clientDetails.address}</p>
              </div>
            </div>
          </div>

          <div className='flex lg:justify-center lg:justify-end w-full lg:w-2/5 '>
            <div className='w-full max-w-md'>
              <h3 className="text-2xl text-start">Invoice Details</h3>
              <div>
                <span className='font-semibold'>Invoice Date: <span>{dates.invoiceDate.get()}</span></span><br />
                <span className='font-semibold'>Due Date: <span>{dates.dueDate.get()}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Section */}
        <div className='flex flex-col w-full py-2'>
          <h3 className="text-2xl lg:text-3xl font-semibold mb-2">Billing Details</h3>
          
          <div className='w-full py-4 bg-white rounded-lg'>
            <InvoiceReviewTable />
          </div>
        </div>

        {/* Notes & Totals Section */}
        <div className='notes-totals flex flex-col lg:flex-row gap-6 w-full p-4'>
          {/* Notes & Terms - Full width on mobile, half on desktop */}
          <div className='notes-terms sm:w-full lg:w-1/2'>
           {(NotesContext.additionalNotes.get())?
            (<div className='mb-5'>
              <h3 className='text-xl mb-2'>Notes</h3>
              <div className='mx-3'>
                <p>{NotesContext.additionalNotes.get()}</p>
              </div>
            </div>): ('')
            }
            {(NotesContext.terms.get())?
            (<div>
              <h3 className='text-xl mb-2'>Terms & Conditions</h3>
              <div className='mx-4'>
                <p>{NotesContext.terms.get()}</p>
              </div>
            </div>):('')
            }
          </div>

          {/* Totals Section - Full width on mobile, half on desktop */}
          <div className='totals w-full md:w-1/2 lg:w-1/2'>
            <div 
              className='p-4 lg:p-4 rounded-lg border border-gray-200'
              style={{ backgroundColor: '#e0e0e0ff'}}
              >
              <div className='mb-4'>
                {/* Tax Row */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-300'>
                  <div className='flex items-center gap-2 flex-wrap'>
                    <span className='text-base font-medium'>Tax Rate:</span>
                    <span className='font-medium'>{TAX_RATE}%</span>
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
                    <span className='font-medium'>{DISCOUNT_RATE}%</span>
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
            className='print-ignore'
            onClick={reactToPrintFn}
            variant='contained' 
            color="primary"
            sx={{
              minWidth: 'auto',
              width: { xs: '100%', sm: '280px' },
              height: '40px',
              py: 1.5
            }}
            startIcon={<PrintIcon />} 
          >
            Print Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}

export default InvoiceReview;