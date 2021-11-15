let url = require('url')
let fs = require('fs')
let path = require('path')

function express(){

  let tasks = []

  let app = (req, res) => {
    makeQuery(req)
    makeResponse(res)

    let i = 0
	
	console.log(i, tasks)

    let next = () => {
      let task = tasks[i++]
      if(!task) {
        return
      }

      //如果是普通的中间件 或者 是路由匹配上的中间件  
      if(task.routePath === null || url.parse(req.url, true).pathname === task.routePath){
        task.middleWare(req, res, next)
      }else{
        //如果说路由未匹配上的中间件，直接下一个
        next()
      }
    }

    next()
  }

  app.use = (routePath, middleWare) => {
    if(typeof routePath === 'function') {
      middleWare = routePath
      routePath = null
    }

    tasks.push({
      routePath: routePath,
      middleWare: middleWare
    })
  }


  return app

}

express.static = staticPath => {

  return (req, res, next) => {
	let pathObj = url.parse(req.url, true)
	let filePath = path.resolve(staticPath, pathObj.pathname.substr(1))
	console.log('staticPath:',staticPath)
	console.log("filePath: ", filePath)
	fs.readFile(filePath, 'binary', (err, content) => {
		if (err){
			next()
		}else{
			res.writeHead(200, 'ok')
			res.write(content, 'binary')
			res.end()
		}
	})
  }
}

module.exports = express


let makeQuery = req => {
  let pathObj = url.parse(req.url, true)
  req.query = pathObj.query
}

let makeResponse = res => {
  res.send = toSend => {
    if(typeof toSend === 'string'){
      res.end(toSend)
    }
    if(typeof toSend === 'object'){
      res.end(JSON.stringify(toSend))
    }
    if(typeof toSend === 'number'){
      res.writeHead(toSend, arguments[1])
      res.end()
    }
  }
}


