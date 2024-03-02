const errorHandle = (res) => {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Aithorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json' 
  }
  res.writeHead(400, headers)
  res.write(JSON.stringify({
    status: 'false',
    message: '欄位填寫錯誤，或無此todo id'
  }))
  res.end();
}
module.exports = errorHandle