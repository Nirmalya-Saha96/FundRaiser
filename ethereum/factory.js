import web3 from './web3';
import FundRaiserFactory from './build/FundRaiserFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(FundRaiserFactory.interface),
  '0xA0BB0fb129ED293E94a6f80341a62D452B50791d'
);

export default instance;
