import React from "react"
import RegisterComponent from "@/components/RegisterComponent"
import NoAuthPage from "@/components/NoAuthPage"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cursos - Registar",
  description: "Página de registro de novos estudantes e professores.",
}

const Register = () => {
  return (
    <NoAuthPage>
      <RegisterComponent />
    </NoAuthPage>
  )
}

export default Register
