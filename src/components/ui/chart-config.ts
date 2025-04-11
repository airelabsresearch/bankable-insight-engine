
import { ChartConfig } from "@/components/ui/chart";

export const financialMetricsConfig: ChartConfig = {
  irr: {
    label: "IRR",
    theme: {
      light: "#22c55e", // Green
      dark: "#2ecc71"
    }
  },
  npv: {
    label: "NPV",
    theme: {
      light: "#3b82f6", // Blue
      dark: "#3498db"
    }
  },
  payback: {
    label: "Payback Period",
    theme: {
      light: "#a855f7", // Purple
      dark: "#9b59b6"
    }
  },
  co2Reduction: {
    label: "CO₂ Reduction",
    theme: {
      light: "#eab308", // Yellow
      dark: "#f1c40f"
    }
  }
};
