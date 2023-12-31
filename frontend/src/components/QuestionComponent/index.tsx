"use client"

import React, { Fragment, useState, useRef, FormEvent, useContext } from "react"
import { IAnswer, IQuestion } from "@/@types/types"
import { UserContextProvider } from "@/contexts/userContext"
import { AxiosError } from "axios"
import { useQueryClient } from "react-query"
import * as S from "./styles"
import api from "@/lib/api"

interface IQuestionComponent {
  questionInfos: {
    question: IQuestion
    answers: IAnswer[]
  }
  canAnswer: boolean
}

const QuestionComponent = ({ questionInfos, canAnswer }: IQuestionComponent) => {
  const { userProfile } = useContext(UserContextProvider)

  const [openQuoteArea, setOpenQuoteArea] = useState(false)
  const [answerError, setAnswerError] = useState("")
  const [answerSubmitting, setAnswerSubmitting] = useState(false)
  const [answerApiError, setAnswerApiError] = useState("")
  const [answerApiSucess, setAnswerApiSucess] = useState("")

  const queryClient = useQueryClient()

  const quoteRef = useRef<HTMLTextAreaElement>({} as HTMLTextAreaElement)

  async function handleSubmitAnswer(e: FormEvent) {
    e.preventDefault()

    if (quoteRef.current.value.length < 10) {
      return setAnswerError("A resposta precisa ter pelo menos 10 caracteres.")
    }

    setAnswerSubmitting(true)

    setAnswerApiError("")

    try {
      const newAnswer = await api.post(
        "/question-answer",
        {
          questionId: questionInfos.question.id,
          courseId: questionInfos.question.fkCourse,
          content: quoteRef.current.value,
        },
        {
          headers: {
            Authorization: `Bearer ${userProfile.token}`,
          },
        }
      )

      if (newAnswer.status === 201) {
        quoteRef.current.value = ""

        setOpenQuoteArea(false)

        queryClient.invalidateQueries("queryCoursePage")
        queryClient.invalidateQueries("queryCourseProfessorPage")

        setAnswerApiSucess(newAnswer.data.message)

        setTimeout(() => setAnswerApiSucess(""), 4000)
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        setAnswerApiError(e.response?.data.message)

        setTimeout(() => setAnswerApiError(""), 4200)
      }
    } finally {
      setAnswerSubmitting(false)
    }
  }

  return (
    <S.Question key={questionInfos.question.id}>
      <S.QuestionContent>
        <S.TopArea>
          <S.Texts>
            <p>
              <strong>Nome do estudante:</strong> {questionInfos.question.name}
            </p>
            <p>Dúvida: {questionInfos.question.question}</p>

            <p>
              Feita em:{" "}
              {new Date(questionInfos.question.createdAt).toLocaleDateString()}
            </p>
          </S.Texts>

          <div>
            {canAnswer &&
              (!questionInfos.answers.length ? (
                <S.AnswerQuestionButton
                  onClick={() =>
                    !answerSubmitting && setOpenQuoteArea(!openQuoteArea)
                  }
                  type="button"
                >
                  Responder
                </S.AnswerQuestionButton>
              ) : (
                <S.AnswerQuestionButton disabled type="button">
                  Respondido
                </S.AnswerQuestionButton>
              ))}
          </div>
        </S.TopArea>

        <S.QuoteArea onSubmit={handleSubmitAnswer} $openQuote={openQuoteArea}>
          <textarea
            ref={quoteRef}
            maxLength={500}
            placeholder="Escreva sua resposta aqui..."
          />

          {answerError && <p className="validationError">{answerError}</p>}
          <S.QuoteButton disabled={answerSubmitting} type="submit">
            Responder
          </S.QuoteButton>
        </S.QuoteArea>
      </S.QuestionContent>

      <Fragment>
        {questionInfos.answers.map((answer) => {
          return (
            <S.Answer key={answer.id}>
              <p>
                <strong>Professor:</strong> {answer.name}
              </p>

              <p>Resposta: {answer.answer}</p>

              <p>Respondida em: {new Date(answer.createdAt).toLocaleDateString()}</p>
            </S.Answer>
          )
        })}
      </Fragment>

      <S.ApiError>{answerApiError && <p>{answerApiError}</p>}</S.ApiError>
      <S.ApiSuccess>{answerApiSucess && <p>{answerApiSucess}</p>}</S.ApiSuccess>
    </S.Question>
  )
}

export default QuestionComponent
