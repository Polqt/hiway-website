import { ReactElement } from "react"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react"

export type ApplicationStatus = "draft" | "submitted" | "withdrawn" | "shortlisted" | "interviewed" | "offered" | "rejected" | "hired"

export const getStatusBadge = (status: ApplicationStatus): ReactElement => {
  switch (status) {
    case "draft":
      return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Draft</Badge>
    case "submitted":
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Submitted</Badge>
    case "withdrawn":
      return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Withdrawn</Badge>
    case "shortlisted":
      return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Shortlisted</Badge>
    case "interviewed":
      return <Badge variant="secondary" className="bg-purple-100 text-purple-800">Interviewed</Badge>
    case "offered":
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Offered</Badge>
    case "rejected":
      return <Badge variant="secondary" className="bg-red-100 text-red-800">Rejected</Badge>
    case "hired":
      return <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">Hired</Badge>
    default:
      return <Badge variant="secondary">Unknown</Badge>
  }
}

export const getStatusIcon = (status: ApplicationStatus): ReactElement => {
  switch (status) {
    case "draft":
      return <Clock className="h-4 w-4 text-gray-600" />
    case "submitted":
      return <Clock className="h-4 w-4 text-yellow-600" />
    case "withdrawn":
      return <XCircle className="h-4 w-4 text-orange-600" />
    case "shortlisted":
      return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "interviewed":
      return <Calendar className="h-4 w-4 text-purple-600" />
    case "offered":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "rejected":
      return <XCircle className="h-4 w-4 text-red-600" />
    case "hired":
      return <CheckCircle className="h-4 w-4 text-emerald-600" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

export const getStatusColor = (status: ApplicationStatus): string => {
  switch (status) {
    case "draft":
      return "text-gray-600"
    case "submitted":
      return "text-yellow-600"
    case "withdrawn":
      return "text-orange-600"
    case "shortlisted":
      return "text-blue-600"
    case "interviewed":
      return "text-purple-600"
    case "offered":
      return "text-green-600"
    case "rejected":
      return "text-red-600"
    case "hired":
      return "text-emerald-600"
    default:
      return "text-gray-600"
  }
}