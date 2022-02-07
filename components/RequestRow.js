import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import fundRaiser from '../ethereum/fundRaiser';
import { Router } from '../routes';

class RequestRow extends Component {
  state = {
    loading: false
  };
  onApproveRequest = async () => {
    const project = fundRaiser(this.props.address);

    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();
    await project.methods.approveRequest(this.props.id).send({
      from: accounts[0]
    });
    window.location.reload(false);
  this.setState({ loading: false });
  };

  onFinalizeRequest = async () => {
    const project = fundRaiser(this.props.address);

    this.setState({ loading: true });
    const accounts = await web3.eth.getAccounts();
    await project.methods.finalizeRequest(this.props.id).send({
      from: accounts[0]
    });
    window.location.reload(false);
  this.setState({ loading: false });
  };

  render() {
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Table.Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Table.Cell>{id}</Table.Cell>
        <Table.Cell>{request.description}</Table.Cell>
        <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
        <Table.Cell>{request.recipient}</Table.Cell>
        <Table.Cell>
          {request.approvalCount}/{approversCount}
        </Table.Cell>
        <Table.Cell>
          {request.complete ? null : (
            <Button loading={this.state.loading} color="green" basic onClick={this.onApproveRequest}>
              Approve
            </Button>
          )}
        </Table.Cell>
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
