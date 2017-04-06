//场景管理类，0开始，1游戏中，2结束
var Scene = Class.extend({
   init : function(){
       this.scenenumber = 0;

       //开始按钮位置
       this.sx = 95;
       this.mx = 265;
       this.sy = 420;
       this.my = 490;

   },
    changescenen : function(number){
        this.scenenumber = number;

        switch(this.scenenumber){
            case 0:
                var self = this;

                //鼠标点击事件
                game.mycanvas.onmousedown = function(event){

                    if((event.offsetX > 95 && event.offsetX < 265) && (event.offsetY > 420 && event.offsetY < 490)){
                        game.mycanvas.onmousedown = null;
                        game.audios["set"].load();
                        game.audios["set"].play();
                        self.changescenen(1);
                        self.scenenumber = 1;
                    }
                }

                //移动端
                game.mycanvas.removeEventListener("touchstart",s2,true);
                game.mycanvas.removeEventListener("touchstart",s3,true);
                game.mycanvas.addEventListener("touchstart",s1,true);
                    function s1(event){

                        //阻止默认事件
                        if(self.scenenumber != 0) return;
                        event.preventDefault();
                        //得到每个手指的信息
                        var fingers = event.touches[0];
                        if((fingers.clientX > 95 && fingers.clientX < 265) && (fingers.clientY > 420 && fingers.clientY < 490)){
                            game.mycanvas.onmousedown = null;
                            self.changescenen(1);
                            self.scenenumber = 1;
                        }
                    };
                break;

            case 1:
                game.map = new Map();
                game.cat = new Cat();

                //点击圆点事件
                var self = this;
                game.mycanvas.onmousedown = function(event){
                    //判定点击到的圆点
                    var crow = event.offsetY <= 180 ? -1 : parseInt((event.offsetY - 180) / 32);
                    var ccol = crow % 2 == 0 ? parseInt((event.offsetX - 20) / 34) : parseInt((event.offsetX - 36) / 34);

                    //越界return
                    if(crow < 0 || crow > 8 || ccol < 0 || ccol > 8 || event.offsetX < 20) return;
                    game.audios["set"].load();
                    game.audios["set"].play();
                    //更改地图数组
                    if(game.map.maparr[crow][ccol] == 1) return;
                    game.map.change(crow,ccol,1);

                    //传参，做个标记
                    game.cat.aicat(crow,ccol);
                }

                //移动端
                game.mycanvas.removeEventListener("touchstart",s1,true);
                game.mycanvas.removeEventListener("touchstart",s3,true);

                game.mycanvas.addEventListener("touchstart",s2,true);

                var self = this;
            function s2(event){
                //阻止默认事件
                if(self.scenenumber != 1) return;
                event.preventDefault();
                //得到每个手指的信息
                var fingers = event.touches[0];

                //判定点击到的圆点
                var crow = fingers.clientY <= 180 ? -1 : parseInt((fingers.clientY - 180) / 32);
                var ccol = crow % 2 == 0 ? parseInt((fingers.clientX - 20) / 34) : parseInt((fingers.clientX - 36) / 34);
                if(crow < 0 || crow > 8 || ccol < 0 || ccol > 8 || fingers.clientX < 20) return;
                //更改地图数组
                if(game.map.maparr[crow][ccol] == 1) return;
                game.map.change(crow,ccol,1);

                //传参，做个标记
                game.cat.aicat(crow,ccol);

            };


                break;

            case 2:
                var self = this;

                game.cat.die ? game.audios["win"].play() : game.audios["lose"].play();
                //鼠标点击事件
                game.mycanvas.onmousedown = function(event){
                    if((event.offsetX > 100 && event.offsetX < 280) && (event.offsetY > 370 && event.offsetY < 440)){
                        game.audios["set"].load();
                        game.audios["set"].play();
                        game.mycanvas.onmousedown = null;
                        self.changescenen(0);
                        self.scenenumber = 0;
                    }
                }

                //移动端
                game.mycanvas.removeEventListener("touchstart",s1,true);
                game.mycanvas.removeEventListener("touchstart",s2,true);

                game.mycanvas.addEventListener("touchstart",s3,true);
                var self = this;
            function s3(event){
                //阻止默认事件
                if(self.scenenumber != 2) return;
                event.preventDefault();

                //得到每个手指的信息
                var fingers = event.touches[0];
                if((fingers.clientX > 100 && fingers.clientX < 280) && (fingers.clientY > 370 && fingers.clientY < 440)){
                    self.changescenen(0);
                    self.scenenumber = 0;
                }
            };

                break;
        }
    },
    render : function(){
        switch(this.scenenumber){
            case 0:
                //渲染两个背景
                game.ctx.drawImage(game.img["bg"],0,0,game.mycanvas.width,game.mycanvas.height);
                game.ctx.drawImage(game.img["btn_start"],0,0,game.mycanvas.width,game.mycanvas.height);
                break;

            case 1:
                //渲染地图背景
                game.ctx.drawImage(game.img["bg"],0,0,game.mycanvas.width,game.mycanvas.height);

                //渲染地图
                game.map.render();
                break;

            case 2:
                //渲染地图背景
                game.ctx.drawImage(game.img["bg"],0,0,game.mycanvas.width,game.mycanvas.height);

                //渲染地图
                game.map.render();

                //渲染再来一次
                game.ctx.drawImage(game.img["replay"],0,0,200,100,game.mycanvas.width/2 - 90,game.mycanvas.height/2 + 100,200,100);
                //渲染成功或者失败
                if(game.cat.die){
                    game.ctx.drawImage(game.img["victory"],0,0,440,360,game.mycanvas.width/2 - 160,game.mycanvas.height/2 - 200,320,250);
                }else{
                    game.ctx.drawImage(game.img["failed"],0,0,440,360,game.mycanvas.width/2 - 160,game.mycanvas.height/2 - 200,320,250);
                }
                break;
        }

    }
});
