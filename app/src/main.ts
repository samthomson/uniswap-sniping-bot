import * as Bot from './bot'

const ensureEnvVarsAreNotEmpty = () => {
	const varsToCheck: string[] = ['RECEIVER_PUBLIC_ADDRESS', 'PRIVATE_KEY', 'WEB_SOCKET_PROVIDER']

	const unset = varsToCheck.filter(el => !process.env[el])

	if (unset.length > 0) {
		console.error('Ensure these env vars are set', unset)
		process.exit(1)
	}
}
const main = async () => {
	console.log('bot')
	ensureEnvVarsAreNotEmpty()
	await Bot.start()
}

main()