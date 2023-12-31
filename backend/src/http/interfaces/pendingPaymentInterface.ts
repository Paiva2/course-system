import { IPendingPayments } from "../@types/types"

export interface PendingPaymentInterface {
  create(
    value: number,
    reason: "course" | "questionAnswered",
    professorId: string
  ): Promise<IPendingPayments>

  findFirstByUserId(professorId: string): Promise<IPendingPayments | null>

  findById(
    professorId: string,
    pendingPaymentId: string
  ): Promise<IPendingPayments | null>

  removePending(
    professorId: string,
    pendingPaymentId: string
  ): Promise<IPendingPayments>

  getAllFromProfessor(professorId: string): Promise<IPendingPayments[]>

  getAll(page: number): Promise<{
    page: number
    totalPages: number
    payments: IPendingPayments[]
    totalPayments: number
  }>
}
