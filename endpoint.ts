import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import dotenv from 'dotenv';
import { parseUnits } from 'ethers';

dotenv.config();

const buyerArtifact = require('./artifacts/PancakeBuyer.json');
const erc20Artifact = require('./artifacts/ERC20.json');

const rpcUrl = process.env.ENV == 'MAINNET' ? process.env.BSC_MAINNET_RPC_URL : process.env.BSC_TESTNET_RPC_URL;
const web3 = new Web3(rpcUrl);
const address = process.env.CONTRACT_ADDRESS;
const contract = new web3.eth.Contract(buyerArtifact.abi, address);

const account = web3.eth.accounts.wallet.add('0x'+String(process.env.PRIVATE_KEY));
const myAddress = account[0].address;

export async function v2swap(
    tokenIn: string,
    tokenOut: string,
    recipient: string,
    amountOut: string,
    amountInMaximum: string
) {
    try {
        console.log('Transfer approving is requested.');
        const tokenInContract = new web3.eth.Contract(erc20Artifact.abi, tokenIn);
        const tokenOutContract = new web3.eth.Contract(erc20Artifact.abi, tokenOut);
        const decimalsIn = await tokenInContract.methods.decimals().call();
        const decimalsOut = await tokenOutContract.methods.decimals().call();

        const amountOutN = parseUnits(amountOut, Number(decimalsOut));
        const amountInMaximumN = parseUnits(amountInMaximum, Number(decimalsIn));
        // approve token transfer for buyer contract
        await tokenInContract.methods.approve(address, amountInMaximumN).send({from: myAddress});
        console.log('Token transfer is approved.');

        console.log("Swapping is requested");
        await contract.methods.swapTokensForExactTokens(
            amountOutN,
            amountInMaximumN,
            [tokenIn, tokenOut],
            recipient
        ).send({from: myAddress});
        
        console.log("Success swapping");
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
    amountOut: string,
    amountInMaximum: string,
    sqrtPriceLimitX96: number
) {

    try {
        console.log('Transfer approving is requested.');
        const tokenInContract = new web3.eth.Contract(erc20Artifact.abi, tokenIn);
        const tokenOutContract = new web3.eth.Contract(erc20Artifact.abi, tokenOut);
        const decimalsIn = await tokenInContract.methods.decimals().call();
        const decimalsOut = await tokenOutContract.methods.decimals().call();

        const amountOutN = parseUnits(amountOut, Number(decimalsOut));
        const amountInMaximumN = parseUnits(amountInMaximum, Number(decimalsIn));
        // approve token transfer for buyer contract
        await tokenInContract.methods.approve(address, amountInMaximumN).send({from: myAddress});
        console.log('Token transfer is approved.');

        const param = {
            tokenIn,
            tokenOut,
            fee,
            recipient,
            amountOutN,
            amountInMaximumN,
            sqrtPriceLimitX96
        };

        console.log("Swapping is requested");
        await contract.methods.exactOutputSingle(
            param
        ).send({from: myAddress});

        console.log("Success swapping");
    } catch(error) {
        console.error("Error swap v3 pair:", error);
        throw error;
    };
}

export async function test() {
    console.log(parseUnits('0.34', 18));
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