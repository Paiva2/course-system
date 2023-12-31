import UserModel from "../../database/prisma/model/userModel"
import WalletModel from "../../database/prisma/model/walletModel"
import AuthStudentService from "../../services/student/authSudentService"
import GetUserProfileService from "../../services/student/getUserProfileService"
import RegisterNewStudentService from "../../services/student/registerNewStudentService"
import UpdateStudentPasswordService from "../../services/student/updateStudentPasswordService"
import UpdateUserProfileService from "../../services/student/updateUserProfileService"

export default class UserFactory {
  public static async exec() {
    const userModel = new UserModel()
    const walletModel = new WalletModel()

    const updateUserProfileService = new UpdateUserProfileService(userModel)

    const getUserProfileService = new GetUserProfileService(userModel)

    const authStudentService = new AuthStudentService(userModel)

    const updateStudentPasswordService = new UpdateStudentPasswordService(userModel)

    const registerNewStudentService = new RegisterNewStudentService(
      userModel,
      walletModel
    )

    return {
      updateUserProfileService,
      getUserProfileService,
      authStudentService,
      updateStudentPasswordService,
      registerNewStudentService,
    }
  }
}
