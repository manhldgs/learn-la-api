const { authenticate } = require('@feathersjs/authentication').hooks;
const {
  disallow,
  disableMultiItemChange,
  disableMultiItemCreate,
  fastJoin,
  iff,
  iffElse,
  isNot,
  isProvider,
  paramsFromClient,
  preventChanges,
  some,
  when,
} = require('feathers-hooks-common');
const { associateCurrentUser } = require('feathers-authentication-hooks');

const {
  _restrictToOwner,
  isAction,
  isPlatform,
  setFastJoinQuery,
} = require('../../hooks');

const { setTicketPlatform } = require('./hooks/before');
const { giveCoinsReward } = require('./hooks/after');
const resolvers = require('./resolvers');

module.exports = {
  before: {
    all: [
      iff(isProvider('external'), [
        authenticate('jwt'),
        paramsFromClient('action'),
      ]),
    ],
    find: [],
    get: [],
    create: [
      disableMultiItemCreate(),
      iffElse(
        some(isPlatform('student'), isPlatform('teacher')),
        // ctx => isPlatform('student')(ctx) || isPlatform('teacher')(ctx),
        [
          associateCurrentUser({ idField: '_id', as: 'ownerId' }),
          setTicketPlatform(),
        ],
        [disallow()]
      ),
    ],
    update: [disallow()],
    patch: [
      disableMultiItemChange(),
      iffElse(
        some(isPlatform('student'), isPlatform('teacher')),
        // ctx => isPlatform('student')(ctx) || isPlatform('teacher')(ctx),
        [_restrictToOwner({ ownerField: 'ownerId' })],
        [iff(isNot(isPlatform('admin')), [disallow()])]
      ),
      preventChanges(false, 'type', 'platform', 'ownerId'),
    ],
    remove: [disallow()],
  },

  after: {
    all: [iff(isPlatform('admin'), [fastJoin(resolvers, setFastJoinQuery())])],
    find: [],
    get: [],
    create: [when(isAction('reward'), giveCoinsReward())],
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
