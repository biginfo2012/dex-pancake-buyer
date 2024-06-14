import {
    v2swap,
    v3swap,
    test
} from "./endpoint";

function doTest() {
    console.log("In progress of test.....");
    test();
}

const functionIndicator = process.argv[2];

if (functionIndicator == '2') {
    // swap on the v2 pool
    const tokenIn = process.argv[3];
    const tokenOut = process.argv[4];
    const recipient = process.argv[5];
    const amountOut = Number(process.argv[6]);
    const amountInMaximum = Number(process.argv[7]);

    v2swap(
        tokenIn,
        tokenOut,
        recipient,
        amountOut,
        amountInMaximum
    );
} else if (functionIndicator == '3') {
    // swap on the v3 pool
    const tokenIn = process.argv[3];
    const tokenOut = process.argv[4];
    const recipient = process.argv[5];
    const amountOut = Number(process.argv[6]);
    const amountInMaximum = Number(process.argv[7]);
    const fee = Number(process.argv[8]);
    const deadline = Number(process.argv[9]);
    const sqrtPriceLimitX96 = Number(process.argv[10]);

    v3swap(
        tokenIn,
        tokenOut,
        fee,
        recipient,
        amountOut,
        amountInMaximum,
        sqrtPriceLimitX96
    );
} else {
    doTest();
}
