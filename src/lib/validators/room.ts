import { z} from "zod"

export const createRoomSchema = z.object({
   userId : z.string("Must be a string").min(3,"Name must be at least 3 characters long")
})


