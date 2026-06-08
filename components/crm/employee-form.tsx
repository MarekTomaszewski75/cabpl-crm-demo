"use client";

import * as React from "react";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SheetFooter } from "@/components/ui/sheet";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDemoData } from "@/lib/data/demo-data-context";
import { createNextEmployeeId } from "@/lib/crm/employee-id";
import { formatEmployeeName } from "@/lib/crm/employee-display";
import {
  EMPLOYEE_STATUS_LABELS,
  USER_ROLE_LABELS,
  type Employee,
  type EmployeeStatus,
  type UserRole,
} from "@/types/crm";

const MANAGER_NONE = "__none__";
const DEPARTMENT_NONE = "__none__";
const MIDDLE_NONE = "__none__";

type EmployeeFormErrors = {
  firstName?: string;
  lastName?: string;
  emails?: string;
  crmRoles?: string;
};

function validateEmployeeForm(state: EmployeeFormState): EmployeeFormErrors {
  const errors: EmployeeFormErrors = {};
  if (!state.firstName.trim()) {
    errors.firstName = "Imię jest wymagane";
  }
  if (!state.lastName.trim()) {
    errors.lastName = "Nazwisko jest wymagane";
  }
  if (state.emails.every((email) => !email.trim())) {
    errors.emails = "Podaj co najmniej jeden adres e-mail";
  }
  if (state.crmRoles.length === 0) {
    errors.crmRoles = "Wybierz co najmniej jedną rolę CRM";
  }
  return errors;
}

const CRM_ROLE_OPTIONS: UserRole[] = [
  "advisor",
  "regional_manager",
  "executive",
];

type EmployeeFormState = {
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  country: string;
  city: string;
  emails: string[];
  phones: string[];
  crmRoles: UserRole[];
  position: string;
  departmentId: string;
  managerId: string;
  status: EmployeeStatus;
};

function emptyFormState(): EmployeeFormState {
  return {
    firstName: "",
    lastName: "",
    middleName: MIDDLE_NONE,
    dateOfBirth: "",
    country: "Polska",
    city: "",
    emails: [""],
    phones: [""],
    crmRoles: ["advisor"],
    position: "",
    departmentId: DEPARTMENT_NONE,
    managerId: MANAGER_NONE,
    status: "active",
  };
}

function employeeToFormState(employee: Employee): EmployeeFormState {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    middleName: employee.middleName ?? MIDDLE_NONE,
    dateOfBirth: employee.dateOfBirth,
    country: employee.country,
    city: employee.city,
    emails: employee.emails.length > 0 ? [...employee.emails] : [""],
    phones: employee.phones.length > 0 ? [...employee.phones] : [""],
    crmRoles: [...employee.crmRoles],
    position: employee.position,
    departmentId: employee.departmentId || DEPARTMENT_NONE,
    managerId: employee.managerId ?? MANAGER_NONE,
    status: employee.status,
  };
}

function buildEmployeeFromForm(
  state: EmployeeFormState,
  id: string,
  demoUserId: string | null,
): Employee {
  const emails = state.emails.map((e) => e.trim()).filter(Boolean);
  const phones = state.phones.map((p) => p.trim()).filter(Boolean);
  return {
    id,
    demoUserId,
    firstName: state.firstName.trim(),
    lastName: state.lastName.trim(),
    middleName:
      state.middleName === MIDDLE_NONE || !state.middleName.trim()
        ? null
        : state.middleName.trim(),
    dateOfBirth: state.dateOfBirth,
    country: state.country.trim(),
    city: state.city.trim(),
    emails,
    phones,
    crmRoles: state.crmRoles,
    position: state.position.trim(),
    departmentId:
      state.departmentId === DEPARTMENT_NONE ? "" : state.departmentId,
    managerId: state.managerId === MANAGER_NONE ? null : state.managerId,
    status: state.status,
  };
}

type EmployeeFormProps = {
  employee?: Employee;
  onSuccess: () => void;
  layout?: "page" | "sheet";
};

