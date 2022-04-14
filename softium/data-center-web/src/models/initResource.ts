import { EffectsCommandMap } from 'dva';

export default {
  namespace: 'initResource',
  state: {
    list: [],
  },
  reducers: {},
  effects: {
    *getProjectManagementList({}, { call, put }: EffectsCommandMap) {},
  },
  subscriptions: {},
};
