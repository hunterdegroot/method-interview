import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'
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
            batchIds: [],
            processedLoading: false,
            stageLoading: false
        }
    }

    parse = async () => {
        this.setState({ data: [], stageLoading: true })
        try {
            api.parseBatch(this.state.selectedFile).then(res => this.setState({
                data: res.data.data,
                processed: false,
                stageLoading: false
            }));
        } catch (error) {
            console.log(error)
        }
    }

    que = async () => {
        this.setState({ processedLoading: true })
        try {
            await api.queBatch(this.state.selectedFile).then(res => this.setState({
                processed: true,
                processedLoading: false
            }));
        } catch (error) {
            console.log(error)
        }
    }

    handleFileSelect = (event) => {
        this.setState({
            selectedFile: event.target.files[0],
            processed: false,
            data: []
        })
    }

    render() {
        const { data, processed, processedLoading, stageLoading, selectedFile } = this.state
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
                <form onSubmit={(e) => { e.preventDefault(); this.parse() }}>
                    <input type="file" onChange={this.handleFileSelect} />
                    {!!selectedFile && <input type="submit" value="Upload File" />}
                </form>
                <br />
                {(!!data.length || stageLoading) && (
                    <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                        loading={stageLoading}
                    />
                )}
                <br />
                {!processedLoading && !!data.length && !processed && (
                    <form onSubmit={(e) => { e.preventDefault(); this.que() }}>
                        <input type="submit" value="Process" />
                    </form>
                )}
                {processed && 'Processing queued. Check reports tab for status.'}
                {processedLoading && 'Loading...'}
            </Wrapper>
        )
    }
}

export default Upload