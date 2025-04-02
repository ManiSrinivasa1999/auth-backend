// @ts-nocheck
import { Router } from "express";
import { getUser,  registerUser, loginUser, deleteUser} from "../handlers/user-handler";

const userRouter = Router();

userRouter.get('/:id', getUser)
userRouter.post('/signup', registerUser)
userRouter.post('/signin', loginUser)
userRouter.delete('/:id', deleteUser)

export default userRouter;
