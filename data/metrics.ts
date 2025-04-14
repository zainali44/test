export interface Metric {
    title: string
    value: string
    subtitle: string
    trend: "up" | "down" | "neutral"
    percentage: string
    chartColor: string
  }
  
  export const metrics: Metric[] = [
    {
      title: "Active Users",
      value: "3632",
      subtitle: "Overall last month",
      trend: "up",
      percentage: "30.65%",
      chartColor: "blue",
    },
    {
      title: "Total Properties",
      value: "10k+",
      subtitle: "Overall last month",
      trend: "down",
      percentage: "20.65%",
      chartColor: "red",
    },
    {
      title: "Total Revenue",
      value: "$900K",
      subtitle: "Overall this month",
      trend: "up",
      percentage: "30.65%",
      chartColor: "green",
    },
  ]
  