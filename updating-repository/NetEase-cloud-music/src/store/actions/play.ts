import {
  SETPLAYSTATUS,
  SETSONGID,
  SETDURATION,
  SETCURRENTDURATION,
  SETPLAYERLIST,
  SETMUSISDETAIL,
  SETMUSICURL,
  SETPLAYERINSTANCE
} from "../constants";
import { Dispatch } from "redux";
import {
  $APISongDetail,
  $APIGetMusicUrl,
  $APICheckMusic
} from "../../api/apiList";
import { http } from "../../api/http";
import { IMusicDetail, IMusicUrl } from "../reducers/play/interface";
import { Toast } from "antd-mobile";
import Player from "../../servers/player";
import { StoreState } from "..";
import history from "../../utils/history";

export interface ISetPlayerInstance {
  type: typeof SETPLAYERINSTANCE;
  player: Player;
}
export interface ISetPlayStatus {
  type: typeof SETPLAYSTATUS;
  flag: boolean;
}
export interface ISetSongId {
  type: typeof SETSONGID;
  id: number;
}
export interface ISetDuration {
  type: typeof SETDURATION;
  duration: number;
}
export interface ICurrentDuration {
  type: typeof SETCURRENTDURATION;
  curDuration: number;
}
export interface ISetPlayerList {
  type: typeof SETPLAYERLIST;
  playerList: number[];
}
export interface ISetMusicDetail {
  type: typeof SETMUSISDETAIL;
  musicDetail: IMusicDetail;
}
export interface ISetMusicUrl {
  type: typeof SETMUSICURL;
  musicUrl: IMusicUrl;
}

export type IPlayAction =
  | ISetPlayerInstance
  | ISetPlayStatus
  | ISetSongId
  | ICurrentDuration
  | ISetDuration
  | ISetPlayerList
  | ISetMusicDetail
  | ISetMusicUrl;

export const setPlayerInstance = (player: Player): ISetPlayerInstance => {
  return {
    type: SETPLAYERINSTANCE,
    player
  };
};
export const setPlayStatus = (isPlay: boolean): ISetPlayStatus => {
  return {
    type: SETPLAYSTATUS,
    flag: isPlay
  };
};

export const setSongId = (id: number): ISetSongId => {
  return {
    type: SETSONGID,
    id
  };
};

export const setDuration = (duration: number): ISetDuration => {
  return {
    type: SETDURATION,
    duration
  };
};

export const setCurrentDuration = (curDuration: number): ICurrentDuration => {
  return {
    type: SETCURRENTDURATION,
    curDuration
  };
};

export const setPlayerList = (playerList: number[]): ISetPlayerList => {
  return {
    type: SETPLAYERLIST,
    playerList
  };
};

export const setMusicDetail = (musicDetail: IMusicDetail): ISetMusicDetail => {
  return {
    type: SETMUSISDETAIL,
    musicDetail
  };
};
export const setMusicUrl = (musicUrl: IMusicUrl): ISetMusicUrl => {
  return {
    type: SETMUSICURL,
    musicUrl
  };
};

export const getMusicDetail = (id: number): any => {
  return (dispatch: Dispatch) => {
    return http($APISongDetail, { data: { ids: id } }).then((res: any) => {
      dispatch(setMusicDetail(res.songs[0]));
    });
  };
};

export const checkMusicUrl = (id: number): any => {
  return (dispatch: Dispatch) => {
    return http($APICheckMusic, { data: { id } }).then((res: any) => {
      if (res.success) {
        return dispatch(getMusicUrl(id));
      }
      // ????????? ?????????
      Toast.info(res.message, undefined, () => {
        dispatch(next(id));
      });
    });
  };
};

export const getMusicUrl = (id: number): any => {
  return (dispatch: Dispatch) => {
    return http($APIGetMusicUrl, {
      data: { id }
    }).then((res: any) => {
      const data: IMusicUrl[] = res.data;
      const songUrlInfo = data[0];
      dispatch(setMusicUrl(songUrlInfo));
      // ?????? ???????????????  ???????????????
      if (songUrlInfo && songUrlInfo.url) {
        // ?????? play
        return dispatch(play(songUrlInfo.url));
      }
      // ???????????????
    });
  };
};

type IGetStateFun = () => StoreState;

export const initPlayer = (id: number): any => {
  return (dispatch: Dispatch, getState: IGetStateFun) => {
    const {
      play: { playerInstance }
    } = getState();
    playerInstance.player && playerInstance.player.unload();

    dispatch(setSongId(id));
    dispatch(setDuration(0));
    dispatch(setCurrentDuration(0));
    dispatch(getMusicDetail(id));
    dispatch(checkMusicUrl(id));
  };
};

export const play = (url: string): any => {
  return (dispatch: Dispatch, getState: IGetStateFun) => {
    // const {
    //   play: { playerInstance }
    // } = getState();
    // playerInstance.player && playerInstance.player.unload();
    const player: Player = new Player({
      src: url,
      onload: ({ duration }) => {
        dispatch(setPlayStatus(true));
        dispatch(setDuration(duration));
      },
      // ??????????????? ?????????????????????  ??????????????????
      onProgress: curDuration => {
        dispatch(setCurrentDuration(curDuration));
      },
      // ???????????????  ???????????????????????????????????????
      onend: () => {
        dispatch(next());
        console.log("????????????");
      }
    });
    Player.setplayerlist(player);
    console.log(player);
    dispatch(setPlayerInstance(player));
  };
};

export const next = (id?: number, cb?: (id: number) => void): any => {
  return (dispatch: Dispatch, getState: IGetStateFun) => {
    const {
      play: { playList, songId }
    } = getState();
    id = id || songId;
    cb =
      cb ||
      ((nextId: number) => {
        const res = history.location.pathname === `/play/${id}`;
        // ????????????????????? ?????????
        if (res) {
          history.replace(`/play/${nextId}`);
        }
      });
    const lastIdIndex = playList.indexOf(songId);
    if (lastIdIndex !== -1) {
      const nextId = playList[lastIdIndex + 1];
      if (typeof nextId === "number") {
        cb && cb(nextId);
        return dispatch(initPlayer(nextId));
      }
    }
    cb && cb(playList[0]);
    dispatch(initPlayer(playList[0]));
  };
};

export const prev = (id?: number, cb?: (id: number) => void): any => {
  return (dispatch: Dispatch, getState: IGetStateFun) => {
    const {
      play: { playList, songId }
    } = getState();
    id = id || songId;
    const lastIdIndex = playList.indexOf(songId);
    if (lastIdIndex !== -1) {
      const nextId = playList[lastIdIndex - 1];
      if (typeof nextId === "number") {
        cb && cb(nextId);
        return dispatch(initPlayer(nextId));
      }
    }
    const playListLen = playList.length - 1;
    cb && cb(playList[playListLen]);
    dispatch(initPlayer(playList[playListLen]));
  };
};
