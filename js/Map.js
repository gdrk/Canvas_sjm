var Map = Class.extend({
   init : function(){
      //地图9*9二维数组,0为初始圆，1为障碍圆，猫为2
       this.maparr = [
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0],
           [0,0,0,0,0,0,0,0,0]
       ];

        //随机障碍
       this.rd = _.random(6,15);
       for(var i = 0; i <= this.rd; ++i) this.maparr[_.random(0,8)][_.random(0,8)] = 1;

       this.maparr[4][4] = 2;
   },
    //change maparr
    change : function(row,col,type){
        if(col < 0 || col > 8 || row < 0 || row >8) return;
        if(typeof(type) == "undefined") type = 1;
        this.maparr[row][col] = type;
    },

    //地图渲染，点击后传入行列号
    render : function(row,col){
        //检测参数是否是underfind
        if(typeof(row) != "undefined") this.maparr[row][col] = 1;

        //渲染地图，确定圆为32 * 32 ，左上第一个圆x/y 为 20,180，列间隔2，奇数行右移一个半径16
        for(var i = 0; i < 9; ++i){
            for(var k = 0; k < 9; ++k){
                if(i % 2 == 0){
                    game.ctx.drawImage(game.img["pot1"],0,0,45,45,20 + k * (32 + 2),180 + i * 32,32,32);
                    if(this.maparr[i][k] == 1) game.ctx.drawImage(game.img["pot2"],0,0,45,45,20 + k * (32 + 2),180 + i * 32,32,32);
                }else{
                    game.ctx.drawImage(game.img["pot1"],0,0,45,45,36 + k * (32 + 2),180 + i * 32,32,32);
                    if(this.maparr[i][k] == 1) game.ctx.drawImage(game.img["pot2"],0,0,45,45,36 + k * (32 + 2),180 + i * 32,32,32);
                }
            }
        };

        //渲染猫
        game.cat.render();
    }
});