import { IQuestion } from "../../@types/types"
import CourseInterface from "../../interfaces/courseInterface"
import QuestionInterface from "../../interfaces/questionInterface"
import { UserInterface } from "../../interfaces/userInterface"

type InsertNewQuestionServiceRequest = {
  studentId: string
  courseId: string
  content: string
}

type InsertNewQuestionServiceResponse = IQuestion

export default class InsertNewQuestionService {
  constructor(
    private userInterface: UserInterface,
    private courseInterface: CourseInterface,
    private questionInterface: QuestionInterface
  ) {}

  async exec({
    content,
    courseId,
    studentId,
  }: InsertNewQuestionServiceRequest): Promise<InsertNewQuestionServiceResponse> {
    if (!courseId) {
      throw {
        status: 422,
        message: "Id do curso inválido.",
      }
    }

    if (!studentId) {
      throw {
        status: 422,
        message: "Id do estudante inválido.",
      }
    }

    if (!content) {
      throw {
        status: 422,
        message: "A questão não pode ser vazia.",
      }
    }

    const doesStudentExists = await this.userInterface.findById(studentId)

    if (!doesStudentExists) {
      throw {
        status: 404,
        message: "Estudante não encontrado.",
      }
    }

    const doesCourseExists = await this.courseInterface.findById(courseId)

    if (!doesCourseExists) {
      throw {
        status: 404,
        message: "Curso não encontrado.",
      }
    }

    const getAllCourseQuestions = await this.questionInterface.findAllFromCourse(
      courseId
    )

    if (getAllCourseQuestions.length) {
      const getUserQuestionsForThisCourse = getAllCourseQuestions.filter(
        (question) => {
          return question.fkStudent === studentId && question.fkCourse === courseId
        }
      )

      if (getUserQuestionsForThisCourse.length >= 2) {
        throw {
          status: 403,
          message: "Um aluno só pode registrar no máximo 2 questões por curso.",
        }
      }
    }

    const insertNewQuestion = await this.questionInterface.create(
      studentId,
      courseId,
      content,
      doesStudentExists.name
    )

    return insertNewQuestion
  }
}
