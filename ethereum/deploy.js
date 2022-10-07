const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/FundRaiserFactory.json');

const provider = new HDWalletProvider(
  'prize verify carpet deposit game round burden cabin general boil topic world',
  'https://sepolia.infura.io/v3/27d0617b4c5a4f5aa18370f47ccd3028'
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
//  '0xB8d641c59F3e56db87F26ACB9E271C4564e96F80'
