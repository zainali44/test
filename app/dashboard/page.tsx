import { redirect } from "next/navigation"

export default function DashboardPage() {
  // Redirect to manual configuration page as shown in the image
  redirect("/dashboard/downloads")
}
