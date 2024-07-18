import React, { ComponentType, PropsWithChildren, FormEvent, useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles, CssHandlesTypes } from 'vtex.css-handles'
import { usePixel } from 'vtex.pixel-manager'
import type { PixelEventTypes } from 'vtex.pixel-manager'

import {
  NewsletterContextProvider,
  useNewsletterDispatch,
  useNewsletterState,
  Arguments,
  State,
} from './components/NewsletterContext'
import {
  validateEmail,
  validatePhoneNumber,
  validateUserName,
} from './modules/formValidators'
import { useSubscribeNewsletter } from './hook/useSubscribeNewsletter'

export const CSS_HANDLES = [
  'newsletterForm',
  'defaultSuccessMessage',
  'defaultErrorMessage',
] as const

interface Props {
  ErrorState?: ComponentType
  SuccessState?: ComponentType<{
    subscribedUserData?: {
      email: State['email']
      name: State['name']
      phone: State['phone']
    }
  }>
  LoadingState?: ComponentType
  classes?: CssHandlesTypes.CustomClasses<typeof CSS_HANDLES>
  customEventId?: string
}

interface CustomField {
  name: string
  value: string | null | undefined
}

function generateMutationVariables({
  email,
  name,
  phone,
  customFields,
}: {
  email: string
  name: string | undefined | null
  phone: string | undefined | null
  customFields: CustomField[] | null
}) {
  const variables: Arguments = { email, fields: {} }

  if (name) {
    variables.fields.name = name
  }

  if (email) {
    variables.fields.email = email
  }

  if (phone) {
    variables.fields.phone = phone
  }

  if (customFields) {
    customFields.forEach((customField) => {
      variables.fields[customField.name] = customField.value
    })
  }

  return variables
}

function Newsletter(props: PropsWithChildren<Props>) {
  const {
    SuccessState,
    LoadingState,
    classes,
    children,
    customEventId,
  } = props

  const {
    email,
    name,
    phone,
    customFields,
  } = useNewsletterState()
  const { formState, subscribeNewsletter } = useSubscribeNewsletter()

  const dispatch = useNewsletterDispatch()
  const { push } = usePixel()
  const { handles } = useCssHandles(CSS_HANDLES, { classes })

  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const isEmailValid = validateEmail(email)
    const isNameValid = name === null || validateUserName(name)
    const isPhoneValid = phone === null || validatePhoneNumber(phone)

    setIsFormValid(isEmailValid && isNameValid && isPhoneValid)
  }, [email, name, phone])

  if (formState.loading && LoadingState) {
    return <LoadingState />
  }

  if (formState.error) {
    <p className={handles.defaultErrorMessage}>
      <FormattedMessage id="store/newsletter-submit-error.default" />
    </p>
  }

  if (formState.data?.DocumentId) {
    return SuccessState ? (
      <SuccessState subscribedUserData={{ email, name, phone }} />
    ) : (
      <p className={handles.defaultSuccessMessage}>
        <FormattedMessage id="store/newsletter-submit-success.default" />
      </p>
    )
  }

  function validateFormInputs() {
    const isEmailValid = validateEmail(email)
    const isNameValid = name === null || validateUserName(name)
    const isPhoneValid = phone === null || validatePhoneNumber(phone)

    dispatch({
      type: 'SET_INVALID_EMAIL',
      value: !isEmailValid,
    })

    dispatch({
      type: 'SET_INVALID_NAME',
      value: !isNameValid,
    })

    dispatch({
      type: 'SET_INVALID_PHONE',
      value: !isPhoneValid,
    })

    return isNameValid && isPhoneValid && isEmailValid
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    const areUserInputsValid = validateFormInputs()

    if (!areUserInputsValid) {
      return
    }

    const pixelData = {
      name,
      email,
      phone,
    }

    const pixelEvent: PixelEventTypes.PixelData = customEventId
      ? {
        id: customEventId,
        event: 'newsletterSubscription',
        data: pixelData,
      }
      : {
        event: 'newsletterSubscription',
        data: pixelData,
      }

    push(pixelEvent)

    const mutationVariables = generateMutationVariables({
      email,
      name,
      phone,
      customFields,
    })

    console.log("mutationVariables",mutationVariables)

    subscribeNewsletter({
      email,
      name,
    })
  }

  return (
    <form className={handles.newsletterForm} onSubmit={handleSubmit}>
      {children}
      <button className={`newsletter-submit`} type="submit" disabled={!isFormValid}>
        Registrar
      </button>
    </form>
  )
}

function WrappedNewsletter(props: PropsWithChildren<Props>) {
  return (
    <NewsletterContextProvider>
      <Newsletter {...props}>{props.children}</Newsletter>
    </NewsletterContextProvider>
  )
}

WrappedNewsletter.schema = {
  title: 'admin/editor.newsletter-form.title',
}

export default WrappedNewsletter
