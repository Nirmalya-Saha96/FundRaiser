import React, { Component, useState } from 'react';
import { Card, Button, Input, Message, Form } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';

import { create } from "ipfs-http-client";

const client = create("https://ipfs.infura.io:5001/api/v0");

class NewNGO extends Component {
  state = {
    minimumContribution: "",
    name: "",
    description: "",
    hash: "",
    file: null,
    errorMessage: '',
    loading: false
  };

 captureFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      this.setState({file: Buffer(reader.result)});
    };

    e.preventDefault();
  }

 onSubmit = async (e) => {
     e.preventDefault();

     this.setState({ loading: true, errorMessage: '' });

     try {
       const created = await client.add(this.state.file);
       const url = `https://ipfs.infura.io/ipfs/${created.path}`;
       this.setState({hash: url});
     } catch (error) {
       console.log(error.message);
       this.setState({ errorMessage: error.message });
     }

     try {
       const accounts = await web3.eth.getAccounts();
       await factory.methods
         .createNGO(this.state.minimumContribution, this.state.name, this.state.description, this.state.hash)
         .send({
           from: accounts[0],
           value: parseInt(this.state.minimumContribution)
         });

      Router.pushRoute('/ngos');
     } catch (err) {
       this.setState({ errorMessage: err.message });
     }

     this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h2>Create a NGO</h2>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>NGO Name</label>
            <Input
              label="name"
              labelPosition="right"
              value={this.state.name}
              onChange={event =>
                this.setState({ name: event.target.value })}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>A Brief Decsription</label>
            <Input
              type='textarea '
              label="description"
              labelPosition="right"
              value={this.state.description}
              onChange={event =>
                this.setState({ description: event.target.value })}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={event =>
                this.setState({ minimumContribution: event.target.value })}
              required
            />
          </Form.Field>
          <Form.Field>
            <label>Documentary Proof</label>
            <Input label="ID proof" labelPosition="right" type='file' onChange={this.captureFile} required></Input>
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

export default NewNGO;
