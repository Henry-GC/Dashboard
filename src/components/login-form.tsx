"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Axios from "@/lib/axios-config"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import { AlertCircle } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      email: "",
      pass: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Correo inválido").required("Campo obligatorio"),
      pass: Yup.string().required("Contraseña obligatoria")
    }),
    onSubmit: async (values) => {
      setLoading(true)
      setError(null)
      try {
        const response = await Axios.post('/adm/admLogin', values)
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('adminEmail', values.email)
        window.location.href = '/dashboard'
      } catch (err: unknown) {
        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err
        ) {
          const axiosErr = err as { response?: { status?: number; data?: { message?: string } } }
          if (axiosErr.response?.status === 401) {
            setError("Credenciales incorrectas. Verifica tu correo y contraseña.")
          } else if (axiosErr.response?.status === 403) {
            setError("Acceso denegado. No tienes permisos de administrador.")
          } else if (axiosErr.response?.data?.message) {
            setError(axiosErr.response.data.message)
          } else {
            setError("Error al iniciar sesión. Intenta nuevamente.")
          }
        } else {
          setError("No se pudo conectar con el servidor. Verifica tu conexión a internet.")
        }
      } finally {
        setLoading(false)
      }
    }
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Inicia sesión con tu cuenta de administrador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="grid gap-6">
              {/* Error feedback banner */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-800/50 dark:bg-red-950/50 dark:text-red-300 animate-in fade-in slide-in-from-top-1 duration-300">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@ejemplo.com"
                    {...formik.getFieldProps("email")}
                    className={
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-500">{formik.errors.email}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="pass">Contraseña</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="pass"
                    type="password"
                    placeholder="••••••••"
                    {...formik.getFieldProps("pass")}
                    className={
                      formik.touched.pass && formik.errors.pass
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                  {formik.touched.pass && formik.errors.pass && (
                    <p className="text-xs text-red-500">{formik.errors.pass}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex justify-center items-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Ingresando...
                    </span>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>

              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        Al continuar, aceptas nuestros <a href="#">Términos de Servicio</a>{" "}
        y <a href="#">Política de Privacidad</a>.
      </div>
      <div className="text-muted-foreground text-center text-xs mt-2">
        Desarrollado por{" "}
        <a
          href="https://henrygc.com"
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold hover:text-primary underline underline-offset-4"
        >
          HenryGC
        </a>
      </div>
    </div>
  )
}
