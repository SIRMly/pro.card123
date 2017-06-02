/**
 * Created by SIRMly on 2017/5/23.
 */

$(function(){
    var click = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    //document.ontouchmove = function (e){
    //    e.preventDefault();
    //};
    var imgs = [
        "img/0.png",
        "img/1.png",
        "img/2.png",
        "img/3.png",
        "img/4.png",
        "img/5.png",
        "img/6.png",
        "img/7.png",
        "img/again-btn.png",
        "img/concern-btn.png",
        "img/continue-btn.png",
        "img/crash-bg.png",
        "img/fail-flag.png",
        "img/head.png",
        "img/home-btn.png",
        "img/page1-bg.jpg",
        "img/page1-btn.png",
        "img/page1-notice.png",
        "img/page1-word.png",
        "img/pic.png",
        "img/rank-btn.png",
        "img/reward-btn.png",
        "img/state.png",
        "img/success-flag.png",
        "img/timer-bg.png"
    ];
    var proBox = $("#progress");
    var pages = $(".page");
    var gamePage = $("#game-center");

    preload(imgs,proBox);
    function preload(imgs,proBox){
        var proNum   = 0,
            count    = imgs.length;
        for(var i in imgs){
            var newImg = new Image();
            newImg.src = imgs[i];
            console.log( newImg.src);
            newImg.onload = function (){
                proNum++;
                if(proNum>=count){
                    proBox.addClass("hide");
                    $(".page1").removeClass("hide");
                }
            }
        }
    }
    var tab = $(".tab"),
        tabShow = $(".tab-show");
    var startBtn = $("#page1-btn"),
        againBtn = $(".again-btns"),
        explainBtn  = $(".explain-btn"),
        rewardBtn = $("#reward-btn"),
        homeBtn = $("#home-btn"),
        explainClose  = $("#close"),
        page1Explain = $("#page1-notice"),
        page1Close = $("#close-page1-btn");

    startBtn.on(click, function () {
        game.init();
    });
    againBtn.on(click, function () {
        $(".card").removeClass("cardRotate");
        $(".card").removeClass("cardRotateBack");
        game.init();
    });
    explainBtn.on(click, function (){
       $("#explain").removeClass("hide");
    });
    explainClose.on(click, function (){
       $("#explain").addClass("hide");
    });
    page1Explain.on(click, function (){
       $("#page1-state").removeClass("hide");
    });
    page1Close.on(click, function (){
       $("#page1-state").addClass("hide");
    });
    rewardBtn.on(click, function (){
        $("#success").addClass("hide");
        $("#fail-img").attr({
            "src":"img/reward1.png",
            "width" : "100%"
        });
        $("#fail").removeClass("hide");
    });
    tab.each(function (index,item){
        $(this).on(click, function (){
            tabShow.eq(index).siblings(".tab-show").addClass("hide");
            tabShow.eq(index).removeClass("hide");
        });
    });
    homeBtn.on(click, function (){
        pages.addClass("hide");
        $("#crash,#crashes>div").addClass("hide");
        $(".page1").removeClass("hide");
    });



    var game = {
        init : function () {
            $("#crashes,#crashes>div").addClass("hide");
            pages.addClass("hide");
            gamePage.removeClass("hide");
            this.pics.removeClass("trans");
            this.pics.off(click);
            this.eachNum = 0;
            this.successNum = 0;
            this.time = 300;
            this.timeText = "60.0s";
            this.gameOn();
            this.timeBox.html(this.timeText);
        },
        cardNum : 16,
        doubleNum : 8,
        cards : $(".card"),
        pics : $(".pic"),
        timeBox : $(".title-time"),
        failArr: [],
        gameOn : function (){
            /*==图片数组==*/var that = this;
            var cardArray = new Array(this.cardNum);
            for(var i=0; i<cardArray.length; i++){
                cardArray[i] = Math.floor(i/2);
            }
            /*===打乱==*/
            cardArray.sort(this.numberRandom);
            console.log(cardArray);
            /*==添加图片==*/
            for(var i=0; i<cardArray.length; i++){
                this.cards.eq(i).css({
                    "background" : "url('img/"+ cardArray[i] +".png') center center  no-repeat ",
                    "background-size" : "contain"
                });
                this.pics.eq(i).attr("data-num",cardArray[i]);
            }
            /*==图片添加完成==*/
            //$("#crashes,#crashes>div").addClass("hide");
            $("#game-center").removeClass("hide");
            this.cards.addClass("cardRotate");
            this.pics.addClass("trans");
            setTimeout(function (){
                game.pics.removeClass("trans");
                game.play();
            },3000);
        },
        numberRandom : function (){
            return Math.random() > 0.5 ? 1 :-1;
        },
        play : function (){
            /*==计时==*/
            this.timeStart();
            /*==绑定点击函数==*/
            $.each(this.pics, function (){
                $(this).on(click, function (){
                    $(this).addClass("trans");
                    if(game.failArr.length>0){
                        /*==之前不对的转过去==*/
                        game.failArr[0].removeClass("trans");
                        game.failArr[1].removeClass("trans");
                        game.failArr = [];
                    }
                    if(game.eachNum === 0){
                        game.presentNum = $(this).attr("data-num");
                        game.card1 = $(this);
                        game.box1 = $(this).parent();
                        game.eachNum = 1;
                    }else{
                        game.card2 = $(this);
                        game.box2 = $(this).parent();
                        if($(this).attr("data-num") == game.presentNum){
                            /*==成功一对==*/
                            game.box1.addClass("cardRotateBack");
                            game.box2.addClass("cardRotateBack");
                            game.successNum++;
                            if(game.successNum==game.doubleNum){
                                clearInterval(game.timer);
                                setTimeout(function (){
                                    $("#crashes,#success").removeClass("hide");
                                    $("#yourTime").text((600-game.time)/10+"s");
                                },500);
                            }
                        }else{
                            game.failArr[0] = game.card1;
                            game.failArr[1] = game.card2;
                        }
                        game.eachNum = 0;
                    }

                });
            });
        },
        timeStart : function (){
            game.timer = setInterval(function (){
                if(game.time>0){
                    game.time--;
                    game.gameText = Math.floor(game.time/10)+ "." + Math.floor(game.time%10) + "s";
                    game.timeBox.html(game.gameText);
                } else{
                    clearInterval(game.timer);
                    $("#fail-img").attr({
                        "src":"img/fail-img.png",
                        "width" : "80%"
                    });
                    $("#crashes,#fail").removeClass("hide");
                }
            },100)
        }
    };



});