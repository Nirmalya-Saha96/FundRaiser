import React, { Component, useState } from 'react';
import { Card, Button, Input, Message, Form } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';

class NewCustomerCare extends Component {
  state = {
    address: "",
    name: "",
    problem: "",
    errorMessage: '',
    loading: false
  };

 onSubmit = async (e) => {
     e.preventDefault();

     this.setState({ loading: true, errorMessage: '' });

     try {
       const accounts = await web3.eth.getAccounts();
       await factory.methods
         .addNewCustomerCare(this.state.problem, this.state.address, this.state.name)
         .send({
           from: accounts[0]
         });

      Router.pushRoute('/customercare');
     } catch (err) {
       this.setState({ errorMessage: err.message });
     }

     this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h2>REGISTER YOUR PROBLEM</h2>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Problem Facing</label>
            <Input
              label="problem"
              labelPosition="right"
              value={this.state.problem}
              onChange={event =>
                this.setState({ problem: event.target.value })}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Address of the Collection</label>
            <Input
              type='textarea '
              label="address"
              labelPosition="right"
              value={this.state.address}
              onChange={event =>
                this.setState({ address: event.target.value })}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Name of the FundRaiser</label>
            <Input
              label="name"
              labelPosition="right"
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
              required
            />
          </Form.Field>
          <Message error header="Something Went Wrong" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default NewCustomerCare;
