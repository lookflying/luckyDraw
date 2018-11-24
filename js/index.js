//抽奖人员名单
var maxNum= 600
var timer3

function display10s(prizeLabel) {
    var delay = 10000
    clearTimeout(timer3)
    console.log("clearTimeout and restart timeout")
    timer3 = setTimeout(function () {
        console.log("timeout show result")
        $("#luckyDrawing").fadeOut();
        var luckyDrawNum = prizeCount[prizeLabel];
        $("#result").fadeIn().find("div").removeClass().addClass("p" + luckyDrawNum);//隐藏输入框，显示中奖框
        $("#bgLuckyDrawEnd").addClass("bg");//添加中奖背景光辉
        $("#txtNum").attr("placeholder", "输入中奖人数(" + remainPerson.length + ")");
    }, delay)
}

function GetNums(maxNum){
    var goodNums = []
    numLen = maxNum.toString().length
    for (var i = 1; i <= maxNum; i++) {
        var temp = i
        var isGood = true
        while (temp > 0) {
            if (temp % 10 == 4)
            {
                isGood = false
                break
            }
            temp = Math.floor(temp / 10)
        }
        if (isGood){
            strNum = i.toString()
            while (strNum.length < numLen)
            {
                strNum = "0" + strNum
            }
            goodNums.push(strNum)
        }
    }
    return goodNums
}

function GetNumStr(maxNum, num){
    numLen = maxNum.toString().length
    strNum = num.toString()
    while (strNum.length < numLen)
    {
        strNum = "0" + strNum
    }
    return strNum
}

