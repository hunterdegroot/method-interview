import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'
import axios from 'axios'

import styled from 'styled-components'
import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 40px;
`

class Upload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            selectedFile: null,
            processed: false,
        }
    }

    preProcess = async () => {
        const formData = new FormData();
        formData.append("file", this.state.selectedFile);
        try {
            await axios({
                method: "post",
                url: "http://localhost:5000/api/batch/preProcess",
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(res => this.setState({
                data: res.data.data,
                batchId: res.data.batchId,
                processed: false
            }));
        } catch (error) {
            console.log(error)
        }
    }

    process = async () => {
        const url = `http://localhost:5000/api/batch/process/${this.state.batchId}`
        try {
            await axios.get(url).then(res => this.setState({
                processed: true,
            }));
        } catch (error) {
            console.log(error)
        }
        this.setState()
    }

    handleFileSelect = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            processed: false
        })
    }

    render() {
        const { data, processed } = this.state
        const columns = [
            {
                Header: 'Employee Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Account',
                accessor: 'account',
                filterable: true,
            },
            {
                Header: 'Loan Number',
                accessor: 'loanNumber',
                filterable: true,
            },
            {
                Header: 'Amount',
                accessor: 'amount',
                filterable: true,
            },
        ]

        return (
            <Wrapper>
                <form onSubmit={(e) => { e.preventDefault(); this.preProcess(this.state.selectedFile) }}>
                    <input type="file" onChange={this.handleFileSelect} />
                    <input type="submit" value="Upload File" />
                </form>
                <br />
                {!!data.length && (
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
                <br />
                {!!data.length && !processed && (
                    <form onSubmit={(e) => { e.preventDefault(); this.process(this.state.selectedFile) }}>
                        <input type="submit" value="Process" />
                    </form>
                )}
                {processed && <h3>Processing queued. Check reports tab for status.</h3>}
            </Wrapper>
        )
    }
}

export default Upload