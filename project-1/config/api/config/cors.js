
module.exports = function(app) {
  app.use((req, res, next)=>{

    process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  	var allowedOrigins = ['http://localhost:3000', 'https://top.104-dev.com.tw', 'http://top.104-dev.com.tw'];
  	var origin = req.headers.origin;
	  if(allowedOrigins.indexOf(origin) > -1){
	       res.setHeader('Access-Control-Allow-Origin', origin);
	  }

    //res.append('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.append('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    res.append('Access-Control-Allow-Credentials', true);
    res.append('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method && process.env.NODE_ENV) { //當是開發階段時處理
      //respond with 200
      res.sendStatus(200);
    }
    else {
    //move on
      next();
    }    
  });
}