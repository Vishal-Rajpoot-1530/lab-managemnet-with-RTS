
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model SuperAdmin
 * Platform owner (you). Signs in on the Super admin panel.
 */
export type SuperAdmin = $Result.DefaultSelection<Prisma.$SuperAdminPayload>
/**
 * Model Tenant
 * One lab = one admin account with its own database.
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model TenantUser
 * Which lab an e-mail address belongs to, so employees sign in with just e-mail and password.
 */
export type TenantUser = $Result.DefaultSelection<Prisma.$TenantUserPayload>
/**
 * Model TenantSession
 * Which lab a signed-in token belongs to (the token itself is never stored, only its hash).
 */
export type TenantSession = $Result.DefaultSelection<Prisma.$TenantSessionPayload>
/**
 * Model Notification
 * 
 */
export type Notification = $Result.DefaultSelection<Prisma.$NotificationPayload>
/**
 * Model NotificationRead
 * 
 */
export type NotificationRead = $Result.DefaultSelection<Prisma.$NotificationReadPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more SuperAdmins
 * const superAdmins = await prisma.superAdmin.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more SuperAdmins
   * const superAdmins = await prisma.superAdmin.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.superAdmin`: Exposes CRUD operations for the **SuperAdmin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdmins
    * const superAdmins = await prisma.superAdmin.findMany()
    * ```
    */
  get superAdmin(): Prisma.SuperAdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantUser`: Exposes CRUD operations for the **TenantUser** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantUsers
    * const tenantUsers = await prisma.tenantUser.findMany()
    * ```
    */
  get tenantUser(): Prisma.TenantUserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tenantSession`: Exposes CRUD operations for the **TenantSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantSessions
    * const tenantSessions = await prisma.tenantSession.findMany()
    * ```
    */
  get tenantSession(): Prisma.TenantSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notification`: Exposes CRUD operations for the **Notification** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Notifications
    * const notifications = await prisma.notification.findMany()
    * ```
    */
  get notification(): Prisma.NotificationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.notificationRead`: Exposes CRUD operations for the **NotificationRead** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more NotificationReads
    * const notificationReads = await prisma.notificationRead.findMany()
    * ```
    */
  get notificationRead(): Prisma.NotificationReadDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    SuperAdmin: 'SuperAdmin',
    Tenant: 'Tenant',
    TenantUser: 'TenantUser',
    TenantSession: 'TenantSession',
    Notification: 'Notification',
    NotificationRead: 'NotificationRead'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "superAdmin" | "tenant" | "tenantUser" | "tenantSession" | "notification" | "notificationRead"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      SuperAdmin: {
        payload: Prisma.$SuperAdminPayload<ExtArgs>
        fields: Prisma.SuperAdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findMany: {
            args: Prisma.SuperAdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          create: {
            args: Prisma.SuperAdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          createMany: {
            args: Prisma.SuperAdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SuperAdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          update: {
            args: Prisma.SuperAdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SuperAdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSuperAdmin>
          }
          groupBy: {
            args: Prisma.SuperAdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminCountArgs<ExtArgs>
            result: $Utils.Optional<SuperAdminCountAggregateOutputType> | number
          }
        }
      }
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      TenantUser: {
        payload: Prisma.$TenantUserPayload<ExtArgs>
        fields: Prisma.TenantUserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantUserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantUserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          findFirst: {
            args: Prisma.TenantUserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantUserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          findMany: {
            args: Prisma.TenantUserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>[]
          }
          create: {
            args: Prisma.TenantUserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          createMany: {
            args: Prisma.TenantUserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TenantUserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          update: {
            args: Prisma.TenantUserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          deleteMany: {
            args: Prisma.TenantUserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantUserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantUserPayload>
          }
          aggregate: {
            args: Prisma.TenantUserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantUser>
          }
          groupBy: {
            args: Prisma.TenantUserGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantUserGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantUserCountArgs<ExtArgs>
            result: $Utils.Optional<TenantUserCountAggregateOutputType> | number
          }
        }
      }
      TenantSession: {
        payload: Prisma.$TenantSessionPayload<ExtArgs>
        fields: Prisma.TenantSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>
          }
          findFirst: {
            args: Prisma.TenantSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>
          }
          findMany: {
            args: Prisma.TenantSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>[]
          }
          create: {
            args: Prisma.TenantSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>
          }
          createMany: {
            args: Prisma.TenantSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TenantSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>
          }
          update: {
            args: Prisma.TenantSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>
          }
          deleteMany: {
            args: Prisma.TenantSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TenantSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TenantSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TenantSessionPayload>
          }
          aggregate: {
            args: Prisma.TenantSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTenantSession>
          }
          groupBy: {
            args: Prisma.TenantSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TenantSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantSessionCountArgs<ExtArgs>
            result: $Utils.Optional<TenantSessionCountAggregateOutputType> | number
          }
        }
      }
      Notification: {
        payload: Prisma.$NotificationPayload<ExtArgs>
        fields: Prisma.NotificationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findFirst: {
            args: Prisma.NotificationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          findMany: {
            args: Prisma.NotificationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>[]
          }
          create: {
            args: Prisma.NotificationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          createMany: {
            args: Prisma.NotificationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          update: {
            args: Prisma.NotificationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          deleteMany: {
            args: Prisma.NotificationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationPayload>
          }
          aggregate: {
            args: Prisma.NotificationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotification>
          }
          groupBy: {
            args: Prisma.NotificationGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationCountAggregateOutputType> | number
          }
        }
      }
      NotificationRead: {
        payload: Prisma.$NotificationReadPayload<ExtArgs>
        fields: Prisma.NotificationReadFieldRefs
        operations: {
          findUnique: {
            args: Prisma.NotificationReadFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.NotificationReadFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>
          }
          findFirst: {
            args: Prisma.NotificationReadFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.NotificationReadFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>
          }
          findMany: {
            args: Prisma.NotificationReadFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>[]
          }
          create: {
            args: Prisma.NotificationReadCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>
          }
          createMany: {
            args: Prisma.NotificationReadCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.NotificationReadDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>
          }
          update: {
            args: Prisma.NotificationReadUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>
          }
          deleteMany: {
            args: Prisma.NotificationReadDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.NotificationReadUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.NotificationReadUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$NotificationReadPayload>
          }
          aggregate: {
            args: Prisma.NotificationReadAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateNotificationRead>
          }
          groupBy: {
            args: Prisma.NotificationReadGroupByArgs<ExtArgs>
            result: $Utils.Optional<NotificationReadGroupByOutputType>[]
          }
          count: {
            args: Prisma.NotificationReadCountArgs<ExtArgs>
            result: $Utils.Optional<NotificationReadCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    superAdmin?: SuperAdminOmit
    tenant?: TenantOmit
    tenantUser?: TenantUserOmit
    tenantSession?: TenantSessionOmit
    notification?: NotificationOmit
    notificationRead?: NotificationReadOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    users: number
    sessions: number
    notificationReads: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | TenantCountOutputTypeCountUsersArgs
    sessions?: boolean | TenantCountOutputTypeCountSessionsArgs
    notificationReads?: boolean | TenantCountOutputTypeCountNotificationReadsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUserWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSessionWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountNotificationReadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationReadWhereInput
  }


  /**
   * Count Type NotificationCountOutputType
   */

  export type NotificationCountOutputType = {
    reads: number
  }

  export type NotificationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reads?: boolean | NotificationCountOutputTypeCountReadsArgs
  }

  // Custom InputTypes
  /**
   * NotificationCountOutputType without action
   */
  export type NotificationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationCountOutputType
     */
    select?: NotificationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * NotificationCountOutputType without action
   */
  export type NotificationCountOutputTypeCountReadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationReadWhereInput
  }


  /**
   * Models
   */

  /**
   * Model SuperAdmin
   */

  export type AggregateSuperAdmin = {
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  export type SuperAdminAvgAggregateOutputType = {
    id: number | null
  }

  export type SuperAdminSumAggregateOutputType = {
    id: number | null
  }

  export type SuperAdminMinAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    passwordHash: string | null
    active: boolean | null
    createdAt: Date | null
  }

  export type SuperAdminMaxAggregateOutputType = {
    id: number | null
    name: string | null
    email: string | null
    passwordHash: string | null
    active: boolean | null
    createdAt: Date | null
  }

  export type SuperAdminCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    active: number
    createdAt: number
    _all: number
  }


  export type SuperAdminAvgAggregateInputType = {
    id?: true
  }

  export type SuperAdminSumAggregateInputType = {
    id?: true
  }

  export type SuperAdminMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    active?: true
    createdAt?: true
  }

  export type SuperAdminMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    active?: true
    createdAt?: true
  }

  export type SuperAdminCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    active?: true
    createdAt?: true
    _all?: true
  }

  export type SuperAdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmin to aggregate.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdmins
    **/
    _count?: true | SuperAdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SuperAdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SuperAdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminMaxAggregateInputType
  }

  export type GetSuperAdminAggregateType<T extends SuperAdminAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdmin[P]>
      : GetScalarType<T[P], AggregateSuperAdmin[P]>
  }




  export type SuperAdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminWhereInput
    orderBy?: SuperAdminOrderByWithAggregationInput | SuperAdminOrderByWithAggregationInput[]
    by: SuperAdminScalarFieldEnum[] | SuperAdminScalarFieldEnum
    having?: SuperAdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminCountAggregateInputType | true
    _avg?: SuperAdminAvgAggregateInputType
    _sum?: SuperAdminSumAggregateInputType
    _min?: SuperAdminMinAggregateInputType
    _max?: SuperAdminMaxAggregateInputType
  }

  export type SuperAdminGroupByOutputType = {
    id: number
    name: string
    email: string
    passwordHash: string
    active: boolean
    createdAt: Date
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  type GetSuperAdminGroupByPayload<T extends SuperAdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    active?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>



  export type SuperAdminSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    active?: boolean
    createdAt?: boolean
  }

  export type SuperAdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "active" | "createdAt", ExtArgs["result"]["superAdmin"]>

  export type $SuperAdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdmin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      email: string
      passwordHash: string
      active: boolean
      createdAt: Date
    }, ExtArgs["result"]["superAdmin"]>
    composites: {}
  }

  type SuperAdminGetPayload<S extends boolean | null | undefined | SuperAdminDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminPayload, S>

  type SuperAdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SuperAdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SuperAdminCountAggregateInputType | true
    }

  export interface SuperAdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdmin'], meta: { name: 'SuperAdmin' } }
    /**
     * Find zero or one SuperAdmin that matches the filter.
     * @param {SuperAdminFindUniqueArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SuperAdminFindUniqueArgs>(args: SelectSubset<T, SuperAdminFindUniqueArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SuperAdmin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SuperAdminFindUniqueOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SuperAdminFindUniqueOrThrowArgs>(args: SelectSubset<T, SuperAdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuperAdmin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SuperAdminFindFirstArgs>(args?: SelectSubset<T, SuperAdminFindFirstArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SuperAdmin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SuperAdminFindFirstOrThrowArgs>(args?: SelectSubset<T, SuperAdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SuperAdmins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany()
     * 
     * // Get first 10 SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SuperAdminFindManyArgs>(args?: SelectSubset<T, SuperAdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SuperAdmin.
     * @param {SuperAdminCreateArgs} args - Arguments to create a SuperAdmin.
     * @example
     * // Create one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.create({
     *   data: {
     *     // ... data to create a SuperAdmin
     *   }
     * })
     * 
     */
    create<T extends SuperAdminCreateArgs>(args: SelectSubset<T, SuperAdminCreateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SuperAdmins.
     * @param {SuperAdminCreateManyArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SuperAdminCreateManyArgs>(args?: SelectSubset<T, SuperAdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SuperAdmin.
     * @param {SuperAdminDeleteArgs} args - Arguments to delete one SuperAdmin.
     * @example
     * // Delete one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.delete({
     *   where: {
     *     // ... filter to delete one SuperAdmin
     *   }
     * })
     * 
     */
    delete<T extends SuperAdminDeleteArgs>(args: SelectSubset<T, SuperAdminDeleteArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SuperAdmin.
     * @param {SuperAdminUpdateArgs} args - Arguments to update one SuperAdmin.
     * @example
     * // Update one SuperAdmin
     * const superAdmin = await prisma.superAdmin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SuperAdminUpdateArgs>(args: SelectSubset<T, SuperAdminUpdateArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SuperAdmins.
     * @param {SuperAdminDeleteManyArgs} args - Arguments to filter SuperAdmins to delete.
     * @example
     * // Delete a few SuperAdmins
     * const { count } = await prisma.superAdmin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SuperAdminDeleteManyArgs>(args?: SelectSubset<T, SuperAdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SuperAdminUpdateManyArgs>(args: SelectSubset<T, SuperAdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SuperAdmin.
     * @param {SuperAdminUpsertArgs} args - Arguments to update or create a SuperAdmin.
     * @example
     * // Update or create a SuperAdmin
     * const superAdmin = await prisma.superAdmin.upsert({
     *   create: {
     *     // ... data to create a SuperAdmin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdmin we want to update
     *   }
     * })
     */
    upsert<T extends SuperAdminUpsertArgs>(args: SelectSubset<T, SuperAdminUpsertArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminCountArgs} args - Arguments to filter SuperAdmins to count.
     * @example
     * // Count the number of SuperAdmins
     * const count = await prisma.superAdmin.count({
     *   where: {
     *     // ... the filter for the SuperAdmins we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminCountArgs>(
      args?: Subset<T, SuperAdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SuperAdminAggregateArgs>(args: Subset<T, SuperAdminAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminAggregateType<T>>

    /**
     * Group by SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SuperAdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SuperAdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdmin model
   */
  readonly fields: SuperAdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdmin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SuperAdmin model
   */
  interface SuperAdminFieldRefs {
    readonly id: FieldRef<"SuperAdmin", 'Int'>
    readonly name: FieldRef<"SuperAdmin", 'String'>
    readonly email: FieldRef<"SuperAdmin", 'String'>
    readonly passwordHash: FieldRef<"SuperAdmin", 'String'>
    readonly active: FieldRef<"SuperAdmin", 'Boolean'>
    readonly createdAt: FieldRef<"SuperAdmin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdmin findUnique
   */
  export type SuperAdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findUniqueOrThrow
   */
  export type SuperAdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findFirst
   */
  export type SuperAdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findFirstOrThrow
   */
  export type SuperAdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findMany
   */
  export type SuperAdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter, which SuperAdmins to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin create
   */
  export type SuperAdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data needed to create a SuperAdmin.
     */
    data: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
  }

  /**
   * SuperAdmin createMany
   */
  export type SuperAdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin update
   */
  export type SuperAdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The data needed to update a SuperAdmin.
     */
    data: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
    /**
     * Choose, which SuperAdmin to update.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin updateMany
   */
  export type SuperAdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to update.
     */
    limit?: number
  }

  /**
   * SuperAdmin upsert
   */
  export type SuperAdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * The filter to search for the SuperAdmin to update in case it exists.
     */
    where: SuperAdminWhereUniqueInput
    /**
     * In case the SuperAdmin found by the `where` argument doesn't exist, create a new SuperAdmin with this data.
     */
    create: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
    /**
     * In case the SuperAdmin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
  }

  /**
   * SuperAdmin delete
   */
  export type SuperAdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
    /**
     * Filter which SuperAdmin to delete.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin deleteMany
   */
  export type SuperAdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmins to delete
     */
    where?: SuperAdminWhereInput
    /**
     * Limit how many SuperAdmins to delete.
     */
    limit?: number
  }

  /**
   * SuperAdmin without action
   */
  export type SuperAdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SuperAdmin
     */
    omit?: SuperAdminOmit<ExtArgs> | null
  }


  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    id: number | null
    failedLoginCount: number | null
  }

  export type TenantSumAggregateOutputType = {
    id: number | null
    failedLoginCount: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: number | null
    labName: string | null
    adminName: string | null
    adminEmail: string | null
    passwordHash: string | null
    dbUrlEncrypted: string | null
    dbHost: string | null
    dbFingerprint: string | null
    connectedAt: Date | null
    lastLoginAt: Date | null
    failedLoginCount: number | null
    lockedUntil: Date | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: number | null
    labName: string | null
    adminName: string | null
    adminEmail: string | null
    passwordHash: string | null
    dbUrlEncrypted: string | null
    dbHost: string | null
    dbFingerprint: string | null
    connectedAt: Date | null
    lastLoginAt: Date | null
    failedLoginCount: number | null
    lockedUntil: Date | null
    active: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    labName: number
    adminName: number
    adminEmail: number
    passwordHash: number
    dbUrlEncrypted: number
    dbHost: number
    dbFingerprint: number
    connectedAt: number
    lastLoginAt: number
    failedLoginCount: number
    lockedUntil: number
    active: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    id?: true
    failedLoginCount?: true
  }

  export type TenantSumAggregateInputType = {
    id?: true
    failedLoginCount?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    labName?: true
    adminName?: true
    adminEmail?: true
    passwordHash?: true
    dbUrlEncrypted?: true
    dbHost?: true
    dbFingerprint?: true
    connectedAt?: true
    lastLoginAt?: true
    failedLoginCount?: true
    lockedUntil?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    labName?: true
    adminName?: true
    adminEmail?: true
    passwordHash?: true
    dbUrlEncrypted?: true
    dbHost?: true
    dbFingerprint?: true
    connectedAt?: true
    lastLoginAt?: true
    failedLoginCount?: true
    lockedUntil?: true
    active?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    labName?: true
    adminName?: true
    adminEmail?: true
    passwordHash?: true
    dbUrlEncrypted?: true
    dbHost?: true
    dbFingerprint?: true
    connectedAt?: true
    lastLoginAt?: true
    failedLoginCount?: true
    lockedUntil?: true
    active?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: number
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted: string | null
    dbHost: string | null
    dbFingerprint: string | null
    connectedAt: Date | null
    lastLoginAt: Date | null
    failedLoginCount: number
    lockedUntil: Date | null
    active: boolean
    createdAt: Date
    updatedAt: Date
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    labName?: boolean
    adminName?: boolean
    adminEmail?: boolean
    passwordHash?: boolean
    dbUrlEncrypted?: boolean
    dbHost?: boolean
    dbFingerprint?: boolean
    connectedAt?: boolean
    lastLoginAt?: boolean
    failedLoginCount?: boolean
    lockedUntil?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Tenant$usersArgs<ExtArgs>
    sessions?: boolean | Tenant$sessionsArgs<ExtArgs>
    notificationReads?: boolean | Tenant$notificationReadsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>



  export type TenantSelectScalar = {
    id?: boolean
    labName?: boolean
    adminName?: boolean
    adminEmail?: boolean
    passwordHash?: boolean
    dbUrlEncrypted?: boolean
    dbHost?: boolean
    dbFingerprint?: boolean
    connectedAt?: boolean
    lastLoginAt?: boolean
    failedLoginCount?: boolean
    lockedUntil?: boolean
    active?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TenantOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "labName" | "adminName" | "adminEmail" | "passwordHash" | "dbUrlEncrypted" | "dbHost" | "dbFingerprint" | "connectedAt" | "lastLoginAt" | "failedLoginCount" | "lockedUntil" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["tenant"]>
  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Tenant$usersArgs<ExtArgs>
    sessions?: boolean | Tenant$sessionsArgs<ExtArgs>
    notificationReads?: boolean | Tenant$notificationReadsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      users: Prisma.$TenantUserPayload<ExtArgs>[]
      sessions: Prisma.$TenantSessionPayload<ExtArgs>[]
      notificationReads: Prisma.$NotificationReadPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      labName: string
      adminName: string
      adminEmail: string
      passwordHash: string
      /**
       * The lab's database URL, encrypted (AES-256-GCM) with TENANT_SECRET.
       */
      dbUrlEncrypted: string | null
      /**
       * host:port/database, safe to show in the panel.
       */
      dbHost: string | null
      /**
       * Hash of host:port/database, so two labs can never share one database.
       */
      dbFingerprint: string | null
      connectedAt: Date | null
      lastLoginAt: Date | null
      failedLoginCount: number
      lockedUntil: Date | null
      active: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantFindUniqueArgs>(args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantFindFirstArgs>(args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TenantFindManyArgs>(args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
     */
    create<T extends TenantCreateArgs>(args: SelectSubset<T, TenantCreateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantCreateManyArgs>(args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
     */
    delete<T extends TenantDeleteArgs>(args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUpdateArgs>(args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantDeleteManyArgs>(args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUpdateManyArgs>(args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
     */
    upsert<T extends TenantUpsertArgs>(args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Tenant$usersArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    sessions<T extends Tenant$sessionsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    notificationReads<T extends Tenant$notificationReadsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$notificationReadsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Tenant model
   */
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'Int'>
    readonly labName: FieldRef<"Tenant", 'String'>
    readonly adminName: FieldRef<"Tenant", 'String'>
    readonly adminEmail: FieldRef<"Tenant", 'String'>
    readonly passwordHash: FieldRef<"Tenant", 'String'>
    readonly dbUrlEncrypted: FieldRef<"Tenant", 'String'>
    readonly dbHost: FieldRef<"Tenant", 'String'>
    readonly dbFingerprint: FieldRef<"Tenant", 'String'>
    readonly connectedAt: FieldRef<"Tenant", 'DateTime'>
    readonly lastLoginAt: FieldRef<"Tenant", 'DateTime'>
    readonly failedLoginCount: FieldRef<"Tenant", 'Int'>
    readonly lockedUntil: FieldRef<"Tenant", 'DateTime'>
    readonly active: FieldRef<"Tenant", 'Boolean'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to update.
     */
    limit?: number
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
    /**
     * Limit how many Tenants to delete.
     */
    limit?: number
  }

  /**
   * Tenant.users
   */
  export type Tenant$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    where?: TenantUserWhereInput
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    cursor?: TenantUserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * Tenant.sessions
   */
  export type Tenant$sessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    where?: TenantSessionWhereInput
    orderBy?: TenantSessionOrderByWithRelationInput | TenantSessionOrderByWithRelationInput[]
    cursor?: TenantSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantSessionScalarFieldEnum | TenantSessionScalarFieldEnum[]
  }

  /**
   * Tenant.notificationReads
   */
  export type Tenant$notificationReadsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    where?: NotificationReadWhereInput
    orderBy?: NotificationReadOrderByWithRelationInput | NotificationReadOrderByWithRelationInput[]
    cursor?: NotificationReadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationReadScalarFieldEnum | NotificationReadScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Tenant
     */
    omit?: TenantOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model TenantUser
   */

  export type AggregateTenantUser = {
    _count: TenantUserCountAggregateOutputType | null
    _avg: TenantUserAvgAggregateOutputType | null
    _sum: TenantUserSumAggregateOutputType | null
    _min: TenantUserMinAggregateOutputType | null
    _max: TenantUserMaxAggregateOutputType | null
  }

  export type TenantUserAvgAggregateOutputType = {
    tenantId: number | null
  }

  export type TenantUserSumAggregateOutputType = {
    tenantId: number | null
  }

  export type TenantUserMinAggregateOutputType = {
    email: string | null
    tenantId: number | null
  }

  export type TenantUserMaxAggregateOutputType = {
    email: string | null
    tenantId: number | null
  }

  export type TenantUserCountAggregateOutputType = {
    email: number
    tenantId: number
    _all: number
  }


  export type TenantUserAvgAggregateInputType = {
    tenantId?: true
  }

  export type TenantUserSumAggregateInputType = {
    tenantId?: true
  }

  export type TenantUserMinAggregateInputType = {
    email?: true
    tenantId?: true
  }

  export type TenantUserMaxAggregateInputType = {
    email?: true
    tenantId?: true
  }

  export type TenantUserCountAggregateInputType = {
    email?: true
    tenantId?: true
    _all?: true
  }

  export type TenantUserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUser to aggregate.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantUsers
    **/
    _count?: true | TenantUserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantUserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantUserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantUserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantUserMaxAggregateInputType
  }

  export type GetTenantUserAggregateType<T extends TenantUserAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantUser[P]>
      : GetScalarType<T[P], AggregateTenantUser[P]>
  }




  export type TenantUserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUserWhereInput
    orderBy?: TenantUserOrderByWithAggregationInput | TenantUserOrderByWithAggregationInput[]
    by: TenantUserScalarFieldEnum[] | TenantUserScalarFieldEnum
    having?: TenantUserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantUserCountAggregateInputType | true
    _avg?: TenantUserAvgAggregateInputType
    _sum?: TenantUserSumAggregateInputType
    _min?: TenantUserMinAggregateInputType
    _max?: TenantUserMaxAggregateInputType
  }

  export type TenantUserGroupByOutputType = {
    email: string
    tenantId: number
    _count: TenantUserCountAggregateOutputType | null
    _avg: TenantUserAvgAggregateOutputType | null
    _sum: TenantUserSumAggregateOutputType | null
    _min: TenantUserMinAggregateOutputType | null
    _max: TenantUserMaxAggregateOutputType | null
  }

  type GetTenantUserGroupByPayload<T extends TenantUserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantUserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantUserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantUserGroupByOutputType[P]>
            : GetScalarType<T[P], TenantUserGroupByOutputType[P]>
        }
      >
    >


  export type TenantUserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    email?: boolean
    tenantId?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUser"]>



  export type TenantUserSelectScalar = {
    email?: boolean
    tenantId?: boolean
  }

  export type TenantUserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"email" | "tenantId", ExtArgs["result"]["tenantUser"]>
  export type TenantUserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantUserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantUser"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      email: string
      tenantId: number
    }, ExtArgs["result"]["tenantUser"]>
    composites: {}
  }

  type TenantUserGetPayload<S extends boolean | null | undefined | TenantUserDefaultArgs> = $Result.GetResult<Prisma.$TenantUserPayload, S>

  type TenantUserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantUserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantUserCountAggregateInputType | true
    }

  export interface TenantUserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantUser'], meta: { name: 'TenantUser' } }
    /**
     * Find zero or one TenantUser that matches the filter.
     * @param {TenantUserFindUniqueArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantUserFindUniqueArgs>(args: SelectSubset<T, TenantUserFindUniqueArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantUser that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantUserFindUniqueOrThrowArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantUserFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantUserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantUser that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserFindFirstArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantUserFindFirstArgs>(args?: SelectSubset<T, TenantUserFindFirstArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantUser that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserFindFirstOrThrowArgs} args - Arguments to find a TenantUser
     * @example
     * // Get one TenantUser
     * const tenantUser = await prisma.tenantUser.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantUserFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantUserFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantUsers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantUsers
     * const tenantUsers = await prisma.tenantUser.findMany()
     * 
     * // Get first 10 TenantUsers
     * const tenantUsers = await prisma.tenantUser.findMany({ take: 10 })
     * 
     * // Only select the `email`
     * const tenantUserWithEmailOnly = await prisma.tenantUser.findMany({ select: { email: true } })
     * 
     */
    findMany<T extends TenantUserFindManyArgs>(args?: SelectSubset<T, TenantUserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantUser.
     * @param {TenantUserCreateArgs} args - Arguments to create a TenantUser.
     * @example
     * // Create one TenantUser
     * const TenantUser = await prisma.tenantUser.create({
     *   data: {
     *     // ... data to create a TenantUser
     *   }
     * })
     * 
     */
    create<T extends TenantUserCreateArgs>(args: SelectSubset<T, TenantUserCreateArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantUsers.
     * @param {TenantUserCreateManyArgs} args - Arguments to create many TenantUsers.
     * @example
     * // Create many TenantUsers
     * const tenantUser = await prisma.tenantUser.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantUserCreateManyArgs>(args?: SelectSubset<T, TenantUserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TenantUser.
     * @param {TenantUserDeleteArgs} args - Arguments to delete one TenantUser.
     * @example
     * // Delete one TenantUser
     * const TenantUser = await prisma.tenantUser.delete({
     *   where: {
     *     // ... filter to delete one TenantUser
     *   }
     * })
     * 
     */
    delete<T extends TenantUserDeleteArgs>(args: SelectSubset<T, TenantUserDeleteArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantUser.
     * @param {TenantUserUpdateArgs} args - Arguments to update one TenantUser.
     * @example
     * // Update one TenantUser
     * const tenantUser = await prisma.tenantUser.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantUserUpdateArgs>(args: SelectSubset<T, TenantUserUpdateArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantUsers.
     * @param {TenantUserDeleteManyArgs} args - Arguments to filter TenantUsers to delete.
     * @example
     * // Delete a few TenantUsers
     * const { count } = await prisma.tenantUser.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantUserDeleteManyArgs>(args?: SelectSubset<T, TenantUserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantUsers
     * const tenantUser = await prisma.tenantUser.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantUserUpdateManyArgs>(args: SelectSubset<T, TenantUserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantUser.
     * @param {TenantUserUpsertArgs} args - Arguments to update or create a TenantUser.
     * @example
     * // Update or create a TenantUser
     * const tenantUser = await prisma.tenantUser.upsert({
     *   create: {
     *     // ... data to create a TenantUser
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantUser we want to update
     *   }
     * })
     */
    upsert<T extends TenantUserUpsertArgs>(args: SelectSubset<T, TenantUserUpsertArgs<ExtArgs>>): Prisma__TenantUserClient<$Result.GetResult<Prisma.$TenantUserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantUsers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserCountArgs} args - Arguments to filter TenantUsers to count.
     * @example
     * // Count the number of TenantUsers
     * const count = await prisma.tenantUser.count({
     *   where: {
     *     // ... the filter for the TenantUsers we want to count
     *   }
     * })
    **/
    count<T extends TenantUserCountArgs>(
      args?: Subset<T, TenantUserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantUserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantUserAggregateArgs>(args: Subset<T, TenantUserAggregateArgs>): Prisma.PrismaPromise<GetTenantUserAggregateType<T>>

    /**
     * Group by TenantUser.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantUserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantUserGroupByArgs['orderBy'] }
        : { orderBy?: TenantUserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantUserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantUser model
   */
  readonly fields: TenantUserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantUser.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantUserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantUser model
   */
  interface TenantUserFieldRefs {
    readonly email: FieldRef<"TenantUser", 'String'>
    readonly tenantId: FieldRef<"TenantUser", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TenantUser findUnique
   */
  export type TenantUserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser findUniqueOrThrow
   */
  export type TenantUserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser findFirst
   */
  export type TenantUserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsers.
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsers.
     */
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * TenantUser findFirstOrThrow
   */
  export type TenantUserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * Filter, which TenantUser to fetch.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsers.
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsers.
     */
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * TenantUser findMany
   */
  export type TenantUserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsers to fetch.
     */
    where?: TenantUserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsers to fetch.
     */
    orderBy?: TenantUserOrderByWithRelationInput | TenantUserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantUsers.
     */
    cursor?: TenantUserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsers.
     */
    skip?: number
    distinct?: TenantUserScalarFieldEnum | TenantUserScalarFieldEnum[]
  }

  /**
   * TenantUser create
   */
  export type TenantUserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantUser.
     */
    data: XOR<TenantUserCreateInput, TenantUserUncheckedCreateInput>
  }

  /**
   * TenantUser createMany
   */
  export type TenantUserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantUsers.
     */
    data: TenantUserCreateManyInput | TenantUserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantUser update
   */
  export type TenantUserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantUser.
     */
    data: XOR<TenantUserUpdateInput, TenantUserUncheckedUpdateInput>
    /**
     * Choose, which TenantUser to update.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser updateMany
   */
  export type TenantUserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantUsers.
     */
    data: XOR<TenantUserUpdateManyMutationInput, TenantUserUncheckedUpdateManyInput>
    /**
     * Filter which TenantUsers to update
     */
    where?: TenantUserWhereInput
    /**
     * Limit how many TenantUsers to update.
     */
    limit?: number
  }

  /**
   * TenantUser upsert
   */
  export type TenantUserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantUser to update in case it exists.
     */
    where: TenantUserWhereUniqueInput
    /**
     * In case the TenantUser found by the `where` argument doesn't exist, create a new TenantUser with this data.
     */
    create: XOR<TenantUserCreateInput, TenantUserUncheckedCreateInput>
    /**
     * In case the TenantUser was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUserUpdateInput, TenantUserUncheckedUpdateInput>
  }

  /**
   * TenantUser delete
   */
  export type TenantUserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
    /**
     * Filter which TenantUser to delete.
     */
    where: TenantUserWhereUniqueInput
  }

  /**
   * TenantUser deleteMany
   */
  export type TenantUserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUsers to delete
     */
    where?: TenantUserWhereInput
    /**
     * Limit how many TenantUsers to delete.
     */
    limit?: number
  }

  /**
   * TenantUser without action
   */
  export type TenantUserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUser
     */
    select?: TenantUserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantUser
     */
    omit?: TenantUserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUserInclude<ExtArgs> | null
  }


  /**
   * Model TenantSession
   */

  export type AggregateTenantSession = {
    _count: TenantSessionCountAggregateOutputType | null
    _avg: TenantSessionAvgAggregateOutputType | null
    _sum: TenantSessionSumAggregateOutputType | null
    _min: TenantSessionMinAggregateOutputType | null
    _max: TenantSessionMaxAggregateOutputType | null
  }

  export type TenantSessionAvgAggregateOutputType = {
    tenantId: number | null
  }

  export type TenantSessionSumAggregateOutputType = {
    tenantId: number | null
  }

  export type TenantSessionMinAggregateOutputType = {
    tokenHash: string | null
    tenantId: number | null
    expiresAt: Date | null
  }

  export type TenantSessionMaxAggregateOutputType = {
    tokenHash: string | null
    tenantId: number | null
    expiresAt: Date | null
  }

  export type TenantSessionCountAggregateOutputType = {
    tokenHash: number
    tenantId: number
    expiresAt: number
    _all: number
  }


  export type TenantSessionAvgAggregateInputType = {
    tenantId?: true
  }

  export type TenantSessionSumAggregateInputType = {
    tenantId?: true
  }

  export type TenantSessionMinAggregateInputType = {
    tokenHash?: true
    tenantId?: true
    expiresAt?: true
  }

  export type TenantSessionMaxAggregateInputType = {
    tokenHash?: true
    tenantId?: true
    expiresAt?: true
  }

  export type TenantSessionCountAggregateInputType = {
    tokenHash?: true
    tenantId?: true
    expiresAt?: true
    _all?: true
  }

  export type TenantSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSession to aggregate.
     */
    where?: TenantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSessions to fetch.
     */
    orderBy?: TenantSessionOrderByWithRelationInput | TenantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantSessions
    **/
    _count?: true | TenantSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantSessionMaxAggregateInputType
  }

  export type GetTenantSessionAggregateType<T extends TenantSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantSession[P]>
      : GetScalarType<T[P], AggregateTenantSession[P]>
  }




  export type TenantSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantSessionWhereInput
    orderBy?: TenantSessionOrderByWithAggregationInput | TenantSessionOrderByWithAggregationInput[]
    by: TenantSessionScalarFieldEnum[] | TenantSessionScalarFieldEnum
    having?: TenantSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantSessionCountAggregateInputType | true
    _avg?: TenantSessionAvgAggregateInputType
    _sum?: TenantSessionSumAggregateInputType
    _min?: TenantSessionMinAggregateInputType
    _max?: TenantSessionMaxAggregateInputType
  }

  export type TenantSessionGroupByOutputType = {
    tokenHash: string
    tenantId: number
    expiresAt: Date
    _count: TenantSessionCountAggregateOutputType | null
    _avg: TenantSessionAvgAggregateOutputType | null
    _sum: TenantSessionSumAggregateOutputType | null
    _min: TenantSessionMinAggregateOutputType | null
    _max: TenantSessionMaxAggregateOutputType | null
  }

  type GetTenantSessionGroupByPayload<T extends TenantSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantSessionGroupByOutputType[P]>
            : GetScalarType<T[P], TenantSessionGroupByOutputType[P]>
        }
      >
    >


  export type TenantSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    tokenHash?: boolean
    tenantId?: boolean
    expiresAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantSession"]>



  export type TenantSessionSelectScalar = {
    tokenHash?: boolean
    tenantId?: boolean
    expiresAt?: boolean
  }

  export type TenantSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"tokenHash" | "tenantId" | "expiresAt", ExtArgs["result"]["tenantSession"]>
  export type TenantSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantSession"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      tokenHash: string
      tenantId: number
      expiresAt: Date
    }, ExtArgs["result"]["tenantSession"]>
    composites: {}
  }

  type TenantSessionGetPayload<S extends boolean | null | undefined | TenantSessionDefaultArgs> = $Result.GetResult<Prisma.$TenantSessionPayload, S>

  type TenantSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TenantSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TenantSessionCountAggregateInputType | true
    }

  export interface TenantSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantSession'], meta: { name: 'TenantSession' } }
    /**
     * Find zero or one TenantSession that matches the filter.
     * @param {TenantSessionFindUniqueArgs} args - Arguments to find a TenantSession
     * @example
     * // Get one TenantSession
     * const tenantSession = await prisma.tenantSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TenantSessionFindUniqueArgs>(args: SelectSubset<T, TenantSessionFindUniqueArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TenantSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TenantSessionFindUniqueOrThrowArgs} args - Arguments to find a TenantSession
     * @example
     * // Get one TenantSession
     * const tenantSession = await prisma.tenantSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TenantSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, TenantSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionFindFirstArgs} args - Arguments to find a TenantSession
     * @example
     * // Get one TenantSession
     * const tenantSession = await prisma.tenantSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TenantSessionFindFirstArgs>(args?: SelectSubset<T, TenantSessionFindFirstArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TenantSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionFindFirstOrThrowArgs} args - Arguments to find a TenantSession
     * @example
     * // Get one TenantSession
     * const tenantSession = await prisma.tenantSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TenantSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, TenantSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TenantSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantSessions
     * const tenantSessions = await prisma.tenantSession.findMany()
     * 
     * // Get first 10 TenantSessions
     * const tenantSessions = await prisma.tenantSession.findMany({ take: 10 })
     * 
     * // Only select the `tokenHash`
     * const tenantSessionWithTokenHashOnly = await prisma.tenantSession.findMany({ select: { tokenHash: true } })
     * 
     */
    findMany<T extends TenantSessionFindManyArgs>(args?: SelectSubset<T, TenantSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TenantSession.
     * @param {TenantSessionCreateArgs} args - Arguments to create a TenantSession.
     * @example
     * // Create one TenantSession
     * const TenantSession = await prisma.tenantSession.create({
     *   data: {
     *     // ... data to create a TenantSession
     *   }
     * })
     * 
     */
    create<T extends TenantSessionCreateArgs>(args: SelectSubset<T, TenantSessionCreateArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TenantSessions.
     * @param {TenantSessionCreateManyArgs} args - Arguments to create many TenantSessions.
     * @example
     * // Create many TenantSessions
     * const tenantSession = await prisma.tenantSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TenantSessionCreateManyArgs>(args?: SelectSubset<T, TenantSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a TenantSession.
     * @param {TenantSessionDeleteArgs} args - Arguments to delete one TenantSession.
     * @example
     * // Delete one TenantSession
     * const TenantSession = await prisma.tenantSession.delete({
     *   where: {
     *     // ... filter to delete one TenantSession
     *   }
     * })
     * 
     */
    delete<T extends TenantSessionDeleteArgs>(args: SelectSubset<T, TenantSessionDeleteArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TenantSession.
     * @param {TenantSessionUpdateArgs} args - Arguments to update one TenantSession.
     * @example
     * // Update one TenantSession
     * const tenantSession = await prisma.tenantSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TenantSessionUpdateArgs>(args: SelectSubset<T, TenantSessionUpdateArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TenantSessions.
     * @param {TenantSessionDeleteManyArgs} args - Arguments to filter TenantSessions to delete.
     * @example
     * // Delete a few TenantSessions
     * const { count } = await prisma.tenantSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TenantSessionDeleteManyArgs>(args?: SelectSubset<T, TenantSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantSessions
     * const tenantSession = await prisma.tenantSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TenantSessionUpdateManyArgs>(args: SelectSubset<T, TenantSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantSession.
     * @param {TenantSessionUpsertArgs} args - Arguments to update or create a TenantSession.
     * @example
     * // Update or create a TenantSession
     * const tenantSession = await prisma.tenantSession.upsert({
     *   create: {
     *     // ... data to create a TenantSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantSession we want to update
     *   }
     * })
     */
    upsert<T extends TenantSessionUpsertArgs>(args: SelectSubset<T, TenantSessionUpsertArgs<ExtArgs>>): Prisma__TenantSessionClient<$Result.GetResult<Prisma.$TenantSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TenantSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionCountArgs} args - Arguments to filter TenantSessions to count.
     * @example
     * // Count the number of TenantSessions
     * const count = await prisma.tenantSession.count({
     *   where: {
     *     // ... the filter for the TenantSessions we want to count
     *   }
     * })
    **/
    count<T extends TenantSessionCountArgs>(
      args?: Subset<T, TenantSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantSessionAggregateArgs>(args: Subset<T, TenantSessionAggregateArgs>): Prisma.PrismaPromise<GetTenantSessionAggregateType<T>>

    /**
     * Group by TenantSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantSessionGroupByArgs['orderBy'] }
        : { orderBy?: TenantSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantSession model
   */
  readonly fields: TenantSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TenantSession model
   */
  interface TenantSessionFieldRefs {
    readonly tokenHash: FieldRef<"TenantSession", 'String'>
    readonly tenantId: FieldRef<"TenantSession", 'Int'>
    readonly expiresAt: FieldRef<"TenantSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantSession findUnique
   */
  export type TenantSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSession to fetch.
     */
    where: TenantSessionWhereUniqueInput
  }

  /**
   * TenantSession findUniqueOrThrow
   */
  export type TenantSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSession to fetch.
     */
    where: TenantSessionWhereUniqueInput
  }

  /**
   * TenantSession findFirst
   */
  export type TenantSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSession to fetch.
     */
    where?: TenantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSessions to fetch.
     */
    orderBy?: TenantSessionOrderByWithRelationInput | TenantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSessions.
     */
    cursor?: TenantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSessions.
     */
    distinct?: TenantSessionScalarFieldEnum | TenantSessionScalarFieldEnum[]
  }

  /**
   * TenantSession findFirstOrThrow
   */
  export type TenantSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSession to fetch.
     */
    where?: TenantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSessions to fetch.
     */
    orderBy?: TenantSessionOrderByWithRelationInput | TenantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantSessions.
     */
    cursor?: TenantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantSessions.
     */
    distinct?: TenantSessionScalarFieldEnum | TenantSessionScalarFieldEnum[]
  }

  /**
   * TenantSession findMany
   */
  export type TenantSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * Filter, which TenantSessions to fetch.
     */
    where?: TenantSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantSessions to fetch.
     */
    orderBy?: TenantSessionOrderByWithRelationInput | TenantSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantSessions.
     */
    cursor?: TenantSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantSessions.
     */
    skip?: number
    distinct?: TenantSessionScalarFieldEnum | TenantSessionScalarFieldEnum[]
  }

  /**
   * TenantSession create
   */
  export type TenantSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantSession.
     */
    data: XOR<TenantSessionCreateInput, TenantSessionUncheckedCreateInput>
  }

  /**
   * TenantSession createMany
   */
  export type TenantSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantSessions.
     */
    data: TenantSessionCreateManyInput | TenantSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantSession update
   */
  export type TenantSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantSession.
     */
    data: XOR<TenantSessionUpdateInput, TenantSessionUncheckedUpdateInput>
    /**
     * Choose, which TenantSession to update.
     */
    where: TenantSessionWhereUniqueInput
  }

  /**
   * TenantSession updateMany
   */
  export type TenantSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantSessions.
     */
    data: XOR<TenantSessionUpdateManyMutationInput, TenantSessionUncheckedUpdateManyInput>
    /**
     * Filter which TenantSessions to update
     */
    where?: TenantSessionWhereInput
    /**
     * Limit how many TenantSessions to update.
     */
    limit?: number
  }

  /**
   * TenantSession upsert
   */
  export type TenantSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantSession to update in case it exists.
     */
    where: TenantSessionWhereUniqueInput
    /**
     * In case the TenantSession found by the `where` argument doesn't exist, create a new TenantSession with this data.
     */
    create: XOR<TenantSessionCreateInput, TenantSessionUncheckedCreateInput>
    /**
     * In case the TenantSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantSessionUpdateInput, TenantSessionUncheckedUpdateInput>
  }

  /**
   * TenantSession delete
   */
  export type TenantSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
    /**
     * Filter which TenantSession to delete.
     */
    where: TenantSessionWhereUniqueInput
  }

  /**
   * TenantSession deleteMany
   */
  export type TenantSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantSessions to delete
     */
    where?: TenantSessionWhereInput
    /**
     * Limit how many TenantSessions to delete.
     */
    limit?: number
  }

  /**
   * TenantSession without action
   */
  export type TenantSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantSession
     */
    select?: TenantSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TenantSession
     */
    omit?: TenantSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantSessionInclude<ExtArgs> | null
  }


  /**
   * Model Notification
   */

  export type AggregateNotification = {
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  export type NotificationAvgAggregateOutputType = {
    id: number | null
  }

  export type NotificationSumAggregateOutputType = {
    id: number | null
  }

  export type NotificationMinAggregateOutputType = {
    id: number | null
    title: string | null
    message: string | null
    createdAt: Date | null
    expiresAt: Date | null
    active: boolean | null
  }

  export type NotificationMaxAggregateOutputType = {
    id: number | null
    title: string | null
    message: string | null
    createdAt: Date | null
    expiresAt: Date | null
    active: boolean | null
  }

  export type NotificationCountAggregateOutputType = {
    id: number
    title: number
    message: number
    createdAt: number
    expiresAt: number
    active: number
    _all: number
  }


  export type NotificationAvgAggregateInputType = {
    id?: true
  }

  export type NotificationSumAggregateInputType = {
    id?: true
  }

  export type NotificationMinAggregateInputType = {
    id?: true
    title?: true
    message?: true
    createdAt?: true
    expiresAt?: true
    active?: true
  }

  export type NotificationMaxAggregateInputType = {
    id?: true
    title?: true
    message?: true
    createdAt?: true
    expiresAt?: true
    active?: true
  }

  export type NotificationCountAggregateInputType = {
    id?: true
    title?: true
    message?: true
    createdAt?: true
    expiresAt?: true
    active?: true
    _all?: true
  }

  export type NotificationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notification to aggregate.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Notifications
    **/
    _count?: true | NotificationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationMaxAggregateInputType
  }

  export type GetNotificationAggregateType<T extends NotificationAggregateArgs> = {
        [P in keyof T & keyof AggregateNotification]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotification[P]>
      : GetScalarType<T[P], AggregateNotification[P]>
  }




  export type NotificationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationWhereInput
    orderBy?: NotificationOrderByWithAggregationInput | NotificationOrderByWithAggregationInput[]
    by: NotificationScalarFieldEnum[] | NotificationScalarFieldEnum
    having?: NotificationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationCountAggregateInputType | true
    _avg?: NotificationAvgAggregateInputType
    _sum?: NotificationSumAggregateInputType
    _min?: NotificationMinAggregateInputType
    _max?: NotificationMaxAggregateInputType
  }

  export type NotificationGroupByOutputType = {
    id: number
    title: string
    message: string
    createdAt: Date
    expiresAt: Date | null
    active: boolean
    _count: NotificationCountAggregateOutputType | null
    _avg: NotificationAvgAggregateOutputType | null
    _sum: NotificationSumAggregateOutputType | null
    _min: NotificationMinAggregateOutputType | null
    _max: NotificationMaxAggregateOutputType | null
  }

  type GetNotificationGroupByPayload<T extends NotificationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationGroupByOutputType[P]>
        }
      >
    >


  export type NotificationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    message?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    active?: boolean
    reads?: boolean | Notification$readsArgs<ExtArgs>
    _count?: boolean | NotificationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notification"]>



  export type NotificationSelectScalar = {
    id?: boolean
    title?: boolean
    message?: boolean
    createdAt?: boolean
    expiresAt?: boolean
    active?: boolean
  }

  export type NotificationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "message" | "createdAt" | "expiresAt" | "active", ExtArgs["result"]["notification"]>
  export type NotificationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reads?: boolean | Notification$readsArgs<ExtArgs>
    _count?: boolean | NotificationCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $NotificationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Notification"
    objects: {
      reads: Prisma.$NotificationReadPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      message: string
      createdAt: Date
      expiresAt: Date | null
      active: boolean
    }, ExtArgs["result"]["notification"]>
    composites: {}
  }

  type NotificationGetPayload<S extends boolean | null | undefined | NotificationDefaultArgs> = $Result.GetResult<Prisma.$NotificationPayload, S>

  type NotificationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationCountAggregateInputType | true
    }

  export interface NotificationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Notification'], meta: { name: 'Notification' } }
    /**
     * Find zero or one Notification that matches the filter.
     * @param {NotificationFindUniqueArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationFindUniqueArgs>(args: SelectSubset<T, NotificationFindUniqueArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Notification that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationFindUniqueOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationFindFirstArgs>(args?: SelectSubset<T, NotificationFindFirstArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Notification that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindFirstOrThrowArgs} args - Arguments to find a Notification
     * @example
     * // Get one Notification
     * const notification = await prisma.notification.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Notifications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Notifications
     * const notifications = await prisma.notification.findMany()
     * 
     * // Get first 10 Notifications
     * const notifications = await prisma.notification.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationWithIdOnly = await prisma.notification.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationFindManyArgs>(args?: SelectSubset<T, NotificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Notification.
     * @param {NotificationCreateArgs} args - Arguments to create a Notification.
     * @example
     * // Create one Notification
     * const Notification = await prisma.notification.create({
     *   data: {
     *     // ... data to create a Notification
     *   }
     * })
     * 
     */
    create<T extends NotificationCreateArgs>(args: SelectSubset<T, NotificationCreateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Notifications.
     * @param {NotificationCreateManyArgs} args - Arguments to create many Notifications.
     * @example
     * // Create many Notifications
     * const notification = await prisma.notification.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationCreateManyArgs>(args?: SelectSubset<T, NotificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Notification.
     * @param {NotificationDeleteArgs} args - Arguments to delete one Notification.
     * @example
     * // Delete one Notification
     * const Notification = await prisma.notification.delete({
     *   where: {
     *     // ... filter to delete one Notification
     *   }
     * })
     * 
     */
    delete<T extends NotificationDeleteArgs>(args: SelectSubset<T, NotificationDeleteArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Notification.
     * @param {NotificationUpdateArgs} args - Arguments to update one Notification.
     * @example
     * // Update one Notification
     * const notification = await prisma.notification.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationUpdateArgs>(args: SelectSubset<T, NotificationUpdateArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Notifications.
     * @param {NotificationDeleteManyArgs} args - Arguments to filter Notifications to delete.
     * @example
     * // Delete a few Notifications
     * const { count } = await prisma.notification.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationDeleteManyArgs>(args?: SelectSubset<T, NotificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Notifications
     * const notification = await prisma.notification.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationUpdateManyArgs>(args: SelectSubset<T, NotificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Notification.
     * @param {NotificationUpsertArgs} args - Arguments to update or create a Notification.
     * @example
     * // Update or create a Notification
     * const notification = await prisma.notification.upsert({
     *   create: {
     *     // ... data to create a Notification
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Notification we want to update
     *   }
     * })
     */
    upsert<T extends NotificationUpsertArgs>(args: SelectSubset<T, NotificationUpsertArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Notifications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationCountArgs} args - Arguments to filter Notifications to count.
     * @example
     * // Count the number of Notifications
     * const count = await prisma.notification.count({
     *   where: {
     *     // ... the filter for the Notifications we want to count
     *   }
     * })
    **/
    count<T extends NotificationCountArgs>(
      args?: Subset<T, NotificationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationAggregateArgs>(args: Subset<T, NotificationAggregateArgs>): Prisma.PrismaPromise<GetNotificationAggregateType<T>>

    /**
     * Group by Notification.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationGroupByArgs['orderBy'] }
        : { orderBy?: NotificationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Notification model
   */
  readonly fields: NotificationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Notification.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    reads<T extends Notification$readsArgs<ExtArgs> = {}>(args?: Subset<T, Notification$readsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Notification model
   */
  interface NotificationFieldRefs {
    readonly id: FieldRef<"Notification", 'Int'>
    readonly title: FieldRef<"Notification", 'String'>
    readonly message: FieldRef<"Notification", 'String'>
    readonly createdAt: FieldRef<"Notification", 'DateTime'>
    readonly expiresAt: FieldRef<"Notification", 'DateTime'>
    readonly active: FieldRef<"Notification", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Notification findUnique
   */
  export type NotificationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findUniqueOrThrow
   */
  export type NotificationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification findFirst
   */
  export type NotificationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findFirstOrThrow
   */
  export type NotificationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notification to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Notifications.
     */
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification findMany
   */
  export type NotificationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter, which Notifications to fetch.
     */
    where?: NotificationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Notifications to fetch.
     */
    orderBy?: NotificationOrderByWithRelationInput | NotificationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Notifications.
     */
    cursor?: NotificationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Notifications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Notifications.
     */
    skip?: number
    distinct?: NotificationScalarFieldEnum | NotificationScalarFieldEnum[]
  }

  /**
   * Notification create
   */
  export type NotificationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to create a Notification.
     */
    data: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
  }

  /**
   * Notification createMany
   */
  export type NotificationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Notifications.
     */
    data: NotificationCreateManyInput | NotificationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Notification update
   */
  export type NotificationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The data needed to update a Notification.
     */
    data: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
    /**
     * Choose, which Notification to update.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification updateMany
   */
  export type NotificationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Notifications.
     */
    data: XOR<NotificationUpdateManyMutationInput, NotificationUncheckedUpdateManyInput>
    /**
     * Filter which Notifications to update
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to update.
     */
    limit?: number
  }

  /**
   * Notification upsert
   */
  export type NotificationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * The filter to search for the Notification to update in case it exists.
     */
    where: NotificationWhereUniqueInput
    /**
     * In case the Notification found by the `where` argument doesn't exist, create a new Notification with this data.
     */
    create: XOR<NotificationCreateInput, NotificationUncheckedCreateInput>
    /**
     * In case the Notification was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationUpdateInput, NotificationUncheckedUpdateInput>
  }

  /**
   * Notification delete
   */
  export type NotificationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
    /**
     * Filter which Notification to delete.
     */
    where: NotificationWhereUniqueInput
  }

  /**
   * Notification deleteMany
   */
  export type NotificationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Notifications to delete
     */
    where?: NotificationWhereInput
    /**
     * Limit how many Notifications to delete.
     */
    limit?: number
  }

  /**
   * Notification.reads
   */
  export type Notification$readsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    where?: NotificationReadWhereInput
    orderBy?: NotificationReadOrderByWithRelationInput | NotificationReadOrderByWithRelationInput[]
    cursor?: NotificationReadWhereUniqueInput
    take?: number
    skip?: number
    distinct?: NotificationReadScalarFieldEnum | NotificationReadScalarFieldEnum[]
  }

  /**
   * Notification without action
   */
  export type NotificationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Notification
     */
    select?: NotificationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Notification
     */
    omit?: NotificationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationInclude<ExtArgs> | null
  }


  /**
   * Model NotificationRead
   */

  export type AggregateNotificationRead = {
    _count: NotificationReadCountAggregateOutputType | null
    _avg: NotificationReadAvgAggregateOutputType | null
    _sum: NotificationReadSumAggregateOutputType | null
    _min: NotificationReadMinAggregateOutputType | null
    _max: NotificationReadMaxAggregateOutputType | null
  }

  export type NotificationReadAvgAggregateOutputType = {
    id: number | null
    notificationId: number | null
    tenantId: number | null
    userId: number | null
  }

  export type NotificationReadSumAggregateOutputType = {
    id: number | null
    notificationId: number | null
    tenantId: number | null
    userId: number | null
  }

  export type NotificationReadMinAggregateOutputType = {
    id: number | null
    notificationId: number | null
    tenantId: number | null
    userId: number | null
    readAt: Date | null
  }

  export type NotificationReadMaxAggregateOutputType = {
    id: number | null
    notificationId: number | null
    tenantId: number | null
    userId: number | null
    readAt: Date | null
  }

  export type NotificationReadCountAggregateOutputType = {
    id: number
    notificationId: number
    tenantId: number
    userId: number
    readAt: number
    _all: number
  }


  export type NotificationReadAvgAggregateInputType = {
    id?: true
    notificationId?: true
    tenantId?: true
    userId?: true
  }

  export type NotificationReadSumAggregateInputType = {
    id?: true
    notificationId?: true
    tenantId?: true
    userId?: true
  }

  export type NotificationReadMinAggregateInputType = {
    id?: true
    notificationId?: true
    tenantId?: true
    userId?: true
    readAt?: true
  }

  export type NotificationReadMaxAggregateInputType = {
    id?: true
    notificationId?: true
    tenantId?: true
    userId?: true
    readAt?: true
  }

  export type NotificationReadCountAggregateInputType = {
    id?: true
    notificationId?: true
    tenantId?: true
    userId?: true
    readAt?: true
    _all?: true
  }

  export type NotificationReadAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationRead to aggregate.
     */
    where?: NotificationReadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationReads to fetch.
     */
    orderBy?: NotificationReadOrderByWithRelationInput | NotificationReadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: NotificationReadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationReads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationReads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned NotificationReads
    **/
    _count?: true | NotificationReadCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: NotificationReadAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: NotificationReadSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: NotificationReadMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: NotificationReadMaxAggregateInputType
  }

  export type GetNotificationReadAggregateType<T extends NotificationReadAggregateArgs> = {
        [P in keyof T & keyof AggregateNotificationRead]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateNotificationRead[P]>
      : GetScalarType<T[P], AggregateNotificationRead[P]>
  }




  export type NotificationReadGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: NotificationReadWhereInput
    orderBy?: NotificationReadOrderByWithAggregationInput | NotificationReadOrderByWithAggregationInput[]
    by: NotificationReadScalarFieldEnum[] | NotificationReadScalarFieldEnum
    having?: NotificationReadScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: NotificationReadCountAggregateInputType | true
    _avg?: NotificationReadAvgAggregateInputType
    _sum?: NotificationReadSumAggregateInputType
    _min?: NotificationReadMinAggregateInputType
    _max?: NotificationReadMaxAggregateInputType
  }

  export type NotificationReadGroupByOutputType = {
    id: number
    notificationId: number
    tenantId: number
    userId: number
    readAt: Date
    _count: NotificationReadCountAggregateOutputType | null
    _avg: NotificationReadAvgAggregateOutputType | null
    _sum: NotificationReadSumAggregateOutputType | null
    _min: NotificationReadMinAggregateOutputType | null
    _max: NotificationReadMaxAggregateOutputType | null
  }

  type GetNotificationReadGroupByPayload<T extends NotificationReadGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<NotificationReadGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof NotificationReadGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], NotificationReadGroupByOutputType[P]>
            : GetScalarType<T[P], NotificationReadGroupByOutputType[P]>
        }
      >
    >


  export type NotificationReadSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    notificationId?: boolean
    tenantId?: boolean
    userId?: boolean
    readAt?: boolean
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["notificationRead"]>



  export type NotificationReadSelectScalar = {
    id?: boolean
    notificationId?: boolean
    tenantId?: boolean
    userId?: boolean
    readAt?: boolean
  }

  export type NotificationReadOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "notificationId" | "tenantId" | "userId" | "readAt", ExtArgs["result"]["notificationRead"]>
  export type NotificationReadInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    notification?: boolean | NotificationDefaultArgs<ExtArgs>
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $NotificationReadPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "NotificationRead"
    objects: {
      notification: Prisma.$NotificationPayload<ExtArgs>
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      notificationId: number
      tenantId: number
      userId: number
      readAt: Date
    }, ExtArgs["result"]["notificationRead"]>
    composites: {}
  }

  type NotificationReadGetPayload<S extends boolean | null | undefined | NotificationReadDefaultArgs> = $Result.GetResult<Prisma.$NotificationReadPayload, S>

  type NotificationReadCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<NotificationReadFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: NotificationReadCountAggregateInputType | true
    }

  export interface NotificationReadDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['NotificationRead'], meta: { name: 'NotificationRead' } }
    /**
     * Find zero or one NotificationRead that matches the filter.
     * @param {NotificationReadFindUniqueArgs} args - Arguments to find a NotificationRead
     * @example
     * // Get one NotificationRead
     * const notificationRead = await prisma.notificationRead.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends NotificationReadFindUniqueArgs>(args: SelectSubset<T, NotificationReadFindUniqueArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one NotificationRead that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {NotificationReadFindUniqueOrThrowArgs} args - Arguments to find a NotificationRead
     * @example
     * // Get one NotificationRead
     * const notificationRead = await prisma.notificationRead.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends NotificationReadFindUniqueOrThrowArgs>(args: SelectSubset<T, NotificationReadFindUniqueOrThrowArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationRead that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadFindFirstArgs} args - Arguments to find a NotificationRead
     * @example
     * // Get one NotificationRead
     * const notificationRead = await prisma.notificationRead.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends NotificationReadFindFirstArgs>(args?: SelectSubset<T, NotificationReadFindFirstArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first NotificationRead that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadFindFirstOrThrowArgs} args - Arguments to find a NotificationRead
     * @example
     * // Get one NotificationRead
     * const notificationRead = await prisma.notificationRead.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends NotificationReadFindFirstOrThrowArgs>(args?: SelectSubset<T, NotificationReadFindFirstOrThrowArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more NotificationReads that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all NotificationReads
     * const notificationReads = await prisma.notificationRead.findMany()
     * 
     * // Get first 10 NotificationReads
     * const notificationReads = await prisma.notificationRead.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const notificationReadWithIdOnly = await prisma.notificationRead.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends NotificationReadFindManyArgs>(args?: SelectSubset<T, NotificationReadFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a NotificationRead.
     * @param {NotificationReadCreateArgs} args - Arguments to create a NotificationRead.
     * @example
     * // Create one NotificationRead
     * const NotificationRead = await prisma.notificationRead.create({
     *   data: {
     *     // ... data to create a NotificationRead
     *   }
     * })
     * 
     */
    create<T extends NotificationReadCreateArgs>(args: SelectSubset<T, NotificationReadCreateArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many NotificationReads.
     * @param {NotificationReadCreateManyArgs} args - Arguments to create many NotificationReads.
     * @example
     * // Create many NotificationReads
     * const notificationRead = await prisma.notificationRead.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends NotificationReadCreateManyArgs>(args?: SelectSubset<T, NotificationReadCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a NotificationRead.
     * @param {NotificationReadDeleteArgs} args - Arguments to delete one NotificationRead.
     * @example
     * // Delete one NotificationRead
     * const NotificationRead = await prisma.notificationRead.delete({
     *   where: {
     *     // ... filter to delete one NotificationRead
     *   }
     * })
     * 
     */
    delete<T extends NotificationReadDeleteArgs>(args: SelectSubset<T, NotificationReadDeleteArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one NotificationRead.
     * @param {NotificationReadUpdateArgs} args - Arguments to update one NotificationRead.
     * @example
     * // Update one NotificationRead
     * const notificationRead = await prisma.notificationRead.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends NotificationReadUpdateArgs>(args: SelectSubset<T, NotificationReadUpdateArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more NotificationReads.
     * @param {NotificationReadDeleteManyArgs} args - Arguments to filter NotificationReads to delete.
     * @example
     * // Delete a few NotificationReads
     * const { count } = await prisma.notificationRead.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends NotificationReadDeleteManyArgs>(args?: SelectSubset<T, NotificationReadDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more NotificationReads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many NotificationReads
     * const notificationRead = await prisma.notificationRead.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends NotificationReadUpdateManyArgs>(args: SelectSubset<T, NotificationReadUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one NotificationRead.
     * @param {NotificationReadUpsertArgs} args - Arguments to update or create a NotificationRead.
     * @example
     * // Update or create a NotificationRead
     * const notificationRead = await prisma.notificationRead.upsert({
     *   create: {
     *     // ... data to create a NotificationRead
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the NotificationRead we want to update
     *   }
     * })
     */
    upsert<T extends NotificationReadUpsertArgs>(args: SelectSubset<T, NotificationReadUpsertArgs<ExtArgs>>): Prisma__NotificationReadClient<$Result.GetResult<Prisma.$NotificationReadPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of NotificationReads.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadCountArgs} args - Arguments to filter NotificationReads to count.
     * @example
     * // Count the number of NotificationReads
     * const count = await prisma.notificationRead.count({
     *   where: {
     *     // ... the filter for the NotificationReads we want to count
     *   }
     * })
    **/
    count<T extends NotificationReadCountArgs>(
      args?: Subset<T, NotificationReadCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], NotificationReadCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a NotificationRead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends NotificationReadAggregateArgs>(args: Subset<T, NotificationReadAggregateArgs>): Prisma.PrismaPromise<GetNotificationReadAggregateType<T>>

    /**
     * Group by NotificationRead.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {NotificationReadGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends NotificationReadGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: NotificationReadGroupByArgs['orderBy'] }
        : { orderBy?: NotificationReadGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, NotificationReadGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetNotificationReadGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the NotificationRead model
   */
  readonly fields: NotificationReadFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for NotificationRead.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__NotificationReadClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    notification<T extends NotificationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, NotificationDefaultArgs<ExtArgs>>): Prisma__NotificationClient<$Result.GetResult<Prisma.$NotificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the NotificationRead model
   */
  interface NotificationReadFieldRefs {
    readonly id: FieldRef<"NotificationRead", 'Int'>
    readonly notificationId: FieldRef<"NotificationRead", 'Int'>
    readonly tenantId: FieldRef<"NotificationRead", 'Int'>
    readonly userId: FieldRef<"NotificationRead", 'Int'>
    readonly readAt: FieldRef<"NotificationRead", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * NotificationRead findUnique
   */
  export type NotificationReadFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * Filter, which NotificationRead to fetch.
     */
    where: NotificationReadWhereUniqueInput
  }

  /**
   * NotificationRead findUniqueOrThrow
   */
  export type NotificationReadFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * Filter, which NotificationRead to fetch.
     */
    where: NotificationReadWhereUniqueInput
  }

  /**
   * NotificationRead findFirst
   */
  export type NotificationReadFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * Filter, which NotificationRead to fetch.
     */
    where?: NotificationReadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationReads to fetch.
     */
    orderBy?: NotificationReadOrderByWithRelationInput | NotificationReadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationReads.
     */
    cursor?: NotificationReadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationReads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationReads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationReads.
     */
    distinct?: NotificationReadScalarFieldEnum | NotificationReadScalarFieldEnum[]
  }

  /**
   * NotificationRead findFirstOrThrow
   */
  export type NotificationReadFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * Filter, which NotificationRead to fetch.
     */
    where?: NotificationReadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationReads to fetch.
     */
    orderBy?: NotificationReadOrderByWithRelationInput | NotificationReadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for NotificationReads.
     */
    cursor?: NotificationReadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationReads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationReads.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of NotificationReads.
     */
    distinct?: NotificationReadScalarFieldEnum | NotificationReadScalarFieldEnum[]
  }

  /**
   * NotificationRead findMany
   */
  export type NotificationReadFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * Filter, which NotificationReads to fetch.
     */
    where?: NotificationReadWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of NotificationReads to fetch.
     */
    orderBy?: NotificationReadOrderByWithRelationInput | NotificationReadOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing NotificationReads.
     */
    cursor?: NotificationReadWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` NotificationReads from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` NotificationReads.
     */
    skip?: number
    distinct?: NotificationReadScalarFieldEnum | NotificationReadScalarFieldEnum[]
  }

  /**
   * NotificationRead create
   */
  export type NotificationReadCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * The data needed to create a NotificationRead.
     */
    data: XOR<NotificationReadCreateInput, NotificationReadUncheckedCreateInput>
  }

  /**
   * NotificationRead createMany
   */
  export type NotificationReadCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many NotificationReads.
     */
    data: NotificationReadCreateManyInput | NotificationReadCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * NotificationRead update
   */
  export type NotificationReadUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * The data needed to update a NotificationRead.
     */
    data: XOR<NotificationReadUpdateInput, NotificationReadUncheckedUpdateInput>
    /**
     * Choose, which NotificationRead to update.
     */
    where: NotificationReadWhereUniqueInput
  }

  /**
   * NotificationRead updateMany
   */
  export type NotificationReadUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update NotificationReads.
     */
    data: XOR<NotificationReadUpdateManyMutationInput, NotificationReadUncheckedUpdateManyInput>
    /**
     * Filter which NotificationReads to update
     */
    where?: NotificationReadWhereInput
    /**
     * Limit how many NotificationReads to update.
     */
    limit?: number
  }

  /**
   * NotificationRead upsert
   */
  export type NotificationReadUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * The filter to search for the NotificationRead to update in case it exists.
     */
    where: NotificationReadWhereUniqueInput
    /**
     * In case the NotificationRead found by the `where` argument doesn't exist, create a new NotificationRead with this data.
     */
    create: XOR<NotificationReadCreateInput, NotificationReadUncheckedCreateInput>
    /**
     * In case the NotificationRead was found with the provided `where` argument, update it with this data.
     */
    update: XOR<NotificationReadUpdateInput, NotificationReadUncheckedUpdateInput>
  }

  /**
   * NotificationRead delete
   */
  export type NotificationReadDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
    /**
     * Filter which NotificationRead to delete.
     */
    where: NotificationReadWhereUniqueInput
  }

  /**
   * NotificationRead deleteMany
   */
  export type NotificationReadDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which NotificationReads to delete
     */
    where?: NotificationReadWhereInput
    /**
     * Limit how many NotificationReads to delete.
     */
    limit?: number
  }

  /**
   * NotificationRead without action
   */
  export type NotificationReadDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the NotificationRead
     */
    select?: NotificationReadSelect<ExtArgs> | null
    /**
     * Omit specific fields from the NotificationRead
     */
    omit?: NotificationReadOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: NotificationReadInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SuperAdminScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    active: 'active',
    createdAt: 'createdAt'
  };

  export type SuperAdminScalarFieldEnum = (typeof SuperAdminScalarFieldEnum)[keyof typeof SuperAdminScalarFieldEnum]


  export const TenantScalarFieldEnum: {
    id: 'id',
    labName: 'labName',
    adminName: 'adminName',
    adminEmail: 'adminEmail',
    passwordHash: 'passwordHash',
    dbUrlEncrypted: 'dbUrlEncrypted',
    dbHost: 'dbHost',
    dbFingerprint: 'dbFingerprint',
    connectedAt: 'connectedAt',
    lastLoginAt: 'lastLoginAt',
    failedLoginCount: 'failedLoginCount',
    lockedUntil: 'lockedUntil',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const TenantUserScalarFieldEnum: {
    email: 'email',
    tenantId: 'tenantId'
  };

  export type TenantUserScalarFieldEnum = (typeof TenantUserScalarFieldEnum)[keyof typeof TenantUserScalarFieldEnum]


  export const TenantSessionScalarFieldEnum: {
    tokenHash: 'tokenHash',
    tenantId: 'tenantId',
    expiresAt: 'expiresAt'
  };

  export type TenantSessionScalarFieldEnum = (typeof TenantSessionScalarFieldEnum)[keyof typeof TenantSessionScalarFieldEnum]


  export const NotificationScalarFieldEnum: {
    id: 'id',
    title: 'title',
    message: 'message',
    createdAt: 'createdAt',
    expiresAt: 'expiresAt',
    active: 'active'
  };

  export type NotificationScalarFieldEnum = (typeof NotificationScalarFieldEnum)[keyof typeof NotificationScalarFieldEnum]


  export const NotificationReadScalarFieldEnum: {
    id: 'id',
    notificationId: 'notificationId',
    tenantId: 'tenantId',
    userId: 'userId',
    readAt: 'readAt'
  };

  export type NotificationReadScalarFieldEnum = (typeof NotificationReadScalarFieldEnum)[keyof typeof NotificationReadScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const SuperAdminOrderByRelevanceFieldEnum: {
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash'
  };

  export type SuperAdminOrderByRelevanceFieldEnum = (typeof SuperAdminOrderByRelevanceFieldEnum)[keyof typeof SuperAdminOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const TenantOrderByRelevanceFieldEnum: {
    labName: 'labName',
    adminName: 'adminName',
    adminEmail: 'adminEmail',
    passwordHash: 'passwordHash',
    dbUrlEncrypted: 'dbUrlEncrypted',
    dbHost: 'dbHost',
    dbFingerprint: 'dbFingerprint'
  };

  export type TenantOrderByRelevanceFieldEnum = (typeof TenantOrderByRelevanceFieldEnum)[keyof typeof TenantOrderByRelevanceFieldEnum]


  export const TenantUserOrderByRelevanceFieldEnum: {
    email: 'email'
  };

  export type TenantUserOrderByRelevanceFieldEnum = (typeof TenantUserOrderByRelevanceFieldEnum)[keyof typeof TenantUserOrderByRelevanceFieldEnum]


  export const TenantSessionOrderByRelevanceFieldEnum: {
    tokenHash: 'tokenHash'
  };

  export type TenantSessionOrderByRelevanceFieldEnum = (typeof TenantSessionOrderByRelevanceFieldEnum)[keyof typeof TenantSessionOrderByRelevanceFieldEnum]


  export const NotificationOrderByRelevanceFieldEnum: {
    title: 'title',
    message: 'message'
  };

  export type NotificationOrderByRelevanceFieldEnum = (typeof NotificationOrderByRelevanceFieldEnum)[keyof typeof NotificationOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type SuperAdminWhereInput = {
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    id?: IntFilter<"SuperAdmin"> | number
    name?: StringFilter<"SuperAdmin"> | string
    email?: StringFilter<"SuperAdmin"> | string
    passwordHash?: StringFilter<"SuperAdmin"> | string
    active?: BoolFilter<"SuperAdmin"> | boolean
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }

  export type SuperAdminOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    _relevance?: SuperAdminOrderByRelevanceInput
  }

  export type SuperAdminWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    name?: StringFilter<"SuperAdmin"> | string
    passwordHash?: StringFilter<"SuperAdmin"> | string
    active?: BoolFilter<"SuperAdmin"> | boolean
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
  }, "id" | "email">

  export type SuperAdminOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    _count?: SuperAdminCountOrderByAggregateInput
    _avg?: SuperAdminAvgOrderByAggregateInput
    _max?: SuperAdminMaxOrderByAggregateInput
    _min?: SuperAdminMinOrderByAggregateInput
    _sum?: SuperAdminSumOrderByAggregateInput
  }

  export type SuperAdminScalarWhereWithAggregatesInput = {
    AND?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    OR?: SuperAdminScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SuperAdmin"> | number
    name?: StringWithAggregatesFilter<"SuperAdmin"> | string
    email?: StringWithAggregatesFilter<"SuperAdmin"> | string
    passwordHash?: StringWithAggregatesFilter<"SuperAdmin"> | string
    active?: BoolWithAggregatesFilter<"SuperAdmin"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
  }

  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: IntFilter<"Tenant"> | number
    labName?: StringFilter<"Tenant"> | string
    adminName?: StringFilter<"Tenant"> | string
    adminEmail?: StringFilter<"Tenant"> | string
    passwordHash?: StringFilter<"Tenant"> | string
    dbUrlEncrypted?: StringNullableFilter<"Tenant"> | string | null
    dbHost?: StringNullableFilter<"Tenant"> | string | null
    dbFingerprint?: StringNullableFilter<"Tenant"> | string | null
    connectedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    lastLoginAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    failedLoginCount?: IntFilter<"Tenant"> | number
    lockedUntil?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    active?: BoolFilter<"Tenant"> | boolean
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: TenantUserListRelationFilter
    sessions?: TenantSessionListRelationFilter
    notificationReads?: NotificationReadListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    labName?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    passwordHash?: SortOrder
    dbUrlEncrypted?: SortOrderInput | SortOrder
    dbHost?: SortOrderInput | SortOrder
    dbFingerprint?: SortOrderInput | SortOrder
    connectedAt?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    failedLoginCount?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: TenantUserOrderByRelationAggregateInput
    sessions?: TenantSessionOrderByRelationAggregateInput
    notificationReads?: NotificationReadOrderByRelationAggregateInput
    _relevance?: TenantOrderByRelevanceInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    adminEmail?: string
    dbFingerprint?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    labName?: StringFilter<"Tenant"> | string
    adminName?: StringFilter<"Tenant"> | string
    passwordHash?: StringFilter<"Tenant"> | string
    dbUrlEncrypted?: StringNullableFilter<"Tenant"> | string | null
    dbHost?: StringNullableFilter<"Tenant"> | string | null
    connectedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    lastLoginAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    failedLoginCount?: IntFilter<"Tenant"> | number
    lockedUntil?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    active?: BoolFilter<"Tenant"> | boolean
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    users?: TenantUserListRelationFilter
    sessions?: TenantSessionListRelationFilter
    notificationReads?: NotificationReadListRelationFilter
  }, "id" | "adminEmail" | "dbFingerprint">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    labName?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    passwordHash?: SortOrder
    dbUrlEncrypted?: SortOrderInput | SortOrder
    dbHost?: SortOrderInput | SortOrder
    dbFingerprint?: SortOrderInput | SortOrder
    connectedAt?: SortOrderInput | SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    failedLoginCount?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Tenant"> | number
    labName?: StringWithAggregatesFilter<"Tenant"> | string
    adminName?: StringWithAggregatesFilter<"Tenant"> | string
    adminEmail?: StringWithAggregatesFilter<"Tenant"> | string
    passwordHash?: StringWithAggregatesFilter<"Tenant"> | string
    dbUrlEncrypted?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    dbHost?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    dbFingerprint?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    connectedAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    failedLoginCount?: IntWithAggregatesFilter<"Tenant"> | number
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    active?: BoolWithAggregatesFilter<"Tenant"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
  }

  export type TenantUserWhereInput = {
    AND?: TenantUserWhereInput | TenantUserWhereInput[]
    OR?: TenantUserWhereInput[]
    NOT?: TenantUserWhereInput | TenantUserWhereInput[]
    email?: StringFilter<"TenantUser"> | string
    tenantId?: IntFilter<"TenantUser"> | number
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TenantUserOrderByWithRelationInput = {
    email?: SortOrder
    tenantId?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: TenantUserOrderByRelevanceInput
  }

  export type TenantUserWhereUniqueInput = Prisma.AtLeast<{
    email?: string
    AND?: TenantUserWhereInput | TenantUserWhereInput[]
    OR?: TenantUserWhereInput[]
    NOT?: TenantUserWhereInput | TenantUserWhereInput[]
    tenantId?: IntFilter<"TenantUser"> | number
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "email">

  export type TenantUserOrderByWithAggregationInput = {
    email?: SortOrder
    tenantId?: SortOrder
    _count?: TenantUserCountOrderByAggregateInput
    _avg?: TenantUserAvgOrderByAggregateInput
    _max?: TenantUserMaxOrderByAggregateInput
    _min?: TenantUserMinOrderByAggregateInput
    _sum?: TenantUserSumOrderByAggregateInput
  }

  export type TenantUserScalarWhereWithAggregatesInput = {
    AND?: TenantUserScalarWhereWithAggregatesInput | TenantUserScalarWhereWithAggregatesInput[]
    OR?: TenantUserScalarWhereWithAggregatesInput[]
    NOT?: TenantUserScalarWhereWithAggregatesInput | TenantUserScalarWhereWithAggregatesInput[]
    email?: StringWithAggregatesFilter<"TenantUser"> | string
    tenantId?: IntWithAggregatesFilter<"TenantUser"> | number
  }

  export type TenantSessionWhereInput = {
    AND?: TenantSessionWhereInput | TenantSessionWhereInput[]
    OR?: TenantSessionWhereInput[]
    NOT?: TenantSessionWhereInput | TenantSessionWhereInput[]
    tokenHash?: StringFilter<"TenantSession"> | string
    tenantId?: IntFilter<"TenantSession"> | number
    expiresAt?: DateTimeFilter<"TenantSession"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type TenantSessionOrderByWithRelationInput = {
    tokenHash?: SortOrder
    tenantId?: SortOrder
    expiresAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    _relevance?: TenantSessionOrderByRelevanceInput
  }

  export type TenantSessionWhereUniqueInput = Prisma.AtLeast<{
    tokenHash?: string
    AND?: TenantSessionWhereInput | TenantSessionWhereInput[]
    OR?: TenantSessionWhereInput[]
    NOT?: TenantSessionWhereInput | TenantSessionWhereInput[]
    tenantId?: IntFilter<"TenantSession"> | number
    expiresAt?: DateTimeFilter<"TenantSession"> | Date | string
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "tokenHash">

  export type TenantSessionOrderByWithAggregationInput = {
    tokenHash?: SortOrder
    tenantId?: SortOrder
    expiresAt?: SortOrder
    _count?: TenantSessionCountOrderByAggregateInput
    _avg?: TenantSessionAvgOrderByAggregateInput
    _max?: TenantSessionMaxOrderByAggregateInput
    _min?: TenantSessionMinOrderByAggregateInput
    _sum?: TenantSessionSumOrderByAggregateInput
  }

  export type TenantSessionScalarWhereWithAggregatesInput = {
    AND?: TenantSessionScalarWhereWithAggregatesInput | TenantSessionScalarWhereWithAggregatesInput[]
    OR?: TenantSessionScalarWhereWithAggregatesInput[]
    NOT?: TenantSessionScalarWhereWithAggregatesInput | TenantSessionScalarWhereWithAggregatesInput[]
    tokenHash?: StringWithAggregatesFilter<"TenantSession"> | string
    tenantId?: IntWithAggregatesFilter<"TenantSession"> | number
    expiresAt?: DateTimeWithAggregatesFilter<"TenantSession"> | Date | string
  }

  export type NotificationWhereInput = {
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    id?: IntFilter<"Notification"> | number
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    expiresAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    active?: BoolFilter<"Notification"> | boolean
    reads?: NotificationReadListRelationFilter
  }

  export type NotificationOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    active?: SortOrder
    reads?: NotificationReadOrderByRelationAggregateInput
    _relevance?: NotificationOrderByRelevanceInput
  }

  export type NotificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: NotificationWhereInput | NotificationWhereInput[]
    OR?: NotificationWhereInput[]
    NOT?: NotificationWhereInput | NotificationWhereInput[]
    title?: StringFilter<"Notification"> | string
    message?: StringFilter<"Notification"> | string
    createdAt?: DateTimeFilter<"Notification"> | Date | string
    expiresAt?: DateTimeNullableFilter<"Notification"> | Date | string | null
    active?: BoolFilter<"Notification"> | boolean
    reads?: NotificationReadListRelationFilter
  }, "id">

  export type NotificationOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    active?: SortOrder
    _count?: NotificationCountOrderByAggregateInput
    _avg?: NotificationAvgOrderByAggregateInput
    _max?: NotificationMaxOrderByAggregateInput
    _min?: NotificationMinOrderByAggregateInput
    _sum?: NotificationSumOrderByAggregateInput
  }

  export type NotificationScalarWhereWithAggregatesInput = {
    AND?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    OR?: NotificationScalarWhereWithAggregatesInput[]
    NOT?: NotificationScalarWhereWithAggregatesInput | NotificationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Notification"> | number
    title?: StringWithAggregatesFilter<"Notification"> | string
    message?: StringWithAggregatesFilter<"Notification"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Notification"> | Date | string
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Notification"> | Date | string | null
    active?: BoolWithAggregatesFilter<"Notification"> | boolean
  }

  export type NotificationReadWhereInput = {
    AND?: NotificationReadWhereInput | NotificationReadWhereInput[]
    OR?: NotificationReadWhereInput[]
    NOT?: NotificationReadWhereInput | NotificationReadWhereInput[]
    id?: IntFilter<"NotificationRead"> | number
    notificationId?: IntFilter<"NotificationRead"> | number
    tenantId?: IntFilter<"NotificationRead"> | number
    userId?: IntFilter<"NotificationRead"> | number
    readAt?: DateTimeFilter<"NotificationRead"> | Date | string
    notification?: XOR<NotificationScalarRelationFilter, NotificationWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }

  export type NotificationReadOrderByWithRelationInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
    notification?: NotificationOrderByWithRelationInput
    tenant?: TenantOrderByWithRelationInput
  }

  export type NotificationReadWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    notificationId_tenantId_userId?: NotificationReadNotificationIdTenantIdUserIdCompoundUniqueInput
    AND?: NotificationReadWhereInput | NotificationReadWhereInput[]
    OR?: NotificationReadWhereInput[]
    NOT?: NotificationReadWhereInput | NotificationReadWhereInput[]
    notificationId?: IntFilter<"NotificationRead"> | number
    tenantId?: IntFilter<"NotificationRead"> | number
    userId?: IntFilter<"NotificationRead"> | number
    readAt?: DateTimeFilter<"NotificationRead"> | Date | string
    notification?: XOR<NotificationScalarRelationFilter, NotificationWhereInput>
    tenant?: XOR<TenantScalarRelationFilter, TenantWhereInput>
  }, "id" | "notificationId_tenantId_userId">

  export type NotificationReadOrderByWithAggregationInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
    _count?: NotificationReadCountOrderByAggregateInput
    _avg?: NotificationReadAvgOrderByAggregateInput
    _max?: NotificationReadMaxOrderByAggregateInput
    _min?: NotificationReadMinOrderByAggregateInput
    _sum?: NotificationReadSumOrderByAggregateInput
  }

  export type NotificationReadScalarWhereWithAggregatesInput = {
    AND?: NotificationReadScalarWhereWithAggregatesInput | NotificationReadScalarWhereWithAggregatesInput[]
    OR?: NotificationReadScalarWhereWithAggregatesInput[]
    NOT?: NotificationReadScalarWhereWithAggregatesInput | NotificationReadScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"NotificationRead"> | number
    notificationId?: IntWithAggregatesFilter<"NotificationRead"> | number
    tenantId?: IntWithAggregatesFilter<"NotificationRead"> | number
    userId?: IntWithAggregatesFilter<"NotificationRead"> | number
    readAt?: DateTimeWithAggregatesFilter<"NotificationRead"> | Date | string
  }

  export type SuperAdminCreateInput = {
    name: string
    email: string
    passwordHash: string
    active?: boolean
    createdAt?: Date | string
  }

  export type SuperAdminUncheckedCreateInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    active?: boolean
    createdAt?: Date | string
  }

  export type SuperAdminUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminCreateManyInput = {
    id?: number
    name: string
    email: string
    passwordHash: string
    active?: boolean
    createdAt?: Date | string
  }

  export type SuperAdminUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantCreateInput = {
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantUserCreateNestedManyWithoutTenantInput
    sessions?: TenantSessionCreateNestedManyWithoutTenantInput
    notificationReads?: NotificationReadCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: number
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantUserUncheckedCreateNestedManyWithoutTenantInput
    sessions?: TenantSessionUncheckedCreateNestedManyWithoutTenantInput
    notificationReads?: NotificationReadUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantUserUpdateManyWithoutTenantNestedInput
    sessions?: TenantSessionUpdateManyWithoutTenantNestedInput
    notificationReads?: NotificationReadUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantUserUncheckedUpdateManyWithoutTenantNestedInput
    sessions?: TenantSessionUncheckedUpdateManyWithoutTenantNestedInput
    notificationReads?: NotificationReadUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: number
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TenantUpdateManyMutationInput = {
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUserCreateInput = {
    email: string
    tenant: TenantCreateNestedOneWithoutUsersInput
  }

  export type TenantUserUncheckedCreateInput = {
    email: string
    tenantId: number
  }

  export type TenantUserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    tenant?: TenantUpdateOneRequiredWithoutUsersNestedInput
  }

  export type TenantUserUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    tenantId?: IntFieldUpdateOperationsInput | number
  }

  export type TenantUserCreateManyInput = {
    email: string
    tenantId: number
  }

  export type TenantUserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUserUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string
    tenantId?: IntFieldUpdateOperationsInput | number
  }

  export type TenantSessionCreateInput = {
    tokenHash: string
    expiresAt: Date | string
    tenant: TenantCreateNestedOneWithoutSessionsInput
  }

  export type TenantSessionUncheckedCreateInput = {
    tokenHash: string
    tenantId: number
    expiresAt: Date | string
  }

  export type TenantSessionUpdateInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutSessionsNestedInput
  }

  export type TenantSessionUncheckedUpdateInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    tenantId?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSessionCreateManyInput = {
    tokenHash: string
    tenantId: number
    expiresAt: Date | string
  }

  export type TenantSessionUpdateManyMutationInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSessionUncheckedUpdateManyInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    tenantId?: IntFieldUpdateOperationsInput | number
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationCreateInput = {
    title: string
    message: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    active?: boolean
    reads?: NotificationReadCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUncheckedCreateInput = {
    id?: number
    title: string
    message: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    active?: boolean
    reads?: NotificationReadUncheckedCreateNestedManyWithoutNotificationInput
  }

  export type NotificationUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    reads?: NotificationReadUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    reads?: NotificationReadUncheckedUpdateManyWithoutNotificationNestedInput
  }

  export type NotificationCreateManyInput = {
    id?: number
    title: string
    message: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    active?: boolean
  }

  export type NotificationUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationReadCreateInput = {
    userId: number
    readAt?: Date | string
    notification: NotificationCreateNestedOneWithoutReadsInput
    tenant: TenantCreateNestedOneWithoutNotificationReadsInput
  }

  export type NotificationReadUncheckedCreateInput = {
    id?: number
    notificationId: number
    tenantId: number
    userId: number
    readAt?: Date | string
  }

  export type NotificationReadUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notification?: NotificationUpdateOneRequiredWithoutReadsNestedInput
    tenant?: TenantUpdateOneRequiredWithoutNotificationReadsNestedInput
  }

  export type NotificationReadUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    notificationId?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationReadCreateManyInput = {
    id?: number
    notificationId: number
    tenantId: number
    userId: number
    readAt?: Date | string
  }

  export type NotificationReadUpdateManyMutationInput = {
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationReadUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    notificationId?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SuperAdminOrderByRelevanceInput = {
    fields: SuperAdminOrderByRelevanceFieldEnum | SuperAdminOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SuperAdminCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SuperAdminMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
  }

  export type SuperAdminSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type TenantUserListRelationFilter = {
    every?: TenantUserWhereInput
    some?: TenantUserWhereInput
    none?: TenantUserWhereInput
  }

  export type TenantSessionListRelationFilter = {
    every?: TenantSessionWhereInput
    some?: TenantSessionWhereInput
    none?: TenantSessionWhereInput
  }

  export type NotificationReadListRelationFilter = {
    every?: NotificationReadWhereInput
    some?: NotificationReadWhereInput
    none?: NotificationReadWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TenantUserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type NotificationReadOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantOrderByRelevanceInput = {
    fields: TenantOrderByRelevanceFieldEnum | TenantOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    labName?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    passwordHash?: SortOrder
    dbUrlEncrypted?: SortOrder
    dbHost?: SortOrder
    dbFingerprint?: SortOrder
    connectedAt?: SortOrder
    lastLoginAt?: SortOrder
    failedLoginCount?: SortOrder
    lockedUntil?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    id?: SortOrder
    failedLoginCount?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    labName?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    passwordHash?: SortOrder
    dbUrlEncrypted?: SortOrder
    dbHost?: SortOrder
    dbFingerprint?: SortOrder
    connectedAt?: SortOrder
    lastLoginAt?: SortOrder
    failedLoginCount?: SortOrder
    lockedUntil?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    labName?: SortOrder
    adminName?: SortOrder
    adminEmail?: SortOrder
    passwordHash?: SortOrder
    dbUrlEncrypted?: SortOrder
    dbHost?: SortOrder
    dbFingerprint?: SortOrder
    connectedAt?: SortOrder
    lastLoginAt?: SortOrder
    failedLoginCount?: SortOrder
    lockedUntil?: SortOrder
    active?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    id?: SortOrder
    failedLoginCount?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type TenantScalarRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type TenantUserOrderByRelevanceInput = {
    fields: TenantUserOrderByRelevanceFieldEnum | TenantUserOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TenantUserCountOrderByAggregateInput = {
    email?: SortOrder
    tenantId?: SortOrder
  }

  export type TenantUserAvgOrderByAggregateInput = {
    tenantId?: SortOrder
  }

  export type TenantUserMaxOrderByAggregateInput = {
    email?: SortOrder
    tenantId?: SortOrder
  }

  export type TenantUserMinOrderByAggregateInput = {
    email?: SortOrder
    tenantId?: SortOrder
  }

  export type TenantUserSumOrderByAggregateInput = {
    tenantId?: SortOrder
  }

  export type TenantSessionOrderByRelevanceInput = {
    fields: TenantSessionOrderByRelevanceFieldEnum | TenantSessionOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type TenantSessionCountOrderByAggregateInput = {
    tokenHash?: SortOrder
    tenantId?: SortOrder
    expiresAt?: SortOrder
  }

  export type TenantSessionAvgOrderByAggregateInput = {
    tenantId?: SortOrder
  }

  export type TenantSessionMaxOrderByAggregateInput = {
    tokenHash?: SortOrder
    tenantId?: SortOrder
    expiresAt?: SortOrder
  }

  export type TenantSessionMinOrderByAggregateInput = {
    tokenHash?: SortOrder
    tenantId?: SortOrder
    expiresAt?: SortOrder
  }

  export type TenantSessionSumOrderByAggregateInput = {
    tenantId?: SortOrder
  }

  export type NotificationOrderByRelevanceInput = {
    fields: NotificationOrderByRelevanceFieldEnum | NotificationOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type NotificationCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
  }

  export type NotificationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type NotificationMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
  }

  export type NotificationMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    message?: SortOrder
    createdAt?: SortOrder
    expiresAt?: SortOrder
    active?: SortOrder
  }

  export type NotificationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type NotificationScalarRelationFilter = {
    is?: NotificationWhereInput
    isNot?: NotificationWhereInput
  }

  export type NotificationReadNotificationIdTenantIdUserIdCompoundUniqueInput = {
    notificationId: number
    tenantId: number
    userId: number
  }

  export type NotificationReadCountOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
  }

  export type NotificationReadAvgOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
  }

  export type NotificationReadMaxOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
  }

  export type NotificationReadMinOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
    readAt?: SortOrder
  }

  export type NotificationReadSumOrderByAggregateInput = {
    id?: SortOrder
    notificationId?: SortOrder
    tenantId?: SortOrder
    userId?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TenantUserCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantUserCreateWithoutTenantInput, TenantUserUncheckedCreateWithoutTenantInput> | TenantUserCreateWithoutTenantInput[] | TenantUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserCreateOrConnectWithoutTenantInput | TenantUserCreateOrConnectWithoutTenantInput[]
    createMany?: TenantUserCreateManyTenantInputEnvelope
    connect?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
  }

  export type TenantSessionCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantSessionCreateWithoutTenantInput, TenantSessionUncheckedCreateWithoutTenantInput> | TenantSessionCreateWithoutTenantInput[] | TenantSessionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSessionCreateOrConnectWithoutTenantInput | TenantSessionCreateOrConnectWithoutTenantInput[]
    createMany?: TenantSessionCreateManyTenantInputEnvelope
    connect?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
  }

  export type NotificationReadCreateNestedManyWithoutTenantInput = {
    create?: XOR<NotificationReadCreateWithoutTenantInput, NotificationReadUncheckedCreateWithoutTenantInput> | NotificationReadCreateWithoutTenantInput[] | NotificationReadUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutTenantInput | NotificationReadCreateOrConnectWithoutTenantInput[]
    createMany?: NotificationReadCreateManyTenantInputEnvelope
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
  }

  export type TenantUserUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantUserCreateWithoutTenantInput, TenantUserUncheckedCreateWithoutTenantInput> | TenantUserCreateWithoutTenantInput[] | TenantUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserCreateOrConnectWithoutTenantInput | TenantUserCreateOrConnectWithoutTenantInput[]
    createMany?: TenantUserCreateManyTenantInputEnvelope
    connect?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
  }

  export type TenantSessionUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantSessionCreateWithoutTenantInput, TenantSessionUncheckedCreateWithoutTenantInput> | TenantSessionCreateWithoutTenantInput[] | TenantSessionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSessionCreateOrConnectWithoutTenantInput | TenantSessionCreateOrConnectWithoutTenantInput[]
    createMany?: TenantSessionCreateManyTenantInputEnvelope
    connect?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
  }

  export type NotificationReadUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<NotificationReadCreateWithoutTenantInput, NotificationReadUncheckedCreateWithoutTenantInput> | NotificationReadCreateWithoutTenantInput[] | NotificationReadUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutTenantInput | NotificationReadCreateOrConnectWithoutTenantInput[]
    createMany?: NotificationReadCreateManyTenantInputEnvelope
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type TenantUserUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantUserCreateWithoutTenantInput, TenantUserUncheckedCreateWithoutTenantInput> | TenantUserCreateWithoutTenantInput[] | TenantUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserCreateOrConnectWithoutTenantInput | TenantUserCreateOrConnectWithoutTenantInput[]
    upsert?: TenantUserUpsertWithWhereUniqueWithoutTenantInput | TenantUserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantUserCreateManyTenantInputEnvelope
    set?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    disconnect?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    delete?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    connect?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    update?: TenantUserUpdateWithWhereUniqueWithoutTenantInput | TenantUserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantUserUpdateManyWithWhereWithoutTenantInput | TenantUserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantUserScalarWhereInput | TenantUserScalarWhereInput[]
  }

  export type TenantSessionUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantSessionCreateWithoutTenantInput, TenantSessionUncheckedCreateWithoutTenantInput> | TenantSessionCreateWithoutTenantInput[] | TenantSessionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSessionCreateOrConnectWithoutTenantInput | TenantSessionCreateOrConnectWithoutTenantInput[]
    upsert?: TenantSessionUpsertWithWhereUniqueWithoutTenantInput | TenantSessionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantSessionCreateManyTenantInputEnvelope
    set?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    disconnect?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    delete?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    connect?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    update?: TenantSessionUpdateWithWhereUniqueWithoutTenantInput | TenantSessionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantSessionUpdateManyWithWhereWithoutTenantInput | TenantSessionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantSessionScalarWhereInput | TenantSessionScalarWhereInput[]
  }

  export type NotificationReadUpdateManyWithoutTenantNestedInput = {
    create?: XOR<NotificationReadCreateWithoutTenantInput, NotificationReadUncheckedCreateWithoutTenantInput> | NotificationReadCreateWithoutTenantInput[] | NotificationReadUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutTenantInput | NotificationReadCreateOrConnectWithoutTenantInput[]
    upsert?: NotificationReadUpsertWithWhereUniqueWithoutTenantInput | NotificationReadUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: NotificationReadCreateManyTenantInputEnvelope
    set?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    disconnect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    delete?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    update?: NotificationReadUpdateWithWhereUniqueWithoutTenantInput | NotificationReadUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: NotificationReadUpdateManyWithWhereWithoutTenantInput | NotificationReadUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: NotificationReadScalarWhereInput | NotificationReadScalarWhereInput[]
  }

  export type TenantUserUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantUserCreateWithoutTenantInput, TenantUserUncheckedCreateWithoutTenantInput> | TenantUserCreateWithoutTenantInput[] | TenantUserUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUserCreateOrConnectWithoutTenantInput | TenantUserCreateOrConnectWithoutTenantInput[]
    upsert?: TenantUserUpsertWithWhereUniqueWithoutTenantInput | TenantUserUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantUserCreateManyTenantInputEnvelope
    set?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    disconnect?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    delete?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    connect?: TenantUserWhereUniqueInput | TenantUserWhereUniqueInput[]
    update?: TenantUserUpdateWithWhereUniqueWithoutTenantInput | TenantUserUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantUserUpdateManyWithWhereWithoutTenantInput | TenantUserUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantUserScalarWhereInput | TenantUserScalarWhereInput[]
  }

  export type TenantSessionUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantSessionCreateWithoutTenantInput, TenantSessionUncheckedCreateWithoutTenantInput> | TenantSessionCreateWithoutTenantInput[] | TenantSessionUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantSessionCreateOrConnectWithoutTenantInput | TenantSessionCreateOrConnectWithoutTenantInput[]
    upsert?: TenantSessionUpsertWithWhereUniqueWithoutTenantInput | TenantSessionUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantSessionCreateManyTenantInputEnvelope
    set?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    disconnect?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    delete?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    connect?: TenantSessionWhereUniqueInput | TenantSessionWhereUniqueInput[]
    update?: TenantSessionUpdateWithWhereUniqueWithoutTenantInput | TenantSessionUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantSessionUpdateManyWithWhereWithoutTenantInput | TenantSessionUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantSessionScalarWhereInput | TenantSessionScalarWhereInput[]
  }

  export type NotificationReadUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<NotificationReadCreateWithoutTenantInput, NotificationReadUncheckedCreateWithoutTenantInput> | NotificationReadCreateWithoutTenantInput[] | NotificationReadUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutTenantInput | NotificationReadCreateOrConnectWithoutTenantInput[]
    upsert?: NotificationReadUpsertWithWhereUniqueWithoutTenantInput | NotificationReadUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: NotificationReadCreateManyTenantInputEnvelope
    set?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    disconnect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    delete?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    update?: NotificationReadUpdateWithWhereUniqueWithoutTenantInput | NotificationReadUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: NotificationReadUpdateManyWithWhereWithoutTenantInput | NotificationReadUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: NotificationReadScalarWhereInput | NotificationReadScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutUsersInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsersInput
    upsert?: TenantUpsertWithoutUsersInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsersInput, TenantUpdateWithoutUsersInput>, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantCreateNestedOneWithoutSessionsInput = {
    create?: XOR<TenantCreateWithoutSessionsInput, TenantUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSessionsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: XOR<TenantCreateWithoutSessionsInput, TenantUncheckedCreateWithoutSessionsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutSessionsInput
    upsert?: TenantUpsertWithoutSessionsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutSessionsInput, TenantUpdateWithoutSessionsInput>, TenantUncheckedUpdateWithoutSessionsInput>
  }

  export type NotificationReadCreateNestedManyWithoutNotificationInput = {
    create?: XOR<NotificationReadCreateWithoutNotificationInput, NotificationReadUncheckedCreateWithoutNotificationInput> | NotificationReadCreateWithoutNotificationInput[] | NotificationReadUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutNotificationInput | NotificationReadCreateOrConnectWithoutNotificationInput[]
    createMany?: NotificationReadCreateManyNotificationInputEnvelope
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
  }

  export type NotificationReadUncheckedCreateNestedManyWithoutNotificationInput = {
    create?: XOR<NotificationReadCreateWithoutNotificationInput, NotificationReadUncheckedCreateWithoutNotificationInput> | NotificationReadCreateWithoutNotificationInput[] | NotificationReadUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutNotificationInput | NotificationReadCreateOrConnectWithoutNotificationInput[]
    createMany?: NotificationReadCreateManyNotificationInputEnvelope
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
  }

  export type NotificationReadUpdateManyWithoutNotificationNestedInput = {
    create?: XOR<NotificationReadCreateWithoutNotificationInput, NotificationReadUncheckedCreateWithoutNotificationInput> | NotificationReadCreateWithoutNotificationInput[] | NotificationReadUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutNotificationInput | NotificationReadCreateOrConnectWithoutNotificationInput[]
    upsert?: NotificationReadUpsertWithWhereUniqueWithoutNotificationInput | NotificationReadUpsertWithWhereUniqueWithoutNotificationInput[]
    createMany?: NotificationReadCreateManyNotificationInputEnvelope
    set?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    disconnect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    delete?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    update?: NotificationReadUpdateWithWhereUniqueWithoutNotificationInput | NotificationReadUpdateWithWhereUniqueWithoutNotificationInput[]
    updateMany?: NotificationReadUpdateManyWithWhereWithoutNotificationInput | NotificationReadUpdateManyWithWhereWithoutNotificationInput[]
    deleteMany?: NotificationReadScalarWhereInput | NotificationReadScalarWhereInput[]
  }

  export type NotificationReadUncheckedUpdateManyWithoutNotificationNestedInput = {
    create?: XOR<NotificationReadCreateWithoutNotificationInput, NotificationReadUncheckedCreateWithoutNotificationInput> | NotificationReadCreateWithoutNotificationInput[] | NotificationReadUncheckedCreateWithoutNotificationInput[]
    connectOrCreate?: NotificationReadCreateOrConnectWithoutNotificationInput | NotificationReadCreateOrConnectWithoutNotificationInput[]
    upsert?: NotificationReadUpsertWithWhereUniqueWithoutNotificationInput | NotificationReadUpsertWithWhereUniqueWithoutNotificationInput[]
    createMany?: NotificationReadCreateManyNotificationInputEnvelope
    set?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    disconnect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    delete?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    connect?: NotificationReadWhereUniqueInput | NotificationReadWhereUniqueInput[]
    update?: NotificationReadUpdateWithWhereUniqueWithoutNotificationInput | NotificationReadUpdateWithWhereUniqueWithoutNotificationInput[]
    updateMany?: NotificationReadUpdateManyWithWhereWithoutNotificationInput | NotificationReadUpdateManyWithWhereWithoutNotificationInput[]
    deleteMany?: NotificationReadScalarWhereInput | NotificationReadScalarWhereInput[]
  }

  export type NotificationCreateNestedOneWithoutReadsInput = {
    create?: XOR<NotificationCreateWithoutReadsInput, NotificationUncheckedCreateWithoutReadsInput>
    connectOrCreate?: NotificationCreateOrConnectWithoutReadsInput
    connect?: NotificationWhereUniqueInput
  }

  export type TenantCreateNestedOneWithoutNotificationReadsInput = {
    create?: XOR<TenantCreateWithoutNotificationReadsInput, TenantUncheckedCreateWithoutNotificationReadsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutNotificationReadsInput
    connect?: TenantWhereUniqueInput
  }

  export type NotificationUpdateOneRequiredWithoutReadsNestedInput = {
    create?: XOR<NotificationCreateWithoutReadsInput, NotificationUncheckedCreateWithoutReadsInput>
    connectOrCreate?: NotificationCreateOrConnectWithoutReadsInput
    upsert?: NotificationUpsertWithoutReadsInput
    connect?: NotificationWhereUniqueInput
    update?: XOR<XOR<NotificationUpdateToOneWithWhereWithoutReadsInput, NotificationUpdateWithoutReadsInput>, NotificationUncheckedUpdateWithoutReadsInput>
  }

  export type TenantUpdateOneRequiredWithoutNotificationReadsNestedInput = {
    create?: XOR<TenantCreateWithoutNotificationReadsInput, TenantUncheckedCreateWithoutNotificationReadsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutNotificationReadsInput
    upsert?: TenantUpsertWithoutNotificationReadsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutNotificationReadsInput, TenantUpdateWithoutNotificationReadsInput>, TenantUncheckedUpdateWithoutNotificationReadsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type TenantUserCreateWithoutTenantInput = {
    email: string
  }

  export type TenantUserUncheckedCreateWithoutTenantInput = {
    email: string
  }

  export type TenantUserCreateOrConnectWithoutTenantInput = {
    where: TenantUserWhereUniqueInput
    create: XOR<TenantUserCreateWithoutTenantInput, TenantUserUncheckedCreateWithoutTenantInput>
  }

  export type TenantUserCreateManyTenantInputEnvelope = {
    data: TenantUserCreateManyTenantInput | TenantUserCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantSessionCreateWithoutTenantInput = {
    tokenHash: string
    expiresAt: Date | string
  }

  export type TenantSessionUncheckedCreateWithoutTenantInput = {
    tokenHash: string
    expiresAt: Date | string
  }

  export type TenantSessionCreateOrConnectWithoutTenantInput = {
    where: TenantSessionWhereUniqueInput
    create: XOR<TenantSessionCreateWithoutTenantInput, TenantSessionUncheckedCreateWithoutTenantInput>
  }

  export type TenantSessionCreateManyTenantInputEnvelope = {
    data: TenantSessionCreateManyTenantInput | TenantSessionCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type NotificationReadCreateWithoutTenantInput = {
    userId: number
    readAt?: Date | string
    notification: NotificationCreateNestedOneWithoutReadsInput
  }

  export type NotificationReadUncheckedCreateWithoutTenantInput = {
    id?: number
    notificationId: number
    userId: number
    readAt?: Date | string
  }

  export type NotificationReadCreateOrConnectWithoutTenantInput = {
    where: NotificationReadWhereUniqueInput
    create: XOR<NotificationReadCreateWithoutTenantInput, NotificationReadUncheckedCreateWithoutTenantInput>
  }

  export type NotificationReadCreateManyTenantInputEnvelope = {
    data: NotificationReadCreateManyTenantInput | NotificationReadCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantUserUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantUserWhereUniqueInput
    update: XOR<TenantUserUpdateWithoutTenantInput, TenantUserUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantUserCreateWithoutTenantInput, TenantUserUncheckedCreateWithoutTenantInput>
  }

  export type TenantUserUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantUserWhereUniqueInput
    data: XOR<TenantUserUpdateWithoutTenantInput, TenantUserUncheckedUpdateWithoutTenantInput>
  }

  export type TenantUserUpdateManyWithWhereWithoutTenantInput = {
    where: TenantUserScalarWhereInput
    data: XOR<TenantUserUpdateManyMutationInput, TenantUserUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantUserScalarWhereInput = {
    AND?: TenantUserScalarWhereInput | TenantUserScalarWhereInput[]
    OR?: TenantUserScalarWhereInput[]
    NOT?: TenantUserScalarWhereInput | TenantUserScalarWhereInput[]
    email?: StringFilter<"TenantUser"> | string
    tenantId?: IntFilter<"TenantUser"> | number
  }

  export type TenantSessionUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantSessionWhereUniqueInput
    update: XOR<TenantSessionUpdateWithoutTenantInput, TenantSessionUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantSessionCreateWithoutTenantInput, TenantSessionUncheckedCreateWithoutTenantInput>
  }

  export type TenantSessionUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantSessionWhereUniqueInput
    data: XOR<TenantSessionUpdateWithoutTenantInput, TenantSessionUncheckedUpdateWithoutTenantInput>
  }

  export type TenantSessionUpdateManyWithWhereWithoutTenantInput = {
    where: TenantSessionScalarWhereInput
    data: XOR<TenantSessionUpdateManyMutationInput, TenantSessionUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantSessionScalarWhereInput = {
    AND?: TenantSessionScalarWhereInput | TenantSessionScalarWhereInput[]
    OR?: TenantSessionScalarWhereInput[]
    NOT?: TenantSessionScalarWhereInput | TenantSessionScalarWhereInput[]
    tokenHash?: StringFilter<"TenantSession"> | string
    tenantId?: IntFilter<"TenantSession"> | number
    expiresAt?: DateTimeFilter<"TenantSession"> | Date | string
  }

  export type NotificationReadUpsertWithWhereUniqueWithoutTenantInput = {
    where: NotificationReadWhereUniqueInput
    update: XOR<NotificationReadUpdateWithoutTenantInput, NotificationReadUncheckedUpdateWithoutTenantInput>
    create: XOR<NotificationReadCreateWithoutTenantInput, NotificationReadUncheckedCreateWithoutTenantInput>
  }

  export type NotificationReadUpdateWithWhereUniqueWithoutTenantInput = {
    where: NotificationReadWhereUniqueInput
    data: XOR<NotificationReadUpdateWithoutTenantInput, NotificationReadUncheckedUpdateWithoutTenantInput>
  }

  export type NotificationReadUpdateManyWithWhereWithoutTenantInput = {
    where: NotificationReadScalarWhereInput
    data: XOR<NotificationReadUpdateManyMutationInput, NotificationReadUncheckedUpdateManyWithoutTenantInput>
  }

  export type NotificationReadScalarWhereInput = {
    AND?: NotificationReadScalarWhereInput | NotificationReadScalarWhereInput[]
    OR?: NotificationReadScalarWhereInput[]
    NOT?: NotificationReadScalarWhereInput | NotificationReadScalarWhereInput[]
    id?: IntFilter<"NotificationRead"> | number
    notificationId?: IntFilter<"NotificationRead"> | number
    tenantId?: IntFilter<"NotificationRead"> | number
    userId?: IntFilter<"NotificationRead"> | number
    readAt?: DateTimeFilter<"NotificationRead"> | Date | string
  }

  export type TenantCreateWithoutUsersInput = {
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: TenantSessionCreateNestedManyWithoutTenantInput
    notificationReads?: NotificationReadCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsersInput = {
    id?: number
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    sessions?: TenantSessionUncheckedCreateNestedManyWithoutTenantInput
    notificationReads?: NotificationReadUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsersInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
  }

  export type TenantUpsertWithoutUsersInput = {
    update: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
    create: XOR<TenantCreateWithoutUsersInput, TenantUncheckedCreateWithoutUsersInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsersInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsersInput, TenantUncheckedUpdateWithoutUsersInput>
  }

  export type TenantUpdateWithoutUsersInput = {
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: TenantSessionUpdateManyWithoutTenantNestedInput
    notificationReads?: NotificationReadUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    sessions?: TenantSessionUncheckedUpdateManyWithoutTenantNestedInput
    notificationReads?: NotificationReadUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutSessionsInput = {
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantUserCreateNestedManyWithoutTenantInput
    notificationReads?: NotificationReadCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutSessionsInput = {
    id?: number
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantUserUncheckedCreateNestedManyWithoutTenantInput
    notificationReads?: NotificationReadUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutSessionsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutSessionsInput, TenantUncheckedCreateWithoutSessionsInput>
  }

  export type TenantUpsertWithoutSessionsInput = {
    update: XOR<TenantUpdateWithoutSessionsInput, TenantUncheckedUpdateWithoutSessionsInput>
    create: XOR<TenantCreateWithoutSessionsInput, TenantUncheckedCreateWithoutSessionsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutSessionsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutSessionsInput, TenantUncheckedUpdateWithoutSessionsInput>
  }

  export type TenantUpdateWithoutSessionsInput = {
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantUserUpdateManyWithoutTenantNestedInput
    notificationReads?: NotificationReadUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutSessionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantUserUncheckedUpdateManyWithoutTenantNestedInput
    notificationReads?: NotificationReadUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type NotificationReadCreateWithoutNotificationInput = {
    userId: number
    readAt?: Date | string
    tenant: TenantCreateNestedOneWithoutNotificationReadsInput
  }

  export type NotificationReadUncheckedCreateWithoutNotificationInput = {
    id?: number
    tenantId: number
    userId: number
    readAt?: Date | string
  }

  export type NotificationReadCreateOrConnectWithoutNotificationInput = {
    where: NotificationReadWhereUniqueInput
    create: XOR<NotificationReadCreateWithoutNotificationInput, NotificationReadUncheckedCreateWithoutNotificationInput>
  }

  export type NotificationReadCreateManyNotificationInputEnvelope = {
    data: NotificationReadCreateManyNotificationInput | NotificationReadCreateManyNotificationInput[]
    skipDuplicates?: boolean
  }

  export type NotificationReadUpsertWithWhereUniqueWithoutNotificationInput = {
    where: NotificationReadWhereUniqueInput
    update: XOR<NotificationReadUpdateWithoutNotificationInput, NotificationReadUncheckedUpdateWithoutNotificationInput>
    create: XOR<NotificationReadCreateWithoutNotificationInput, NotificationReadUncheckedCreateWithoutNotificationInput>
  }

  export type NotificationReadUpdateWithWhereUniqueWithoutNotificationInput = {
    where: NotificationReadWhereUniqueInput
    data: XOR<NotificationReadUpdateWithoutNotificationInput, NotificationReadUncheckedUpdateWithoutNotificationInput>
  }

  export type NotificationReadUpdateManyWithWhereWithoutNotificationInput = {
    where: NotificationReadScalarWhereInput
    data: XOR<NotificationReadUpdateManyMutationInput, NotificationReadUncheckedUpdateManyWithoutNotificationInput>
  }

  export type NotificationCreateWithoutReadsInput = {
    title: string
    message: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    active?: boolean
  }

  export type NotificationUncheckedCreateWithoutReadsInput = {
    id?: number
    title: string
    message: string
    createdAt?: Date | string
    expiresAt?: Date | string | null
    active?: boolean
  }

  export type NotificationCreateOrConnectWithoutReadsInput = {
    where: NotificationWhereUniqueInput
    create: XOR<NotificationCreateWithoutReadsInput, NotificationUncheckedCreateWithoutReadsInput>
  }

  export type TenantCreateWithoutNotificationReadsInput = {
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantUserCreateNestedManyWithoutTenantInput
    sessions?: TenantSessionCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutNotificationReadsInput = {
    id?: number
    labName: string
    adminName: string
    adminEmail: string
    passwordHash: string
    dbUrlEncrypted?: string | null
    dbHost?: string | null
    dbFingerprint?: string | null
    connectedAt?: Date | string | null
    lastLoginAt?: Date | string | null
    failedLoginCount?: number
    lockedUntil?: Date | string | null
    active?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: TenantUserUncheckedCreateNestedManyWithoutTenantInput
    sessions?: TenantSessionUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutNotificationReadsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutNotificationReadsInput, TenantUncheckedCreateWithoutNotificationReadsInput>
  }

  export type NotificationUpsertWithoutReadsInput = {
    update: XOR<NotificationUpdateWithoutReadsInput, NotificationUncheckedUpdateWithoutReadsInput>
    create: XOR<NotificationCreateWithoutReadsInput, NotificationUncheckedCreateWithoutReadsInput>
    where?: NotificationWhereInput
  }

  export type NotificationUpdateToOneWithWhereWithoutReadsInput = {
    where?: NotificationWhereInput
    data: XOR<NotificationUpdateWithoutReadsInput, NotificationUncheckedUpdateWithoutReadsInput>
  }

  export type NotificationUpdateWithoutReadsInput = {
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type NotificationUncheckedUpdateWithoutReadsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
  }

  export type TenantUpsertWithoutNotificationReadsInput = {
    update: XOR<TenantUpdateWithoutNotificationReadsInput, TenantUncheckedUpdateWithoutNotificationReadsInput>
    create: XOR<TenantCreateWithoutNotificationReadsInput, TenantUncheckedCreateWithoutNotificationReadsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutNotificationReadsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutNotificationReadsInput, TenantUncheckedUpdateWithoutNotificationReadsInput>
  }

  export type TenantUpdateWithoutNotificationReadsInput = {
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantUserUpdateManyWithoutTenantNestedInput
    sessions?: TenantSessionUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutNotificationReadsInput = {
    id?: IntFieldUpdateOperationsInput | number
    labName?: StringFieldUpdateOperationsInput | string
    adminName?: StringFieldUpdateOperationsInput | string
    adminEmail?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    dbUrlEncrypted?: NullableStringFieldUpdateOperationsInput | string | null
    dbHost?: NullableStringFieldUpdateOperationsInput | string | null
    dbFingerprint?: NullableStringFieldUpdateOperationsInput | string | null
    connectedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    failedLoginCount?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    active?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: TenantUserUncheckedUpdateManyWithoutTenantNestedInput
    sessions?: TenantSessionUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantUserCreateManyTenantInput = {
    email: string
  }

  export type TenantSessionCreateManyTenantInput = {
    tokenHash: string
    expiresAt: Date | string
  }

  export type NotificationReadCreateManyTenantInput = {
    id?: number
    notificationId: number
    userId: number
    readAt?: Date | string
  }

  export type TenantUserUpdateWithoutTenantInput = {
    email?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUserUncheckedUpdateWithoutTenantInput = {
    email?: StringFieldUpdateOperationsInput | string
  }

  export type TenantUserUncheckedUpdateManyWithoutTenantInput = {
    email?: StringFieldUpdateOperationsInput | string
  }

  export type TenantSessionUpdateWithoutTenantInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSessionUncheckedUpdateWithoutTenantInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantSessionUncheckedUpdateManyWithoutTenantInput = {
    tokenHash?: StringFieldUpdateOperationsInput | string
    expiresAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationReadUpdateWithoutTenantInput = {
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    notification?: NotificationUpdateOneRequiredWithoutReadsNestedInput
  }

  export type NotificationReadUncheckedUpdateWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    notificationId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationReadUncheckedUpdateManyWithoutTenantInput = {
    id?: IntFieldUpdateOperationsInput | number
    notificationId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationReadCreateManyNotificationInput = {
    id?: number
    tenantId: number
    userId: number
    readAt?: Date | string
  }

  export type NotificationReadUpdateWithoutNotificationInput = {
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutNotificationReadsNestedInput
  }

  export type NotificationReadUncheckedUpdateWithoutNotificationInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type NotificationReadUncheckedUpdateManyWithoutNotificationInput = {
    id?: IntFieldUpdateOperationsInput | number
    tenantId?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    readAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}