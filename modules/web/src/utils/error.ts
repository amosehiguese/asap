import { FetchBaseQueryError } from "@reduxjs/toolkit/query"

export const isErrorWithMessage = (error: unknown): error is { status: number, data: {message: string}} => {
  return (
    typeof error === 'object' &&
    error != null &&
    'data' in error &&
    typeof (error as any).data.message === 'string'
  )
}

export const isFetchBaseQueryError=(error: unknown):error is FetchBaseQueryError=>{
  return typeof error === 'object' && error != null && 'status' in error
}
