// import { ApolloError } from 'apollo-client'
import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  PropsWithChildren,
} from 'react'

import { useSubscribeNewsletter } from '../hook/useSubscribeNewsletter'

import { SubscribeNewsletterStateTypes, SubscribeNewsletterFunctionType } from '../typings/subscribe'


export interface Arguments {
  email: string
  fields: {
    name?: string
    phone?: string
    bindingUrl?: string
    bindingId?: string
    [key: string]: string | undefined | null
  }
}

interface CustomField {
  name: string
  value: string | undefined | null
}

export interface State {
  email: string
  name: string | null
  phone: string | null
  customFields: CustomField[] | null
  confirmation: boolean | null
  invalidEmail: boolean
  invalidName: boolean
  invalidPhone: boolean
  submission: SubscribeNewsletterStateTypes
  subscribe: SubscribeNewsletterFunctionType
}

interface UpdateEmailAction {
  type: 'UPDATE_EMAIL'
  value: State['email']
}

interface UpdateNameAction {
  type: 'UPDATE_NAME'
  value: State['name']
}

interface UpdatePhoneAction {
  type: 'UPDATE_PHONE'
  value: State['phone']
}

interface UpdateConfirmationAction {
  type: 'UPDATE_CONFIRMATION'
  value: State['confirmation']
}

interface SetInvalidEmailAction {
  type: 'SET_INVALID_EMAIL'
  value: State['invalidEmail']
}

interface SetInvalidNameAction {
  type: 'SET_INVALID_NAME'
  value: State['invalidName']
}

interface SetInvalidPhoneAction {
  type: 'SET_INVALID_PHONE'
  value: State['invalidPhone']
}

interface SetCustomValuesAction {
  type: 'SET_CUSTOM_VALUES'
  value: State['customFields']
}

interface SetSubmissionAction {
  type: 'SET_SUBMISSION'
  value: State['submission']
}

type Action =
  | UpdateEmailAction
  | UpdateNameAction
  | UpdatePhoneAction
  | UpdateConfirmationAction
  | SetInvalidEmailAction
  // | SetMutationValues
  | SetInvalidNameAction
  | SetInvalidPhoneAction
  | SetCustomValuesAction
  | SetSubmissionAction
type Dispatch = (action: Action) => void

const NewsletterStateContext = createContext<State | undefined>(undefined)
const NewsletterDispatchContext = createContext<Dispatch | undefined>(undefined)

function newsletterContextReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return {
        ...state,
        email: action.value,
      }

    case 'UPDATE_NAME':
      return {
        ...state,
        name: action.value,
      }

    case 'UPDATE_PHONE':
      return {
        ...state,
        phone: action.value,
      }

    case 'UPDATE_CONFIRMATION':
      return {
        ...state,
        confirmation: action.value,
      }

    case 'SET_INVALID_EMAIL':
      return {
        ...state,
        invalidEmail: action.value,
      }

    case 'SET_INVALID_NAME':
      return {
        ...state,
        invalidName: action.value,
      }

    case 'SET_INVALID_PHONE':
      return {
        ...state,
        invalidPhone: action.value,
      }

    case 'SET_SUBMISSION': {
      return {
        ...state,
        submission: action.value,
      }
    }

    case 'SET_CUSTOM_VALUES': {
      return {
        ...state,
        customFields: action.value,
      }
    }

    default:
      return state
  }
}

function NewsletterContextProvider(props: PropsWithChildren<{}>) {
  const { formState, subscribeNewsletter } = useSubscribeNewsletter()

  const [state, dispatch] = useReducer(newsletterContextReducer, {
    email: '',
    name: null,
    phone: null,
    customFields: null,
    confirmation: null,
    invalidEmail: false,
    invalidName: false,
    invalidPhone: false,
    subscribe: subscribeNewsletter,
    submission: formState,
  })

  useEffect(() => {
    dispatch({type: 'SET_SUBMISSION', value: formState})
  }, [formState])


  return (
    <NewsletterStateContext.Provider value={state}>
      <NewsletterDispatchContext.Provider value={dispatch}>
        {props.children}
      </NewsletterDispatchContext.Provider>
    </NewsletterStateContext.Provider>
  )
}

function useNewsletterState() {
  const context = useContext(NewsletterStateContext)

  if (context === undefined) {
    throw new Error(
      'useNewsletterState must be used within a NewsletterContextProvider'
    )
  }

  return context
}

function useNewsletterDispatch() {
  const context = useContext(NewsletterDispatchContext)

  if (context === undefined) {
    throw new Error(
      'useNewsletterDispatch must be used within a NewsletterContextProvider'
    )
  }

  return context
}

export { NewsletterContextProvider, useNewsletterDispatch, useNewsletterState }
