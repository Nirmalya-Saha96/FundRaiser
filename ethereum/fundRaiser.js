import web3 from './web3';
import FundRaiser from './build/FundRaiser.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(FundRaiser.interface), address);
};
