import React, { Component } from 'react';
import { Button, Table, Grid, Card, Feed } from 'semantic-ui-react';
import { Link } from '../../routes';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import VoteRow from '../../components/VoteRow';

class Vote extends Component {
  static async getInitialProps(props) {
    const reportCount = await factory.methods.getReportCount().call();
    const winner = await factory.methods.getWinner().call();
    const isStarted = await factory.methods.isStartedVoting().call();

    const report = await Promise.all(
      Array(parseInt(reportCount))
        .fill()
        .map((element, index) => {
          return factory.methods.report(index).call();
        })
    );

    return { reportCount, report, winner, isStarted };
  }

  renderVotes() {
    return this.props.report.map((request, index) => {
      return (
        <VoteRow
          key={index}
          id={index}
          request={request}
        />
      );
    });
  }

  render() {
    return (
      <Layout>
        <h3>PEOPLE CHOISE VOTING</h3>
            <Card fluid>
              <Card.Content>
                <Card.Header>WINNER DETAILS</Card.Header>
              </Card.Content>
              <Card.Content >
                <Feed>
                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Date content='Winner Name' />
                      <Feed.Summary>
                        <a>{this.props.winner[0]}</a>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>

                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Date content='Winner Manager' />
                      <Feed.Summary style={ {overflowWrap: 'break-word' }}>
                        <a style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>{this.props.winner[1]}</a>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>

                  <Feed.Event>
                    <Feed.Content>
                      <Feed.Date content='Fund Raiser Address' />
                      <Feed.Summary style={ {overflowWrap: 'break-word'} }>
                        <a>{this.props.winner[2]}</a>
                      </Feed.Summary>
                    </Feed.Content>
                  </Feed.Event>
                </Feed>
              </Card.Content>
            </Card>

            {this.props.isStarted ?
              (
                <Table>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>ID</Table.HeaderCell>
                      <Table.HeaderCell>NAME</Table.HeaderCell>
                      <Table.HeaderCell>MANAGER ADDRESS</Table.HeaderCell>
                      <Table.HeaderCell>COLLECTION ADDRESS</Table.HeaderCell>
                      <Table.HeaderCell>VOTES</Table.HeaderCell>
                      <Table.HeaderCell>VOTE</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>{this.renderVotes()}</Table.Body>
                </Table>
              ) : null
            }

      </Layout>
    );
  }
}

export default Vote;
