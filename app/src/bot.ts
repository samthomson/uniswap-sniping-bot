import { ethers } from 'ethers'

const addresses = {
	WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
	factory: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
	router: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
	recipient: process.env.RECEIVER_PUBLIC_ADDRESS
}

const privateKey = process.env.PRIVATE_KEY

export const start = async () => {
	// get a connection to the blockchain
	const provider = new ethers.providers.WebSocketProvider(process.env.WEB_SOCKET_PROVIDER)
	// create wallet, to sign txs
	const wallet = new ethers.Wallet(privateKey)
	// connect wallet to provider, so ethers can sign txs
	const account = wallet.connect(provider)

	const factory = new ethers.Contract(
		addresses.factory,
		['event PairCreated(address indexed token0, address indexed token1, address pair, uint)'], account
	)

	const router = new ethers.Contract(
		addresses.router,
		[
			'function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)',
			'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
		],
		account
	)

	factory.on('PairCreated', async (token0, token1, pairAddress) => {
		console.log(`
		New pair detected
		-----------------
		token0: ${token0}
		token1: ${token1}
		pairAddress: ${pairAddress}
		`)

		// ensure WETH is part of the pair, since we'll pay in WETH
		let tokenIn, tokenOut;
		if (token0 === addresses.WETH) {
			tokenIn = token0
			tokenOut = token1
		}

		if (token1 === addresses.WETH) {
			tokenIn = token1;
			tokenOut = token0;
		}

		// non-weth pair
		if (!tokenIn) {
			return
		}

		const amountIn = ethers.utils.parseUnits('0.1', 'ether')
		const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut])
		// allow for some slippage
		const slippage = amounts[1].mul(0.05)
		const amountOutMin = amounts[1].sub(slippage)
		console.log(`
		Buying new token
		----------------
		token in: ${amountIn.toString()} ${tokenIn} (WETH)
		token out: ${amountOutMin.toString()} ${tokenOut}
		`)

		const tx = await router.swapExactTokensForTokens(
			amountIn,
			amountOutMin,
			[tokenIn, tokenOut],
			addresses.recipient,
			Date.now() + 1000 * 60 * 10 // 10 mins
		)
		const receipt = await tx.wait()
		console.log('Transaction receipt')
		console.log(receipt)
	})
}