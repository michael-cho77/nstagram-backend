import bcrypt from "bcrypt";
import client from "../../client"
import { protectedResolver } from "../users.utils";


const resolverFn = async (
    _,
    { firstName, lastName, username, email, password: newPassword },
    { loggedInUser, protectedResolver }
) => {
    if (!loggedInUser) {
        return {
            ok: false,
            error: 'You need to Login'
        }
    }
    let uglyPassword = null;
    if (newPassword) {
        uglyPassword = await bcrypt.hash(newPassword, 10)
    }
    const updatedUser = await client.user.update({
        where: {
            id: loggedInUser.id,
        },
        data: {
            firstName,
            lastName,
            username,
            email,
            ...(uglyPassword && { password: uglyPassword }),
            //password: uglyPassword,
        }
    });
    if (updatedUser.id) {
        return {
            ok: true
        };
    } else {
        return {
            ok: false,
            error: "Could Not Update Profile"
        }
    }
}


export default {
    Mutation: {
        editProfile: protectedResolver(resolverFn)
    }
}
