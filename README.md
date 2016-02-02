# 《Game2048》

## 简介

合并相同数字的方块获取得分。当合并出2048时，赢得游戏胜利；否则当满格后且不能再合并时，游戏结束。

在PC端使用“上 下 左 右”键进行游戏，手机端滑动触屏进行游戏。

适配iPhone 6以及 iPhone 6 puls。

## 页面展示

游戏主页面：

![](https://github.com/dorkpon/Game2048/raw/master/readmePic/home.png)

## 使用的框架

jQuery

## 项目结构

- `index.html`
 
    - 主要结构由得分区`score_container`和游戏区`game_container`构成。
 
- 2048.css
- 2048.js

## 算法思路  功能实现

### 1. 2048.js

#### 构造函数构建对象：`Game2048`

- 私有成员
- 原型方法

#### 私有成员：

- 游戏区格子内的数字矩阵：`gameGrid[][]`;
- 得分记录
    - 目前得分总计：`score`;
    - 每次合并加分：`scoreAdd`;
    - 最高得分总计：`bestScore`;
    - 基于最高分数的得分加分：`bestScoreAdd`;
- 标记数字出现时(Appear)或者合并时闪烁(Blink)的效果：`flag[][]`;
- 标记方块是否移动过：`slide`;
- 触屏事件手指移动的起始终止的坐标位置：`startX`, `startY`, `endX`, `endY`;

#### 原型方法：

**(1)`Game2048.prototype.flagInit`: 初始化flag矩阵**

即return 一个全为0的二维矩阵。

**(2)`Game2048.prototype.restartInit`: 游戏重新开始初始化**

- gameGrid[][]初始化；
- flag[][]初始化；
- 得分记录`this.score`的初始化；
- game_container的每个div DOM初始化：
```js
$(".game_container div").eq(indexNum).removeClass().html("");
```
- score_container的scores DOM初始化：
```js
$(".score_container .scores").html(this.score);
```

**(3)`Game2048.prototype.init`: 游戏开始初始化：**

- 调用两次生成随机数的方法random()生成随机数及数所在位置；
- 操作game_container的div DOM 添加数字出现(Appear)的css样式：
```js
$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j] + '_Appear').html(this.gameGrid[i][j]);
```

**(4)`Game2048.prototype.randomNum`: 生成随机数和随机位置**

① 生成随机数

- `Math.ceil()`: 对数字向上取整；
- `Math.random()`: 随机生成0~1之间的小数；

那么我们用`rand = Math.ceil(Math.random() * 4)`就可以生成[1, 2, 3, 4]内的随机数；

② 生成随机位置

`Math.floor()`: 对数字向下取整；

那么坐标 x, y 均可用`Math.floor(Math.random() * 4)`随机生成一个[0, 1, 2 ,3]内的随机数；

综合 ①②：
```js
if (this.gameGrid[x][y] == 0) { //判定随机位置无数值时
	this.gameGrid[x][y] = rand; //随机位置生成随机数
	this.flag[x][y] = 2; //标识该数值得样式为 出现Appear样式
}
```

**(5)`Game2048.prototype.touchOrKeypress`: 判断是触屏事件还是键盘事件**

① 触屏监听事件`addEventListener: touchstart, touchmove, touchend`

每一个事件都禁止屏幕滚动：
```js
event.prevent.Default();
```

获取起始位置：

```js
this.startX = event.touches[0].clientX;
this.startY = event.touches[0].clientY;	
```
终止位置：

```js
this.endX = event.changedTouches[0].clientX;
this.endY = event.changedTouches[0].clientY;
```
坐标：

```js
var x = this.endX - this.startX;
var y = this.endY - this.startY;
```

判定方向取 `|x| > 3 or |y| > 3` (不取0而是3的原因是为了防止抖动)

- `|x| < |y| && y < 0`: 上移moveUp();
- `|x| < |y| && y > 0`: 下移moveDowm();
- `|x| > |y| && x < 0`: 左移moveLeft();
- `|x| > |y| && x > 0`: 右移moveRight();

② 键盘监听事件`addEventListener: keydowm`

键盘字符 W S A D 的 ASCII 码分别对应为 87 83 65 68；

```js
switch (event.which) {
	case 65:
		_self.moveLeft();
		break;
	case 87:
		_self.moveUp();
		break;
	case 68:
		_self.moveRight();
		break;
	case 83:
		_self.moveDowm();
		break;
	default:
		console.log("not right");
}
```

**(6)`Game2048.prototype.showNum`: 显示数值（将逻辑结果输出至web页面html的DOM上）**

① 判定`.game_container div`是数字的出现样式(Appear)、数字合并的闪烁样式(Blink)、有数字无样式、无数字无样式

其中数字由`gameGrid[][]`标记，样式由`flag[][]`(0 为无样式，1 为 Blink，2 为 Appear)标记

```js
if (this.gameGrid[i][j] != 0 && this.flag[i][j] == 0) { //有数字但是无样式
	$(".game_container div").eq(indexNum).removeClass();
	$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j]).html(this.gameGrid[i][j]);
} else if (this.gameGrid[i][j] != 0 && this.flag[i][j] == 1) { //有数字且为闪烁Blink样式
	$(".game_container div").eq(indexNum).removeClass();
	$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j] + '_Blink').html(this.gameGrid[i][j]);
} else if (this.gameGrid[i][j] != 0 && this.flag[i][j] == 2) { //有数字且为出现Appear样式
	$(".game_container div").eq(indexNum).removeClass();
	$(".game_container div").eq(indexNum).addClass('Num' + this.gameGrid[i][j] + '_Appear').html(this.gameGrid[i][j]);
} else {
	$(".game_container div").eq(indexNum).removeClass().html("");
}
```

② `.score_container .scores`和`.score_container .bestScore`显示分数

- 首先显示目前分数score
```js
$(".score_container .scores").html(this.score);
```
- 判定是否合并有加分，有则添加加分的动画效果
```js
if (this.scoreAdd != 0) { //有加分，则添加一支带动画效果的DOM
	$(".score_container .scores").append('<div class="score-addition">+' + this.scoreAdd + '</div>');
	this.bestScoreAdd = this.scoreAdd; //便于下一步判定是基于最高分数加分
	this.scoreAdd = 0;
	setTimeout(function() { // 动画效果600ms结束后移除该DOM
		$(".scores .score-addition").remove()
	}, 600);
}
```
- 判定是否是基于最高分数的加分，有则添加加分的动画效果
```js
if (this.bestScore <= this.score && this.bestScoreAdd != 0) { //最高分数小于目前分数且有加分
	this.bestScore = this.score;
	$(".score_container .bestScore").html(this.bestScore);
	$(".score_container .bestScore").append('<div class="score-addition">+' + this.bestScoreAdd + '</div>');
	this.bestScoreAdd = 0;
	setTimeout(function() {
		$(".bestScore .score-addition").remove()
	}, 600);
}
```
- 调用`flagInit()`初始化flag矩阵(这一步很重要，否则下一次显示样式就乱套了)

**(7)`Game2048.prototype.moveUp`, `Game2048.prototype.moveDown`, `Game2048.prototype.moveLeft`, `Game2048.prototype.moveRight`: 上下左后的移动方法**

由于四种方法类似，我们不妨只看上移`Game2048.prototype.moveUp`的方法

① 上移

由于遍历一次gameGrid矩阵只能移动一次，但是移动的时候按3步的最大移动步长来算，我们需要3次遍历，故需要三次循环
```js
var m = 3; // 3步的最大移动步长
while (m > 0) {
	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 4; j++) {
			if (this.gameGrid[i][j] == 0 && this.gameGrid[i + 1][j] != 0) { //如果该元素部位0且其下方的元素不为0，则下方元素向上移动1步
				this.gameGrid[i][j] = this.gameGrid[i + 1][j];
				this.gameGrid[i + 1][j] = 0;
				this.slide = true;
			}
		}
	}
	m--;
}
```

② 合并

遍历gameGrid矩阵，若上下元素相等，则合并且加分
```js
for (var i = 0; i < 3; i++) {
	for (var j = 0; j < 4; j++) {
		if (this.gameGrid[i][j] != 0 && this.gameGrid[i][j] == this.gameGrid[i + 1][j]) {
			this.gameGrid[i][j] *= 2; //乘2合并
			this.scoreAdd = this.gameGrid[i][j]; //加分为合并后的数值
			this.gameGrid[i + 1][j] = 0;
			this.score += this.scoreAdd; //分数累加
			this.slide = true; //滑动标志
			this.flag[i][j] = 1; //标记该数值的样式为 闪烁Blink
		}
	}
}
```

③ 合并后的进一步上移

合并后，若下方还有数字，则需要继续上移，也是三次循环

```js
for (var j = 0; j < 4; j++) {
	for (var n = 0; n < 2; n++) {
		for (var i = 0; i < 3; i++) {
			if (this.gameGrid[i][j] == 0 && this.gameGrid[i + 1][j] != 0) {
				this.gameGrid[i][j] = this.gameGrid[i + 1][j];
				this.gameGrid[i + 1][j] = 0;
				if (this.flag[i + 1][j] == 1) { //这里很重要的一个点就是数值的样式标志需要跟着上移
					this.flag[i][j] = 1;
					this.flag[i + 1][j] = 0;
				}
			}
		}
	}
}
```

④ 发生移动后需要产生新的随机数

判定滑动标志`slide`为真后，调random()方法随机位置生成随机数，再把标志置为false

```js
if (this.slide) { 
	this.randomNum(); 
	this.slide = false;
}
```

⑤ 调showNum()将逻辑结果输出至web页面html的DOM上，判定游戏是否结束gameOver()

```js
this.showNum();
this.gameOver();
```
其他方向的移动类似，不再赘述

**(8)`Game2048.prototype.gameOver`: 游戏结束处理方法**

- 首先遍历矩阵是否出现2048，判定是否赢得游戏；

- 然后判定元素是否满格且不能再合并；

这里采用横向和纵向各遍历一次的方法去比对

```js
var xCount = 0;
var yCount = 0;
for (var i = 0; i < 4; i++) {
	for (var j = 0; j < 3; j++) {
		if ((this.gameGrid[i][j] != 0) && (this.gameGrid[i][j + 1] != 0) && (this.gameGrid[i][j] != this.gameGrid[i][j + 1])) { //横向向右两两元素不为0且左右比对不相等
			xCount++;
		}
	}
}

for (var j = 0; j < 4; j++) {
	for (var i = 0; i < 3; i++) {
		if ((this.gameGrid[i][j] != 0) && (this.gameGrid[i + 1][j] != 0) && (this.gameGrid[i][j] != this.gameGrid[i + 1][j])) { //纵向向下两两元素不为0且比对不相等
			yCount++;
		}
	}
}

if (xCount == 12 && yCount == 12) { 
	alert("Game Over! Please click the \"Restart\" button to restart the Game2048!")
}
```

### 2. 2048.css

- 加分动画样式

```
@-webkit-keyframes 'scoreAddition' {
    from {
        opacity: 1;
        top: 25px;
    }
    to {
        opacity: 0;
        top: -25px;
    }

}
.scores .score-addition, .bestScore .score-addition {
    position: absolute;
    right: 37px;
    color: red;
    font-size: 25px;
    line-height: 25px;
    font-weight: bold;
    color: rgba(119, 110, 101, 0.9);
    z-index: 100;
    -webkit-animation: scoreAddition 600ms ease-in;
}
```

- 闪烁Blink和出现Appear的动画样式

```
@-webkit-keyframes 'numBlink' {
    from {
        opacity: 1;
        -webkit-transform: scale(1);
    }
    50% {
        opacity: 0.9;
        -webkit-transform: scale(1.2);
    }
    to {
        opacity: 1;
        -webkit-transform: scale(1);
    }
}

@-webkit-keyframes 'numAppear' {
    from {
        opacity: 0.6;
        -webkit-transform: scale(0.6);
    }
    to {
        opacity: 1;
        -webkit-transform: scale(1);
    }
}

.game_container .Num2_Blink {
    background: #eee4da;
    -webkit-animation-name: numBlink;
    -webkit-animation-duration: 1s;
    -webkit-animation-iteration-count: 2;
}
.game_container .Num2_Appear {
    background: #eee4da;
    -webkit-animation-name: numAppear;
    -webkit-animation-duration: 400ms;
    -webkit-animation-iteration-count: 1;
}
```

- 屏幕适配
```
@media screen and (max-width: 520px) { ... }
```




