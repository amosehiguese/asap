import { useEffect } from "react";
import type { IUser } from "../interfaces";
import { updateLoggedInUser } from "../features/user/userSlice";
import { useAppDispatch } from "./useAppDispatch";

export const useUpdateLogin = (isSuccess: boolean, data: IUser | null | undefined) => {
  const dispatch = useAppDispatch()

  useEffect(()=>{
    if(isSuccess && data){
      dispatch(updateLoggedInUser(data))
    }
  }, [isSuccess])
}
