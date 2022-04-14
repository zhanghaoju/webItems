import { EffectsCommandMap } from 'dva';
import { getDictionaryByCode, getDictionaryAll } from '@/services/dictionary';

export default {
  namespace: 'institution',
  state: {
    list: [],
  },
  reducers: {
    updateInstitutionCategory(state: any, payload: any) {
      return { ...state };
    },
  },
  effects: {
    *getRegionList({ payload }: any, { call, put }: EffectsCommandMap) {
      const { data } = yield call(getDictionaryAll, payload);

      yield put({
        type: 'updateInstitutionCategory',
        payload: {},
      });
    },
  },
  subscriptions: {},
};
