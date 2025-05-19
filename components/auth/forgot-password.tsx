"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { getCookie } from "cookies-next"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AUTH_API } from "@/lib/env"
import { Bounce, toast} from "react-toastify"


// Step 1: Email form schema
const emailFormSchema = z.object({
  email: z.string().email({
    message: "Vui lòng nhập địa chỉ email hợp lệ",
  }),
})

// Step 2: OTP form schema
const otpFormSchema = z.object({
  otp: z.string().min(6, {
    message: "Mã OTP phải có ít nhất 6 ký tự",
  }),
})

// Step 3: New password form schema
const newPasswordFormSchema = z
  .object({
    password: z.string().min(6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    }),
    confirmPassword: z.string().min(6, {
      message: "Mật khẩu phải có ít nhất 6 ký tự",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  })

export function ForgotPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp" | "newPassword">("email")
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")

  // Kiểm tra xem đã có reset_token chưa khi component mount
  useEffect(() => {
    const resetToken = getCookie('reset_token')
    if (resetToken) {
      setStep("newPassword")
    }
  }, [])

  // Email form
  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  })

  // OTP form
  const otpForm = useForm<z.infer<typeof otpFormSchema>>({
    resolver: zodResolver(otpFormSchema),
    defaultValues: {
      otp: "",
    },
  })

  // New password form
  const newPasswordForm = useForm<z.infer<typeof newPasswordFormSchema>>({
    resolver: zodResolver(newPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  // Handle email form submission
  async function onEmailSubmit(values: z.infer<typeof emailFormSchema>) {
    setIsLoading(true)
    setEmail(values.email)

    try {
      // Gọi API request forgot password
      const url = `${AUTH_API.REQUEST_FORGOT_PASSWORD}?email=${encodeURIComponent(values.email)}`
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Không thể gửi yêu cầu đặt lại mật khẩu');
      }

      setStep("otp")
      toast.success('Mã xác nhận đã được gửi', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error('Không thể gửi yêu cầu đặt lại mật khẩu', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP form submission
  async function onOtpSubmit(values: z.infer<typeof otpFormSchema>) {
    setIsLoading(true)

    try {
      // Gọi API xác thực OTP
      const response = await fetch(AUTH_API.VERIFY_OTP, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp: values.otp }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Mã OTP không hợp lệ');
      }

      // Kiểm tra reset_token cookie
      const resetToken = getCookie('reset_token');
      if (!resetToken) {
        throw new Error('Không nhận được token đặt lại mật khẩu');
      }

      setStep("newPassword")
      toast.success('Xác nhận mã OTP thành công', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Mã OTP không hợp lệ hoặc đã hết hạn', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    } finally {
      setIsLoading(false)
    }
  }

  // Handle new password form submission
  async function onNewPasswordSubmit(values: z.infer<typeof newPasswordFormSchema>) {
    setIsLoading(true)

    try {
      // Gọi API đặt lại mật khẩu
      const response = await fetch(AUTH_API.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: values.password,
          confirmPassword: values.confirmPassword,
        }),
        credentials: 'include', // Để sử dụng cookie reset_token
      });

      if (!response.ok) {
        throw new Error('Không thể đặt lại mật khẩu');
      }

      toast.success('Đặt lại mật khẩu thành công', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
      router.push("/login")
    } catch (error) {
      console.error('Error resetting password:', error);
      toast.error('Đặt lại mật khẩu thất bại', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    setIsLoading(true)

    try {
      // Gọi lại API request forgot password
      const url = `${AUTH_API.REQUEST_FORGOT_PASSWORD}?email=${encodeURIComponent(email)}`
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Không thể gửi lại mã OTP');
      }

      toast.success('Đã gửi lại mã xác nhận', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      })
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Không thể gửi lại mã OTP', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full shadow-lg border-blue-100 bg-white/90 backdrop-blur-sm">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            {step === "email" && <Mail className="h-8 w-8 text-blue-700" />}
            {step === "otp" && <ShieldCheck className="h-8 w-8 text-blue-700" />}
            {step === "newPassword" && <KeyRound className="h-8 w-8 text-blue-700" />}
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-blue-900">
          {step === "email" && "Quên mật khẩu"}
          {step === "otp" && "Xác nhận mã OTP"}
          {step === "newPassword" && "Đặt lại mật khẩu"}
        </CardTitle>
        <CardDescription className="text-center text-blue-700">
          {step === "email" && "Nhập email của bạn để nhận mã xác nhận"}
          {step === "otp" && `Nhập mã xác nhận đã được gửi đến ${email}`}
          {step === "newPassword" && "Tạo mật khẩu mới cho tài khoản của bạn"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === "email" && (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-900">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập địa chỉ email của bạn"
                        {...field}
                        className="border-blue-200 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang gửi
                  </>
                ) : (
                  "Gửi mã xác nhận"
                )}
              </Button>
            </form>
          </Form>
        )}

        {step === "otp" && (
          <Form {...otpForm}>
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-900">Mã xác nhận</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập mã xác nhận"
                        {...field}
                        className="border-blue-200 focus-visible:ring-blue-500 text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center">
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-blue-700 hover:text-blue-900"
                  onClick={() => setStep("email")}
                >
                  Thay đổi email
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 text-blue-700 hover:text-blue-900"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  Gửi lại mã
                </Button>
              </div>
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác nhận
                  </>
                ) : (
                  "Xác nhận"
                )}
              </Button>
            </form>
          </Form>
        )}

        {step === "newPassword" && (
          <Form {...newPasswordForm}>
            <form onSubmit={newPasswordForm.handleSubmit(onNewPasswordSubmit)} className="space-y-4">
              <FormField
                control={newPasswordForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-900">Mật khẩu mới</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        {...field}
                        className="border-blue-200 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={newPasswordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-900">Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập lại mật khẩu mới"
                        {...field}
                        className="border-blue-200 focus-visible:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang cập nhật
                  </>
                ) : (
                  "Đặt lại mật khẩu"
                )}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-blue-100 pt-4">
        <div className="flex justify-center">
          <Link href="/login">
            <Button variant="link" className="text-blue-700 hover:text-blue-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại đăng nhập
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
