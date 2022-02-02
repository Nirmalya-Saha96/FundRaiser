const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');   //constructor web3->provider->ganache
const web3 = new Web3(ganache.provider()); //creating a instance of web3 and providing a provider for the perticular network

const compiledFactory = require('../ethereum/build/FundRaiserFactory.json');
const compiledFundRaiser = require('../ethereum/build/FundRaiser.json');

let accounts;
let factory;
let fundRaiserAddress;
let fundRaiser;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '5000000' });

  await factory.methods.createProjectCampaign('1000', "College Street App", "B-2-B market place for second hand books", "hash").send({
    from: accounts[1],
    value: '1000',
    gas: '5000000'
  });

  [fundRaiserAddress] = await factory.methods.getDeployedProjectCampaigns().call();
  fundRaiser = await new web3.eth.Contract(
    JSON.parse(compiledFundRaiser.interface),
    fundRaiserAddress
  );
});

describe('FundRaiser', ()=>{
  it('deploys', ()=>{
    assert.ok(factory.options.address);
    assert.ok(fundRaiser.options.address);
  });

  it('marks caller as the campaign manager and factory creator as factory manager', async () => {
    const manager = await fundRaiser.methods.manager().call();
    const factoryManager = await factory.methods.manager().call();
    assert.equal(accounts[1], manager);
    assert.equal(accounts[0], factoryManager);
  });

  it('allows people to contribute money and be a approvers', async () => {
    await fundRaiser.methods.contribute().send({
      value: '1000',
      from: accounts[2]
    });
    const isContributor = await fundRaiser.methods.approvers(accounts[2]).call();
    assert(isContributor);
  });

  it('requires atleast minimum contribution to be an approver', async () =>{
    try{
      await fundRaiser.methods.contribute().send({
        value: '100',
        from: accounts[2]
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('creates a request', async () =>{
    await fundRaiser.methods.contribute().send({
      value: '1000',
      from: accounts[2]
    });

    await fundRaiser.methods
      .createRequest('Buy batteries', '100', accounts[5])
      .send({
        from: accounts[1],
        gas: '1000000'
      });
    const request = await fundRaiser.methods.requests(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('requires the manager to make request', async ()=>{
    try{
      await fundRaiser.methods.contribute().send({
        value: '1000',
        from: accounts[2]
      });

      await fundRaiser.methods
        .createRequest('Buy batteries', '100', accounts[5])
        .send({
          from: accounts[2],
          gas: '1000000'
        });
        assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('requires the balance more than request value', async () =>{
    try{
      await fundRaiser.methods.contribute().send({
        value: '1000',
        from: accounts[2]
      });

      await fundRaiser.methods
        .createRequest('Buy batteries', '10000', accounts[5])
        .send({
          from: accounts[1],
          gas: '1000000'
        });
        assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('processes requests', async () => {
    await fundRaiser.methods.contribute().send({
      from: accounts[2],
      value: web3.utils.toWei('10', 'ether')
    });

    await fundRaiser.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[5])
      .send({ from: accounts[1], gas: '1000000' });

    await fundRaiser.methods.approveRequest(0).send({
      from: accounts[2],
      gas: '1000000'
    });

    await fundRaiser.methods.finalizeRequest(0).send({
      from: accounts[1],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[5]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });

  it('require one approver cannot approve one request multiple request', async ()=>{
    try{
      await fundRaiser.methods.contribute().send({
        from: accounts[2],
        value: web3.utils.toWei('10', 'ether')
      });

      await fundRaiser.methods
        .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[5])
        .send({ from: accounts[1], gas: '1000000' });

      await fundRaiser.methods.approveRequest(0).send({
        from: accounts[2],
        gas: '1000000'
      });

      await fundRaiser.methods.approveRequest(0).send({
        from: accounts[2],
        gas: '1000000'
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('require to be an approver to approve request', async () =>{
    try{
      await fundRaiser.methods
        .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[5])
        .send({ from: accounts[1], gas: '1000000' });

      await fundRaiser.methods.approveRequest(0).send({
        from: accounts[2],
        gas: '1000000'
      });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('reqires a mority approvers to approve then the manager can finalise a request', async ()=>{
    try{
      await fundRaiser.methods.contribute().send({
        from: accounts[2],
        value: web3.utils.toWei('10', 'ether')
      });

      await fundRaiser.methods
        .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[5])
        .send({ from: accounts[1], gas: '1000000' });

      await fundRaiser.methods.finalizeRequest(0).send({
        from: accounts[1],
        gas: '1000000'
      });
    }catch(err){
      assert(err);
    }
  });

  it('add new customer care', async ()=>{
    await factory.methods.addNewCustomerCare("prob", "0xCdcE0D63DD308F0d507884E515513c74F3dC9b17", "College Street App")
      .send({
        from: accounts[2],
        gas: '1000000'
      });
      const customerCare = await factory.methods.cure(0).call();

      assert.equal('prob', customerCare.problem);
  });

  it('upvote customer care', async ()=>{
    await factory.methods.addNewCustomerCare("prob", "0xCdcE0D63DD308F0d507884E515513c74F3dC9b17", "College Street App")
      .send({
        from: accounts[2],
        gas: '1000000'
      });

      await factory.methods.upvoteCustomerCare(0)
        .send({
          from: accounts[2],
          gas: '1000000'
        });

        const customerCare = await factory.methods.cure(0).call();

        assert.equal(1, customerCare.voteCount);
  });

  it('requires one can only upvote any customer care once', async ()=>{
    try{
      await factory.methods.addNewCustomerCare("prob", "0xCdcE0D63DD308F0d507884E515513c74F3dC9b17", "College Street App")
        .send({
          from: accounts[2],
          gas: '1000000'
        });

        await factory.methods.upvoteCustomerCare(0)
          .send({
            from: accounts[2],
            gas: '1000000'
          });

          await factory.methods.upvoteCustomerCare(0)
            .send({
              from: accounts[2],
              gas: '1000000'
            });
            assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('set an alert by the factory manager', async ()=>{
    await factory.methods.addNewCustomerCare("prob", "0xCdcE0D63DD308F0d507884E515513c74F3dC9b17", "College Street App")
      .send({
        from: accounts[2],
        gas: '1000000'
      });

      await factory.methods.setAlert(0)
        .send({
          from: accounts[0],
          gas: '1000000'
        });

      const customerCare = await factory.methods.cure(0).call();

      assert.equal(true, customerCare.imp);
  });

  it('requires the factory manager to set alert', async ()=>{
    try{
      await factory.methods.addNewCustomerCare("prob", "0xCdcE0D63DD308F0d507884E515513c74F3dC9b17", "College Street App")
        .send({
          from: accounts[2],
          gas: '1000000'
        });

        await factory.methods.setAlert(0)
          .send({
            from: accounts[1],
            gas: '1000000'
          });
      assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('creates a report to vote at time to deploy', async ()=>{
    const report = await factory.methods.report(0).call();

    assert.equal(accounts[1], report.managerAddress);
  });

  it('factory manager starts voting for public choise', async ()=>{
    await factory.methods.startVoting()
      .send({
        from: accounts[0],
        gas: '1000000'
      });

      const vote = await factory.methods.isStartedVoting().call();
      assert.equal(true, vote);
  });

  it('whole voting', async ()=>{
    await factory.methods.startVoting()
      .send({
        from: accounts[0],
        gas: '1000000'
      });

      await factory.methods.vote(0)
        .send({
          from: accounts[1],
          gas: '1000000'
        });

      await factory.methods.declareResult()
        .send({
          from: accounts[0],
          gas: '1000000'
        });

      const winner = await factory.methods.getWinner().call();
      assert.equal("College Street App", winner[0]);
  });

  it('requires factory manger to start voting', async ()=>{
    try{
      await factory.methods.startVoting()
        .send({
          from: accounts[1],
          gas: '1000000'
        });
        assert(false);
    }catch(err){
      assert(err);
    }
  });

  it('npo can finalize a request without approvals', async ()=>{
    await factory.methods.createNPOCampaign('1000', "Donation", "donate", "hash").send({
      from: accounts[1],
      gas: '5000000'
    });
    let npoAddress;
    [npoAddress] = await factory.methods.getDeployedNPOCampaigns().call();
    const npo = await new web3.eth.Contract(
      JSON.parse(compiledFundRaiser.interface),
      npoAddress
    );

    await npo.methods.contribute().send({
      from: accounts[2],
      value: web3.utils.toWei('10', 'ether')
    });

    await npo.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[4])
      .send({ from: accounts[1], gas: '1000000' });

    await npo.methods.finalizeNPORequest(0).send({
      from: accounts[1],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[4]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
