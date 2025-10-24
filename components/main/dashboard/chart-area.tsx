"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
   { date: "2024-04-01", rejected: 222, accepted: 150 },
   { date: "2024-04-02", rejected: 97, accepted: 180 },
   { date: "2024-04-03", rejected: 167, accepted: 120 },
   { date: "2024-04-04", rejected: 242, accepted: 260 },
   { date: "2024-04-05", rejected: 373, accepted: 290 },
   { date: "2024-04-06", rejected: 301, accepted: 340 },
   { date: "2024-04-07", rejected: 245, accepted: 180 },
   { date: "2024-04-08", rejected: 409, accepted: 320 },
   { date: "2024-04-09", rejected: 59, accepted: 110 },
   { date: "2024-04-10", rejected: 261, accepted: 190 },
   { date: "2024-04-11", rejected: 327, accepted: 350 },
   { date: "2024-04-12", rejected: 292, accepted: 210 },
   { date: "2024-04-13", rejected: 342, accepted: 380 },
   { date: "2024-04-14", rejected: 137, accepted: 220 },
   { date: "2024-04-15", rejected: 120, accepted: 170 },
   { date: "2024-04-16", rejected: 138, accepted: 190 },
   { date: "2024-04-17", rejected: 446, accepted: 360 },
   { date: "2024-04-18", rejected: 364, accepted: 410 },
   { date: "2024-04-19", rejected: 243, accepted: 180 },
   { date: "2024-04-20", rejected: 89, accepted: 150 },
   { date: "2024-04-21", rejected: 137, accepted: 200 },
   { date: "2024-04-22", rejected: 224, accepted: 170 },
   { date: "2024-04-23", rejected: 138, accepted: 230 },
   { date: "2024-04-24", rejected: 387, accepted: 290 },
   { date: "2024-04-25", rejected: 215, accepted: 250 },
   { date: "2024-04-26", rejected: 75, accepted: 130 },
   { date: "2024-04-27", rejected: 383, accepted: 420 },
   { date: "2024-04-28", rejected: 122, accepted: 180 },
   { date: "2024-04-29", rejected: 315, accepted: 240 },
   { date: "2024-04-30", rejected: 454, accepted: 380 },
   { date: "2024-05-01", rejected: 165, accepted: 220 },
   { date: "2024-05-02", rejected: 293, accepted: 310 },
   { date: "2024-05-03", rejected: 247, accepted: 190 },
   { date: "2024-05-04", rejected: 385, accepted: 420 },
   { date: "2024-05-05", rejected: 481, accepted: 390 },
   { date: "2024-05-06", rejected: 498, accepted: 520 },
   { date: "2024-05-07", rejected: 388, accepted: 300 },
   { date: "2024-05-08", rejected: 149, accepted: 210 },
   { date: "2024-05-09", rejected: 227, accepted: 180 },
   { date: "2024-05-10", rejected: 293, accepted: 330 },
   { date: "2024-05-11", rejected: 335, accepted: 270 },
   { date: "2024-05-12", rejected: 197, accepted: 240 },
   { date: "2024-05-13", rejected: 197, accepted: 160 },
   { date: "2024-05-14", rejected: 448, accepted: 490 },
   { date: "2024-05-15", rejected: 473, accepted: 380 },
   { date: "2024-05-16", rejected: 338, accepted: 400 },
   { date: "2024-05-17", rejected: 499, accepted: 420 },
   { date: "2024-05-18", rejected: 315, accepted: 350 },
   { date: "2024-05-19", rejected: 235, accepted: 180 },
   { date: "2024-05-20", rejected: 177, accepted: 230 },
   { date: "2024-05-21", rejected: 82, accepted: 140 },
   { date: "2024-05-22", rejected: 81, accepted: 120 },
   { date: "2024-05-23", rejected: 252, accepted: 290 },
   { date: "2024-05-24", rejected: 294, accepted: 220 },
   { date: "2024-05-25", rejected: 201, accepted: 250 },
   { date: "2024-05-26", rejected: 213, accepted: 170 },
   { date: "2024-05-27", rejected: 420, accepted: 460 },
   { date: "2024-05-28", rejected: 233, accepted: 190 },
   { date: "2024-05-29", rejected: 78, accepted: 130 },
   { date: "2024-05-30", rejected: 340, accepted: 280 },
   { date: "2024-05-31", rejected: 178, accepted: 230 },
   { date: "2024-06-01", rejected: 178, accepted: 200 },
   { date: "2024-06-02", rejected: 470, accepted: 410 },
   { date: "2024-06-03", rejected: 103, accepted: 160 },
   { date: "2024-06-04", rejected: 439, accepted: 380 },
   { date: "2024-06-05", rejected: 88, accepted: 140 },
   { date: "2024-06-06", rejected: 294, accepted: 250 },
   { date: "2024-06-07", rejected: 323, accepted: 370 },
   { date: "2024-06-08", rejected: 385, accepted: 320 },
   { date: "2024-06-09", rejected: 438, accepted: 480 },
   { date: "2024-06-10", rejected: 155, accepted: 200 },
   { date: "2024-06-11", rejected: 92, accepted: 150 },
   { date: "2024-06-12", rejected: 492, accepted: 420 },
   { date: "2024-06-13", rejected: 81, accepted: 130 },
   { date: "2024-06-14", rejected: 426, accepted: 380 },
   { date: "2024-06-15", rejected: 307, accepted: 350 },
   { date: "2024-06-16", rejected: 371, accepted: 310 },
   { date: "2024-06-17", rejected: 475, accepted: 520 },
   { date: "2024-06-18", rejected: 107, accepted: 170 },
   { date: "2024-06-19", rejected: 341, accepted: 290 },
   { date: "2024-06-20", rejected: 408, accepted: 450 },
   { date: "2024-06-21", rejected: 169, accepted: 210 },
   { date: "2024-06-22", rejected: 317, accepted: 270 },
   { date: "2024-06-23", rejected: 480, accepted: 530 },
   { date: "2024-06-24", rejected: 132, accepted: 180 },
   { date: "2024-06-25", rejected: 141, accepted: 190 },
   { date: "2024-06-26", rejected: 434, accepted: 380 },
   { date: "2024-06-27", rejected: 448, accepted: 490 },
   { date: "2024-06-28", rejected: 149, accepted: 200 },
   { date: "2024-06-29", rejected: 103, accepted: 160 },
   { date: "2024-06-30", rejected: 446, accepted: 400 },
 ]

const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    rejected: {
      label: "Rejected",
      color: "#ef4444",
    },
    accepted: {
      label: "Accepted",
      color: "#3b82f6",
    },
  } satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Application Trends</CardTitle>
          <CardDescription>
            Showing accepted vs rejected applications over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRejected" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-rejected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAccepted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-accepted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="accepted"
              type="natural"
              fill="url(#fillAccepted)"
              stroke="var(--color-accepted)"
              stackId="a"
            />
            <Area
              dataKey="rejected"
              type="natural"
              fill="url(#fillRejected)"
              stroke="var(--color-rejected)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
