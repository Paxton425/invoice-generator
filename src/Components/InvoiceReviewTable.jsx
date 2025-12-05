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

import { NumericFormat } from 'react-number-format';

function InvoiceReviewTable(){

    const invoiceContext = useContext(InvoiceContext);
    
    const currency = invoiceContext.currency.getCurrency();
    
    const itemsContext = invoiceContext.items;
    const lineItems = itemsContext.getItems();

    //No rounded corners
    const FlatPaper = styled(Paper)(({ theme }) => ({
        borderRadius: 0,
        overflow: 'hidden',
    }));

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

     return (
        <div>
            <TableContainer component={FlatPaper}>
                <Table 
                    sx={{ minWidth: 500, borderRadius: 0 }} 
                    aria-label="customized table">
                    <TableHead> 
                        <TableRow>
                            <StyledTableCell>Item</StyledTableCell>
                            <StyledTableCell align="center">Quantity</StyledTableCell>
                            <StyledTableCell align="center">Unit Price</StyledTableCell>
                            <StyledTableCell align="center">Amount</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lineItems.map((item, index) => (
                        <StyledTableRow 
                         key={index}>
                            <StyledTableCell  sx={{ width:'55%', padding:1 }} component="th" scope="row">
                                <p>{item.description}</p>
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ width:'10%', padding:1}}>
                                <NumericFormat 
                                    value={(item.quantity)}
                                    displayType="text"
                                    decimalScale={0}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding:1, width:'20%', }}>
                                <NumericFormat 
                                    value={(item.unitPrice)}
                                    prefix={currency.symbol} 
                                    displayType="text"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                />
                            </StyledTableCell>
                            <StyledTableCell align="center" sx={{ padding:1, width:'15%', }}>
                                <NumericFormat 
                                    style={{width: '100%', margin: 0}}
                                    value={(item.unitPrice)*(item.quantity)}
                                    prefix={currency.symbol} 
                                    displayType="text"
                                    decimalScale={2}
                                    fixedDecimalScale={true}
                                    thousandSeparator={true}
                                />
                            </StyledTableCell>
                        </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    )
}

export default InvoiceReviewTable;