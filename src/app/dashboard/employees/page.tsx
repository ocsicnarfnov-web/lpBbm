import { db } from "@/db";
import { employees } from "@/db/schema";
import { getSession } from "@/lib/auth";
import EmployeeClient from "./EmployeeClient";
import { Users } from "lucide-react";

export default async function EmployeesPage() {
  const session = await getSession();

  const allEmployees = await db.select().from(employees);

  const canEdit = session?.role === "admin" || session?.role === "manager";

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-7 h-7 text-blue-500" />
          Employee Management
        </h1>
        <p className="text-gray-500 mt-1">Manage farm employee records</p>
      </div>

      <EmployeeClient employees={allEmployees} canEdit={canEdit} />
    </div>
  );
}
