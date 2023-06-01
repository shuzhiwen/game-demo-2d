/* eslint-disable */
import {gql} from '@apollo/client'
import * as Apollo from '@apollo/client'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends {[key: string]: unknown}> = {[K in keyof T]: T[K]}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]?: Maybe<T[SubKey]>}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {[SubKey in K]: Maybe<T[SubKey]>}
const defaultOptions = {} as const
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: number
  JSON: any
  Void: undefined
}

export type IdInput = {
  id: Scalars['String']
}

export type TransportInput = {
  channelId: Scalars['String']
  data: Scalars['JSON']
  userId: Scalars['String']
}

export type TransportLoginInput = {
  channelId: Scalars['String']
  userId: Scalars['String']
}

export type TransportHistoryQueryVariables = Exact<{
  input: IdInput
}>

export type TransportHistoryQuery = {
  __typename?: 'Query'
  transportHistory?: Array<{__typename?: 'Transport'; data: any; userId: string}> | null
}

export type TransportUserCountQueryVariables = Exact<{
  input: IdInput
}>

export type TransportUserCountQuery = {__typename?: 'Query'; transportUserCount?: number | null}

export type TransportLoginMutationVariables = Exact<{
  input: TransportLoginInput
}>

export type TransportLoginMutation = {__typename?: 'Mutation'; transportLogin: boolean}

export type TransportMutationVariables = Exact<{
  input: TransportInput
}>

export type TransportMutation = {__typename?: 'Mutation'; transport: boolean}

export type TransportSubscriptionVariables = Exact<{
  input: IdInput
}>

export type TransportSubscription = {
  __typename?: 'Subscription'
  transport: {__typename?: 'Transport'; data: any; userId: string}
}

export const TransportHistoryDocument = gql`
  query transportHistory($input: IdInput!) {
    transportHistory(input: $input) {
      data
      userId
    }
  }
`

/**
 * __useTransportHistoryQuery__
 *
 * To run a query within a React component, call `useTransportHistoryQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransportHistoryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransportHistoryQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransportHistoryQuery(
  baseOptions: Apollo.QueryHookOptions<TransportHistoryQuery, TransportHistoryQueryVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useQuery<TransportHistoryQuery, TransportHistoryQueryVariables>(
    TransportHistoryDocument,
    options
  )
}
export function useTransportHistoryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TransportHistoryQuery, TransportHistoryQueryVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useLazyQuery<TransportHistoryQuery, TransportHistoryQueryVariables>(
    TransportHistoryDocument,
    options
  )
}
export type TransportHistoryQueryHookResult = ReturnType<typeof useTransportHistoryQuery>
export type TransportHistoryLazyQueryHookResult = ReturnType<typeof useTransportHistoryLazyQuery>
export type TransportHistoryQueryResult = Apollo.QueryResult<
  TransportHistoryQuery,
  TransportHistoryQueryVariables
>
export const TransportUserCountDocument = gql`
  query transportUserCount($input: IdInput!) {
    transportUserCount(input: $input)
  }
`

/**
 * __useTransportUserCountQuery__
 *
 * To run a query within a React component, call `useTransportUserCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransportUserCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransportUserCountQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransportUserCountQuery(
  baseOptions: Apollo.QueryHookOptions<TransportUserCountQuery, TransportUserCountQueryVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useQuery<TransportUserCountQuery, TransportUserCountQueryVariables>(
    TransportUserCountDocument,
    options
  )
}
export function useTransportUserCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    TransportUserCountQuery,
    TransportUserCountQueryVariables
  >
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useLazyQuery<TransportUserCountQuery, TransportUserCountQueryVariables>(
    TransportUserCountDocument,
    options
  )
}
export type TransportUserCountQueryHookResult = ReturnType<typeof useTransportUserCountQuery>
export type TransportUserCountLazyQueryHookResult = ReturnType<
  typeof useTransportUserCountLazyQuery
>
export type TransportUserCountQueryResult = Apollo.QueryResult<
  TransportUserCountQuery,
  TransportUserCountQueryVariables
>
export const TransportLoginDocument = gql`
  mutation transportLogin($input: TransportLoginInput!) {
    transportLogin(input: $input)
  }
`
export type TransportLoginMutationFn = Apollo.MutationFunction<
  TransportLoginMutation,
  TransportLoginMutationVariables
>

/**
 * __useTransportLoginMutation__
 *
 * To run a mutation, you first call `useTransportLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransportLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transportLoginMutation, { data, loading, error }] = useTransportLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransportLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<TransportLoginMutation, TransportLoginMutationVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useMutation<TransportLoginMutation, TransportLoginMutationVariables>(
    TransportLoginDocument,
    options
  )
}
export type TransportLoginMutationHookResult = ReturnType<typeof useTransportLoginMutation>
export type TransportLoginMutationResult = Apollo.MutationResult<TransportLoginMutation>
export type TransportLoginMutationOptions = Apollo.BaseMutationOptions<
  TransportLoginMutation,
  TransportLoginMutationVariables
>
export const TransportDocument = gql`
  mutation transport($input: TransportInput!) {
    transport(input: $input)
  }
`
export type TransportMutationFn = Apollo.MutationFunction<
  TransportMutation,
  TransportMutationVariables
>

/**
 * __useTransportMutation__
 *
 * To run a mutation, you first call `useTransportMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransportMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transportMutation, { data, loading, error }] = useTransportMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransportMutation(
  baseOptions?: Apollo.MutationHookOptions<TransportMutation, TransportMutationVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useMutation<TransportMutation, TransportMutationVariables>(
    TransportDocument,
    options
  )
}
export type TransportMutationHookResult = ReturnType<typeof useTransportMutation>
export type TransportMutationResult = Apollo.MutationResult<TransportMutation>
export type TransportMutationOptions = Apollo.BaseMutationOptions<
  TransportMutation,
  TransportMutationVariables
>
export const TransportDocument = gql`
  subscription Transport($input: IdInput!) {
    transport(input: $input) {
      data
      userId
    }
  }
`

/**
 * __useTransportSubscription__
 *
 * To run a query within a React component, call `useTransportSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTransportSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransportSubscription({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTransportSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<TransportSubscription, TransportSubscriptionVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useSubscription<TransportSubscription, TransportSubscriptionVariables>(
    TransportDocument,
    options
  )
}
export type TransportSubscriptionHookResult = ReturnType<typeof useTransportSubscription>
export type TransportSubscriptionResult = Apollo.SubscriptionResult<TransportSubscription>
