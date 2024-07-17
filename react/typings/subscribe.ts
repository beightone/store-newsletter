export type SubscribeNewsletterStateTypes = {
  data: {
    DocumentId: string
    Href: string
    Id: string
  } | null
  loading: boolean
  error: unknown | null
}

export type SubscribeNewsletterFunctionType = (args: SubscribeNewsletterTypes) => void

type SubscribeNewsletterTypes = {
  email: string,
  name: string | null
  // entity: string
  // payload: {
  //   [x: string]: string | null;
  // }
}
