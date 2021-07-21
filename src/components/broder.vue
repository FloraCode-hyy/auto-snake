<template>
  <div class="score">
      <span>score:{{score}}</span>
      <span>highest:{{highestScore}}</span>
  </div>
  <div class="snake-border">
    <div class="mask" v-show="isdead">
      <div class="title">
          <h2>Game over</h2>
          <div v-if="ishigh">
            恭喜你获得最高分！{{score}}
          </div>
          <div v-else>
            你的成绩为 <span class="scroe">{{score}}</span>
          </div>
      </div>
    </div>
    <div class="col" v-for="(col,i) in table" :key="i">
      <span
        class="row"
        v-for="(row, j) in table[i]"
        :key="j"
        >
        <svg class="icon" aria-hidden="true" :style="table[i][j].type == 'food'?{fontSize:'100px'}:''">
        <use :xlink:href=table[i][j].icon></use>
        </svg>
      </span>
    </div>
  </div>
  <div class="button">
    <el-button round type="info" @click="start()" icon="el-icon-video-play">开始</el-button>
    <el-button round type="info" @click="startauto()" icon="el-icon-video-play">自动玩</el-button>
    <el-button round type="info" @click="pause()" icon="el-icon-video-pause">暂停</el-button>
    <el-button round type="info" @click="replay()" icon="el-icon-refresh-right">重玩</el-button>
  </div>
</template>

