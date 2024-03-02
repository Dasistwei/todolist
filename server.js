// const { v4: uuidv4 } = require('uuid')
// const id = uuidv4()
// const obj = {
//   title: "oceans",
//   id: id
// }
// const title = undefined
// if(title){
//   console.log(title)
// }

const http = require('node:http')
const { v4: uuidv4 } = require('uuid')
const errorHandle = require('./errorHandle');
const port = 3000
const hostname = '127.0.0.1'
const todos = []

const server = http.createServer((req, res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Aithorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json' 
  }
  
  let body = ""

  req.on('data', chunk => {
    body+=chunk
  })
  // console.log('patch url', req.url.startsWith('/todos/') && req.method === 'PATCH')
  

  if(req.url === '/todos'&& req.method === 'GET'){
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }))
    res.end();
  }else if(req.url === '/todos'&& req.method === 'POST'){
    req.on('end', () => {
      try {
        const title = JSON.parse(body).title
        if(title){
          const todo = {
            title: title,
            id: uuidv4()
          }
          todos.push(todo)
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: 'success',
            data: todos
          }))
          res.end()
        }else{
          errorHandle(res)
        }
      } catch (error) {
        errorHandle(res)
      }
    })    

  }else if(req.url === '/todos' && req.method === 'DELETE'){
    res.writeHead(200, headers)
    todos.length = 0
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }))
    res.end()
  }else if(req.url.match(/^\/todos\/(.*)/)&& req.method === 'DELETE'){
    // const id = req.url.split('/').slice(1)[1]
    const id = req.url.split('/').pop()
    const todoId = todos.findIndex((todo) => todo.id === id)

    if(todoId !== -1){
      todos.splice(todoId, 1)
      res.writeHead(200, headers)
      res.write(JSON.stringify({
        status: 'sucess', 
        data: todos
      }))
      res.end()
    }else{
      errorHandle(res)
    }
  }else if(req.url.startsWith('/todos/') && req.method === 'PATCH'){
    req.on('end', ()=> {
      try {
        const id = req.url.split('/').pop()
        const newTitle= JSON.parse(body).title
        const index = todos.findIndex((todo) => todo.id === id )
        console.log(id, newTitle, index)
        if(index !== -1 && newTitle){
          todos[index].title = newTitle
          res.writeHead(200, headers)
          res.write(JSON.stringify({
            status: 'success',
            data: todos,
            todo: newTitle
          }))
          res.end()
        }else{
          errorHandle(res)
        }

        
      } catch (error) {
        errorHandle(res)
      }
    })
  }else if(req.method === 'OPTIONS'){
    res.writeHead(200, headers);
    res.end()
  }else{
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: 'false',
      message: 'page not found'
    }))
    res.end()    
    // errorHandle(res)
  }
})

server.listen(process.env.PORT || `http://${hostname}:${port}`, ()=> {
  console.log(`server runningat  http://${hostname}:${port}`)
})
