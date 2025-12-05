import React, { useContext, useCallback } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { InvoiceContext } from './InvoiceContext';

function CurrencySelector() {

    const CURRENCY_FORMATS = [
        { code: 'ZAR', locale: 'en-RSA', name: 'South African Rand', symbol: 'R' },
        { code: 'USD', locale: 'en-US', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', locale: 'de-DE', name: 'Euro', symbol: '€' },
        { code: 'GBP', locale: 'en-GB', name: 'British Pound', symbol: '£' },
        { code: 'JPY', locale: 'ja-JP', name: 'Japanese Yen', symbol: '¥' },
        { code: 'CAD', locale: 'en-CA', name: 'Canadian Dollar', symbol: 'C$' },
        { code: 'AUD', locale: 'en-AU', name: 'Australian Dollar', symbol: 'A$' },
        { code: 'INR', locale: 'en-IN', name: 'Indian Rupee', symbol: '₹' },
        { code: 'BRL', locale: 'pt-BR', name: 'Brazilian Real', symbol: 'R$' }
    ];

    const invoiceContext = useContext(InvoiceContext);
    const currencyContext = invoiceContext.currency;
    let currency = currencyContext.getCurrency();

    const onCurrencyChange = useCallback((currencyFormat) => {
        currencyContext.setCurrency(currencyFormat);
    }, []);

    const getFormatObject = (code) => {
        return CURRENCY_FORMATS.find(format => format.code === code) || CURRENCY_FORMATS[0];
    }

    return (
        <div className='flex items-start px-2 max-w-[250px]'>
            <FormControl>
                <InputLabel id="select-label">Currency</InputLabel>
                <Select
                    labelId="select-label"
                    id="currency-select"
                    label="Currency"
                    variant='standard'
                    value={currency.code} // Use the currency code for value
                    style={{minWidth: '210px'}}
                    onChange={(event) => onCurrencyChange(getFormatObject(event.target.value))}
                >
                    {CURRENCY_FORMATS.map((format) => (
                        <MenuItem key={format.code} value={format.code}> {/* Use code as value */}
                            {`${format.name} (${format.code})`}  
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}

export default CurrencySelector;