import { describe, it, expect, beforeEach } from "vitest"
import { ICourse, IUser } from "../../../@types/types"
import InMemoryUser from "../../../in-memory/inMemoryUser"
import RegisterNewStudentService from "../../student/registerNewStudentService"
import CreateNewCourseService from "../../course/createNewCourseService"
import InMemoryCourse from "../../../in-memory/inMemoryCourse"
import InsertNewQuestionService from "../../question/insertNewQuestionService"
import InMemoryQuestion from "../../../in-memory/inMemoryQuestion"
import InMemoryPendingPayments from "../../../in-memory/inMemoryPendingPayment"
import InMemoryWallet from "../../../in-memory/inMemoryWallet"

let fakeProfessor: IUser
let fakeStudent: IUser
let fakeCourse: ICourse

let inMemoryUser: InMemoryUser
let inMemoryCourse: InMemoryCourse
let inMemoryQuestion: InMemoryQuestion
let inMemoryPendingPayments: InMemoryPendingPayments
let inMemoryWallet: InMemoryWallet

let registerNewStudentService: RegisterNewStudentService

let createNewCourseService: CreateNewCourseService

let sut: InsertNewQuestionService

describe("Insert new question service", () => {
  beforeEach(async () => {
    inMemoryUser = new InMemoryUser()
    inMemoryCourse = new InMemoryCourse()
    inMemoryQuestion = new InMemoryQuestion()
    inMemoryPendingPayments = new InMemoryPendingPayments()
    inMemoryWallet = new InMemoryWallet()

    registerNewStudentService = new RegisterNewStudentService(
      inMemoryUser,
      inMemoryWallet
    )

    createNewCourseService = new CreateNewCourseService(
      inMemoryUser,
      inMemoryCourse,
      inMemoryPendingPayments
    )

    fakeProfessor = await registerNewStudentService.exec({
      name: "John Doe Professor",
      password: "123456",
      role: "professor",
      email: "johndoeprofessor@email.com",
    })

    fakeStudent = await registerNewStudentService.exec({
      name: "John Doe Student",
      password: "123456",
      role: "student",
      email: "johndoestudent@email.com",
    })

    fakeCourse = await createNewCourseService.exec({
      professorId: fakeProfessor.id as string,
      course: {
        title: "Test course",
        description: "Test description",
        duration: 3600, // 1h,
      },
    })

    sut = new InsertNewQuestionService(
      inMemoryUser,
      inMemoryCourse,
      inMemoryQuestion
    )
  })

  it("should insert a new question to an existing course", async () => {
    const newQuestion = await sut.exec({
      courseId: fakeCourse.id as string,
      studentId: fakeStudent.id as string,
      content: "This is an question for test purposes",
    })

    expect(newQuestion).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(Date),
        question: "This is an question for test purposes",
        fkStudent: fakeStudent.id,
        fkCourse: fakeCourse.id,
        name: "John Doe Student",
      })
    )
  })

  it("should not be possible to insert a more than 2 questions for user on same course", async () => {
    await sut.exec({
      courseId: fakeCourse.id as string,
      studentId: fakeStudent.id as string,
      content: "Question 1",
    })

    await sut.exec({
      courseId: fakeCourse.id as string,
      studentId: fakeStudent.id as string,
      content: "Question 2",
    })

    await expect(() => {
      return sut.exec({
        courseId: fakeCourse.id as string,
        studentId: fakeStudent.id as string,
        content: "Question 3 attempt",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Um aluno só pode registrar no máximo 2 questões por curso.",
      })
    )
  })

  it("should not insert a new question to an existing course if course id are not provided", async () => {
    await expect(() => {
      return sut.exec({
        courseId: "",
        studentId: fakeStudent.id as string,
        content: "This is an question for test purposes",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Id do curso inválido.",
      })
    )
  })

  it("should not insert a new question to an existing course if student id are not provided", async () => {
    await expect(() => {
      return sut.exec({
        courseId: fakeCourse.id as string,
        studentId: "",
        content: "This is an question for test purposes",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Id do estudante inválido.",
      })
    )
  })

  it("should not insert a new question to an existing course if question content are not provided", async () => {
    await expect(() => {
      return sut.exec({
        courseId: fakeCourse.id as string,
        studentId: fakeStudent.id as string,
        content: "",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "A questão não pode ser vazia.",
      })
    )
  })

  it("should not insert a new question to an existing course if student isn't registered", async () => {
    await expect(() => {
      return sut.exec({
        courseId: fakeCourse.id as string,
        studentId: "Inexistent student id",
        content: "This is an question for test purposes",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Estudante não encontrado.",
      })
    )
  })

  it("should not insert a new question to an existing course if course isn't registered", async () => {
    await expect(() => {
      return sut.exec({
        courseId: "Inexistent course id",
        studentId: fakeStudent.id as string,
        content: "This is an question for test purposes",
      })
    }).rejects.toEqual(
      expect.objectContaining({
        message: "Curso não encontrado.",
      })
    )
  })
})
