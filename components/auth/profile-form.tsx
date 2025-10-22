"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useTransition } from "react"
import { toast } from "sonner"
import { updateProfile } from "@/app/(main)/profile/action"
import { ProfileFormProps } from "@/types/profile"


export function ProfileForm({
  initialData = {},
  className,
  ...props
}: ProfileFormProps & React.ComponentProps<"div">) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await updateProfile(formData)

      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Profile updated successfully!")
      }
    })
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-bold">Complete Your Profile</h1>
            <FieldDescription>
              Please fill in your company details to continue
            </FieldDescription>
          </div>

          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              defaultValue={initialData.name || ""}
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="company">Company Name</FieldLabel>
            <Input
              id="company"
              name="company"
              type="text"
              placeholder="ABC Corporation"
              defaultValue={initialData.company || ""}
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="company_email">Company Email</FieldLabel>
            <Input
              id="company_email"
              name="company_email"
              type="email"
              placeholder="hr@company.com"
              defaultValue={initialData.company_email || ""}
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="company_position">Your Position</FieldLabel>
            <Input
              id="company_position"
              name="company_position"
              type="text"
              placeholder="HR Manager"
              defaultValue={initialData.company_position || ""}
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="company_phone_number">Company Phone Number</FieldLabel>
            <Input
              id="company_phone_number"
              name="company_phone_number"
              type="tel"
              placeholder="+1 (555) 123-4567"
              defaultValue={initialData.company_phone_number || ""}
              required
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="dti_or_sec_registration">DTI/SEC Registration Number</FieldLabel>
            <Input
              id="dti_or_sec_registration"
              name="dti_or_sec_registration"
              type="text"
              placeholder="DTI-123456789 or SEC-123456789"
              defaultValue={initialData.dti_or_sec_registration || ""}
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="barangay_clearance">Barangay Clearance Number</FieldLabel>
            <Input
              id="barangay_clearance"
              name="barangay_clearance"
              type="text"
              placeholder="BC-123456789"
              defaultValue={initialData.barangay_clearance || ""}
              disabled={isPending}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="business_permit">Business Permit Number</FieldLabel>
            <Input
              id="business_permit"
              name="business_permit"
              type="text"
              placeholder="BP-123456789"
              defaultValue={initialData.business_permit || ""}
              disabled={isPending}
            />
          </Field>

          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Updating Profile..." : "Complete Profile"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}