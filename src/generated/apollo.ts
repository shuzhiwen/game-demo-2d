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
  seq: Scalars['Int']
  serialize?: InputMaybe<Scalars['Boolean']>
  userId: Scalars['String']
}

export type TransportHistoryQueryVariables = Exact<{
  channelId: Scalars['String']
  offset?: InputMaybe<Scalars['Int']>
  limit?: InputMaybe<Scalars['Int']>
}>

export type TransportHistoryQuery = {
  __typename?: 'Query'
  transportHistory?: Array<{
    __typename?: 'Transport'
    data: any
    userId: string
    seq: number
  }> | null
}

export type TransportUsersQueryVariables = Exact<{
  channelId: Scalars['String']
}>

export type TransportUsersQuery = {__typename?: 'Query'; transportUsers: Array<string>}

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

export type ReceiveDataSubscriptionVariables = Exact<{
  channelId: Scalars['String']
}>

export type ReceiveDataSubscription = {
  __typename?: 'Subscription'
  receiveData: {__typename?: 'Transport'; data: any; userId: string; seq: number}
}

export const TransportHistoryDocument = gql`
  query transportHistory($channelId: String!, $offset: Int, $limit: Int) {
    transportHistory(channelId: $channelId, offset: $offset, limit: $limit) {
      data
      userId
      seq
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
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
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
export const TransportUsersDocument = gql`
  query transportUsers($channelId: String!) {
    transportUsers(channelId: $channelId)
  }
`

/**
 * __useTransportUsersQuery__
 *
 * To run a query within a React component, call `useTransportUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransportUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransportUsersQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useTransportUsersQuery(
  baseOptions: Apollo.QueryHookOptions<TransportUsersQuery, TransportUsersQueryVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useQuery<TransportUsersQuery, TransportUsersQueryVariables>(
    TransportUsersDocument,
    options
  )
}
export function useTransportUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<TransportUsersQuery, TransportUsersQueryVariables>
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useLazyQuery<TransportUsersQuery, TransportUsersQueryVariables>(
    TransportUsersDocument,
    options
  )
}
export type TransportUsersQueryHookResult = ReturnType<typeof useTransportUsersQuery>
export type TransportUsersLazyQueryHookResult = ReturnType<typeof useTransportUsersLazyQuery>
export type TransportUsersQueryResult = Apollo.QueryResult<
  TransportUsersQuery,
  TransportUsersQueryVariables
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
export const ReceiveDataDocument = gql`
  subscription receiveData($channelId: String!) {
    receiveData(channelId: $channelId) {
      data
      userId
      seq
    }
  }
`

/**
 * __useReceiveDataSubscription__
 *
 * To run a query within a React component, call `useReceiveDataSubscription` and pass it any options that fit your needs.
 * When your component renders, `useReceiveDataSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useReceiveDataSubscription({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useReceiveDataSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    ReceiveDataSubscription,
    ReceiveDataSubscriptionVariables
  >
) {
  const options = {...defaultOptions, ...baseOptions}
  return Apollo.useSubscription<ReceiveDataSubscription, ReceiveDataSubscriptionVariables>(
    ReceiveDataDocument,
    options
  )
}
export type ReceiveDataSubscriptionHookResult = ReturnType<typeof useReceiveDataSubscription>
export type ReceiveDataSubscriptionResult = Apollo.SubscriptionResult<ReceiveDataSubscription>
