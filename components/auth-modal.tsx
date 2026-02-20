import { useAuth } from "@/hooks/useAuth";
import React, { FormEvent, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Chrome, Mail, Sparkles , Cpu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "signin" | "signup";
  onSwitchMode: () => void;
}

const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) => {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, resetPassword } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError("");

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(
        err && typeof err === "object" && "message" in err
          ? String((err as { message: unknown }).message)
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>
          <VisuallyHidden>
            {resetMode
              ? "Atur Ulang Kata Sandi"
              : mode === "signin"
              ? "Masuk"
              : "Buat Akun"}
          </VisuallyHidden>
        </DialogTitle>
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl">
              {resetMode
                ? "Atur Ulang Kata Sandi"
                : mode === "signin"
                ? "Selamat Datang Kembali Yeey"
                : "Buat Akun"}
            </CardTitle>
            <CardDescription>
              {resetMode
                ? "Masukkan email Anda untuk mengatur ulang kata sandi"
                : mode === "signin"
                ? "Masuk untuk mengakses riwayat chat Anda"
                : "Bergabung dengan MESH AI untuk menyimpan percakapan Anda"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSent ? (
              <div className="text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Cek Email Anda</h3>
                  <p className="text-muted-foreground">
                    Kami telah mengirim tautan reset kata sandi ke {email}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setResetMode(false);
                    setResetSent(false);
                    setEmail("");
                  }}
                >
                  Kembali ke Masuk
                </Button>
              </div>
            ) : (
              <>
                <form
                  className="space-y-2"
                  onSubmit={resetMode ? handlePasswordReset : handleSubmit}
                >
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  {!resetMode && (
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Kata Sandi
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Masukkan kata sandi Anda"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="mt-1"
                      />
                    </div>
                  )}
                  {error && (
                    <Card className="border-destructive">
                      <CardContent className="pt-3">
                        <p className="text-sm text-destructive">{error}</p>
                      </CardContent>
                    </Card>
                  )}
                  <Button className="w-full" type="submit">
                    {loading
                      ? "Memuat..."
                      : resetMode
                      ? "Kirim Tautan Reset"
                      : mode === "signin"
                      ? "Masuk"
                      : "Buat Akun"}
                  </Button>
                </form>
                {!resetMode && (
                  <>
                    <div className="relative mt-4">
                      <div className="absolute inset-0 flex items-center">
                        <Separator />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Atau lanjutkan dengan
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant={"outline"}
                      disabled={loading}
                      className="w-full mt-2"
                      onClick={handleGoogleSignIn}
                    >
                      <Chrome className="mr-2 h-4 w-4" />
                      Google
                    </Button>
                    <div className="space-y-2 text-center text-sm">
                      {mode === "signin" && (
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => setResetMode(true)}
                          className="h-auto p-0 mt-2"
                        >
                          Lupa kata sandi?
                        </Button>
                      )}
                      <div>
                        <span className="text-muted-foreground">
                          {mode === "signin"
                            ? "Belum punya akun? "
                            : "Sudah punya akun? "}
                        </span>
                        <Button
                          type="button"
                          variant="link"
                          onClick={onSwitchMode}
                          className="h-auto p-0 mt-2"
                        >
                          {mode === "signin" ? "Buat Akun" : "Masuk"}
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;