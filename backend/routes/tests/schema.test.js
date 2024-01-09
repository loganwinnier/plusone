const { UserData } = require("./_testCommon");
const { prisma } = require("../../prisma");

describe("create user", () => {

    beforeEach(async () => {
        await prisma.user.deleteMany({});
    });

    afterAll(async () => {
        await prisma.user.deleteMany({});
    });

    test("works", async () => {
        const user = await prisma.user.create({
            data: UserData.good
        });

        const queryable = await prisma.user.findUnique({
            where: {
                email: user.email
            }
        });

        for (let key in user) {
            expect(queryable).toHaveProperty(key);
        }
    });

    test("fails with bad email", async () => {
        const data = UserData.good;
        delete data.email;
        let user = null;
        try {
            user = await prisma.user.create({ data }).toThrow();
            expect(user).toBeNull();
        } catch {
            expect(user).toBeNull();
        }
    });
});
