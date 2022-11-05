
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  decompressFromBase64,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum
} = require('./runtime/edge')


const Prisma = {}

exports.Prisma = Prisma

/**
 * Prisma Client JS version: 4.5.0
 * Query Engine version: 0362da9eebca54d94c8ef5edd3b2e90af99ba452
 */
Prisma.prismaVersion = {
  client: "4.5.0",
  engine: "0362da9eebca54d94c8ef5edd3b2e90af99ba452"
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = () => (val) => val

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}


const dirname = '/'

/**
 * Enums
 */
// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275
function makeEnum(x) { return x; }

exports.Prisma.IpScalarFieldEnum = makeEnum({
  id: 'id',
  ip: 'ip',
  requests: 'requests',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

exports.Prisma.QueryMode = makeEnum({
  default: 'default',
  insensitive: 'insensitive'
});

exports.Prisma.SortOrder = makeEnum({
  asc: 'asc',
  desc: 'desc'
});

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});


exports.Prisma.ModelName = makeEnum({
  Ip: 'Ip'
});

const compressedDMMF = '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'
const decompressedDMMF = decompressFromBase64(compressedDMMF)
// We are parsing 2 times, as we want independent objects, because
// DMMFClass introduces circular references in the dmmf object
const dmmf = JSON.parse(decompressedDMMF)
exports.Prisma.dmmf = JSON.parse(decompressedDMMF)

/**
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "/home/jake/workspace/packages/dinopack/generated/client",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [],
    "previewFeatures": [
      "deno"
    ],
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": "../../.env",
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../../prisma",
  "clientVersion": "4.5.0",
  "engineVersion": "0362da9eebca54d94c8ef5edd3b2e90af99ba452",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "dataProxy": true
}
config.document = dmmf
config.dirname = dirname

config.inlineSchema = 'Ly8gVGhpcyBpcyB5b3VyIFByaXNtYSBzY2hlbWEgZmlsZSwKLy8gbGVhcm4gbW9yZSBhYm91dCBpdCBpbiB0aGUgZG9jczogaHR0cHM6Ly9wcmlzLmx5L2QvcHJpc21hLXNjaGVtYQoKZ2VuZXJhdG9yIGNsaWVudCB7CiAgcHJvdmlkZXIgPSAicHJpc21hLWNsaWVudC1qcyIKICBwcmV2aWV3RmVhdHVyZXMgPSBbImRlbm8iXQogIG91dHB1dCAgICAgICAgICA9ICIuLi9nZW5lcmF0ZWQvY2xpZW50Igp9CgpkYXRhc291cmNlIGRiIHsKICBwcm92aWRlciA9ICJwb3N0Z3Jlc3FsIgogIHVybCAgICAgID0gZW52KCJEQVRBQkFTRV9VUkwiKQp9Cgptb2RlbCBJcCB7CiAgaWQgICAgICAgIFN0cmluZyAgICAgIEBpZCBAZGVmYXVsdCh1dWlkKCkpCiAgaXAgICAgICAgIFN0cmluZyAgICAgIEB1bmlxdWUKICAvLyBob3N0bmFtZSAgU3RyaW5nCiAgLy8gY2l0eSAgICAgIFN0cmluZwogIC8vIHJlZ2lvbiAgICBTdHJpbmcKICAvLyBjb3VudHJ5ICAgU3RyaW5nCiAgLy8gbG9jICAgICAgIFN0cmluZwogIC8vIHBvc3RhbCAgICBTdHJpbmcKICAvLyB0aW1lem9uZSAgU3RyaW5nCiAgcmVxdWVzdHMgIEludCAgICAgICAgIEBkZWZhdWx0KDApCiAgY3JlYXRlZEF0IERhdGVUaW1lICAgIEBkZWZhdWx0KG5vdygpKQogIHVwZGF0ZWRBdCBEYXRlVGltZSAgICBAdXBkYXRlZEF0CgogIEBAaW5kZXgoW2lwXSwgbmFtZTogImlwIikKICAvLyBAQGluZGV4KFtjb3VudHJ5XSwgbmFtZTogImNvdW50cnkiKQogIC8vIEBAaW5kZXgoW3JlZ2lvbl0sIG5hbWU6ICJyZWdpb24iKQp9Cg=='
config.inlineSchemaHash = '6cf42766b8caa4815e41f809ee70905ee229b9d8c725835c127f424e5a4ffd9b'

config.inlineDatasources = {
  "db": {
    "url": {
      "fromEnvVar": "DATABASE_URL",
      "value": null
    }
  }
}

config.injectableEdgeEnv = {
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
}

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

