"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Building2, KeyRound, Loader2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/app/providers/auth-provider"
import { Bounce, toast} from "react-toastify"

const formSchema = z.object({
  password: z.string().min(6, {
    message: "Mật khẩu phải có ít nhất 6 ký tự",
  }),
  rememberMe: z.boolean(),
  email: z.string().email({
    message: "Email không hợp lệ",
  }),
})

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      await login(values.email, values.password)
      toast.success('Đăng nhập thành công', {
        position: "top-right",
        autoClose: 500,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        onClose: () => {
          router.push("/dashboard")
        }
        });
    } catch (error) {
      console.error("Đăng nhập thất bại:", error)
      toast.error('Đăng nhập thất bại', {
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
            <Building2 className="h-8 w-8 text-blue-700" />
          </div>
        </div>
        <CardTitle className="text-2xl text-center text-blue-900">Đăng nhập</CardTitle>
        <CardDescription className="text-center text-blue-700">
          Nhập thông tin đăng nhập của bạn để tiếp tục
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập Email"
                      {...field}
                      className="border-blue-200 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-blue-900">Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Nhập mật khẩu"
                      {...field}
                      className="border-blue-200 focus-visible:ring-blue-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal text-blue-900">Ghi nhớ đăng nhập</FormLabel>
                  </FormItem>
                )}
              />
                <Link href="/login/forgot-password">
                <Button variant="link" className="p-0 text-blue-700 hover:text-blue-900">
                  Quên mật khẩu?
                </Button>
                </Link>
            </div>
            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang đăng nhập
                </>
              ) : (
                <>
                  <KeyRound className="mr-2 h-4 w-4" />
                  Đăng nhập
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t border-blue-100 pt-4">
        <div className="text-center text-sm text-blue-700">
          © 2023 Hệ thống Quản lý tòa nhà chung cư. Bản quyền thuộc về công ty của bạn.
        </div>
      </CardFooter>
    </Card>
  )
}
