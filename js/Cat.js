var Cat = Class.extend({
    init : function(){
        //初始位置
        this.row = 4;
        this.col = 4;

        //动图序列，总16个序列
        this.bgn = 0;
        //动画间隔，每三帧执行
        this.bgjg = 0;

        //路径数组，左、左上、右上、右、右下、左下，没有障碍为正数，有障碍为负数（障碍就在相邻圆时为-1，差一步为-2，以此类推）
        this.shortarr = [];
        this.directionarr = [];

        //围住判定，xharr存储待检查的可通行路径点，zaarr存储检查过的点
        this.lap = false;
        this.xharr = [[4,4]];
        this.zaarr = [];

        //结束判定
        this.die = false;

    },
    move : function(row,col){
        //如果猫到了边界则游戏结束
        if(this.row == 0 || this.row == 8 || this.col == 0 || this.col == 8){
            //game over
            game.scene.changescenen(2);
            return;
        }
        //if(this.die){
        //    game.scene.changescenen(2);
        //    return;
        //};

        //如果当前猫的位置被点击，
        game.map.maparr[this.row][this.col] == 1 ? game.map.change(this.row,this.col,1) : game.map.change(this.row,this.col,0);
        this.row = row;
        this.col = col;
        game.map.change(row,col,2);

        //todo 猫移动后就要再计算自己的最短路径,然后判断自己是否被围住
        this.aicat();
        //if(!this.lap) this.xunhuan();


    },
    render : function() {
            //序列增加，到16返0
            this.bgjg++;
            this.bgjg % 3 == 0 && ((this.bgn < 15) ? ++this.bgn : this.bgn = 0);
            this.bgnrow = parseInt(this.bgn / 4);
            this.bgncol = this.bgn % 4;

            if(this.row % 2 == 0){
                game.ctx.drawImage(game.img["stay"],61 * this.bgncol,93 * this.bgnrow,61,93,20 + this.col * (32 + 2) - 6,180 + this.row * 32 - 50,46,70);
            }else{
                game.ctx.drawImage(game.img["stay"],61 * this.bgncol,93 * this.bgnrow,61,93,36 + this.col * (32 + 2) - 6,180 + this.row * 32 - 50,46,70);
            }
    },

    //计算六个方向最短路径，左、左上、右上、右、右下、左下
    aicat : function(row,col){

            //重置路径数组
            this.shortarr = [];
            //计算六条路线距离,左、左上、右上、右、右下、左下
            var d0 = 0;
            var d1 = 0;
            var d2 = 0;
            var d3 = 0;
            var d4 = 0;
            var d5 = 0;

            //计算路径
            if(true){
                //左
                for(var i = this.col - 1; i >= 0; --i){
                    if(game.map.maparr[this.row][i] != 1){
                        ++d0;
                    }else{
                        d0 = -1 * d0 - 1;
                        break;
                    }
                }
                this.shortarr.push(d0);

                //左上
                for(var i = this.row - 1,k = this.col - 1; i >= 0 && k >= 0; --i,--k){
                        //列数补偿
                        if(i % 2 == 0) ++k;

                        if(game.map.maparr[i][k] != 1){
                            ++d1;
                        }else{
                            d1 = -1 * d1 - 1;
                            break;
                        }
                }
                this.shortarr.push(d1);

                //右上
                for(var i = this.row - 1,k = this.col + 1; i >= 0 && k <= 8; --i,++k){
                    //列数补偿
                    if((i + 1) % 2 == 0) --k;

                    if(game.map.maparr[i][k] != 1){
                        ++d2;
                    }else{
                        d2 = -1 * d2 - 1;
                        break;
                    }
                }
                this.shortarr.push(d2);

                //右
                for(var i = this.col + 1; i <= 8; ++i){
                    if(game.map.maparr[this.row][i] != 1){
                        ++d3;
                    }else{
                        d3 = -1 * d3 - 1;
                        break;
                    }
                }
                this.shortarr.push(d3);

                //右下
                for(var i = this.row + 1,k = this.col + 1; i <= 8 && k <= 8; ++i,++k){
                    //列数补偿
                    if((i + 1) % 2 == 0) --k;

                    if(game.map.maparr[i][k] != 1){
                        ++d4;
                    }else{
                        d4 = -1 * d4 - 1;
                        break;
                    }
                }
                this.shortarr.push(d4);

                //左下
                for(var i = this.row + 1,k = this.col - 1; i <= 8 && k >= 0; ++i,--k){
                    //列数补偿
                    if(i % 2 == 0) ++k;

                    if(game.map.maparr[i][k] != 1){
                        ++d5;
                    }else{
                        d5 = -1 * d5 - 1;
                        break;
                    }
                }
                this.shortarr.push(d5);
            }

        //检查路径数组，无障碍最短 > 相同按方向顺序 > 有障碍最长 > 相同按方向顺序
        var idx;
        var zresult = [];
        var fresult = [];

        for(var i = 0; i < this.shortarr.length; ++i){
            if(this.shortarr[i] >= 0){
                zresult.push(this.shortarr[i]);
            }else{
                fresult.push(this.shortarr[i]);
            }
        }

        if(zresult.length != 0){
            idx = Math.min.apply(null, zresult);
        }else{
            idx = Math.min.apply(null, fresult);
        }

        //todo 无路可走游戏结束
        if(idx == -1){
          this.die = true;
                game.scene.changescenen(2);
            return;
        }

        if(arguments.length != 0){
            //todo 这里用一个临时变量存储this.col值，否则提前更改col值会影响游戏判定
            var ccc = this.col;
            switch(_.indexOf(this.shortarr,idx)){
                case 0 :
                    this.move(this.row,this.col - 1);
                    break;

                case 1 :
                    //补偿
                    this.row % 2 == 0 && --ccc;
                    this.move(this.row - 1,ccc);
                    break;

                case 2 :
                    //补偿
                    this.row % 2 != 0 && ++ccc;
                    this.move(this.row - 1,ccc);
                    break;

                case 3 :
                    this.move(this.row,this.col + 1);
                    break;

                case 4 :
                    //补偿
                    this.row % 2 != 0 && ++ccc;
                    this.move(this.row + 1,ccc);
                    break;

                case 5 :
                    //补偿
                    this.row % 2 == 0 && --ccc;
                    this.move(this.row + 1,ccc);
                    break;
            }
        }
    },

    //判断是否被围
    weizhu : function(){


    },

    xunhuan : function(row,col){
        if(arguments.length == 0) row = 4,col = 4;
        //循环遍历邻近可通行的圆，如果有边界圆说明没有被围住
        //6个方向
        game.map.maparr[row][col - 1] == 0 ? this.xharr.push([row,col-1]) : this.zaarr.push([row,col-1]);

        if(row % 2 == 0){
            game.map.maparr[row - 1][col - 1] == 0 ? this.xharr.push([row - 1,col - 1]): this.zaarr.push([row -1,col-1]);
        }else{
            game.map.maparr[row - 1][col] == 0 ? this.xharr.push([row - 1,col]): this.zaarr.push([row -1,col]);
        }

        if(row % 2 == 0){
            game.map.maparr[row - 1][col] == 0 ? this.xharr.push([row - 1,col]): this.zaarr.push([row -1,col]);
        }else{
            game.map.maparr[row - 1][col + 1] == 0 ? this.xharr.push([row - 1,col +1]): this.zaarr.push([row -1,col+1]);
        }

        game.map.maparr[row][col + 1] == 0 ? this.xharr.push([row,col+1]): this.zaarr.push([row,col+1]);

        if(row % 2 == 0){
            game.map.maparr[row + 1][col] == 0 ? this.xharr.push([row + 1,col]): this.zaarr.push([row + 1,col]);
        }else{
            game.map.maparr[row + 1][col + 1] == 0 ? this.xharr.push([row + 1,col + 1]): this.zaarr.push([row + 1,col+1]);
        }

        if(row % 2 == 0){
            game.map.maparr[row + 1][col - 1] == 0 ? this.xharr.push([row + 1,col - 1]): this.zaarr.push([row + 1,col-1]);
        }else{
            game.map.maparr[row + 1][col] == 0 ? this.xharr.push([row + 1,col]): this.zaarr.push([row + 1,col]);
        }
        //去重
        var hash = {};
        var result = [];
        for(var i = 0, len = this.xharr.length; i < len; i++){
            if(!hash[this.xharr[i]]){
                result.push(this.xharr[i]);
                hash[this.xharr[i]] = true;
            }
        }
        this.xharr = result;
        //遍历边界
        for(var i = 0; i < this.xharr.length; ++i) {
            if (this.xharr[i][0] == 0 || this.xharr[i][0] == 8 || this.xharr[i][1] == 0 || this.xharr[i][1] == 8) {
                console.log(123456);
                return;
            }
        }
        //判定数组
        console.log(this.xharr);
        if(this.xharr.length < 0){
            this.lap = true; console.log("围住了"); return;
        }
        //取头
        var temp = this.xharr[0];
        this.xharr = _.rest(this.xharr);
        //自迭代
        var self = this;
        this.xunhuan.call(self,temp[0],temp[1]);
    }
});

