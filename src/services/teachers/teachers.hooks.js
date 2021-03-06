const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  disallow,
  discard,
  disableMultiItemChange,
  disablePagination,
  fastJoin,
  iff,
  iffElse,
  isProvider,
  keep,
  paramsFromClient,
  preventChanges,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const {
  restrictToOwner,
  associateCurrentUser,
} = require('feathers-authentication-hooks');

const setFastJoinQuery = require('../../hooks/set-fastJoin-query');

// Before hooks
const extractAndUpdateUserInfo = require('./hooks/before/extract-and-update-user-info');
const initTeacherQuota = require('./hooks/before/init-teacher-quota');

// After hooks
const saveTeacherToUser = require('./hooks/after/save-teacher-to-user');
const giveTeacherWelcomeCoins = require('./hooks/after/give-teacher-welcome-coins');

const resolvers = require('./resolvers');

module.exports = {
  before: {
    all: [iff(isProvider('external'), [authenticate('jwt')])],
    find: [],
    get: [],
    create: [initTeacherQuota()],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      extractAndUpdateUserInfo(),
      iff(
        isProvider('external'),
        preventChanges(
          false,
          'coin',
          'credit',
          'freeAdsQuota',
          'freeAdsQuotaLeft',
          'freeApplyQuota',
          'freeApplyQuotaLeft'
        )
      ),
    ],
    remove: [disallow()],
  },

  after: {
    all: [],
    find: [fastJoin(resolvers, setFastJoinQuery())],
    get: [fastJoin(resolvers, setFastJoinQuery())],
    create: [
      giveTeacherWelcomeCoins(),
      saveTeacherToUser(),
      fastJoin(resolvers, setFastJoinQuery()),
    ],
    update: [],
    patch: [fastJoin(resolvers, setFastJoinQuery())],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
