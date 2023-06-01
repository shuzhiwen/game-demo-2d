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

export type ChannelInput = {
  channelId: Scalars['String']
  userId: Scalars['String']
}

export type IdInput = {
  id: Scalars['String']
}

export type SendDataInput = {
  channelId: Scalars['String']
  data: Scalars['JSON']
  userId: Scalars['String']
}

export type TransportHistoryQueryVariables = Exact<{
  channelId: Scalars['String']
}>

export type TransportHistoryQuery = {
  __typename?: 'Query'
  transportHistory?: Array<{__typename?: 'Transport'; data: any; userId: string}> | null
}

export type TransportUserCountQueryVariables = Exact<{
  channelId: Scalars['String']
}>

export type TransportUserCountQuery = {__typename?: 'Query'; transportUserCount?: number | null}

export type EnterChannelMutationVariables = Exact<{
  input: ChannelInput
}>

export type EnterChannelMutation = {__typename?: 'Mutation'; enterChannel: boolean}

export type ExitChannelMutationVariables = Exact<{
  input: ChannelInput
}>

export type ExitChannelMutation = {__typename?: 'Mutation'; exitChannel: boolean}

export type SendDataMutationVariables = Exact<{
  input: SendDataInput
}>

export type SendDataMutation = {__typename?: 'Mutation'; sendData: boolean}

export type TransportSubscriptionVariables = Exact<{
  channelId: Scalars['String']
}>

export type TransportSubscription = {
  __typename?: 'Subscription'
  transport: {__typename?: 'Transport'; data: any; userId: string}
}

export const TransportHistoryDocument = gql`
  query transportHistory($channelId: String!) {
    transportHistory(channelId: $channelId) {
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
 *      channelId: // value for 'channelId'
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
  query transportUserCount($channelId: String!) {
    transportUserCount(channelId: $channelId)
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
 *      channelId: // value for 'channelId'
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
export const EnterChannelDocument = gql`
  mutation enterChannel($input: ChannelInput!) {
    enterChannel(input: $input)
  }
`
export type EnterChannelMutationFn = Apollo.MutationFunction<
  EnterChannelMutation,
  EnterChannelMutationVariables
>

/**
 * __useEnterChannelMutation__
 *
 * To run a mutation, you first call `useEnterChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnterChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enterChannelMutation, { data, loading, error }] = useEnterChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useEnterChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<EnterChannelMutation, EnterChannelMutationVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useMutation<EnterChannelMutation, EnterChannelMutationVariables>(
    EnterChannelDocument,
    options
  )
}
export type EnterChannelMutationHookResult = ReturnType<typeof useEnterChannelMutation>
export type EnterChannelMutationResult = Apollo.MutationResult<EnterChannelMutation>
export type EnterChannelMutationOptions = Apollo.BaseMutationOptions<
  EnterChannelMutation,
  EnterChannelMutationVariables
>
export const ExitChannelDocument = gql`
  mutation exitChannel($input: ChannelInput!) {
    exitChannel(input: $input)
  }
`
export type ExitChannelMutationFn = Apollo.MutationFunction<
  ExitChannelMutation,
  ExitChannelMutationVariables
>

/**
 * __useExitChannelMutation__
 *
 * To run a mutation, you first call `useExitChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useExitChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [exitChannelMutation, { data, loading, error }] = useExitChannelMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useExitChannelMutation(
  baseOptions?: Apollo.MutationHookOptions<ExitChannelMutation, ExitChannelMutationVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useMutation<ExitChannelMutation, ExitChannelMutationVariables>(
    ExitChannelDocument,
    options
  )
}
export type ExitChannelMutationHookResult = ReturnType<typeof useExitChannelMutation>
export type ExitChannelMutationResult = Apollo.MutationResult<ExitChannelMutation>
export type ExitChannelMutationOptions = Apollo.BaseMutationOptions<
  ExitChannelMutation,
  ExitChannelMutationVariables
>
export const SendDataDocument = gql`
  mutation sendData($input: SendDataInput!) {
    sendData(input: $input)
  }
`
export type SendDataMutationFn = Apollo.MutationFunction<
  SendDataMutation,
  SendDataMutationVariables
>

/**
 * __useSendDataMutation__
 *
 * To run a mutation, you first call `useSendDataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendDataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendDataMutation, { data, loading, error }] = useSendDataMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendDataMutation(
  baseOptions?: Apollo.MutationHookOptions<SendDataMutation, SendDataMutationVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useMutation<SendDataMutation, SendDataMutationVariables>(SendDataDocument, options)
}
export type SendDataMutationHookResult = ReturnType<typeof useSendDataMutation>
export type SendDataMutationResult = Apollo.MutationResult<SendDataMutation>
export type SendDataMutationOptions = Apollo.BaseMutationOptions<
  SendDataMutation,
  SendDataMutationVariables
>
export const TransportDocument = gql`
  subscription transport($channelId: String!) {
    transport(channelId: $channelId) {
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
 *      channelId: // value for 'channelId'
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
