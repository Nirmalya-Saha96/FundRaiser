import web3 from './web3';
import FundRaiserFactory from './build/FundRaiserFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(FundRaiserFactory.interface),
  '0xB8d641c59F3e56db87F26ACB9E271C4564e96F80'
);

export default instance;
