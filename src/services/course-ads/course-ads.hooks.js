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
  serialize,
  skipRemainingHooks,
} = require('feathers-hooks-common');
const {
  restrictToOwner,
  associateCurrentUser,
} = require('feathers-authentication-hooks');

const isAuthenticated = require('../../hooks/is-authenticated');
const isPlatform = require('../../hooks/is-platform');
const setFastJoinQuery = require('../../hooks/set-fastJoin-query');

const isSettingOnline = require('./hooks/before/is-setting-online');
const chargeCoins = require('./hooks/before/charge-coins');

const getLatestStudentProfile = require('./hooks/after/get-latest-student-profile');

const resolvers = require('./resolvers');

const schema = require('./schema');

module.exports = {
  before: {
    all: [
      // paramsFromClient('action', 'paginate'),
    ],
    find: [],
    get: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        restrictToOwner({ idField: 'teacherId', ownerField: 'teacherId' }),
      ]),
    ],
    create: [
      authenticate('jwt'),
      associateCurrentUser({ idField: 'teacherId', as: 'teacherId' }),
      // iff(isSettingOnline(), [chargeCoins()]),
    ],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      iff(isProvider('external'), [
        authenticate('jwt'),
        restrictToOwner({ idField: 'teacherId', ownerField: 'teacherId' }),
        iff(isSettingOnline(), [chargeCoins()]),
      ]),
    ],
    remove: [
      disableMultiItemChange(),
      iff(isProvider('external'), [
        authenticate('jwt'),
        restrictToOwner({ idField: 'teacherId', ownerField: 'teacherId' }),
      ]),
    ],
  },

  after: {
    all: [
      fastJoin(resolvers, setFastJoinQuery()),
      iff(isAuthenticated(), [
        iff(isPlatform('student'), [
          getLatestStudentProfile(),
          serialize(schema),
        ]),
      ]),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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
