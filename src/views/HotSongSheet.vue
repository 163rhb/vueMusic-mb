<template>
	<transition name="slide">
		<div class="song-sheet">
			<div class="sheet-header">
				<div class="sheet-box-bd">
					<page-header title="热门歌单"></page-header>
					<div class="sheet-info">
						<div class="media-img">
							<img :src="songListData.logo">
						</div>
						<div class="media-text">
							<h2>{{songListData.dissname}}</h2>
							<div>
								<img :src="songListData.headurl">
								{{songListData.nickname}}
							</div>
							<p>播放量：{{songListData.visitnum}}</p>
						</div>
					</div>
				</div>
				<img class="sheet-box-bg" :src="songListData.logo">
			</div>
			<div class="navbar">
				<mt-navbar v-model="selected">
					<mt-tab-item id="songlist">歌单歌曲</mt-tab-item>
					<mt-tab-item id="description">歌单简介</mt-tab-item>
				</mt-navbar>
			</div>
			<div class="main">
				<mt-tab-container v-model="selected">
					<mt-tab-container-item id="songlist">
						<ul>
							<div class="loading-container" v-if="!songListData.songlist">
								<loading></loading>
							</div>
							<li v-for="(item,index) in songListData.songlist" :key="index" class="song" @click="selectItem(index)">
							<!--	<div class="ranking" v-if="isShowIndex">
									<span :class="{'playing-item':isplaying(index)}">{{index+1}}</span>
								</div>-->
								<h3>{{item.name}}</h3>
								<p>{{item.singer[0].name+'·'+item.album.name}}</p>
							</li>
						</ul>
					</mt-tab-container-item>
					<mt-tab-container-item id="description">
						<div class="description">
							<h2>歌单简介</h2>
							<p v-html="songListData.desc"></p>
						</div>
					</mt-tab-container-item>
				</mt-tab-container>
			</div>
		</div>
	</transition>
</template>
<script>
	import PageHeader from '@/components/PageHeader'
	import Loading from '@/components/Loading'
	import SongList from '@/components/SongList'
	import { getHotSongSheet } from '@/api/getRecommendData'
	import { mapActions, mapGetters } from 'vuex'
	import axios from 'axios'
	import { MessageBox } from 'mint-ui';
	import Song, { createSong } from "../assets/js/song";

	export default{
		components:{
			PageHeader,
			Loading,
			SongList,
		},
		computed: {
		/*	...mapGetters([
				'currentSong'
			]),*/
		},
		data(){
			return {
				selected:'songlist',
				songListData:{},
				newSong:{
					id:0,
					mid: 0,
					singername:null ,
					songname: null,
					albumname:0 ,
					duration:0,
					img: null,
					url: null,
				},
				newSongList:[],
			}
		},
		props:{
			isShowIndex:{
				type:Boolean,
				default:false
			}
		},
		created(){
			this._getHotSongSheet();
		},
		methods:{
			...mapActions([
				'selectPlay'
			]),
			/*isplaying(index) {
				if (this.currentSong.id===this.songListData.songlist[index].id) {
					return true
				}
			},*/
			selectItem(index) {
				/*console.log(this.songListData.songlist)*/
				console.log(this.newSongList);
				let list = this.newSongList.slice()
				this.selectPlay({
					list,
					index
				})
			},

			_getHotSongSheet(){
				let id=this.$route.params.id
			/*
				axios.get('https://v1.itooi.cn/tencent/songList/category').then((res)=>{
						console.log(res)
					this.info = Object.assign({},res.data[id])
				})*/
			const url=`https://api.itooi.cn/tencent/songList?${id}`
				/*console.log(url)*/
			this.getRequest(url).then(resp=>{
			/*	console.log(resp)*/
				let data=resp.data.data
				/*console.log(data)*/
				this.songListData=data[0]
				console.log(this.songListData.songlist)
				this.songListData.songlist.forEach((item)=>{
					console.log(item)
				this.newSong.singername=item.singer[0].name
					this.newSong.songname=item.name
					this.newSong.img=`https://api.itooi.cn/tencent/pic?id=${item.mid}`
					this.newSong.url=`https://api.itooi.cn/tencent/url?id=${item.mid}&quality=flac`
					this.newSong.mid=item.mid
					this.newSong.id=item.id
					this.newSong.albumname=item.album.name
					this.newSong.duration=item.interval
					let newSong1={}
					Object.assign(newSong1,this.newSong)
					/*console.log(newSong1)*/
					this.newSongList.push(newSong1)
					/*this.newSongList.push(this.newSong)*/
				})
				console.log(this.newSongList)
			})
			},
			message() {
				MessageBox.confirm('推荐歌单数据需要接口验证').then(()=>{},()=>{})
			},

		}
	}
</script>
<style scoped>
	.ranking{
		height: 80%;
		margin-right: 20px;
		font-size: 16px;
		color: #777
	}
	.loading-container{
		margin: 150px 0;
	}
	.slide-enter-active,.slide-leave-active{
		transition: all 0.3s;
	}
	.slide-enter,.slide-leave-to{
		transform: translateX(100%);
	}
	.song-sheet{
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #fff;
		overflow: auto;
	}
	.sheet-header{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 10;
		width: 100%;
		height: 274px;
		overflow: hidden;
		color: #fff;
		background: #fff;
	}
	.sheet-box-bd{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
		background: rgba(0,0,0,.5);
	}
	.sheet-box-bg{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 3;
		width: 100%;
		height: 100%;
		/*css3的新属性*/
		object-fit: cover;
		filter: blur(36px);
		transform: scale(1.1);
	}
	.sheet-info{
		display: flex;
		margin-top: 85px;
		padding: 0 16px;
		box-sizing: content-box;
	}
	.sheet-info .media-img img{
		width: 125px;
		height: 125px;
	}
	.sheet-info .media-text{
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-left: 10px;
		font-family: sans-serif;
	}
	.sheet-info .media-text h2{
		font-size: 18px;
		font-weight: normal;
	}
	.sheet-info .media-text div{
		margin-top: 8px;
		font-size: 14px;
	}
	.sheet-info .media-text img{
		width: 24px;
		height: 24px;
		margin-right: 5px;
		border-radius: 50%;
		vertical-align: middle;
	}
	.sheet-info .media-text p{
		margin-top: 8px;
		font-size: 12px;
	}
	.navbar{
		height: 50px;
		margin-top: 274px;
		background-color: #fff;
		letter-spacing: 3px;
	}
	.main{
		padding-bottom: 80px;
	}
	.main h3{
		color: #444;
		font-size: 15px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.main h2{
		margin: 40px 0 20px;
		font-size: 17px;
		font-weight: normal;
		text-align: center;
		letter-spacing: 5px;
		color: #555;
	}
	.description p{
		margin: 0 30px 60px;
		font-size: 14px;
		color: #777;
	}
	.song{
		padding: 0 30px 0 20px;
		margin: 20px 0;
	}
	.song h3{
		color: #444;
		font-size: 15px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
	.song p{
		color: #777;
		font-size: 14px;
		text-overflow: ellipsis;
		overflow: hidden;
		white-space: nowrap;
	}
</style>
