
/** Common User data for testing*/
class UserData {


    static good = {
        isAdmin: false,
        email: "test_user@email.com",
        firstName: "Test",
        lastName: "User 1",
        password: "password",
        phoneNumber: "1234567890"
    };

    static bad = {
        email: "test_useremail.com",
        firstName: "Test#@$",
        lastName: "User 1@",
        password: "pas",
        phoneNumber: "12345678"
    };


}

module.exports = { UserData };