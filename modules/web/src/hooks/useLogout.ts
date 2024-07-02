import { useLazyLogoutQuery } from "../services/api";
import { logout } from "../features/user/userSlice";
import { useAppDispatch } from "./useAppDispatch";

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const [logoutTrigger, {}] = useLazyLogoutQuery()

  return () => {
    logoutTrigger()
    dispatch(logout())
  }
}
