import React, { Component } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 40px;
`

const Input = styled.input`
    margin-left: 20px
`

export default class Report extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Wrapper>
                <form onSubmit={(e) => { e.preventDefault(); window.location = 'http://localhost:5000/api/report' }}>
                    <select name="reports" id="reports">
                        <option value="total-pmts-per-acct">Total payments per account</option>
                        <option value="total-pmts-per-branch">Total payments per branch</option>
                        <option value="pmt-status">Payment status</option>
                    </select>
                    <Input type="submit" value="Download" />
                </form>
            </Wrapper>
        )
    }
}