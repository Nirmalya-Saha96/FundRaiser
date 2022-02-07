import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import fundRaiser from '../../ethereum/fundRaiser';
import NpoRequestRow from '../../components/NpoRequestRow';

class ShowRequestNpo extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const npo = fundRaiser(address);
    const requestsCount = await npo.methods.getRequestsCount().call();

    const requests = await Promise.all(
      Array(parseInt(requestsCount))
        .fill()
        .map((element, index) => {
          return npo.methods.requests(index).call();
        })
    );

    return { address, requests, requestsCount };
  }

  renderRequests() {
    return this.props.requests.map((request, index) => {
      return (
        <NpoRequestRow
          key={index}
          id={index}
          request={request}
          address={this.props.address}
        />
      );
    });
  }

  render() {
    return (
      <Layout>
        <h3>Transaction Requests</h3>
        <Link route={`/npos/${this.props.address}/requests/new`}>
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
              <Table.HeaderCell>FINALIZE</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{this.renderRequests()}</Table.Body>
        </Table>
      </Layout>
    );
  }
}

export default ShowRequestNpo;