export function EmployeeForm({
  employee,
  onSuccess,
  layout = "page",
}: EmployeeFormProps) {
  const { departments, employees, addEmployee, updateEmployee } = useDemoData();
  const isEdit = Boolean(employee);
  const [form, setForm] = React.useState<EmployeeFormState>(() =>
    employee ? employeeToFormState(employee) : emptyFormState(),
  );
  const [errors, setErrors] = React.useState<EmployeeFormErrors>({});

  const managerOptions = employees.filter((e) => e.id !== employee?.id);

  function clearError(field: keyof EmployeeFormErrors) {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function toggleRole(role: UserRole, checked: boolean) {
    clearError("crmRoles");
    setForm((prev) => {
      const next = checked
        ? [...prev.crmRoles, role]
        : prev.crmRoles.filter((r) => r !== role);
      return { ...prev, crmRoles: next };
    });
  }

  function updateListItem(
    key: "emails" | "phones",
    index: number,
    value: string,
  ) {
    if (key === "emails") clearError("emails");
    setForm((prev) => {
      const list = [...prev[key]];
      list[index] = value;
      return { ...prev, [key]: list };
    });
  }

  function addListItem(key: "emails" | "phones") {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] }));
  }

  function removeListItem(key: "emails" | "phones", index: number) {
    setForm((prev) => {
      const list = prev[key].filter((_, i) => i !== index);
      return { ...prev, [key]: list.length > 0 ? list : [""] };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors = validateEmployeeForm(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    if (isEdit && employee) {
      const parsed = buildEmployeeFromForm(
        form,
        employee.id,
        employee.demoUserId,
      );
      updateEmployee(employee.id, parsed);
      toast.success(`Zaktualizowano: ${formatEmployeeName(parsed)}`);
    } else {
      const parsed = buildEmployeeFromForm(
        form,
        createNextEmployeeId(employees),
        null,
      );
      addEmployee(parsed);
      toast.success(`Dodano pracownika: ${formatEmployeeName(parsed)}`);
    }
    onSuccess();
  }

  const fields = (
          <FieldGroup>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor="emp-firstName">Imię</FieldLabel>
                <Input
                  id="emp-firstName"
                  value={form.firstName}
                  aria-invalid={!!errors.firstName}
                  onChange={(e) => {
                    clearError("firstName");
                    setForm((p) => ({ ...p, firstName: e.target.value }));
                  }}
                />
                <FieldError>{errors.firstName}</FieldError>
              </Field>
              <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor="emp-lastName">Nazwisko</FieldLabel>
                <Input
                  id="emp-lastName"
                  value={form.lastName}
                  aria-invalid={!!errors.lastName}
                  onChange={(e) => {
                    clearError("lastName");
                    setForm((p) => ({ ...p, lastName: e.target.value }));
                  }}
                />
                <FieldError>{errors.lastName}</FieldError>
              </Field>
            </FieldGroup>
            <Field>
              <FieldLabel htmlFor="emp-middleName">Drugie imię</FieldLabel>
              <Input
                id="emp-middleName"
                value={form.middleName === MIDDLE_NONE ? "" : form.middleName}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    middleName: e.target.value || MIDDLE_NONE,
                  }))
                }
                placeholder="Opcjonalnie"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="emp-dob">Data urodzenia</FieldLabel>
              <Input
                id="emp-dob"
                type="date"
                value={form.dateOfBirth}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dateOfBirth: e.target.value }))
                }
              />
            </Field>
            <FieldGroup className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="emp-country">Kraj</FieldLabel>
                <Input
                  id="emp-country"
                  value={form.country}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, country: e.target.value }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="emp-city">Miasto</FieldLabel>
                <Input
                  id="emp-city"
                  value={form.city}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, city: e.target.value }))
                  }
                />
              </Field>
            </FieldGroup>
            <Field data-invalid={!!errors.emails}>
              <FieldLabel>E-mail</FieldLabel>
              <FieldGroup className="gap-2">
                {form.emails.map((email, index) => (
                  <div key={`email-${index}`} className="flex gap-2">
                    <Input
                      type="email"
                      value={email}
                      aria-invalid={!!errors.emails}
                      onChange={(e) =>
                        updateListItem("emails", index, e.target.value)
                      }
                      placeholder="nazwa@demo.cabpl"
                    />
                    {form.emails.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem("emails", index)}
                        aria-label="Usuń e-mail"
                      >
                        <Trash2Icon />
                      </Button>
                    ) : null}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => addListItem("emails")}
                >
                  Dodaj e-mail
                </Button>
              </FieldGroup>
              <FieldError>{errors.emails}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Telefon</FieldLabel>
              <FieldGroup className="gap-2">
                {form.phones.map((phone, index) => (
                  <div key={`phone-${index}`} className="flex gap-2">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        updateListItem("phones", index, e.target.value)
                      }
                      placeholder="+48 …"
                    />
                    {form.phones.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeListItem("phones", index)}
                        aria-label="Usuń telefon"
                      >
                        <Trash2Icon />
                      </Button>
                    ) : null}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-fit"
                  onClick={() => addListItem("phones")}
                >
                  Dodaj telefon
                </Button>
              </FieldGroup>
            </Field>
            <Field data-invalid={!!errors.crmRoles}>
              <FieldSet>
                <FieldLegend variant="label">Role CRM</FieldLegend>
                <FieldGroup className="gap-3">
                  {CRM_ROLE_OPTIONS.map((role) => (
                    <Field key={role} orientation="horizontal">
                      <Checkbox
                        id={`emp-role-${role}`}
                        checked={form.crmRoles.includes(role)}
                        aria-invalid={!!errors.crmRoles}
                        onCheckedChange={(checked) =>
                          toggleRole(role, checked === true)
                        }
                      />
                      <FieldLabel
                        htmlFor={`emp-role-${role}`}
                        className="font-normal"
                      >
                        {USER_ROLE_LABELS[role]}
                      </FieldLabel>
                    </Field>
                  ))}
                </FieldGroup>
              </FieldSet>
              <FieldError>{errors.crmRoles}</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="emp-position">Stanowisko</FieldLabel>
              <Input
                id="emp-position"
                value={form.position}
                onChange={(e) =>
                  setForm((p) => ({ ...p, position: e.target.value }))
                }
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="emp-department">Dział</FieldLabel>
              <Select
                value={form.departmentId}
                onValueChange={(value) =>
                  setForm((p) => ({ ...p, departmentId: value }))
                }
              >
                <SelectTrigger id="emp-department" className="w-full">
                  <SelectValue placeholder="Wybierz dział" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value={DEPARTMENT_NONE}>— Brak —</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="emp-manager">Kierownik</FieldLabel>
              <Select
                value={form.managerId}
                onValueChange={(value) =>
                  setForm((p) => ({ ...p, managerId: value }))
                }
              >
                <SelectTrigger id="emp-manager" className="w-full">
                  <SelectValue placeholder="Brak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={MANAGER_NONE}>— Brak —</SelectItem>
                  {managerOptions.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {formatEmployeeName(emp)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="emp-status">Status</FieldLabel>
              <Select
                value={form.status}
                onValueChange={(value) =>
                  setForm((p) => ({
                    ...p,
                    status: value as EmployeeStatus,
                  }))
                }
              >
                <SelectTrigger id="emp-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {(Object.keys(EMPLOYEE_STATUS_LABELS) as EmployeeStatus[]).map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {EMPLOYEE_STATUS_LABELS[status]}
                        </SelectItem>
                      ),
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
  );

  const submitLabel = isEdit ? "Zapisz zmiany" : "Dodaj pracownika";

  if (layout === "sheet") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          {fields}
        </div>
        <SheetFooter className="mt-0 shrink-0 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
          <Button type="submit">{submitLabel}</Button>
        </SheetFooter>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {fields}
      <div className="flex justify-end border-t border-border pt-4">
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
