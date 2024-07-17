const BASE_URL = "/api/dataentities/";

type CreateMDDocumentTypes = {
  entity: string
  payload: {
    [x: string]: string | null;
  }
}

export const createMDDocument = async ({ entity, payload }: CreateMDDocumentTypes) => {
  if (!entity || !payload) {
    const param = !entity ? "entity" : "payload";
    throw new Error(`Parameter ${param} is undefined!`);
  }

  const endpoint = `${BASE_URL}${entity}/documents`;
  console.log('@@endpoint', endpoint);
  const options = {
    method: "POST",
    headers: {
      Accept: "application/json; charset=utf-8",
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(payload),
  };

  return fetch(endpoint, options)
    .then((response) => {
      console.log('@@responsefetch', response);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      console.log("ErrorFetch:", error);
      throw error;
    });
};
