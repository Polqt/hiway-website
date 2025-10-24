"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "Application status distribution"

const chartData = [
  { status: "draft", count: 50, fill: "var(--color-draft)" },
  { status: "submitted", count: 200, fill: "var(--color-submitted)" },
  { status: "withdrawn", count: 30, fill: "var(--color-withdrawn)" },
  { status: "shortlisted", count: 80, fill: "var(--color-shortlisted)" },
  { status: "interviewed", count: 60, fill: "var(--color-interviewed)" },
  { status: "offered", count: 40, fill: "var(--color-offered)" },
  { status: "rejected", count: 150, fill: "var(--color-rejected)" },
  { status: "hired", count: 25, fill: "var(--color-hired)" },
]

const chartConfig = {
  count: {
    label: "Count",
  },
  draft: {
    label: "Draft",
    color: "var(--chart-1)",
  },
  submitted: {
    label: "Submitted",
    color: "var(--chart-2)",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "var(--chart-3)",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "var(--chart-4)",
  },
  interviewed: {
    label: "Interviewed",
    color: "var(--chart-5)",
  },
  offered: {
    label: "Offered",
    color: "var(--chart-6)",
  },
  rejected: {
    label: "Rejected",
    color: "var(--chart-7)",
  },
  hired: {
    label: "Hired",
    color: "var(--chart-8)",
  },
} satisfies ChartConfig

export function ChartBarMixed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status Distribution</CardTitle>
        <CardDescription>Current application status breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 15,
            }}
          >
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Total applications: 635
        </div>
        <div className="text-muted-foreground leading-none">
          Distribution of application statuses across all applications
        </div>
      </CardFooter>
    </Card>
  )
}
