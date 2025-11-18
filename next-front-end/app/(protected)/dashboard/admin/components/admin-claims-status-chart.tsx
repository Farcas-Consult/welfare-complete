"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { ChartDatum } from "../types/admin-types";

interface AdminClaimsStatusChartProps {
  data?: ChartDatum[];
}

const chartConfig = {
  Submitted: {
    label: "Submitted",
    color: "hsl(var(--chart-1))",
  },
  Approved: {
    label: "Approved",
    color: "hsl(var(--chart-2))",
  },
  All: {
    label: "All Claims",
    color: "hsl(var(--chart-3))",
  },
};

export function AdminClaimsStatusChart({ data }: AdminClaimsStatusChartProps) {
  const chartData = data ?? [
    { label: "Submitted", value: 0 },
    { label: "Approved", value: 0 },
    { label: "All", value: 0 },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base">Claims Status</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                stroke="var(--muted-foreground)"
              />
              <YAxis axisLine={false} tickLine={false} stroke="var(--muted-foreground)" />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent hideIcon />} />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

