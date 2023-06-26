import React, { Component } from 'react'
import styled from 'styled-components'
const { REACT_APP_API_URL } = process.env;

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

    downloadReport(e) {
        e.preventDefault();
        window.location = `${REACT_APP_API_URL}/report/` + document.getElementById('report').value;
    }


    render() {
        return (
            <Wrapper>
                <form onSubmit={this.downloadReport}>
                    <select name="report" id="report">
                        <option value="account">Total payments per account</option>
                        <option value="branch">Total payments per branch</option>
                        <option value="payment">Payment status</option>
                    </select>
                    <Input type="submit" value="Download" />
                </form>
            </Wrapper>
        )
    }
}