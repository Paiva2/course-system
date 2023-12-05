import { Request, Response } from "express"
import parseJwt from "../../utils/parseJwt"
import Factory from "../factory"
import { HttpError } from "../../@types/types"

export default class InsertNewQuestionController {
  public static async handle(req: Request, res: Response) {
    const { courseId, content } = req.body

    const { data: userData } = parseJwt(req.headers.authorization as string)

    const { insertNewQuestionService } = await Factory.exec()

    try {
      await insertNewQuestionService.exec({
        content,
        courseId,
        studentId: userData.id,
      })

      return res.status(201).send({ message: "Questão registrada com sucesso." })
    } catch (e) {
      const error = e as HttpError

      return res.status(error.status).send(error.message)
    }
  }
}