<script>
import Util from '../plugins/util'
import IconList from '../assets/font/icon.js'
export default {
  name: "SnakeBorder",
  props: {
    size: {
      type: Number,
    },
  },
  data() {
    return {
      snake: [ 
        { x: 4, y: 1, icon:'#icon-caterpie',type:'head'},
        { x: 3, y: 1, icon:'#icon-maomaochongmianbao',type:'body'},
        { x: 2, y: 1, icon:'#icon-maomaochongmianbao',type:'body'},
        { x: 1, y: 1, icon:'#icon-maomaochongmianbao',type:'body'}],
      food: [],
      direction: 1,
      directionFlag: 1,
      foodX: "",
      foodY: "",
      timer: "",
      isdead:false,
      table:[],
      iconNameArr:IconList.glyphs,
      num:0,
      highestScore:0,
      ishigh:false,
      bst:[],
      speed:100
    };
  },
  computed:{
    score(){
      return this.snake.length-4;
    },
  },
  watch:{
    highestScore(newValue){
      localStorage.setItem('highestScore', newValue) 
    }
  },
  created(){
      this.initTable();
  },
  mounted() {
    //初始化蛇
    this.createSnake();
    //初始化食物
    this.createFood();

    this.highestScore = localStorage.getItem('highestScore') || 0
  },
  methods: {
    sleep(mstime) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, mstime)
      })
    },
    initTable(){
          for(let i = 0; i<this.size;i++){
              let row = []
              for(let j = 0;j<this.size;j++){
                 row.push({X:i,y:j,icon:'',type:''})
              }
              this.table.push(row)
          }
    },
    start() {
      this.keyborad();
      if(this.isdead!=true){
        this.timer = setInterval(() => {
        this.moveSnake(this.direction);
        if(this.speed>30){
          this.speed = (1/this.snake.length)*400;
        }
        console.log(this.speed);
      }, this.speed);
      }
    },
    async startauto(){
      while(this.isdead!=true){
        let pathnew = this.findPath()
        for(let i = 0; i< pathnew.length; i++){
            this.moveSnake(pathnew[i])
            if(this.isdead == true){
              return
            }
            await this.sleep(30)
          }
      }
    },
    pause(){
        clearInterval(this.timer)
    },
    replay(){
        location.reload()
    },
    keyborad() {
      document.onkeydown =  (event) => {
        switch (event.code) {
          case "ArrowDown": {
            this.direction = 1;
            break;
          }

          case "ArrowUp": {
            this.direction = 3;
            break;
          }

          case "ArrowLeft": {
            this.direction = 4;
            break;
          }

          case "ArrowRight": {
            this.direction = 2;
            break;
          }

          default:
        }
      };
    },
    createFood() {
        let iconName = this.iconNameArr[Math.floor(Math.random()*25)].font_class;
        let iconitem = '#icon-'+iconName;
        this.food.push({x:Math.floor(Math.random() * 30),y:Math.floor(Math.random() * 30),icon:iconitem,type:'food'})
        for(let i = 0;i<this.food.length;i++){
        this.table[this.food[i].x][this.food[i].y].icon = this.food[i].icon
        this.table[this.food[i].x][this.food[i].y].type = this.food[i].type
        }
    },
    createSnake() {
      for (let i = 0; i < this.snake.length; i++) {
          this.table[this.snake[i].x][this.snake[i].y].type = this.snake[i].type
          this.table[this.snake[i].x][this.snake[i].y].icon = this.snake[i].icon
        }
    },
    moveSnake(direction) {
      if (Math.abs(this.directionFlag - direction) == 2) {
        direction = this.directionFlag;
      } else {
        this.directionFlag = direction;
      }
      let len = this.snake.length;
      this.foodX = this.snake[len - 1].x;
      this.foodY = this.snake[len - 1].y;
      this.table[this.snake[len-1].x][this.snake[len-1].y].icon= ''
      this.table[this.snake[len-1].x][this.snake[len-1].y].type= ''
      for (let i = len - 1; i > 0; i--) {
          this.snake[i].x = this.snake[i-1].x
          this.snake[i].y = this.snake[i-1].y
          this.table[this.snake[i].x][this.snake[i].y].icon= this.snake[i].icon
          this.table[this.snake[i].x][this.snake[i].y].type= this.snake[i].type
      }
      switch (direction) {
        case 1: {
          this.snake[0].x += 1;
          break;
        }
        case 2: {
          this.snake[0].y += 1;
          break;
        }
        case 3: {
          this.snake[0].x -= 1;

          break;
        }
        case 4: {
          this.snake[0].y -= 1;
          break;
        }
      }
      this.snakeDie();
      if(this.isdead!=true){
          this.table[this.snake[0].x][this.snake[0].y].icon = this.snake[0].icon
      }
      this.eatFood();
    },
    eatFood(){
       for(let i = 0;i<this.food.length;i++){
           if(this.snake[0].x==this.food[i].x&&this.snake[0].y==this.food[i].y){
            this.snake.push({x:this.foodX,y:this.foodY,icon:'#icon-maomaochongmianbao',type:'body'})
            this.food.splice(i,1)
            this.table[this.foodX][this.foodY].icon = '#icon-maomaochongmianbao'
            this.table[this.foodX][this.foodY].icon = 'body'
            this.createFood()
        }
       }

    },
    snakeDie() {
      if (
        this.snake[0].x < 0 ||
        this.snake[0].x >= this.size||
        this.snake[0].y < 0 ||
        this.snake[0].y >= this.size
      ) {
        if(this.score>this.highestScore){
          this.highestScore = this.score;
          this.ishigh =true
        }
        this.isdead = true
        clearInterval(this.timer);
        return
      }
      for(let i=1;i<this.snake.length;i++){
        if(this.snake[0].x === this.snake[i].x && this.snake[0].y==this.snake[i].y){
          if(this.score>this.highestScore){
          this.highestScore = this.score;
          this.ishigh =true
        }
          this.isdead = true
          clearInterval(this.timer)
          return
      }
      }
    },
    findPath(){
      let headpos = [this.snake[0].x,this.snake[0].y]
      let foodpos = [this.food[0].x,this.food[0].y]
      let path = [];
      let perfectPath = this.findPerfectNode(headpos,foodpos);
      for(let i= 0;i<perfectPath.length - 1;i++){
        path.push(this.findDirection(perfectPath[i].pos,perfectPath[i+1].pos))
      }
      return path;
    },
    findDirection(pos1,pos2){
      if(pos1[1]===pos2[1]){
        if(pos1[0]-pos2[0]==1){
          return 3 
      }else{
        return 1
      }
      }
      if(pos1[0]===pos2[0]){
        if(pos1[1]-pos2[1]==1){
          return 4
        }else{
          return 2
        }
      }
    },
    posEquals(pos1,pos2){
        if(pos1[0]==pos2[0]&&pos1[1]==pos2[1]) return true;
        return false;
    },
    findPerfectNode(startNode,findNode){
        let perfectNode
        var pos
        let perfectPath1 = []
        this.bst = []
        this.putBST(startNode,findNode);
        while(this.bst.length != 0 ){
            perfectNode = this.returnMinNode();
            perfectPath1.push(perfectNode)
            pos = perfectNode.pos;
            this.bst = [];
            //将该节点周围四个节点加入bst
            this.putBST([pos[0],pos[1]-1],findNode,perfectNode);//上
            this.putBST([pos[0],pos[1]+1],findNode,perfectNode);//下
            this.putBST([pos[0]-1,pos[1]],findNode,perfectNode);//左
            this.putBST([pos[0]+1,pos[1]],findNode,perfectNode);//右
            if(this.posEquals(pos,findNode)){
                //已经找到
                break;
            }
        }
        if(perfectNode==null||!this.posEquals(perfectNode.pos,findNode)){
            Util.log("查找失败！");
            return;
        }
        return perfectPath1
    },
    returnMinNode(){
      let minValue = this.bst[0].value
      let index = 0
      for(let i = 1; i<this.bst.length;i++){
        if(this.bst[i].value < minValue){
          minValue = this.bst[i].value
          index = i
        }
      }
      let minNode = this.bst[index]
      this.bst.splice(index,1)
      return minNode
    },
    putBST(startNode,findNode,parent) {
        var x = startNode[0],y = startNode[1];
        if(x<0||x>=this.size||y<0||y>=this.size) return;
        var d = {
            parent:parent,
            pos:startNode,
            value:this.calcGH(startNode,findNode)
        }
        this.bst.push(d);
    },
    calcGH(src,des){//A*计算GH值
        var x = src[0],y=src[1];
        if(x<0||x>=this.size||y<0||y>=this.size) return;
        x = des[0],y=des[1];
        if(x<0||x>=this.size||y<0||y>=this.size) return;
        return Math.abs(src[0]-des[0])+Math.abs(src[1]-des[1]);
    },
  },

};
</script>

<style>
.icon {
    width:100%; 
    height: 100%;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: 50px;
}
.row {
  flex: 1;

}
.col {
  display: flex;
  height: 100%;

  height: 25px;
}
.snake-border {
    position: relative;
    margin: 0 auto;
    width: 750px;
    border: solid 1px #333;
}
.active {
  background-color: #E6A23C;
  border-radius: 10px;
}
.button {
    display: flex;
    margin: 10px auto;
    width: 600px;
}
.button .el-button{
  flex: 1;
  margin: 0 5px;
  font-size: 25px;
}
.mask{
    position:absolute;
    display: flex;
    top: 0;
    left: 0;
    z-index: 99;
    background-color:rgba(0, 0,0,.7);
    height: 100%;
    width: 100%;
    text-align: center;
    font-size: 30px;
    color: #F56C6C;
}
.title{
    justify-content: center;
    align-items: center;
    margin: auto;
}
.title h2 {
    font-size: 50px;
}
.scroe {
    font-size: 26px;
    font-weight: bolder;
}
.score{
    display: flex;
    width: 750px;
    margin: 5px auto;

}
.score span{
    flex: 1;
    font-size: 25px;
}
</style>