//콜백함수는 함수 A를 호출하면서 특정조건일 때 함수 B를 실행하여 나에게 알려줘!라는 뜻
//콜백함수는 다른 코드(함수 또는 메서드)에게 인자로 넘겨줌으로써 그 제어권도 함게
// 위임하는 함수
// 예시 ->
/*
function fn_sum(a, b, callback){
  var sum = a + b;
  callback(sum);
}
fn_sum 함수에 익명 함수를 인자로 전달
fn_sum(3, 7, function(result){
  console.log(result);
});
*/

/*
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/', function(req, res){
  return res.send('Hello World!');
});
이런애들을 route, routing이라고 함
위에 두개는 같은 뜻임
*/

const express = require('express');
const qs = require('querystring');
const bodyParser = require('body-parser');
const compression = require('compression');
const topicRouter = require('./routes/topic.js');
const indexRouter = require('./routes/index.js');
const fs = require('fs');
const template = require('./lib/template.js');
const helmet = require('helmet')

const app = express();
const port = 3000;

app.use(helmet())
app.use(express.static('image'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression());
app.get('*',function(req, res, next){
  fs.readdir('./data', function(error, filelist){
    req.list = filelist;
    next();
  });
});

app.use('/topic', topicRouter); //라우터라는 express의 기능을 이용하 연관되있는 라우트들을 하나의 파일로 빼서 쉽게 관리할 수 있고 보기편한 코드를 생성
app.use('/', indexRouter);

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

app.listen(port, function(){
  console.log(`Example app listening at http://localhost:${port}`)
});
