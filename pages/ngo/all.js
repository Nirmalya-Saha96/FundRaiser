import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../../ethereum/factory';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import SearchBox from '../../components/SearchBox';

class NGOs extends Component {
  state = {
    c: ""
  };

    onSearchChange = (e) => {
     this.setState({c: e.target.value});
   }

  static async getInitialProps() {
    const ngos = await factory.methods.getDeployedNGOCampaigns().call();
    const ngol = ngos.length;

    return { ngos, ngol };
  }

  renderNGOs() {
    const fill = this.props.ngos.filter(profile => (
               profile.toLowerCase().includes(this.state.c.toLowerCase())
            ));
    const items = fill.map((address, index) => {
      return {
        header: index,
        description: (
          address
        ),
        extra: (
          <Link route={`/ngos/${address}`}>
            <a>View NGO</a>
          </Link>
        ),
        style: { overflowWrap: 'break-word' },
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }


  render() {
    return (
      <Layout>
        <div>
          <h3>Open NGOs</h3>
          <Link route='/ngos/new'>
            <Button
              floated="right"
              basic
              color='yellow'
              content='New NGO'
              icon='add'
              label={{
                as: 'a',
                basic: true,
                color: 'yellow',
                pointing: 'left',
                content: [this.props.ngol],
              }}
            />
          </Link>
          <SearchBox searchChange={ this.onSearchChange}/>
          <br />
          {this.renderNGOs()}
        </div>
      </Layout>
    );
  }
}

export default NGOs;
