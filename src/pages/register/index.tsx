import { RegisterForm } from "@/components/register-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function RegisterPage() {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4">
            <div className="absolute top-4 right-4">
              <ThemeToggle />
            </div>
            <div className="w-full max-w-md">
                <RegisterForm/>
            </div>
          </div>
    )
}