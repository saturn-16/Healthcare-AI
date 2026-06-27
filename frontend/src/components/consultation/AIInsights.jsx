import { motion } from "framer-motion";
import { ShieldCheck, Zap, Info, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";

export default function AIInsights() {
  const recommendations = [];

  return (
    <div className="glass-panel rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-gray-400" />
          <h3 className="text-lg font-bold text-gray-500">AI Insights & Risk Profiling</h3>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Info className="h-6 w-6 text-gray-300" />
        </div>
        <h4 className="text-gray-500 font-medium">Ready for Analysis</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-[200px]">
          Start a consultation or upload a report to generate AI insights.
        </p>
      </div>
    </div>
  );
}
