import { db } from 'src/prisma/contract.prisma'

const Users = await db.orm.public.Users;

const index = (req, res) => {
    return res.status(200).json({
            message: 'You requested the list of users'
    })
}

export default { index };