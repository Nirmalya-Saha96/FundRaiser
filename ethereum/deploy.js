const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/FundRaiserFactory.json');

const provider = new HDWalletProvider(
  'prize verify carpet deposit game round burden cabin general boil topic world',
  'https://rinkeby.infura.io/v3/53de4285dd664c6a9ebaeb6c4c765cc6'
);
const web3 = new Web3(provider);

const deploy = async () => {    //deployed script
  const accounts = await web3.eth.getAccounts();    //getting the accounts

  console.log('Attempting to deploy from account', accounts[0]);

//this is the main deploy phase to deploy to the ehereum network(rinkeby)
  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: '0x' + compiledFactory.bytecode })
    .send({ from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
//0x983dAc06bcd8c7453EA3c7A39cc82DCB90EF6A6B
