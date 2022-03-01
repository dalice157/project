<template>
    <div class="s-canvas">
        <canvas id="s-canvas" :width="contentWidth" :height="contentHeight"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { watch, onMounted } from "vue";

const props = defineProps({
    identifyCode: {
        type: String,
        default: "1234",
    },
    fontSizeMin: {
        type: Number,
        default: 20,
    },
    fontSizeMax: {
        type: Number,
        default: 35,
    },
    backgroundColorMin: {
        type: Number,
        default: 180,
    },
    backgroundColorMax: {
        type: Number,
        default: 240,
    },
    colorMin: {
        type: Number,
        default: 50,
    },
    colorMax: {
        type: Number,
        default: 160,
    },
    lineColorMin: {
        type: Number,
        default: 40,
    },
    lineColorMax: {
        type: Number,
        default: 180,
    },
    dotColorMin: {
        type: Number,
        default: 0,
    },
    dotColorMax: {
        type: Number,
        default: 255,
    },
    contentWidth: {
        type: Number,
        default: 97,
    },
    contentHeight: {
        type: Number,
        default: 30,
    },
});

//生成隨機數
const randomNum = (min: any, max: any) => {
    return Math.floor(Math.random() * (max - min) + min);
};
//生成隨機顏色
const randomColor = (min: any, max: any) => {
    let r = randomNum(min, max);
    let g = randomNum(min, max);
    let b = randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
};

const drawPic = () => {
    let canvas = document.getElementById("s-canvas") as any;
    let ctx = canvas.getContext("2d");
    ctx.textBaseline = "bottom";
    // 繪製背景
    ctx.fillStyle = randomColor(props.backgroundColorMin, props.backgroundColorMax);
    ctx.fillRect(0, 0, props.contentWidth, props.contentHeight);
    // 繪製文字
    for (let i = 0; i < props.identifyCode.length; i++) {
        drawText(ctx, props.identifyCode[i], i);
    }
    drawLine(ctx);
    drawDot(ctx);
};
const drawText = (ctx: any, txt: any, i: any) => {
    ctx.fillStyle = randomColor(props.colorMin, props.colorMax);
    ctx.font = randomNum(props.fontSizeMin, props.fontSizeMax) + "px SimHei";
    let x = (i + 1) * (props.contentWidth / (props.identifyCode.length + 1));
    let y = randomNum(props.fontSizeMax, props.contentHeight - 5);
    var deg = randomNum(-45, 45);
    // 修改座標原點和旋轉角度
    ctx.translate(x, y);
    ctx.rotate((deg * Math.PI) / 180);
    ctx.fillText(txt, 0, 0);
    // 恢復座標原點和旋轉角度
    ctx.rotate((-deg * Math.PI) / 180);
    ctx.translate(-x, -y);
};
//繪製干擾線
const drawLine = (ctx: any) => {
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = randomColor(props.lineColorMin, props.lineColorMax);
        ctx.beginPath();
        ctx.moveTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight));
        ctx.lineTo(randomNum(0, props.contentWidth), randomNum(0, props.contentHeight));
        ctx.stroke();
    }
};
//繪製干擾點
const drawDot = (ctx: any) => {
    for (let i = 0; i < 30; i++) {
        ctx.fillStyle = randomColor(0, 255);
        ctx.beginPath();
        ctx.arc(
            randomNum(0, props.contentWidth),
            randomNum(0, props.contentHeight),
            1,
            0,
            2 * Math.PI
        );
        ctx.fill();
    }
};
watch(
    () => props.identifyCode,
    () => {
        drawPic();
    }
);
onMounted(() => {
    drawPic();
});
</script>