//
//function lingju(row,col){
//    //循环遍历邻近可通行的圆，如果有边界圆说明没有被围住
//    //6个方向
//    game.map.maparr[row][col - 1] == 0 ? this.xharr.push([row,col-1]) : this.zaarr.push([row,col-1]);
//
//    if(row % 2 == 0){
//        game.map.maparr[row - 1][col - 1] == 0 ? this.xharr.push([row - 1,col - 1]): this.zaarr.push([row -1,col-1]);
//    }else{
//        game.map.maparr[row - 1][col] == 0 ? this.xharr.push([row - 1,col]): this.zaarr.push([row -1,col]);
//    }
//
//    if(row % 2 == 0){
//        game.map.maparr[row - 1][col] == 0 ? this.xharr.push([row - 1,col]): this.zaarr.push([row -1,col]);
//    }else{
//        game.map.maparr[row - 1][col + 1] == 0 ? this.xharr.push([row - 1,col +1]): this.zaarr.push([row -1,col+1]);
//    }
//
//    game.map.maparr[row][col + 1] == 0 ? this.xharr.push([row,col+1]): this.zaarr.push([row,col+1]);
//
//    if(row % 2 == 0){
//        game.map.maparr[row + 1][col] == 0 ? this.xharr.push([row + 1,col]): this.zaarr.push([row + 1,col]);
//    }else{
//        game.map.maparr[row + 1][col + 1] == 0 ? this.xharr.push([row + 1,col + 1]): this.zaarr.push([row + 1,col+1]);
//    }
//
//    if(row % 2 == 0){
//        game.map.maparr[row + 1][col - 1] == 0 ? this.xharr.push([row + 1,col - 1]): this.zaarr.push([row + 1,col-1]);
//    }else{
//        game.map.maparr[row + 1][col] == 0 ? this.xharr.push([row + 1,col]): this.zaarr.push([row + 1,col]);
//    }
//    //去重
//    var hash = {};
//    var result = [];
//    for(var i = 0, len = this.zaarr.length; i < len; i++){
//        if(!hash[this.zaarr[i]]){
//            result.push(this.zaarr[i]);
//            hash[this.zaarr[i]] = true;
//        }
//    }
//    this.zaarr = result;
//    //遍历边界
//    for(var i = 0; i < this.xharr.length; ++i) {
//        if (this.xharr[i][0] == 0 || this.xharr[i][0] == 8 || this.xharr[i][1] == 0 || this.xharr[i][1] == 8) {
//            console.log(123456);
//            return;
//        }
//    }
//    //判定数组
//    if(this.xharr.length < 0) this.lap = true; console.log("围住了"); return;
//};
//
//function panding(arr){
//    for(var i = 0; i < this.xharr.length; ++i) {
//        if (this.xharr[i][0] == 0 || this.xharr[i][0] == 8 || this.xharr[i][1] == 0 || this.xharr[i][1] == 8) {
//            console.log(123456);
//            return;
//        }
//    }
//}
