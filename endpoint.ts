import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import dotenv from 'dotenv';

dotenv.config();

const buyerArtifact = require('./artifacts/PancakeBuyer.json');
const erc20Artifact = require('./artifacts/ERC20.json');

const web3 = new Web3(process.env.BSC_TESTNET_RPC_URL);
const address = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(buyerArtifact.abi, address);

const account = web3.eth.accounts.wallet.add('0x'+String(process.env.PRIVATE_KEY));
const myAddress = account[0].address;

export async function v2swap(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    amountOut: number,
    amountInMaximum: number
) {
    try {
        console.log('Transfer approving is requested.');
        const tokenInContract = new web3.eth.Contract(erc20Artifact.abi, tokenIn);
        // approve token transfer for buyer contract
        await tokenInContract.methods.approve(address, amountInMaximum).send({from: myAddress});

        console.log('Token transfer is approved.');

        const response = await contract.methods.swapTokensForExactTokens(
            amountOut,
            amountInMaximum,
            [tokenIn, tokenOut],
            recipient
        ).send({from: myAddress});
        
        console.log("Success");
    } catch(error) {
        console.error("Error swap v2 pair:", error);
        throw error;
    };
}

export async function v3swap(
    tokenIn: string,
    tokenOut: string,
    fee: number,
    recipient: string,
    amountOut: number,
    amountInMaximum: number,
    sqrtPriceLimitX96: number
) {
    const param = {
        tokenIn,
        tokenOut,
        fee,
        recipient,
        amountOut,
        amountInMaximum,
        sqrtPriceLimitX96
    };

    try {
        console.log('Transfer approving is requested.');
        const tokenInContract = new web3.eth.Contract(erc20Artifact.abi, tokenIn);
        // approve token transfer for buyer contract
        await tokenInContract.methods.approve(address, amountInMaximum).send({from: myAddress});

        console.log('Token transfer is approved.');

        const trx = await contract.methods.exactOutputSingle(
            param
        ).send({from: myAddress});

        console.log("Success");
    } catch(error) {
        console.error("Error swap v3 pair:", error);
        throw error;
    };
}

export async function test() {
    console.log(BigNumber(3).times(4).pow(2));
}

function convert(
    num: BigNumber,
    precision: number,
    round: BigNumber.RoundingMode = 1
): string {
    if (num.gte(1)) return num.toFixed(precision, 1);

    const exponent = new BigNumber(Number(num.e));
    return num.toFixed(
        exponent.abs().plus(precision - 1).toNumber(),
        round
    );
}