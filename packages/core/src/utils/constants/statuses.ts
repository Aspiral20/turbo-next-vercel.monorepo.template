export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
}

export const CRUD_STATUS = {
  CREATE: 'create',
  UPDATE: 'update',
  REMOVE: 'remove',
  READ: 'read',
}

export const ERROR_STATUSES = {
  NOT_FOUND: { code: 404, message: 'errors.notFound' },
  SERVER_SIDE: { code: 500, message: 'errors.serverSide' },
}