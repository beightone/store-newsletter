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

    console.log('@@payload', payload);
    try {
      //@ts-ignore
      const data = await createMDDocument({ entity: 'NW', payload });
      console.log('@@data', data);

      setFormState({
        ...INITIAL_STATE,
        data,
      });
      console.log('@@formState', formState);
    } catch (error) {
      console.log('@@error', error);
      console.log({ error });

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
