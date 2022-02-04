const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const fundRaiserPath = path.resolve(__dirname, 'contracts', 'FundRaiser.sol');
const source = fs.readFileSync(fundRaiserPath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

//getting the build for all bytecode and interface for two contracts
for (let contractName in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contractName.replace(':', '') + '.json'),
    output[contractName]
  );
}
