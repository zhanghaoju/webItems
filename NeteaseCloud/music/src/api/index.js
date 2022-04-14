// 统一在index.js中向外导出接口 api下的各个请求模块js，统一来到index.js，再导出
import {recommendMusic} from "@/api/Home";
import {newMusic} from "@/api/Home";
import {hotSearch} from "@/api/Search";
import {searchResult} from "@/api/Search";
import {getSongById} from "@/api/Play";
import {getLyricById} from "@/api/Play";

export const recommendMusicAPI = recommendMusic // 请求推荐歌单的方法导出去
export const newMusicAPI = newMusic // 最新音乐
export const hotSearchAPI = hotSearch // 热门搜索
export const searchResultAPI = searchResult // 搜索结果
export const getSongByIdAPI = getSongById // 播放页-获取歌曲详情
export const getLyricByIdAPI = getLyricById // 播放页-获取歌词