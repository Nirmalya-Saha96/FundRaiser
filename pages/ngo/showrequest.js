import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import fundRaiser from '../../ethereum/fundRaiser';
import RequestRow from '../../components/RequestRow';

class ShowRequestNgo extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const ngo = fundRaiser(address);
    const requestsCount = await ngo.methods.getRequestsCount().call();
    const approversCount = await ngo.methods.approversCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return ngo.methods.requests(index).call();
        })
    );

    return { address, requests, requestsCount, approversCount };
  }

  renderRequests() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
          approversCount={this.props.approversCount}
        />
      );
    });
  }

  render() {
    return (
      <Layout>
        <h3>Transaction Requests</h3>
        <Link route={`/ngos/${this.props.address}/requests/new`}>
          <a>
            <Button
              floated="right"
              basic
              color='yellow'
              content='ADD'
              style={{ marginBottom: 10 }}
              icon='add'
              label={{
                as: 'a',
                basic: true,
                color: 'yellow',
                pointing: 'left',
                content: [this.props.requestsCount],
              }}
            />
          </a>
        </Link>
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Amount</Table.HeaderCell>
              <Table.HeaderCell>Recipient</Table.HeaderCell>
              <Table.HeaderCell>Total Approval</Table.HeaderCell>
              <Table.HeaderCell>APPROVE</Table.HeaderCell>
              <Table.HeaderCell>FINALIZE</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderRequests()}</Table.Body>
        </Table>
      </Layout>
    );
  }
}

export default ShowRequestNgo;
