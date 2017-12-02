var express = require('express');
var router = express.Router();

var addpost=function (req,res) {
    console.log('post 모듈 안에 있는 addpost 호출됨');

    var paramTitle = req.body.title || req.query.title;
    var paramContents = req.body.contents || req.query.contents;
    var paramWriter = req.body.writer || req.query.writer;

    console.log('요청 파라미터 : ' + paramTitle + ', ' + paramContents + ', ' + paramWriter);

    var database = req.app.get('database');

    //db 객체 초기화 경우
    if (database.db) {
        //1.아이디 이용해 사용자 검색
        database.PostModel.find(paramWriter, function (err, results) {
            if (err) {
                console.error('게시판 글 추가 중 오류: ' + err.stack);

                res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                res.write('사용자 [' + paramWriter + ']를 찾을 수 없습니다.');
                res.end();

                return;
            }

            var userObjectId = results[0]._doc._id;
            console.log('사용자 ObjectId : ' + paramWriter + ' -> ' + userObjectId);

            //save
            var post = new database.PostModel({
                title: paramTitle,
                contents: paramContents,
                writer: userObjectId
            });
            post.savePost(function (err, result) {
                if (err) {
                    throw err;
                }

                console.log("글 데이터 추가함.");
                console.log("글 작성", '포스팅 글을 생성했습니다. : ' + post._id);
                return res.redirect('/process/showpost/' + post._id);
            });
        });
    }
};

var showpost=function (req,res) {
    console.log('post 모듈 안에 있는 showpost 호출됨');

    var paramId=req.body.id||req.query.id||req.params.id;
    console.log('요청 파라미터 : '+paramId);

    var database=req.app.get('database');

    //db 객체 초기화 경우
    if(database.db){
        //1.글 리스트
        database.PostModel.load(paramId,function (err,results) {
            if(err){
                console.error("게시판 글 조회 오류 : "+err.stack);

                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('게시판 글 조회 중 오류 발생');
                res.write('<p>'+err.stack+'</p>');
                res.end();

                return;
            }

            if(results){
                console.dir(results);
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});

                var context={
                    title:'글 조회 ',
                    posts:results
                };
                req.app.render('showpost',context,function (err,html) {
                    if(err){
                        throw err;
                    }
                    console.log('응답 웹 문서 : '+html);
                    res.end(html);
                });

            }
        })
    }
};

var listpost=function(req,res){
    console.log('post 모듈 안에 있는 listpost 호출됨');

    var paramPage=req.body.page||req.query.page;
    var paramPerPage=req.body.perPage||req.query.perPage;

    console.log('요청 파라미터 : '+paramPage+', '+paramPage);

    var database=req.app.get('database');

    //db 객체 초기화 경우
    if(database.db){
        var options={
            page:paramPage,
            perPage:paramPerPage
        };

        database.PostModel.list(options,function(err,results){
            if(err){
                console.error('게시판 글 목록 조회 중 오류 발생 : '+err.stack);
                res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                res.write('게시판 글 목록 조회 중 오류 발생');
                res.write('<p>'+err.stack+'</p>');
                res.end();

                return;
            }

            if(results){
                console.dir(results);

                //전체 문서 객체 수 확인
                database.PostModel.count().exec(function (err,count) {
                    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});

                    var context={
                        title:'글 목록',
                        posts:results,
                        page:parseInt(paramPage),
                        pageCount:Math.ceil(count/paramPerPage),
                        perPage:paramPerPage,
                        totalRecords:count,
                        size:paramPerPage
                    };

                    req.app.render('listpost',context,function (err,html) {
                        if(err){
                            console.error('응답 웹 문서 생성 중 오류 발생'+err.stack);

                            res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
                            res.write('응답 웹문서 생성 중 오류');
                            res.write('<p>'+err.stack+'</p>');
                            res.end();

                            return;
                        }
                        res.end(html);
                    });
                });
            }

        })
    }
};
module.exports.addpost=addpost;
module.exports.showpost=showpost;
module.exports.listpost=listpost;