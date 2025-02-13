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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-text">Sign Up</CardTitle>
          <CardDescription className="text-text-foreground">
            Create your account by filling out the form below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="text-text-foreground">
            <div className="flex flex-col gap-6">
              {/* Full Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter a strong password"
                  required
                />
              </div>

              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {/* Sign Up Button */}
              <Button type="submit" className="w-full">
                Sign Up
              </Button>

              {/* Google Sign Up Button */}
              <Button variant="outline" className="w-full">
                Sign Up with Google
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/auth/login" className="underline underline-offset-4">
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}