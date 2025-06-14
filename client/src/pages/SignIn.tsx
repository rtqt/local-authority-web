// src/pages/SignIn.tsx

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { LogIn, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/api/api"; // Import your API client

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const SignIn = () => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const handleLanguageChange = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("i18nextLng", language);
  };

  const getCurrentLanguageLabel = () => {
    return i18n.language === "am"
      ? t("languages.amharic")
      : t("languages.english");
  };

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);

    try {
      // Call your backend login API
      const response = await api.auth.login(data.email, data.password);

      // Store the token (and potentially user info)
      localStorage.setItem("token", response.token);

      // Optionally store user role or other relevant user info if needed later
      localStorage.setItem("userRole", response.user.userRole);
      // Example: localStorage.setItem('userId', response.user.userId);

      toast({
        title: t("auth.welcome"),
        description: `${t("auth.signInSuccess")}`,
      });

      // Redirect to the dashboard or a protected route
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: t("auth.signInFailed"),
        description:
          error.response?.data?.error || t("auth.invalidCredentials"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white"
            >
              <Globe size={16} className="mr-2" />
              {getCurrentLanguageLabel()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              {t("languages.english")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("am")}>
              {t("languages.amharic")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-primary rounded-full p-3">
              <LogIn className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {t("auth.signIn")}
          </CardTitle>
          <CardDescription className="text-center">
            {t("auth.signInToAccount")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("auth.password")}</Label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" {...register("rememberMe")} />
                <Label htmlFor="rememberMe" className="text-sm">
                  {t("auth.rememberMe")}
                </Label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {t("auth.signingIn")} {/* Changed text to signingIn */}
                </div>
              ) : (
                t("auth.signInButton")
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {t("auth.noAccount")}{" "}
            </span>
            <Link to="/sign-up" className="text-primary hover:underline">
              {t("auth.signUp")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignIn;