function Shuffle(arr) {
    let i = arr.length;
    while (i) {
        let j = Math.floor(Math.random() * i--);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
}


var prizeName={"一等奖":"戴森吹风机","二等奖":"B&O Beoplay E8 耳机","三等奖":"正版 Pokemon 玩偶"}
var prizeCount={"一等奖":"3","二等奖":"5","三等奖":"10"}
var whiteList = {"一等奖":[213],"二等奖":[526]}
var prizeResult = {}
var displayResult = {}

goodNums = GetNums(maxNum)
for (p in whiteList){
    $.each(whiteList[p], function (i, n) {
        var idx = goodNums.indexOf(GetNumStr(maxNum, n))
        console.log("num " + n.toString() + " idx: " + idx.toString() )
        goodNums.splice(idx,1)

    })
}
console.log(goodNums)

//未中奖人员名单
//var remainPerson = allPerson.toString().split(";");
var remainPerson = goodNums
//中奖人员名单
var luckyMan = [];
var timer;//定时器
var times = 1;//抽奖次数,如果不是第一次，不加粗显示领导姓名
$(function () {
    iconAnimation();
    //开始抽奖
    $("#btnStart").on("click", function () {
        clearTimeout(timer3)
        console.log("clearTimeout")
        var prizeLabel = $("#prize option:selected").text()
        var count = prizeCount[prizeLabel]
        var name = prizeName[prizeLabel]
        console.log(prizeLabel + " " + count.toString() + " " + name)
        //判断是开始还是结束
        if ($("#btnStart").text() === "开始") {
            if (count > remainPerson.length) {
                showDialog("当前抽奖人数大于奖池总人数<br>当前抽奖人数：<b>" + $("#txtNum").val() + "</b>人,奖池人数：<b>" + remainPerson.length + "</b>人");
                return false;
            }
            $("#result").fadeOut();
            //显示动画框，隐藏中奖框
            $("#luckyDrawing").show().next().addClass("hide");
            move();
            $("#btnStart").text("抽一个");
            $("#bgLuckyDrawEnd").removeClass("bg");
        }
        else {
            var luckyDrawNum = prizeCount[prizeLabel];
            console.log("luckyDrawNum = " + luckyDrawNum)
            startLuckDraw(prizeLabel);//抽奖开始

            clearInterval(timer);//停止输入框动画展
             $("#luckyDrawing").val(displayResult[prizeLabel][displayResult[prizeLabel].length - 1]);//输入框显示最后一个中奖名字
            var $showName = $("#showName"); //显示内容的input的ID
            $showName.val(displayResult[prizeLabel][displayResult[prizeLabel].length - 1]);//输入框赋值

           // $("#luckyDrawing").val(displayResult[prizeLabel][displayResult[prizeLabel].length - 1]);
            //$("#luckyDrawing").fadeOut();
            //var $showName = $("#showName"); //显示内容的input的ID

            //$show_name.val(displayResult[prizeLabel][displayResult[prizeLabel].length - 1])
            display10s(prizeLabel)

        }
    });

    $("#btnReset").on("click", function () {
        //确认重置对话框
        var confirmReset = false;
        showConfirm("确认重置吗？所有已中奖的人会重新回到抽奖池！", function () {
            //熏置未中奖人员名单
            remainPerson = GetNums(maxNum);
            prizeResult = {}
            //中奖人数框置空
            $("#txtNum").val("").attr("placeholder", "请输入中奖人数");
            $("#showName").val("");
            //隐藏中奖名单,然后显示抽奖框
            $("#result").fadeOut();//.prev().fadeIn()
            $("#bgLuckyDrawEnd").removeClass("bg");//移除背景光辉
            times++;
            console.log(times);

        });
    });
});

//抽奖主程序
function startLuckDraw(prizeLabel) {
    var displayPerson = []
    if (prizeLabel in displayResult){
        displayPerson = displayResult[prizeLabel]
    }
    var luckyDrawNum = prizeCount[prizeLabel];
    if (displayPerson.length == 0 ){
        if (luckyDrawNum > remainPerson.length) {
            alert("抽奖人数大于奖池人数！请修改人数。或者点重置开始将新一轮抽奖！");
            return false;
        }
        //随机中奖人
        var randomPerson = []
        var wl = []
        if (prizeLabel in whiteList) {
            wl = whiteList[prizeLabel]
            if (wl.length > luckyDrawNum)
            {
                wl = wl.subarray(0, luckyDrawNum)
            }
            whiteList[prizeLabel] = whiteList[prizeLabel].delete(wl)
        }
        console.log("wl for " + prizeLabel + " is " + wl)
        $.each(wl, function(i, num) {
            randomPerson.push(num)
        });
        var realRandomPerson = getRandomArrayElements(remainPerson, luckyDrawNum);
        $.each(realRandomPerson, function (i, num) {
            if (randomPerson.length < luckyDrawNum){
                randomPerson.push(num)
            }
        })

        Shuffle(randomPerson)
        remainPerson = remainPerson.delete(randomPerson);
        console.log("remain:" + remainPerson)
        prizeResult[prizeLabel] = randomPerson
        //中奖人员
    }else if(displayPerson.length >= luckyDrawNum) {
        var newPerson = getRandomArrayElements(remainPerson, 1);
        prizeResult[prizeLabel].push(newPerson[0])
        remainPerson = remainPerson.delete(newPerson);
        console.log("remain:" + remainPerson)
    }

    displayPerson.push(prizeResult[prizeLabel][displayPerson.length])
    console.log("lucky man: " + displayPerson[displayPerson.length - 1].toString())
    //luckyMan = luckyMan.concat(displayPerson[displayPerson.length - 1]);
    displayResult[prizeLabel] = displayPerson
    var tempHtml = "";


    $.each(displayPerson, function (i, person) {
        tempHtml += "<span>" + person + "</span>";
 //     }
    });
    $("#result>div").html(tempHtml);
    //剩余人数剔除已中奖名单

    var rstTxt = "中奖名单"
    var rstHtml = "<p>中奖名单</p>"
    for (p in displayResult){
        rstTxt = rstTxt + "\n" + p + ": " + displayResult[p]
        var prefix = p
        if (p in prizeName){
            prefix += " " + prizeName[p] + "(" + displayResult[p].length + ")"
        }
        rstHtml += "<p>" + prefix + ": " + displayResult[p] + "</p>"
    }
    $("#prizeResult>div").html(rstHtml)
    console.log(rstHtml)
    console.log(rstTxt)

    $("#btnStart").text("开始");//设置按
    //设置抽奖人数框数字为空
    //$("#txtNum").val("");
}

//参考这篇文章：http://www.html-js.com/article/JS-rookie-rookie-learned-to-fly-in-a-moving-frame-beating-figures
//跳动的数字
function move() {
    var $showName = $("#showName"); //显示内容的input的ID
    var interTime = 30;//设置间隔时间
    timer = setInterval(function () {
        var i = GetRandomNum(0, remainPerson.length);
        $showName.val(remainPerson[i]);//输入框赋值
        console.log("move " + remainPerson[i])
    }, interTime);
}



//顶上的小图标，随机动画
function iconAnimation() {
    var interTime = 200;//设置间隔时间
    var $icon = $("#iconDiv>span");
    var arrAnimatoin = ["bounce", "flash", "pulse", "rubberBand", "shake", "swing", "wobble", "tada"];
    var timer2 = setInterval(function () {
        var i = GetRandomNum(0, $icon.length);
        var j = GetRandomNum(0, arrAnimatoin.length);
        //console.log("i:" + i + ",j:" + j);
        $($icon[i]).removeClass().stop().addClass("animated " + arrAnimatoin[j]);//输入框赋值
    }, interTime);

}
