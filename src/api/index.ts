import { DevboxListItem } from '../types/devbox'
// import { DELETE, GET, POST } from './axios'

export const getDevboxList = () =>
  new Promise<DevboxListItem[]>((resolve, reject) => {
    return resolve([
      {
        name: 'devbox1',
        status: 'Running',
      },
      {
        name: 'devbox2',
        status: 'Stopped',
      },
    ])
  })

// export const createDevbox = (payload: { devboxForm: {} }) =>
//   POST('/api/extension/createDevbox', payload)

// export const deleteDevbox = (payload: { devboxId: string }) =>
//   DELETE('/api/extension/deleteDevbox', payload)
