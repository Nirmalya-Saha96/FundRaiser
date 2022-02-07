import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import fundRaiser from '../ethereum/fundRaiser';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
    loading: false
  };

  onFinalizeRequest = async () => {
    const npo = fundRaiser(this.props.address);

    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();
    await npo.methods.finalizeNPORequest(this.props.id).send({
      from: accounts[0]
    });
    window.location.reload(false);
  this.setState({ loading: false });
  };

  render() {
    const { id, request } = this.props;

    return (
      <Table.Row disabled={request.complete} positive={!request.complete}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button loading={this.state.loading} color="red" basic onClick={this.onFinalizeRequest}>
              Finalize
            </Button>
          )}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default RequestRow;
