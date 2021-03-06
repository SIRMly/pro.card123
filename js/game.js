/**
 * Created by SIRMly on 2017/5/23.
 */

$(function(){
    var click = "ontouchstart" in document.documentElement ? "touchstart" : "click";
    var imgs = [
        "img/0.png",
        "img/1.png",
        "img/2.png",
        "img/3.png",
        "img/4.png",
        "img/5.png",
        "img/6.png",
        "img/7.png",
        "img/5yuan.png",
        "img/10.png",
        "img/20.png",
        "img/again-btn.png",
        "img/arrow.png",
        "img/bomb.png",
        "img/fire.png",
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
        "img/reward1.png",
        "img/reward2.png",
        "img/reward3.png",
        "img/reward-btn.png",
        "img/rope.png",
        "img/state.png",
        "img/success-flag.png",
        "img/time-num.png",
        "img/timer-bg.png",
        "img/rules.png"
    ];
    var proBox = $("#progress");
    var pages = $(".page");
    var gamePage = $("#game-center");

    preload(imgs,proBox);
    function preload(imgs,proBox){
        var proNum          = 0,
            count           = imgs.length,
            proPercentage   = 0;
        for(var i in imgs){
            var newImg = new Image();
            newImg.src = imgs[i];
            newImg.onload = function (){
                proNum++;
                proPercentage = Math.floor(proNum/count*100);
                if(proNum>=count){
                    proPercentage=100;
                    proBox.addClass("hide");
                    $(".page1").removeClass("hide");
                }
                $("#progressNum").html(proPercentage+"%");
            }
        }
    }
    $("#rules").on(click, function (){
        $(this).empty().remove();
        $("#page1-btn").addClass("page1-btn-move");
        $("#page1-word").addClass("page1-word-move");
    });
    var tab = $(".tab"),
        tabShow = $(".tab-show");
    tab.each(function (index,item){
        $(this).on(click, function (){
            $(this).addClass("active").siblings(".tab").removeClass("active");
            tabShow.eq(index).siblings(".tab-show").addClass("hide");
            tabShow.eq(index).removeClass("hide");
        });
    });
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
       $("#explain").removeClass("hide").stop().animate({
            width : "100%",
            height : "100%"
        },300);
    });
    explainClose.on(click, function (){
        $("#explain").stop().animate({
            width : "0",
            height : "0"
        },300, function (){
            $("#explain").addClass("hide");
        });
    });
    page1Explain.on(click, function (){
       $("#page1-state").removeClass("hide").stop().animate({
           width : "100%",
           height : "100%"
       },300);
    });
    page1Close.on(click, function (){
        $("#page1-state").stop().animate({
            width : "0",
            height : "0"
        },300, function (){
            $("#page1-state").addClass("hide");
        });
    });
    rewardBtn.on(click, function (){
        $("#success").addClass("hide");
        $("#fail").removeClass("hide");
    });
    homeBtn.on(click, function (){
        pages.addClass("hide");
        $("#crash,#crashes>div").addClass("hide");
        $(".page1").removeClass("hide");
        $(".card").removeClass("cardRotate");
        $(".card").removeClass("cardRotateBack");
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
            this.time = 600;
            this.timeText = "60.0s";
            this.winTime = 0;
            this.gameOn();
            this.number1=6;
            this.number2=0;
            this.number3=0;
            game.number1Dom.css("background-position-x",game.numberArray[game.number1]+"%");
            game.number2Dom.css("background-position-x",game.numberArray[game.number2]+"%");
            game.number3Dom.css("background-position-x",game.numberArray[game.number3]+"%");
            $(".time-flag").removeClass("flag-hide");
            $("#rope").css({
                "width" : "77.6vw",
                "transition" : "width 0s"
            });
            $("#fire").removeClass("fireMove").css("transform","translate(0,0)");
        },
        number1Dom : $("#number1"),
        number2Dom : $("#number2"),
        number3Dom : $("#number3"),
        numberArray : [87,1,10.5,20,29.5,39,48.5,58,67.5,77.5],
        cardNum : 16,
        doubleNum : 8,
        cards : $(".card"),
        pics : $(".pic"),
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
                            /*==全部对==*/
                            if(game.successNum==game.doubleNum){
                                clearInterval(game.timer);
                                setTimeout(function (){
                                    game.winTime = 600-game.time;
                                    if(game.winTime<=200){
                                        $("#reward-number").removeClass("hide");
                                        $("#crashes,#success").removeClass("hide");
                                        if(game.winTime<=50){
                                            $("#fail-img").attr({
                                                "src":"img/reward1.png",
                                                "width" : "100%"
                                            });
                                        }else if (game.winTime<=100){
                                            $("#fail-img").attr({
                                                "src":"img/reward2.png",
                                                "width" : "100%"
                                            });
                                        }else(game.winTime<=200)
                                        {
                                            $("#fail-img").attr({
                                                "src": "img/reward3.png",
                                                "width": "100%"
                                            });
                                        }
                                    }else{
                                        /*==失败==*/
                                        $("#fail-img").attr({
                                            "src":"img/fail-flag.png",
                                            "width" : "100%"
                                        });
                                        $("#reward-number").addClass("hide");
                                        $("#crashes,#fail").removeClass("hide");

                                    }
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
            var rope = $("#rope");
            $("#fire").addClass("fireMove");
            game.timer = setInterval(function (){
                if(game.time>0){
                    game.time--;
                    game.number1 = Math.floor(game.time/100);
                    game.number2 = Math.floor((game.time-game.number1*100)/10);
                    game.number3 = game.time-(Math.floor(game.time/10)*10);
                    game.number1Dom.css("background-position-x",game.numberArray[game.number1]+"%");
                    game.number2Dom.css("background-position-x",game.numberArray[game.number2]+"%");
                    game.number3Dom.css("background-position-x",game.numberArray[game.number3]+"%");
                    game.gameText = Math.floor(game.time/10)+ "." + Math.floor(game.time%10) + "s";
                    rope.css({
                        "width" : "57vw",
                        "transition" : "width 5s linear"
                    });
                    if(game.time <= 550){
                        $(".flag20").addClass("flag-hide");
                        rope.css({
                            "width" : "41vw",
                            "transition" : "width 5s linear"
                        });
                    }
                    if(game.time <= 500){
                        $(".flag10").addClass("flag-hide");
                        rope.css({
                            "width" : "21vw",
                            "transition" : "width 10s linear"
                        });
                    }
                    if(game.time <= 400){
                        $(".flag10").addClass("flag-hide");
                        rope.css({
                            "width" : "4vw",
                            "transition" : "width 40s linear"
                        });
                        $(".flag5").addClass("flag-hide");
                    }
                } else{
                    /*==超时==*/
                    clearInterval(game.timer);
                    $("#fail-img").attr({
                        "src":"img/fail-flag.png",
                        "width" : "80%"
                    });
                    $("#reward-number").addClass("hide");
                    $("#crashes,#fail").removeClass("hide");
                }
            },100)
        }
    };



});