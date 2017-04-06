var Game = Class.extend({
    init : function(canvasid){
        this.mycanvas = document.getElementById(canvasid);
        this.ctx = this.mycanvas.getContext("2d");

        this.robj = null;
        this.img = {};
        this.audios = {};

        this.f = 0;
        this.t0 = 0;
        this.t0f = 0;
        this.fps = 0;

        this.registeventarr = [];

        this.loadresource();
    },
    //加载资源
    loadresource : function(){
        var self = this;
        //初始加载
        this.ctx.font = "20px 微软雅黑";
        this.ctx.textAlign = "center";
        this.ctx.fillText("正在加载~",this.mycanvas.width / 2,200);
        //Ajax请求预加载图片资源
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                if(xhr.status == 200 || xhr.status == 304){
                    //加载完毕的图片数
                    var count = 0;
                    self.robj = JSON.parse(xhr.responseText);
                    self.imglength = _.size(self.robj["IMG"]);
                    for(var k in self.robj["IMG"]){
                        self.img[k] = new Image();
                        self.img[k].src = self.robj["IMG"][k];
                        self.img[k].onload = function(){
                            count++;
                            self.ctx.clearRect(0,0,self.mycanvas.width,self.mycanvas.height);
                            self.ctx.fillText("正在加载图片资源" + count + "/" + self.imglength,self.mycanvas.width / 2,250);
                            //加载完毕执行start
                        }
                    }
                    var counta = 0;
                    self.audioslength = _.size(self.robj["AUDIO"]);
                    for(var k in self.robj["AUDIO"]){
                        counta++;
                        self.audios[k] = new Audio();
                        self.audios[k].src = self.robj["AUDIO"][k];
                        self.ctx.clearRect(0,0,self.mycanvas.width,self.mycanvas.height);
                        self.ctx.fillText("正在加载图片资源" + count + "/" + self.audios,self.mycanvas.width / 2,250);
                        //加载完毕执行start
                        if(counta == self.audioslength) self.start();
                    }
                }
            }
        }
        xhr.open("get","R.txt",true);
        xhr.send(null);
    },
    //开始，调用场景，显示帧率
    start : function(){
        //fps和帧率字体
        this.ctx.font = "16px consolas";
        this.ctx.fillStyle = "black";
        this.ctx.textAlign = "left";
        //初始时间戳，计算fps
        this.t0 = Date.parse(new Date());
        this.t0f = 0;
        //new场景管理器，调用开始场景
        this.scene = new Scene();
        this.scene.changescenen(0);

        //执行主循环
        this.mainloop();
    },
    //主循环
    mainloop : function(){
        var self = this;
        this.f++;
        this.ctx.clearRect(0,0,this.mycanvas.width,this.mycanvas.height);

        //渲染场景
        this.scene.render();

        this.ctx.fillText("帧:" + this.f ,10,15);
        //fps
        if(Date.parse(new Date()) - this.t0 >= 1000){
            this.fps = this.f - this.t0f;
            this.t0 = Date.parse(new Date());
            this.t0f = this.f;
        }
        this.ctx.fillText("FPS:" + this.fps, 10,35);



        window.requestAnimationFrame(function(){
            self.mainloop();
        })
    }
});

