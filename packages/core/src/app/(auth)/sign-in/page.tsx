import SignInForm from "shared/src/components/SignInForm";

export default function AdminSignInPage() {
  return <SignInForm redirectTo="/admin/dashboard" microfrontend="admin" />;
}
