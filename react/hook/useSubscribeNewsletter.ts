import { useState } from 'react'
import { createMDDocument } from '../services/masterdata'
import { SubscribeNewsletterStateTypes, SubscribeNewsletterFunctionType } from '../typings/subscribe'

const INITIAL_STATE: SubscribeNewsletterStateTypes = {
  data: null,
  loading: false,
  error: null
}

export const useSubscribeNewsletter = () => {
  const [formState, setFormState] = useState(INITIAL_STATE)

  const subscribeNewsletter: SubscribeNewsletterFunctionType = async  (payload) => {
    setFormState((oldState) => ({
      ...oldState,
      loading: true,
    }))

    try {
      //@ts-ignore
      const data = await createMDDocument({ entity: 'NW', payload });

      setFormState({
        ...INITIAL_STATE,
        data,
      });
    } catch (error) {

      setFormState({
        ...INITIAL_STATE,
        error,
      });
    }
  };

  return {
    formState,
    subscribeNewsletter
  }
}
