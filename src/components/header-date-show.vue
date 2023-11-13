<template>
	<!-- 顶部时间展示 -->
	<div class="date-show">
		<p>{{dateShow.YMD}}</p>
		<p>{{dateShow.hms}}</p>
		<p>{{ dateShow.dayType }}</p>
		<p>{{ dateShow.week }}</p>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

// 时间
const dateShow = reactive({
	YMD: "00/00/0000",
	hms: "00:00:00",
	dayType: "--",
	week: "--",
});

// 计算时间
const getDateTime = () => {
	// 年月日
	const YMD = proxy.$timeSpToDate(new Date()).split('-').reverse().join('/');
	// 时分秒
	const hms = proxy.$timeStampToTime(new Date());

  // 当前几时
  const hours = new Date().getHours()
  // 当前第几周
  const weekValue = new Date().getDay()

  const weeks = ['周日','周一','周二','周三','周四','周五','周六']
  const week = proxy.$LANG_TEXT(weeks[weekValue])

  dateShow.YMD = YMD
  dateShow.hms = hms
  dateShow.dayType = hours>12?'PM':'AM'
  dateShow.week = week
	// console.log(YMD);
	// console.log(hms);
};

onMounted(() => {
	setInterval(() => {
		getDateTime();
	}, 1000);
});
</script>

<style lang="scss" scoped>
.date-show {
	display: flex;
	flex-direction: row;
	align-items: center;
	font-weight: bold;
	font-size: 14px;

	p + p {
		margin-left: 15px;
	}
}
</style>