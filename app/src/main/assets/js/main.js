var board=new Array();
var score=0;
var hasConflicted=new Array();

var startX=0;
var startY=0;
var endX=0;
var endY=0;

$(document).ready(function(){
    prepareForMobile();
    newGame();
    score=0;
    updateScore(score);
})

$(document).keydown(function(event){
    switch(event.keyCode){
        case 37://left
            event.preventDefault()
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 38://up
            event.preventDefault()
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 39://right
            event.preventDefault()
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
        case 40://down
            event.preventDefault()
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
            break;
    }
})

document.addEventListener('touchstart',function(event){
    startX=event.touches[0].pageX;
    startY=event.touches[0].pageY;
})

document.addEventListener('touchmove',function(event){
    event.preventDefault()
})

document.addEventListener('touchend',function(event){
    endX=event.changedTouches[0].pageX;
    endY=event.changedTouches[0].pageY;

    var deltaX=endX-startX;
    var deltaY=endY-startY;

    if(Math.abs(deltaX)<0.3*documentWidth && Math.abs(deltaY)<0.3*documentWidth)
        return;

    //x轴进行滑动
    if(Math.abs(deltaX)>=Math.abs(deltaY)){
        if(deltaX>0){
            //move right
            if(moveRight()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }else{
            //move left
            if(moveLeft()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }

        }
    }
    //y轴进行滑动
    else{
        if(deltaY>0){
            //move down
            if(moveDown()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }else{
            //move up
            if(moveUp()){
                setTimeout("generateOneNumber()",210);
                setTimeout("isGameOver()",300);
            }
        }
    }
})

$("#bot").click(function(){
    score=0;
    updateScore(score)
})

function prepareForMobile(){
    if(documentWidth>500){
        gridContainerWidth=500;
        cellSpace=20;
        cellSideLength=100;
    }
    
    $("#main").css("width",gridContainerWidth-2*cellSpace);
    $("#main").css("height",gridContainerWidth-2*cellSpace);
    $("#main").css("padding",cellSpace);
    $("#main").css("border-radius",0.01*gridContainerWidth);
    
    $(".main-box").css("width",cellSideLength);
    $(".main-box").css("height",cellSideLength);
    $(".main-box").css("border-radius",6);
}

function newGame(){
    //初始化棋盘格
    init();
    //随机生成两个数字
    generateOneNumber();
    generateOneNumber();
}

function init(){
    for(var i=0;i<4;i++){
        for(var j=0;j<4;j++){
            var gridCell=$("#box-"+i+"-"+j)
            gridCell.css("top",getPosTop(i,j))
            gridCell.css("left",getPosLeft(i,j))
        }
    }
    
    for(var i=0;i<4;i++){
        board[i]=new Array();
        hasConflicted[i]=new Array();
        for(var j=0;j<4;j++){
            board[i][j]=0;    
            hasConflicted[i][j]=false;    
        }
    }
    updateBoardView();
    
    score=0;
}

function updateBoardView(){
    $(".number-cell").remove();
    for(var i=0; i<4;i++){
        for(var j=0;j<4;j++){
            $("#main").append('<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>')
            var theNumberCell=$('#number-cell-'+i+'-'+j)
            
            if(board[i][j]==0){
                theNumberCell.css({"width":"0","height":"0"})
                theNumberCell.css("top",getPosTop(i,j)+cellSideLength/2)
                theNumberCell.css("left",getPosLeft(i,j)+cellSideLength/2)
            }else{
                theNumberCell.css('width',cellSideLength);
                theNumberCell.css('height',cellSideLength);
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color',getNumberBackgroundColor( board[i][j] ) );
                theNumberCell.css('color',getNumberColor( board[i][j] ) );

                theNumberCell.text( getNumberText( board[i][j] ) );
                
            }
            hasConflicted[i][j]=false;    
        }
        $(".number-cell").css("line-height",cellSideLength+"px");
        $(".number-cell").css("font-size",0.3*cellSideLength+"px");
    }
}

function generateOneNumber(){
    if(noSpace(board))
        return false;
    //随机一个位置
    var randX=parseInt(Math.floor(Math.random()*4));
    var randy=parseInt(Math.floor(Math.random()*4))
    
    var times=0;
    while(times<50){
        if(board[randX][randy]==0)
            break;
            
        randX=parseInt(Math.floor(Math.random()*4));
        randy=parseInt(Math.floor(Math.random()*4))
        
        times++;
    }
    if(times==50){
        for(var i=0;i<4;i++)
            for(var j=0; j<4; j++){
                if(board[i][j]==0){
                    randX=i;
                    randy=j;
                }
        }
    }
    //随机一个数字
    var randNumber=Math.random()<0.5? 2:4;
    //在随机的位置上显示数字
    board[randX][randy]=randNumber;
    showNumberWithAnimation(randX,randy,randNumber)
    return true;
    
}

function isGameOver(){
    if(noSpace(board) && noMove(board)){
        showGameOver();
    }
}

function showGameOver(){
    $(".over").show();
    $(document).click(function(){
        $(".over").hide()
    })
}