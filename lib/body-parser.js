let bodyParser = (req, res, next) => {
	let body = ''
	req.on('data', chunk => {
		body += chunk
	}).on('end', () => {
		req.body = parseBody(body)
		next()
	})
}
let parseBody = body => {
	let obj = {}
	body.split('&').forEach(str => {
		obj[str.split('=')[0]] = str.split('=')[1]
	})
	return obj
}

module.exports = bodyParser