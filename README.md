# Pancakeswap V2, V3 Buyer

## Environment Configuration

Copy `.env.example` and rename it as `.env`.

Then replace the `PRIVATE_KEY` of `.env` file with your own private key.

## V2 Swap Wrapper

```
ts-node main.ts 2 [input token address] [output token address] [recipient address] [expected out amount] [input autput maximum limit]
```

For example, 
```
ts-node main.ts 2 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c 0x55d398326f99059fF775485246999027B3197955 0xc7aC3B12ceBb8D8fBC26ED2939d7D323eb887E2D 5 0.0085
```

Above example is for swapping `WBNB` to `5 USDT` under the maximum limit of `0.0085 WBNB` in v2 pool.


## V3 Swap Wrapper

```
ts-node main.ts 3 [input token address] [output token address] [recipient address] [expected out amount] [input autput maximum limit] [fee] [sqrtPriceLimitX96]
```

For example, 
```
ts-node main.ts 3 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c 0x55d398326f99059fF775485246999027B3197955 0xc7aC3B12ceBb8D8fBC26ED2939d7D323eb887E2D 5 0.0085 2500 0
```

Above example is for swapping `WBNB` to `5 USDT` under the maximum limit of `0.0085 WBNB` in v3 pool of `0.25% fee`.

`0 sqrtPriceLimitX96` means that no limit for `sqrtPriceX96`.

