import React, { useState, useCallback, useContext, useEffect } from 'react';

import { InvoiceContext } from './InvoiceContext';

import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


import ClearIcon from '@mui/icons-material/Clear';
import PlusIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

import { NumericFormat } from 'react-number-format';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 14,
        },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
},
}));



function ItemsForm() {

    const initialLineItem = {
        description: '', 
        quantity: 0, 
        unitPrice: 0.00,
        amount: 0.00,
    }
    const invoiceContext = useContext(InvoiceContext);

    let currency = invoiceContext.currency.getCurrency();

    const itemsContext = invoiceContext.items;
    const lineItems = itemsContext.getItems();

    const addItem = useCallback(() => {
        itemsContext.addItem(initialLineItem);
    }, []);

    const updateItem = useCallback((index, field, value) => {
        itemsContext.updateItem(index, field, value);
    });

    const removeItem = useCallback((index) => {
        itemsContext.removeItem(index);
    }, []);

    //Debug
    useEffect(() => {
        console.log('Line Items Updated:', lineItems);
    }, [lineItems]);

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 600 }} aria-label="customized table">
                    <TableHead> 
                        <TableRow>
                            <StyledTableCell>Item</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Unit Price</StyledTableCell>
                            <StyledTableCell align="center">Amount</StyledTableCell>
                            <StyledTableCell align="center"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineItems.map((item, index) => (
                        <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                <TextField 
                                    className='lineItemTextfield'
                                    label="description" 
                                    style={{'width' : '260px'}}
                                    defaultValue={item.description}
                                    onChange={(e) => updateItem(index, 'description', (e.target.value) || '')}
                                    size='small' 
                                    variant="outlined" />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <TextField 
                                    style={{'width' : '80px'}} 
                                    type="number" 
                                    defaultValue={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                                    size='small' 
                                    variant="outlined" 
                                    inputProps={{ 
                                        min: 0,
                                        step: 1
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                            e.preventDefault();
                                        }
                                    }} 
                              />
                            </StyledTableCell>
                            <StyledTableCell align="center">
                                <TextField 
                                    label="Price/Rate"
                                    type="number"
                                    inputProps={{ 
                                        min: 0.00,
                                        step: 1
                                    }}
                                    defaultValue={item.unitPrice} 
                                    onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                                    size='small' 
                                    variant="outlined" />
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <NumericFormat 
                                    value={(item.unitPrice)*(item.quantity)}
                                    prefix={currency.symbol} 
                                    displayType="text"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                <Button 
                                    onClick={() => removeItem(index)}
                                    size='small'
                                    sx={{
                                            minWidth: 'auto',
                                            width: 'fit-content',
                                            padding: '8px' // Adjust padding as needed
                                        }}
                                    startIcon={
                                        <ClearIcon sx={{ 
                                            color: '#7c7c7c', 
                                            '&:hover': { color: 'red' } 
                                        }} />
                                    }
                                > 
                            </Button>
                            </StyledTableCell>
                            
                        </StyledTableRow>
                        ))}
                        <StyledTableRow>
                            <StyledTableCell colSpan={5} align="left">
                                <Button 
                                    onClick={addItem}
                                    variant="outlined" 
                                    size="small"
                                    >
                                    <PlusIcon slign='left' />Add Item
                                </Button>
                            </StyledTableCell>
                        </StyledTableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    )
}

export default ItemsForm;